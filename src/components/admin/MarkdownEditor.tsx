"use client";

import { useRef } from "react";

const fontFamilies = [
  { label: "Sans", value: "md-font-sans" },
  { label: "Serif", value: "md-font-serif" },
  { label: "Mono", value: "md-font-mono" },
];

const fontSizes = [
  { label: "Small", value: "md-font-sm" },
  { label: "Base", value: "" },
  { label: "Large", value: "md-font-lg" },
  { label: "Huge", value: "md-font-xl" },
];

const fontColors = [
  { label: "Default", value: "" },
  { label: "Accent", value: "md-color-accent" },
  { label: "Rose", value: "md-color-rose" },
  { label: "Emerald", value: "md-color-emerald" },
  { label: "Amber", value: "md-color-amber" },
];

const codeLanguages = [
  "typescript",
  "javascript",
  "python",
  "java",
  "kotlin",
  "go",
  "csharp",
  "cpp",
  "swift",
  "rust",
  "bash",
];

type MarkdownEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  minRows?: number;
};

function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minRows = 10,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const updateValue = (next: string) => {
    onChange(next);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const wrapSelection = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    updateValue(`${before}${prefix}${selected}${suffix}${after}`);
  };

  const toggleHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const lines = value.split("\n");
    let charCount = 0;
    const updatedLines = lines.map((line) => {
      const lineStart = charCount;
      charCount += line.length + 1;
      if (
        selectionStart <= lineStart + line.length &&
        selectionEnd >= lineStart
      ) {
        const prefix = "#".repeat(level) + " ";
        const trimmed = line.replace(/^#+\s*/, "");
        return `${prefix}${trimmed}`;
      }
      return line;
    });
    updateValue(updatedLines.join("\n"));
  };

  const toggleList = (type: "bullet" | "number") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const lines = value.split("\n");
    let charCount = 0;
    const updatedLines = lines.map((line, index) => {
      const lineStart = charCount;
      charCount += line.length + 1;
      const selected =
        selectionStart <= lineStart + line.length && selectionEnd >= lineStart;
      if (!selected) return line;
      if (type === "bullet") {
        return line.startsWith("- ")
          ? line
          : `- ${line.replace(/^[-*]\s*/, "")}`;
      }
      const base = line.replace(/^[0-9]+\.\s*/, "");
      return `${index + 1}. ${base}`;
    });
    updateValue(updatedLines.join("\n"));
  };

  const insertCodeBlock = (language: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || "// code";
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const snippet = `\n\n\`\`\`${language}\n${selected}\n\`\`\`\n`;
    updateValue(`${before}${snippet}${after}`);
  };

  const wrapWithSpan = (className: string) => {
    if (!className) return;
    wrapSelection(`<span class="${className}">`, "</span>");
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
          <button
            type="button"
            onClick={() => wrapSelection("**", "**")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("*", "*")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("<u>", "</u>")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Underline
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("`", "`")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Inline code
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
          <button
            type="button"
            onClick={() => toggleHeading(2)}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(3)}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(4)}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            H4
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
          <button
            type="button"
            onClick={() => toggleList("bullet")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Bullet list
          </button>
          <button
            type="button"
            onClick={() => toggleList("number")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Numbered list
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("> ", "")}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            Quote
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
          <label className="flex items-center gap-1">
            <span>Font</span>
            <select
              className="rounded bg-transparent text-white/80"
              onChange={(event) => {
                const className = event.target.value;
                if (!className) return;
                wrapWithSpan(className);
                event.target.value = "";
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Choose
              </option>
              {fontFamilies.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-black"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span>Size</span>
            <select
              className="rounded bg-transparent text-white/80"
              onChange={(event) => {
                const className = event.target.value;
                if (!className) return;
                wrapWithSpan(className);
                event.target.value = "";
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Choose
              </option>
              {fontSizes.map((option) => (
                <option
                  key={option.value || option.label}
                  value={option.value}
                  className="text-black"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span>Color</span>
            <select
              className="rounded bg-transparent text-white/80"
              onChange={(event) => {
                const className = event.target.value;
                if (className) {
                  wrapWithSpan(className);
                }
                event.target.value = "";
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Choose
              </option>
              {fontColors.map((option) => (
                <option
                  key={option.value || option.label}
                  value={option.value}
                  className="text-black"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
          <label className="flex items-center gap-1">
            <span>Code</span>
            <select
              className="rounded bg-transparent text-white/80"
              onChange={(event) => {
                const language = event.target.value;
                if (language) {
                  insertCodeBlock(language);
                }
                event.target.value = "";
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Language
              </option>
              {codeLanguages.map((language) => (
                <option key={language} value={language} className="text-black">
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        rows={minRows}
        className="min-h-[200px] w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white shadow-inner focus:border-white/30 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
