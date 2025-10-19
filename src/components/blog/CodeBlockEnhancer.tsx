"use client";

import { useEffect } from "react";

const ACTION_FEEDBACK_TIMEOUT = 1900;

type OutputSection = {
  title: string;
  lines: string[];
  className: string;
};

type ExecuteResponse = {
  language?: string;
  version?: string;
  stdout?: string[] | string;
  stderr?: string[] | string;
  output?: string[] | string;
  compileStdout?: string[] | string;
  compileStderr?: string[] | string;
  exitCode?: number | null;
  signal?: string | null;
};

const LANGUAGE_ALIASES: Record<string, { runtime: string; version?: string }> =
  {
    js: { runtime: "javascript" },
    javascript: { runtime: "javascript" },
    ts: { runtime: "typescript" },
    typescript: { runtime: "typescript" },
    tsx: { runtime: "tsx" },
    py: { runtime: "python" },
    python: { runtime: "python" },
    rb: { runtime: "ruby" },
    ruby: { runtime: "ruby" },
    go: { runtime: "go" },
    rust: { runtime: "rust" },
    rs: { runtime: "rust" },
    java: { runtime: "java" },
    kotlin: { runtime: "kotlin" },
    swift: { runtime: "swift" },
    php: { runtime: "php" },
    c: { runtime: "c" },
    cpp: { runtime: "cpp" },
    cplusplus: { runtime: "cpp" },
    cs: { runtime: "csharp" },
    csharp: { runtime: "csharp" },
    scala: { runtime: "scala" },
    r: { runtime: "r" },
    sh: { runtime: "bash" },
    bash: { runtime: "bash" },
    shell: { runtime: "bash" },
    dart: { runtime: "dart" },
    elixir: { runtime: "elixir" },
    haskell: { runtime: "haskell" },
    perl: { runtime: "perl" },
    lua: { runtime: "lua" },
  };

const DEFAULT_VERSION = "*";

function resolveRuntime(language: string | null | undefined) {
  const normalized = (language ?? "").trim().toLowerCase();
  if (!normalized || normalized === "plaintext" || normalized === "text") {
    return null;
  }
  const alias = LANGUAGE_ALIASES[normalized];
  if (alias) {
    return {
      runtime: alias.runtime,
      version: alias.version ?? DEFAULT_VERSION,
    };
  }
  return {
    runtime: normalized,
    version: DEFAULT_VERSION,
  };
}

function toLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => toLines(entry));
  }
  if (value === null || value === undefined) {
    return [];
  }
  const text = String(value);
  if (!text) {
    return [];
  }
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }
  return lines;
}

function dedupeLines(lines: string[]): string[] {
  const seen = new Set<string>();
  return lines.filter((line) => {
    if (seen.has(line)) {
      return false;
    }
    seen.add(line);
    return true;
  });
}

