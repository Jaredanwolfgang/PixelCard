"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";
import { engagementClientPath } from "@/lib/engagement";

const AVATAR_COLORS = ["#E7ECF1", "#EAF0E8", "#F5EEDF", "#F5E9EE", "#EDE8F2"];

function colorOf(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function CommentSection({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        engagementClientPath(`/posts/${encodeURIComponent(slug)}/comments`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, content }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "发表失败，请重试");
        return;
      }
      setComments((c) => [...c, data.comment]);
      setContent("");
      localStorage.setItem("pixelcard-comment-author", author);
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setAuthor(localStorage.getItem("pixelcard-comment-author") ?? "");
  }, []);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  return (
    <section className="comment-card">
      <h2 className="comment-title">评论 · {comments.length}</h2>

      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-row">
            <span className="comment-avatar" style={{ background: colorOf(c.author) }}>
              {c.author[0]}
            </span>
            <div className="comment-body">
              <div className="comment-head">
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{c.createdAt}</span>
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          </div>
        ))}
        {!comments.length && (
          <div className="empty-hint" style={{ padding: "24px 0" }}>
            还没有评论，来抢沙发
          </div>
        )}
      </div>

      <form className="comment-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="comment-form-row">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的昵称"
            maxLength={24}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的想法…"
          rows={3}
          maxLength={1000}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn primary small" type="submit" disabled={submitting}>
            {submitting ? "发表中…" : "发表评论"}
          </button>
        </div>
      </form>
    </section>
  );
}
