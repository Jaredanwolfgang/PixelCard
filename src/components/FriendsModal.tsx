"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Friend } from "@/lib/types";

export default function FriendsStat({
  count,
  friends,
}: {
  count: number;
  friends: Friend[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="stat-btn" onClick={() => setOpen(true)}>
        <div className="num">{count}</div>
        <div className="lbl">朋友</div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.94, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 12, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <span>我的朋友们</span>
                <button
                  className="modal-close"
                  aria-label="关闭"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="friend-list">
                {friends.map((f) => (
                  <a
                    key={f.name}
                    className="friend-row"
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {f.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="friend-avatar"
                        src={f.avatar}
                        alt={f.name}
                        style={{ background: f.color }}
                      />
                    ) : (
                      <span className="friend-avatar" style={{ background: f.color }}>
                        {f.name[0]}
                      </span>
                    )}
                    <span className="friend-meta">
                      <span className="friend-name">{f.name}</span>
                      <span className="friend-bio">{f.bio}</span>
                    </span>
                    <span className="friend-arr">↗</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
