import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT || 4000);
const defaultDb =
  path.basename(process.cwd()) === "server"
    ? path.join(process.cwd(), "..", "data", "engagement.db")
    : path.join(process.cwd(), "data", "engagement.db");
const DB_PATH = process.env.DB_PATH || defaultDb;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS post_stats (
    slug     TEXT PRIMARY KEY,
    views    INTEGER NOT NULL DEFAULT 0,
    likes    INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT NOT NULL,
    author     TEXT NOT NULL,
    content    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug);
`);

function ensureStats(slug) {
  db.prepare(
    "INSERT OR IGNORE INTO post_stats (slug, views, likes) VALUES (?, 0, 0)"
  ).run(slug);
  return db.prepare("SELECT * FROM post_stats WHERE slug = ?").get(slug);
}

function commentCount(slug) {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM comments WHERE slug = ?")
    .get(slug);
  return row.c;
}

function formatComment(r) {
  return {
    id: r.id,
    slug: r.slug,
    author: r.author,
    content: r.content,
    createdAt: r.created_at.replace("T", " ").slice(0, 16),
  };
}

const app = new Hono();

app.use(
  "*",
  cors({
    origin:
      CORS_ORIGIN === "*"
        ? "*"
        : CORS_ORIGIN.split(",").map((s) => s.trim()),
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/health", (c) => c.json({ ok: true }));

app.get("/aggregate", (c) => {
  const row = db
    .prepare(
      "SELECT COALESCE(SUM(views),0) AS views, COALESCE(SUM(likes),0) AS likes FROM post_stats"
    )
    .get();
  return c.json(row);
});

app.get("/stats", (c) => {
  const slugsParam = c.req.query("slugs") || "";
  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const stats = {};
  for (const slug of slugs) {
    const row = ensureStats(slug);
    stats[slug] = {
      views: row.views,
      likes: row.likes,
      comments: commentCount(slug),
    };
  }
  return c.json({ stats });
});

app.post("/posts/:slug/view", (c) => {
  const slug = c.req.param("slug");
  ensureStats(slug);
  db.prepare("UPDATE post_stats SET views = views + 1 WHERE slug = ?").run(slug);
  const row = ensureStats(slug);
  return c.json({ views: row.views });
});

app.post("/posts/:slug/like", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json().catch(() => ({}));
  const action = body?.action === "unlike" ? "unlike" : "like";
  ensureStats(slug);
  if (action === "like") {
    db.prepare("UPDATE post_stats SET likes = likes + 1 WHERE slug = ?").run(slug);
  } else {
    db.prepare(
      "UPDATE post_stats SET likes = MAX(0, likes - 1) WHERE slug = ?"
    ).run(slug);
  }
  const row = ensureStats(slug);
  return c.json({ likes: row.likes });
});

app.get("/posts/:slug/comments", (c) => {
  const slug = c.req.param("slug");
  const rows = db
    .prepare("SELECT * FROM comments WHERE slug = ? ORDER BY id ASC")
    .all(slug);
  return c.json({ comments: rows.map(formatComment) });
});

app.post("/posts/:slug/comments", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json().catch(() => ({}));
  const author = String(body?.author ?? "").trim();
  const content = String(body?.content ?? "").trim();
  if (!author || author.length > 24) {
    return c.json({ error: "昵称需要 1–24 个字符" }, 400);
  }
  if (!content || content.length > 1000) {
    return c.json({ error: "评论需要 1–1000 个字符" }, 400);
  }
  ensureStats(slug);
  const res = db
    .prepare("INSERT INTO comments (slug, author, content) VALUES (?, ?, ?)")
    .run(slug, author, content);
  const row = db
    .prepare("SELECT * FROM comments WHERE id = ?")
    .get(Number(res.lastInsertRowid));
  return c.json({ comment: formatComment(row) }, 201);
});

console.log(`[engagement] listening on :${PORT}  db=${DB_PATH}`);
serve({ fetch: app.fetch, port: PORT });
