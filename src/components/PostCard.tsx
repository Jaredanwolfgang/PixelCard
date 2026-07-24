"use client";

import { motion } from "framer-motion";
import type { Post } from "@/lib/types";
import { CommentIcon } from "./SocialIcons";
import LikeButton from "./LikeButton";
import { useTag } from "./SiteProvider";

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

export default function PostCard({
  post,
  onOpen,
}: {
  post: Post;
  onOpen: (post: Post) => void;
}) {
  const tag = useTag(post.tagId);
  return (
    <motion.article
      className="post-card"
      onClick={() => onOpen(post)}
      style={
        {
          "--accent": tag.accent,
          "--cover-a": tag.coverFrom,
          "--cover-b": tag.coverTo,
        } as React.CSSProperties
      }
      whileTap={{ scale: 0.98 }}
    >
      <div className="cover">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverUrl} alt={post.title} />
        ) : (
          <span className="cover-icon">{tag.icons[0]}</span>
        )}
        <span className="cover-chip">{tag.name}</span>
      </div>
      <div className="body">
        <h3 className="title">{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="hashtags">#{tag.nameEn}</div>
        <div className="foot">
          <LikeButton slug={post.slug} initialLikes={post.likes} />
          <span className="act">
            <CommentIcon /> {post.comments}
          </span>
          <span className="date">{relDate(post.publishedAt)}</span>
        </div>
      </div>
    </motion.article>
  );
}
