"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Comment, Post } from "@/lib/types";
import type { TocItem } from "@/lib/toc";
import BackgroundPattern from "./BackgroundPattern";
import MarkdownRenderer from "./MarkdownRenderer";
import { AvatarGlyph } from "./SocialIcons";
import { useTagTheme } from "./useTagTheme";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { useSiteConfig, useTag } from "./SiteProvider";

export default function PostReader({
  post,
  toc,
  prev,
  next,
  comments,
}: {
  post: Post;
  toc: TocItem[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  comments: Comment[];
}) {
  const tag = useTag(post.tagId);
  const { profile } = useSiteConfig();
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useTagTheme(tag);

  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <BackgroundPattern tag={tag} />

      <nav className="crumbs">
        <Link href="/" className="back">
          ‹ 返回
        </Link>
        <span>
          <span className="tag-link">{tag.name}</span>
          <span className="sep"> › </span>
          <span className="cur">{post.title}</span>
        </span>
      </nav>

      <div className="reader-shell">
        <motion.aside
          className="toc-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.08 }}
          style={
            {
              "--accent": tag.accent,
              "--accent-soft": tag.accentSoft,
            } as React.CSSProperties
          }
        >
          <div className="toc-author">
            <div className="avatar">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <AvatarGlyph />
              )}
            </div>
            <div>
              <div className="n">{profile.name}</div>
              <div className="d">{post.publishedAt}</div>
            </div>
          </div>

          <hr className="hairline" />

          <div className="label">目录</div>
          <ul className="toc-list">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className={`${t.level === 3 ? "l3" : ""} ${
                    activeId === t.id ? "active" : ""
                  }`}
                >
                  {t.text}
                </a>
              </li>
            ))}
          </ul>

          <hr className="hairline" />

          <div className="label">操作</div>
          <div className="toc-actions">
            <button onClick={share}>{copied ? "已复制链接 ✓" : "分享文章"}</button>
            <button onClick={() => window.print()}>打印 / 收藏为 PDF</button>
          </div>
        </motion.aside>

        <div style={{ perspective: 1400, flex: 1, minWidth: 0 }}>
          <motion.article
            className="article-card"
            initial={{ rotateY: 14, scale: 0.92, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            style={{ "--accent": tag.accent } as React.CSSProperties}
          >
            <h1>{post.title}</h1>
            <div className="title-bar" />
            <div className="article-meta">
              {post.readingTime} 分钟阅读 · {post.views} 次浏览 ·{" "}
              {comments.length} 条评论
            </div>
            <div className="article-actions">
              <LikeButton slug={post.slug} initialLikes={post.likes} big />
            </div>
            <hr className="hairline" style={{ margin: "16px 0 0" }} />
            <MarkdownRenderer content={post.content} />
          </motion.article>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <CommentSection slug={post.slug} initialComments={comments} />
          </motion.div>

          <motion.nav
            className="pager"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <div>
              {prev && (
                <>
                  <span className="lbl">‹ 上一篇</span>
                  <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                </>
              )}
            </div>
            <div className="next">
              {next && (
                <>
                  <span className="lbl">下一篇 ›</span>
                  <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                </>
              )}
            </div>
          </motion.nav>
        </div>
      </div>
    </>
  );
}
