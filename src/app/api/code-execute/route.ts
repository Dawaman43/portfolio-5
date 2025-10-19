import { NextRequest, NextResponse } from "next/server";

const ACTION_ENDPOINT = "https://emkc.org/api/v2/piston/execute";
const DEFAULT_VERSION = "*";

type ExecuteBody = {
  code?: string;
  language?: string;
  version?: string;
  originalLanguage?: string;
};

const LANGUAGE_ALIASES = new Map<string, { runtime: string; version?: string }>(
  [
    ["js", { runtime: "javascript" }],
    ["javascript", { runtime: "javascript" }],
    ["ts", { runtime: "typescript" }],
    ["typescript", { runtime: "typescript" }],
    ["tsx", { runtime: "tsx" }],
    ["py", { runtime: "python" }],
    ["python", { runtime: "python" }],
    ["rb", { runtime: "ruby" }],
    ["ruby", { runtime: "ruby" }],
    ["go", { runtime: "go" }],
    ["rust", { runtime: "rust" }],
    ["rs", { runtime: "rust" }],
    ["java", { runtime: "java" }],
    ["kotlin", { runtime: "kotlin" }],
    ["swift", { runtime: "swift" }],
    ["php", { runtime: "php" }],
    ["c", { runtime: "c" }],
    ["cpp", { runtime: "cpp" }],
    ["cplusplus", { runtime: "cpp" }],
    ["cs", { runtime: "csharp" }],
    ["csharp", { runtime: "csharp" }],
    ["scala", { runtime: "scala" }],
    ["r", { runtime: "r" }],
    ["sh", { runtime: "bash" }],
    ["bash", { runtime: "bash" }],
    ["shell", { runtime: "bash" }],
    ["dart", { runtime: "dart" }],
    ["elixir", { runtime: "elixir" }],
    ["haskell", { runtime: "haskell" }],
    ["perl", { runtime: "perl" }],
    ["lua", { runtime: "lua" }],
  ]
);

function resolveRuntime(language?: string, version?: string) {
  const normalized = language?.trim().toLowerCase();
  if (!normalized || normalized === "plaintext" || normalized === "text") {
    return null;
  }

  const alias = LANGUAGE_ALIASES.get(normalized);
  const runtime = alias?.runtime ?? normalized;
  const resolvedVersion = version?.trim() || alias?.version || DEFAULT_VERSION;
  return { runtime, version: resolvedVersion };
}

function splitLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => splitLines(entry));
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

function dedupe(lines: string[]): string[] {
  const seen = new Set<string>();
  return lines.filter((line) => {
    if (seen.has(line)) {
      return false;
    }
    seen.add(line);
    return true;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExecuteBody;
    const code = body.code ?? "";
    if (typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Code is required for execution." },
        { status: 400 }
      );
    }

    const runtime =
      resolveRuntime(body.language, body.version) ||
      resolveRuntime(body.originalLanguage, body.version);

    if (!runtime) {
      return NextResponse.json(
        { error: "Unsupported or missing language hint." },
        { status: 400 }
      );
    }

    const executionResponse = await fetch(ACTION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: runtime.runtime,
        version: runtime.version,
        files: [{ content: code }],
      }),
      cache: "no-store",
    });

    if (!executionResponse.ok) {
      const detail = await executionResponse.text();
      return NextResponse.json(
        {
          error: "Execution service returned an error.",
          detail: detail || undefined,
        },
        { status: 502 }
      );
    }

    const result = await executionResponse.json();
    const run = result?.run ?? {};
    const compile = result?.compile ?? {};

    const compileStdout = dedupe(splitLines(compile.stdout));
    const compileStderr = dedupe(splitLines(compile.stderr));
    const runStdout = splitLines(run.stdout);
    const runOutput = splitLines(run.output);
    const stdout = dedupe(runStdout.length > 0 ? runStdout : runOutput);
    const stderr = dedupe(splitLines(run.stderr));

    return NextResponse.json({
      language: runtime.runtime,
      version: result?.version ?? runtime.version,
      stdout,
      stderr,
      output: runOutput,
      compileStdout,
      compileStderr,
      exitCode:
        typeof run.code === "number" && Number.isFinite(run.code)
          ? run.code
          : null,
      signal: run.signal ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to execute code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
