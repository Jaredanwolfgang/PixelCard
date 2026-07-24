import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function estimateReadingTime(markdown: string): number {
  const chars = markdown.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}

function resolveMediaUrl(slug: string, rel: string | undefined): string {
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel) || rel.startsWith("/")) return rel;
  const cleaned = rel.replace(/^\.\//, "");
  return `/media/${slug}/${cleaned}`;
}

/** 把正文里相对图片路径改写成 /media/<slug>/... */
function rewriteContentUrls(slug: string, content: string): string {
  return content.replace(
    /(!?\[[^\]]*\]\()(\.\/[^)\s]+|images\/[^)\s]+)(\))/g,
    (_m, open: string, url: string, close: string) => {
      const cleaned = url.replace(/^\.\//, "");
      return `${open}/media/${slug}/${cleaned}${close}`;
    }
  );
}

function parsePostFile(slug: string, filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: body } = matter(raw);
  const draft = Boolean(data.draft);
  const publishedAt = String(data.publishedAt ?? data.date ?? "").slice(0, 10);
  if (!publishedAt && !draft) return null;

  const title = String(data.title ?? slug);
  const excerpt = String(data.excerpt ?? "");
  const tagId = String(data.tag ?? data.tagId ?? "academic");
  const finalSlug = String(data.slug ?? slug);
  const content = rewriteContentUrls(finalSlug, body.trim());
  const coverUrl = resolveMediaUrl(
    finalSlug,
    data.cover ? String(data.cover) : undefined
  );

  return {
    slug: finalSlug,
    title,
    excerpt,
    coverUrl,
    tagId,
    content,
    publishedAt: publishedAt || "1970-01-01",
    readingTime: estimateReadingTime(body),
    draft,
    views: 0,
    likes: 0,
    comments: 0,
  };
}

function discoverPostDirs(): { slug: string; filePath: string }[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const out: { slug: string; filePath: string }[] = [];

  for (const ent of entries) {
    if (ent.isDirectory()) {
      const indexMd = path.join(POSTS_DIR, ent.name, "index.md");
      if (fs.existsSync(indexMd)) {
        out.push({ slug: ent.name, filePath: indexMd });
      }
    } else if (ent.isFile() && ent.name.endsWith(".md")) {
      out.push({
        slug: ent.name.replace(/\.md$/, ""),
        filePath: path.join(POSTS_DIR, ent.name),
      });
    }
  }
  return out;
}

/** 列出已发布文章（默认排除 draft；开发环境可 includeDrafts） */
export function listPosts(opts?: {
  tagId?: string;
  includeDrafts?: boolean;
}): Post[] {
  const includeDrafts =
    opts?.includeDrafts ?? process.env.NODE_ENV !== "production";
  let posts = discoverPostDirs()
    .map(({ slug, filePath }) => parsePostFile(slug, filePath))
    .filter((p): p is Post => !!p);

  if (!includeDrafts) {
    posts = posts.filter((p) => !p.draft);
  }
  if (opts?.tagId) {
    posts = posts.filter((p) => p.tagId === opts.tagId);
  }
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return posts;
}

export function getPostBySlug(
  slug: string,
  opts?: { includeDrafts?: boolean }
): Post | null {
  const includeDrafts =
    opts?.includeDrafts ?? process.env.NODE_ENV !== "production";
  const found = discoverPostDirs().find((d) => {
    const post = parsePostFile(d.slug, d.filePath);
    return post?.slug === slug;
  });
  if (!found) return null;
  const post = parsePostFile(found.slug, found.filePath);
  if (!post) return null;
  if (post.draft && !includeDrafts) return null;
  return post;
}

export function adjacentPosts(publishedAt: string): {
  prev: Pick<Post, "slug" | "title"> | null;
  next: Pick<Post, "slug" | "title"> | null;
} {
  const posts = listPosts();
  const i = posts.findIndex((p) => p.publishedAt === publishedAt);
  // list is DESC: index-1 = newer, index+1 = older
  const newer = i > 0 ? posts[i - 1] : null;
  const older = i >= 0 && i < posts.length - 1 ? posts[i + 1] : null;
  return {
    prev: older ? { slug: older.slug, title: older.title } : null,
    next: newer ? { slug: newer.slug, title: newer.title } : null,
  };
}

/** 安全解析 content 下媒体文件的真实路径 */
export function resolveContentMedia(parts: string[]): string | null {
  const base = path.resolve(path.join(process.cwd(), "content", "posts"));
  const target = path.resolve(path.join(base, ...parts));
  if (!target.startsWith(base + path.sep) && target !== base) return null;
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return null;
  return target;
}

export { extractToc, headingId } from "./toc";
export type { TocItem } from "./toc";
