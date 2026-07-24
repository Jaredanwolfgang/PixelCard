"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { AvatarGlyph, SearchIcon } from "./SocialIcons";
import { useSiteConfig, useTag, useTags } from "./SiteProvider";
import BackgroundPattern from "./BackgroundPattern";
import { useTagTheme } from "./useTagTheme";

function monthOf(iso: string): string {
  const [y, m] = iso.split("-");
  return `${y}年${Number(m)}月`;
}

function relDate(iso: string): string {
  const days = Math.floor(
    (Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000
  );
  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}个月前`;
}

function ArchiveRow({ post }: { post: Post }) {
  const tag = useTag(post.tagId);
  return (
    <Link href={`/blog/${post.slug}`} className="archive-row">
      <div className="top">
        <span
          className="chip"
          style={{ background: tag.accentSoft, color: tag.accent }}
        >
          {tag.name}
        </span>
        <span className="t">{post.title}</span>
      </div>
      <div className="e">{post.excerpt}</div>
      <div className="m">
        <span>
          {relDate(post.publishedAt)} · {post.readingTime}分钟阅读
        </span>
        <span className="lk">♥ {post.likes}</span>
      </div>
    </Link>
  );
}

export default function ArchiveClient({ posts }: { posts: Post[] }) {
  const { site, profile } = useSiteConfig();
  const tags = useTags();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (selected.length && !selected.includes(p.tagId)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    });
  }, [posts, query, selected]);

  const groups = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of filtered) {
      const key = monthOf(p.publishedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return [...map.entries()];
  }, [filtered]);

  const tagCount = (id: string) => posts.filter((p) => p.tagId === id).length;

  const activeTag =
    (selected.length === 1
      ? tags.find((t) => t.id === selected[0])
      : null) ?? tags[0];
  useTagTheme(activeTag);

  return (
    <>
      <BackgroundPattern tag={activeTag} />
    <main className="shell" style={{ alignItems: "flex-start" }}>
      <aside className="sidebar-card" style={{ textAlign: "left" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            className="avatar"
            style={{ width: 44, height: 44, margin: 0, borderWidth: 2 }}
          >
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <AvatarGlyph />
            )}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>
              {profile.handle}
            </div>
          </div>
        </div>

        <hr className="hairline" style={{ margin: "16px 0" }} />

        <div style={{ fontSize: 11.5, color: "var(--text-3)", padding: "0 8px" }}>
          共 {posts.length} 篇文章
        </div>

        <hr className="hairline" style={{ margin: "16px 0" }} />

        <div
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: 1,
            color: "var(--text-3)",
            margin: "0 8px 10px",
          }}
        >
          按标签筛选
        </div>
        <div className="filter-chips">
          {tags.map((t) => {
            const active = selected.includes(t.id);
            return (
              <button
                key={t.id}
                className={active ? "active" : ""}
                style={
                  active
                    ? {
                        background: t.accentSoft,
                        borderColor: t.accent,
                        color: t.accent,
                      }
                    : undefined
                }
                onClick={() => toggleTag(t.id)}
              >
                {t.name} {tagCount(t.id)}
              </button>
            );
          })}
        </div>

        <hr className="hairline" style={{ margin: "16px 0" }} />

        <div
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: 1,
            color: "var(--text-3)",
            margin: "0 8px 10px",
          }}
        >
          快捷链接
        </div>
        <nav className="side-links">
          <Link href="/">
            回到主页 <span className="arr">→</span>
          </Link>
          <Link href="/academic">
            学术主页 <span className="arr">→</span>
          </Link>
        </nav>

        <div className="copyright" style={{ textAlign: "center" }}>
          {site.copyright || `© ${site.name}`}
        </div>
      </aside>

      <section className="feed" style={{ alignItems: "stretch" }}>
        <div className="archive-head">
          <h1>全部博客</h1>
          <div className="search-pill">
            <SearchIcon />
            <input
              placeholder="搜索文章…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {groups.map(([month, list]) => (
          <div key={month}>
            <div className="month-label">{month}</div>
            <div className="archive-list">
              {list.map((p) => (
                <ArchiveRow key={p.slug} post={p} />
              ))}
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="empty-hint">没有匹配的文章，换个关键词试试</div>
        )}
      </section>
    </main>
    </>
  );
}
