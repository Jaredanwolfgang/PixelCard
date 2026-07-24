import type { Comment, Post, PostStats } from "./types";

function baseUrl(): string {
  return (
    process.env.ENGAGEMENT_URL ||
    process.env.NEXT_PUBLIC_ENGAGEMENT_URL ||
    "http://127.0.0.1:4000"
  ).replace(/\/$/, "");
}

async function safeFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchStats(
  slugs: string[]
): Promise<Record<string, PostStats>> {
  if (!slugs.length) return {};
  const data = await safeFetch<{ stats: Record<string, PostStats> }>(
    `/stats?slugs=${encodeURIComponent(slugs.join(","))}`
  );
  return data?.stats ?? {};
}

export async function fetchAggregate(): Promise<{
  views: number;
  likes: number;
}> {
  const data = await safeFetch<{ views: number; likes: number }>("/aggregate");
  return data ?? { views: 0, likes: 0 };
}

export async function mergePostsWithStats(posts: Post[]): Promise<Post[]> {
  const stats = await fetchStats(posts.map((p) => p.slug));
  return posts.map((p) => ({
    ...p,
    views: stats[p.slug]?.views ?? 0,
    likes: stats[p.slug]?.likes ?? 0,
    comments: stats[p.slug]?.comments ?? 0,
  }));
}

export async function incrementView(slug: string): Promise<number> {
  const data = await safeFetch<{ views: number }>(`/posts/${encodeURIComponent(slug)}/view`, {
    method: "POST",
  });
  return data?.views ?? 0;
}

export async function listComments(slug: string): Promise<Comment[]> {
  const data = await safeFetch<{ comments: Comment[] }>(
    `/posts/${encodeURIComponent(slug)}/comments`
  );
  return data?.comments ?? [];
}

/** 浏览器端调用：走 Next rewrite → engagement server */
export function engagementClientPath(path: string): string {
  return `/api/e${path.startsWith("/") ? path : `/${path}`}`;
}