function useCodeBlockActions() {
  useEffect(() => {
    const figures = Array.from(
      document.querySelectorAll<HTMLElement>(".code-figure")
    );
    const disposers: Array<() => void> = [];

    const showFeedback = (button: HTMLElement, message: string) => {
      button.dataset.feedback = message;
      button.classList.add("is-active");
      window.setTimeout(() => {
        button.classList.remove("is-active");
      }, ACTION_FEEDBACK_TIMEOUT);
    };

    const ensureOutputContainer = (figure: HTMLElement) => {
      let output = figure.querySelector<HTMLElement>(".code-figure__output");
      if (!output) {
        output = document.createElement("div");
        output.className = "code-figure__output";
        figure.appendChild(output);
      }
      return output;
    };

    const renderOutput = (
      figure: HTMLElement,
      sections: OutputSection[],
      fallbackMessage = "Code executed with no output."
    ) => {
      const output = ensureOutputContainer(figure);
      output.innerHTML = "";

      const appendSection = (section: OutputSection) => {
        const normalizedLines = toLines(section.lines);
        if (normalizedLines.length === 0) {
          return false;
        }
        const heading = document.createElement("p");
        heading.className = "code-figure__output-title";
        heading.textContent = section.title;
        const body = document.createElement("pre");
        body.className = section.className;
        body.textContent = normalizedLines.join("\n");
        output.appendChild(heading);
        output.appendChild(body);
        return true;
      };

      let rendered = false;
      sections.forEach((section) => {
        rendered = appendSection(section) || rendered;
      });

      if (!rendered) {
        appendSection({
          title: "Output",
          lines: [fallbackMessage],
          className: "code-figure__stdout",
        });
      }
    };

    const setRunningState = (button: HTMLButtonElement, running: boolean) => {
      if (running) {
        button.disabled = true;
        button.dataset.state = "running";
        button.dataset.feedback = "Running";
        button.classList.add("is-active");
      } else {
        button.disabled = false;
        delete button.dataset.state;
        button.classList.remove("is-active");
        button.dataset.feedback = "";
      }
    };

    const copyText = async (text: string) => {
      if (!text) return;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textarea);
      }
    };

    figures.forEach((figure) => {
      const copyButton =
        figure.querySelector<HTMLButtonElement>(".code-action--copy");
      const runButton =
        figure.querySelector<HTMLButtonElement>(".code-action--run");
      const codeId = copyButton?.dataset.target ?? runButton?.dataset.target;
      const codeElement = codeId
        ? document.getElementById(codeId)
        : figure.querySelector("code");

      if (!codeElement) {
        return;
      }

      if (copyButton) {
        const handleCopy = async () => {
          try {
            await copyText(codeElement.textContent ?? "");
            showFeedback(copyButton, "Copied");
          } catch (error) {
            console.error(error);
            showFeedback(copyButton, "Copy failed");
          }
        };
        copyButton.addEventListener("click", handleCopy);
        disposers.push(() =>
          copyButton.removeEventListener("click", handleCopy)
        );
      }

      if (runButton) {
        const handleRun = async () => {
          const language = (runButton.dataset.language ?? "").toLowerCase();
          const runtime = resolveRuntime(language);
          if (!runtime) {
            showFeedback(runButton, "No language");
            renderOutput(figure, [
              {
                title: "Errors",
                lines: [
                  "Add a language hint (for example ```python) to run this snippet.",
                ],
                className: "code-figure__stderr",
              },
            ]);
            return;
          }

          const code = codeElement.textContent ?? "";
          if (!code.trim()) {
            showFeedback(runButton, "No code");
            renderOutput(figure, [
              {
                title: "Errors",
                lines: ["No code available to execute."],
                className: "code-figure__stderr",
              },
            ]);
            return;
          }

          setRunningState(runButton, true);
          let feedback: string | null = null;

          try {
            const response = await fetch("/api/code-execute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                language: runtime.runtime,
                version: runtime.version,
                originalLanguage: language,
                code,
              }),
              cache: "no-store",
            });

            if (!response.ok) {
              const errorPayload = await response.json().catch(() => null);
              const message =
                (errorPayload && errorPayload.error) ||
                `Execution failed (${response.status})`;
              throw new Error(message);
            }

            const payload: ExecuteResponse = await response.json();

            const metaLines: string[] = [];
            if (payload.language) {
              metaLines.push(
                payload.version
                  ? `Runtime: ${payload.language} (${payload.version})`
                  : `Runtime: ${payload.language}`
              );
            }
            if (typeof payload.exitCode === "number") {
              metaLines.push(`Exit code: ${payload.exitCode}`);
            }
            if (payload.signal) {
              metaLines.push(`Signal: ${payload.signal}`);
            }

            const compilerOutput = dedupeLines(toLines(payload.compileStdout));
            const primaryStdout = toLines(payload.stdout);
            const fallbackStdout = toLines(payload.output);
            const stdoutLines = dedupeLines(
              primaryStdout.length > 0 ? primaryStdout : fallbackStdout
            );
            const errorLines = dedupeLines([
              ...toLines(payload.compileStderr),
              ...toLines(payload.stderr),
            ]);

            const sections: OutputSection[] = [];

            if (metaLines.length) {
              sections.push({
                title: "Details",
                lines: metaLines,
                className: "code-figure__stdout",
              });
            }

            if (compilerOutput.length) {
              sections.push({
                title: "Compiler",
                lines: compilerOutput,
                className: "code-figure__stdout",
              });
            }

            if (stdoutLines.length) {
              sections.push({
                title: "Output",
                lines: stdoutLines,
                className: "code-figure__stdout",
              });
            }

            if (errorLines.length) {
              sections.push({
                title: "Errors",
                lines: errorLines,
                className: "code-figure__stderr",
              });
            }

            renderOutput(figure, sections, "Code executed with no output.");
            feedback = errorLines.length
              ? "Errors"
              : stdoutLines.length || compilerOutput.length
              ? "Ran"
              : "Done";
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Run failed";
            renderOutput(figure, [
              {
                title: "Errors",
                lines: [message],
                className: "code-figure__stderr",
              },
            ]);
            feedback = "Error";
          } finally {
            setRunningState(runButton, false);
            if (feedback) {
              showFeedback(runButton, feedback);
            }
          }
        };
        runButton.addEventListener("click", handleRun);
        disposers.push(() => runButton.removeEventListener("click", handleRun));
      }
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);
}

function CodeBlockEnhancer() {
  useCodeBlockActions();
  return null;
}

export default CodeBlockEnhancer;
