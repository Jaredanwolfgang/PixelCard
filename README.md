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

## 汇报 Slides

`/slide` 为所有汇报的目录，`/slide/diffusion-depth-step` 为第一份组会调研。
使用 [Slidev](https://sli.dev/)，Markdown 源文档和 Vue 交互组件位于 `slides/`，编译器独立于博客依赖。需要 Node.js 22.12+。

```bash
npm --prefix slides ci
npm --prefix slides run dev
npm --prefix slides run build
```

编译结果在 `public/slides/diffusion-depth-step/`，与源文件一同提交；生产服务器只构建 Next.js，不再编译 Slidev。修改后先重新编译，再运行根目录 `npm run build`。新增汇报时为其设置独立的 `--base /slide/<slug>/` 和输出目录，并更新 `src/lib/slides.ts` 的目录条目。

展示时方向键翻页，`O` 总览；工具栏可全屏或进入演讲者视图。公开构建使用 `--without-notes`，不打包演讲备注。交互图中的预算统计使用论文原始网格，不作插值。

当前汇报为 14 页主体＋1 页交互参考资料，建议讲述约 20 分钟。近期论文时间线的数据与纳入口径保存在 `slides/references/loop-diffusion-papers.json`；讲述节奏保存在 `slides/references/talk-plan.json`。数量按 arXiv 首发去重，直接相关与相邻工作分别计算，不是全领域总量或会议录用数量。

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
