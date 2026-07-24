"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartIcon } from "./SocialIcons";
import { engagementClientPath } from "@/lib/engagement";

export default function LikeButton({
  slug,
  initialLikes,
  big,
}: {
  slug: string;
  initialLikes: number;
  big?: boolean;
}) {
  const storageKey = `pixelcard-liked-${slug}`;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    if (next) setBurst((b) => b + 1);
    localStorage.setItem(storageKey, next ? "1" : "0");
    try {
      const res = await fetch(engagementClientPath(`/posts/${encodeURIComponent(slug)}/like`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: next ? "like" : "unlike" }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } catch {
      /* offline: keep optimistic state */
    }
  };

  return (
    <button
      className={`like-btn ${big ? "big" : ""} ${liked ? "liked" : ""}`}
      onClick={toggle}
      aria-label="点赞"
    >
      <motion.span
        key={burst}
        initial={burst ? { scale: 1.5 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        style={{ display: "inline-flex" }}
      >
        <HeartIcon filled={liked} />
      </motion.span>
      <span>{likes}</span>
    </button>
  );
}
