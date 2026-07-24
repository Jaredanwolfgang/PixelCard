"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Post } from "@/lib/types";
import BackgroundPattern from "./BackgroundPattern";
import PostCard from "./PostCard";
import { useTagTheme } from "./useTagTheme";
import { useTags, useTag } from "./SiteProvider";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
};

export default function HomeFeed({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const tags = useTags();
  const [tagId, setTagId] = useState<string>("all");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const touchX = useRef<number | null>(null);

  const filtered = useMemo(
    () => (tagId === "all" ? posts : posts.filter((p) => p.tagId === tagId)),
    [posts, tagId]
  );
  const activeTag = useTag(tagId === "all" ? filtered[index]?.tagId : tagId);
  const current = filtered[Math.min(index, Math.max(filtered.length - 1, 0))];

  useTagTheme(activeTag);

  const go = useCallback(
    (delta: number) => {
      if (filtered.length < 2) return;
      setDir(delta);
      setIndex((i) => (i + delta + filtered.length) % filtered.length);
    },
    [filtered.length]
  );

  const selectTag = (id: string) => {
    setTagId(id);
    setIndex(0);
    setDir(1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const openPost = (post: Post) => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => router.push(`/blog/${post.slug}`), 380);
  };

  return (
    <>
      <BackgroundPattern tag={activeTag} />
      <section className="feed">
        <nav className="tag-nav">
          <button
            className={tagId === "all" ? "active" : ""}
            onClick={() => selectTag("all")}
          >
            全部
          </button>
          {tags.map((t) => (
            <button
              key={t.id}
              className={tagId === t.id ? "active" : ""}
              onClick={() => selectTag(t.id)}
            >
              {t.name}
            </button>
          ))}
        </nav>

        <div
          className="card-stage"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="peek-card left" />
          <div className="peek-card right" />

          <button
            className="stage-arrow prev"
            aria-label="上一篇"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <button
            className="stage-arrow next"
            aria-label="下一篇"
            onClick={() => go(1)}
          >
            ›
          </button>

          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            {current && (
              <motion.div
                key={current.slug + tagId}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate={
                  leaving
                    ? { rotateY: -16, scale: 1.06, opacity: 0.9 }
                    : "center"
                }
                exit="exit"
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                style={{ perspective: 1200, zIndex: 2 }}
              >
                <PostCard post={current} onOpen={openPost} />
              </motion.div>
            )}
          </AnimatePresence>

          {!current && <div className="empty-hint">这个标签下还没有文章</div>}
        </div>

        <div className="dots">
          {filtered.map((p, i) => (
            <button
              key={p.slug}
              className={i === index ? "active" : ""}
              aria-label={`第 ${i + 1} 篇`}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
