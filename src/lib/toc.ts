// Client-safe TOC helpers (no Node built-ins — safe to import from client components).

export interface TocItem {
  level: 2 | 3;
  text: string;
  id: string;
}

export function headingId(text: string): string {
  return (
    "h-" +
    encodeURIComponent(
      text
        .toLowerCase()
        .replace(/[`*_]/g, "")
        .replace(/\s+/g, "-")
    )
  );
}

/** Extract H2/H3 headings from markdown for the table of contents. */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inCode = false;
  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) {
      items.push({
        level: m[1].length as 2 | 3,
        text: m[2].trim(),
        id: headingId(m[2].trim()),
      });
    }
  }
  return items;
}
