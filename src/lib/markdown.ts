"use server";

import { marked } from "marked";
import hljs from "highlight.js";
import createDOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(
  window as unknown as Window & typeof globalThis
);

DOMPurify.setConfig({
  ADD_TAGS: ["button"],
  ADD_ATTR: [
    "data-target",
    "data-language",
    "title",
    "aria-label",
    "aria-disabled",
  ],
});

const renderer = new marked.Renderer();

let codeBlockIndex = 0;

renderer.code = ({ text, lang }): string => {
  const fallbackLanguage = lang?.trim()?.split(/\s+/)[0] ?? "plaintext";
  const language = hljs.getLanguage(fallbackLanguage)
    ? fallbackLanguage
    : "plaintext";

  const highlighted = hljs.highlight(text, { language }).value;
  const languageLabel =
    language === "plaintext" ? "TEXT" : language.toUpperCase();
  codeBlockIndex += 1;
  const codeId = `code-block-${codeBlockIndex}`;

  return [
    `<figure class="code-figure" data-language="${language}">`,
    '  <figcaption class="code-figure__header">',
    '    <div class="code-figure__meta">',
    `      <span class="code-figure__lang">${languageLabel}</span>`,
    "    </div>",
    '    <div class="code-figure__actions">',
    `      <button type="button" class="code-action code-action--copy" data-target="${codeId}" title="Copy code" aria-label="Copy code">`,
    '        <span aria-hidden="true">⧉</span>',
    "      </button>",
    `      <button type="button" class="code-action code-action--run" data-target="${codeId}" data-language="${language}" title="Run code" aria-label="Run code">`,
    '        <span aria-hidden="true">▶</span>',
    "      </button>",
    "    </div>",
    "  </figcaption>",
    `  <pre><code id="${codeId}" class="hljs language-${language}">`,
    highlighted,
    "  </code></pre>",
    "</figure>",
  ].join("\n");
};

marked.use({ renderer });

marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function renderMarkdown(markdown: string) {
  codeBlockIndex = 0;
  const parsed = await marked.parse(markdown);
  const html = typeof parsed === "string" ? parsed : "";
  return DOMPurify.sanitize(html);
}
