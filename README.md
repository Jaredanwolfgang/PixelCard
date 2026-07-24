# PixelCard

社交卡片风格的个人博客 **Template** — 暖纸色极简设计，Tag 主题化，本地 Markdown + KaTeX，YAML 全局配置，Docker Compose 附带互动小后端。

## 快速开始（本地）

```bash
# 1. 安装前端依赖
npm install

# 2. 安装并启动互动服务（浏览 / 点赞 / 评论）
cd server && npm install && npm run dev
# 另开终端
cd .. && cp .env.example .env.local
npm run dev   # http://localhost:3000
```

不启 `server` 时页面仍可浏览文章，互动数字会显示为 0。

## 你只需要改这些

| 文件 / 目录 | 用途 |
|---|---|
| `site.config.yaml` | 站点名、个人资料、社交链接、Tags、友链、学术主页 |
| `content/posts/<slug>/index.md` | 写文章（frontmatter + Markdown） |
| `content/posts/<slug>/images/` | 文章配图 |
| `content/assets/` | 全局资源（如头像） |

### 社交链接

在 `site.config.yaml` 的 `socials` 里只填 `href`，图标已内置：

`github` · `linkedin` · `mail` · `website` · `twitter` · `scholar` · `bilibili` · `rss`

`href` 为空或不写则不显示。

### 文章示例

```md
---
title: "我的第一篇文章"
excerpt: "一句话摘要"
tag: tech
cover: ./images/cover.png
publishedAt: "2026-07-24"
draft: false
---

正文支持 **GFM**、KaTeX（`$inline$` / `$$block$$`）、相对路径图片，以及安全过滤后的 HTML：

![示意图](./images/diagram.png)

$$
E = mc^2
$$

<div class="callout">自定义 HTML 块</div>
```

图片会通过 `/media/<slug>/...` 提供；`draft: true` 仅在开发环境展示。

## Docker 部署

```bash
docker compose up -d --build
```

- Web：`http://服务器IP:3000`
- 互动数据持久化：`./data/engagement.db`
- 改 Markdown / `site.config.yaml` 后重新 `docker compose up -d --build`

## 架构

```
content/ + site.config.yaml   →  Git 管理的内容与配置
Next.js (web)                 →  前端渲染
server/ (Hono + SQLite)       →  浏览量 / 点赞 / 评论
```

浏览器请求 `/api/e/*`，由 Next rewrite 转到互动服务。

## 目录结构

```
├── site.config.yaml          # 全局配置
├── content/
│   ├── posts/<slug>/index.md
│   └── assets/
├── server/                   # 互动小后端
├── src/                      # Next.js 前端
├── docker-compose.yml
└── Dockerfile
```
