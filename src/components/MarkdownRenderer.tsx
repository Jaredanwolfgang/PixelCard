"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import { headingId } from "@/lib/toc";

/** Trusted author content: keep layout attrs while still blocking exotic tags. */
const schema: Schema = {
  ...defaultSchema,
  // Keep original ids so post demos / anchors still work
  clobber: [],
  required: {},
  strip: [],
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "video",
    "audio",
    "canvas",
    "label",
    "figure",
    "figcaption",
    "iframe",
    "style",
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      "target",
      "rel",
      "className",
      "style",
    ],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "className",
      "style",
      "loading",
      "draggable",
      "width",
      "height",
      "id",
    ],
    video: [
      "src",
      "controls",
      "autoPlay",
      "muted",
      "loop",
      "playsInline",
      "poster",
      "width",
      "height",
      "className",
      "style",
      "id",
      "ariaLabel",
    ],
    audio: ["src", "controls", "autoPlay", "muted", "loop", "className", "style", "id"],
    canvas: ["id", "width", "height", "className", "style", "ariaLabel"],
    iframe: [
      "src",
      "width",
      "height",
      "frameBorder",
      "allow",
      "allowFullScreen",
      "loading",
      "className",
      "style",
      "title",
    ],
    input: [
      "type",
      "id",
      "name",
      "min",
      "max",
      "step",
      "value",
      "checked",
      "disabled",
      "className",
      "style",
    ],
    label: ["htmlFor", "className", "style", "id"],
    div: ["className", "style", "id", "role", "tabIndex", "ariaLabel"],
    span: ["className", "style", "id"],
    section: ["className", "style", "id"],
    figure: ["className", "style", "id"],
    figcaption: ["className", "style", "id"],
    p: ["className", "style", "id", "align"],
    table: ["className", "style", "id", "width", "align"],
    thead: ["className", "style"],
    tbody: ["className", "style"],
    tr: ["className", "style", "align"],
    th: ["className", "style", "align", "colSpan", "rowSpan", "width"],
    td: ["className", "style", "align", "colSpan", "rowSpan", "width"],
    h1: ["className", "style", "id"],
    h2: ["className", "style", "id"],
    h3: ["className", "style", "id"],
    h4: ["className", "style", "id"],
    h5: ["className", "style", "id"],
    h6: ["className", "style", "id"],
    pre: ["className", "style"],
    code: [...(defaultSchema.attributes?.code ?? []), "className", "style"],
    style: ["type", "media"],
    "*": [
      ...((defaultSchema.attributes?.["*"] as string[] | undefined) ?? []),
      "className",
      "style",
      "id",
      "role",
      "tabIndex",
      "ariaLabel",
      "ariaHidden",
      "dataFrameCount",
      "dataNoLightbox",
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto", "xmpp", "irc", "ircs"],
    src: ["http", "https"],
  },
};

type ExtractedAssets = {
  markdown: string;
  styles: string[];
  scripts: { src?: string; code?: string }[];
};

function extractAssets(content: string): ExtractedAssets {
  const styles: string[] = [];
  const scripts: { src?: string; code?: string }[] = [];

  // External + inline scripts
  let markdown = content.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (_m, attrs: string, body: string) => {
      const srcMatch = attrs.match(/\bsrc\s*=\s*(["'])(.*?)\1/i);
      if (srcMatch) {
        scripts.push({ src: srcMatch[2] });
      } else if (body.trim()) {
        scripts.push({ code: body });
      }
      return "\n";
    }
  );

  // Style blocks (kept out of react-markdown tree; injected into <style>)
  markdown = markdown.replace(
    /<style\b[^>]*>([\s\S]*?)<\/style>/gi,
    (_m, css: string) => {
      styles.push(css);
      return "\n";
    }
  );

  return { markdown, styles, scripts };
}

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return textOf(
      (node as { props: { children?: React.ReactNode } }).props.children
    );
  }
  return "";
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-md-src="${CSS.escape(src)}"]`
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.mdSrc = src;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(el);
  });
}

function prepareInlineScript(code: string): string {
  // Post demos often listen for DOMContentLoaded; by the time we inject,
  // the document is already ready, so patch addEventListener temporarily.
  return `;(function(){
  var __orig = document.addEventListener.bind(document);
  document.addEventListener = function(type, listener, options) {
    if (String(type).toLowerCase() === "domcontentloaded") {
      if (document.readyState === "loading") {
        return __orig(type, listener, options);
      }
      try { listener.call(document, new Event("DOMContentLoaded")); } catch (e) { console.warn(e); }
      return;
    }
    return __orig(type, listener, options);
  };
  try {
${code}
  } finally {
    document.addEventListener = __orig;
  }
})();`;
}

function MdInput({
  value,
  defaultValue,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  // HTML in markdown uses value="…"; under React that becomes a controlled
  // input and the thumb cannot move. Prefer uncontrolled defaultValue.
  const initial =
    defaultValue !== undefined
      ? defaultValue
      : value !== undefined
        ? value
        : undefined;
  return <input {...props} defaultValue={initial} />;
}

function MdImg({
  src,
  alt,
  draggable,
  loading,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  // Keep the initial src from markdown; interactive demos mutate img.src
  // imperatively and must not be overwritten by React re-renders.
  const initialSrc = useRef(src);
  if (initialSrc.current == null && src) initialSrc.current = src;
  const canDrag =
    draggable === true || draggable === "true";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={initialSrc.current ?? src}
      alt={alt ?? ""}
      loading={loading ?? "lazy"}
      draggable={canDrag}
    />
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const scopeId = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const { markdown, styles, scripts } = useMemo(
    () => extractAssets(content),
    [content]
  );

  // Inject post-authored styles as-is (trusted content; class names are post-specific)
  const injectedCss = useMemo(() => styles.join("\n"), [styles]);

  useEffect(() => {
    let cancelled = false;
    const injected: HTMLScriptElement[] = [];
    (async () => {
      try {
        for (const s of scripts) {
          if (cancelled) return;
          if (s.src) await loadScript(s.src);
        }
        // Wait until markdown DOM (inputs/canvas/imgs) is committed
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (cancelled || !rootRef.current) return;

        for (const s of scripts) {
          if (cancelled || !s.code) continue;
          const runner = document.createElement("script");
          runner.type = "text/javascript";
          runner.text = prepareInlineScript(s.code);
          runner.dataset.mdInline = scopeId;
          document.body.appendChild(runner);
          injected.push(runner);
        }
      } catch (err) {
        console.warn("[MarkdownRenderer] script error:", err);
      }
    })();

    return () => {
      cancelled = true;
      injected.forEach((n) => n.remove());
      document
        .querySelectorAll(`script[data-md-inline="${scopeId}"]`)
        .forEach((n) => n.remove());
    };
  }, [scripts, scopeId]);

  return (
    <div className={`md md-html md-scope-${scopeId}`} ref={rootRef}>
      {injectedCss ? (
        <style dangerouslySetInnerHTML={{ __html: injectedCss }} />
      ) : null}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeKatex]}
        components={{
          h2: ({ children }) => (
            <h2 id={headingId(textOf(children))}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={headingId(textOf(children))}>{children}</h3>
          ),
          table: ({ children }) => (
            <div className="md-scroll">
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => (
            <div className="md-scroll md-scroll--code">
              <pre>{children}</pre>
            </div>
          ),
          input: MdInput,
          img: MdImg,
          a: ({ href, children, ...props }) => {
            const external = !!href && /^https?:\/\//i.test(href);
            return (
              <a
                href={href}
                {...props}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
