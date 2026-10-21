import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { slideDecks } from "@/lib/slides";

export const dynamic = "force-dynamic";

const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string; path?: string[] } },
) {
  if (!slideDecks.some((deck) => deck.slug === params.slug)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const root = path.resolve(process.cwd(), "public/slides", params.slug);
  const parts = params.path ?? [];
  if (parts.some((part) => part.includes("\\") || part === ".." || part.includes("\0"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  // Slidev uses history routes for slide numbers, overview and presenter mode.
  // Only known SPA routes fall back to the entry; missing assets remain 404s.
  const relative = parts.join("/");
  const isEntry = /^(?:\d+|entry|overview|print|notes|notes-edit|presenter(?:\/(?:\d+|print))?)?$/.test(relative);
  const file = path.resolve(root, isEntry ? "index.html" : relative);
  if (!file.startsWith(`${root}${path.sep}`) || !mime[path.extname(file)]) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const content = await readFile(file);
    return new NextResponse(content, {
      headers: {
        "Content-Type": mime[path.extname(file)],
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": !isEntry && relative.startsWith("assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
