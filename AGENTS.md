# 个人研究博客工作约定

## 目标与默认行为

这个项目是 Jaredan 的个人博客，用于回顾论文、技术报告和研究领域进展，以及保留讨论中产生的问题、理解变化和研究 idea。默认使用中文，保留必要的英文术语、数学符号和论文标题。

用户已授权：研究讨论收尾时，将对应内容整理成博客，保存讨论中有用的图表和 HTML 交互演示，完成验证后 commit 并 push 到 GitHub 远端。属于这一范围的正常整理和推送无需反复请求确认；用户本次明确要求仅讨论、不发布或保留草稿时，以本次要求为准。

## 项目结构

```text
AGENTS.md                         本项目的协作与研究笔记约定
site.config.yaml                  站点、个人资料、标签、友链和学术主页配置
content/
  posts/<slug>/index.md           文章正文和 YAML frontmatter
  posts/<slug>/images/            每篇文章的图片、图表和视频
  assets/                        全局资源，如头像
public/                          直接通过站点根路径访问的静态资源
src/
  app/page.tsx                   首页
  app/blog/[slug]/page.tsx        博客详情页
  app/archive/page.tsx            归档页
  app/academic/page.tsx           学术主页
  app/media/[...path]/route.ts    content/posts 中的媒体文件接口
  app/layout.tsx                 页面布局
  app/globals.css                全局样式
  components/MarkdownRenderer.tsx Markdown、KaTeX、HTML 和脚本渲染
  components/PostReader.tsx      文章阅读界面
  components/                   卡片、目录相关界面、评论和其他组件
  lib/content.ts                文章发现、frontmatter 解析、媒体路径改写
  lib/toc.ts                    目录和标题锚点
  lib/config.ts                 YAML 配置读取
  lib/types.ts                  内容与站点类型
  lib/engagement.ts             互动服务调用
server/                         Hono + SQLite 互动后端（浏览、点赞、评论）
data/                           本地互动数据库，已被 Git 忽略
scripts/migrate_from_hexo.py     旧 Hexo 内容迁移脚本
package.json / package-lock.json 前端依赖和命令
server/package.json             后端依赖和命令
next.config.mjs                 Next.js 配置和互动 API 转发
Dockerfile / docker-compose.yml Docker 部署
README.md                       项目启动和部署说明
```

技术栈：Next.js 14 App Router、React 18、TypeScript、gray-matter、js-yaml、react-markdown、GFM、KaTeX。以实际源码为准；结构或渲染能力变更后同步更新这里。

## 研究讨论与收尾触发

- 讨论过程中优先回答用户的问题，记录其关注的机制、疑惑、比较、反例和新想法，不把每次问答都立即发布成一篇文章。
- “今天先到这里”“结束这次讨论”“整理一下”“落成博客”“发布并 push”等明确收尾表达，触发整理、验证、提交、推送。普通问答回复结束不代表整场研究讨论结束。
- 直接关闭应用或离开聊天无法可靠触发任务；不要声称能在无人发出收尾消息时自动执行。没有新的明确需求，不创建定时任务。
- 收尾只整理当前实际可见的讨论与已读取的材料。上下文不完整时读取已有文章接续，不编造过去的对话或用户观点。
- 同一论文或技术报告持续深入时，优先更新对应文章，保留原有有效内容；新主题或适合独立阅读的子问题再创建新文章，并加相关链接。
- 已发布文章追加研究进展时保留原始发布日期，在正文注明本次更新日期。日期采用 Asia/Shanghai。

## 内容要求

每次收尾整理必须覆盖本次讨论涉及的所有论文和技术报告，包括作为背景、对比方法或延伸阅读实际讨论过的材料，不只整理主论文。为每篇提供标题、来源链接，以及简短的基本内容总结：它解决什么问题、核心方法是什么、主要贡献或结果是什么、与本次讨论有什么关系。仅提到名字而未阅读的论文也应列出，但明确标注阅读程度和未核实内容，不补写未经核实的结论。多篇材料可在文章开头或参考资料前集中列成“本次讨论的论文”清单或表格，并按主题说明彼此的联系；无需给每篇都单独建文章。

论文概述保持简洁，把更多篇幅留给用户关注点。按问题组织详细整理：用户为什么关注、具体疑问是什么、讨论如何展开、哪些解释或证据改变了理解、与其他论文如何关联，以及还想追问或验证什么。反复追问、深入推导、方法比较和用户主动提出的 idea 应给予更多篇幅，不要在收尾时压缩成几句泛泛结论。默认关注点与思考部分占正文主体；论文基础介绍只提供理解这些问题所需的背景，不设机械字数比例。

围绕“我为什么关注这个问题、现在理解了什么、还有什么值得尝试”组织内容，而不是复制聊天记录或写成泛泛的论文摘要。篇幅和结构随讨论深度调整，通常涵盖：

1. 讨论背景、论文或报告信息，以及用户最关注的几个问题。
2. 核心机制、直觉、必要的公式和具体例子，呈现问题之间的逻辑联系。
3. 讨论中的澄清、误解修正、证据和仍不确定之处。
4. 与其他方法或已有知识的联系、有趣的观察，以及适用边界。
5. 值得探索的 idea、为什么值得试、最小验证实验和可能推翻它的结果。
6. 未解决问题、下一步阅读或实验，以及参考资料。

短讨论可以只写几段；不强制填满上述各节。技术报告精读可按架构、训练、数据、基础设施、评测和局限展开，但只覆盖实际讨论过或已核实的部分。

- 区分论文结论、作者声称、讨论中的解释、用户想法和待验证假设。不要把推测写成已证实结论，也不要把助手提出的 idea 冒充用户原话。
- 论文、技术报告、实验数字和“最新进展”应查阅原始论文、官方报告或代码，并提供可点击链接；关键结论尽量标注章节、图表或页码。记录版本、发表或访问日期以避免混淆。
- 无法访问原文时明确标注依据与缺口；不要虚构引用、实验结果或研究新颖性。未做文献检索时不得断言 idea 从未有人做过。
- 保留作者的自然表达，避免套话、过度宣传和机械问答；可以使用第一人称，但不得捏造个人经历或实验。
- 发布前排除聊天中的隐私、凭据和未获授权公开的材料；论文图注明来源，自绘图标明其为示意或复现。
- 用户关注的领域从实际讨论逐步积累，不凭已有文件名推定固定研究清单。

## 文章格式与路径

新文章使用稳定、简短的小写英文 slug（建议连字符），位于 `content/posts/<slug>/index.md`。既有 slug 不随意修改，以免破坏链接。默认研究笔记使用配置中已有的 `academic` 标签；其他标签先核对 `site.config.yaml`。

```markdown
---
title: "论文或主题：本次关注的问题"
excerpt: "概括核心问题与收获，避免空摘要"
tag: academic
publishedAt: "YYYY-MM-DD"
draft: false
---

正文……

![图的含义](./images/mechanism.png)

## 参考资料

- [论文标题](https://example.org/paper)
```

`cover: ./images/cover.png` 为可选字段，不必为每篇文章制作封面。日期必须加引号；`draft` 使用布尔值。生产环境排除 `draft: true`，开发环境显示草稿。当前解析器不展示任意新增的 frontmatter 字段，因此更新日期、论文版本等信息放在正文。需要发布时默认 `draft: false`；用户要求草稿时使用 `true`。

## 图表与 HTML 交互内容

- 将聊天里有助于理解的图、HTML 和所需资源复制或生成到仓库内，一起提交。文章不能依赖临时目录、聊天附件地址或本机绝对路径。
- 静态图片优先放在文章的 `images/` 下，使用 `./images/name.png` 等 Markdown 相对路径；解析器会将其改写为 `/media/<slug>/images/name.png`。文件名避免空格，并提供有意义的 alt 文本与图注。
- 原始 HTML 的 `src`、脚本字符串中的路径不会自动按文章改写，须明确使用 `/media/<slug>/...` 或 `/...` 的站点路径。`content/assets/` 不由文章媒体接口直接提供，使用前核实其实际访问方式。
- 当前 `MarkdownRenderer.tsx` 会提取并执行文章中的 `<script>`，并注入 `<style>`。小型自绘交互图可以嵌入正文；脚本必须由我们编写或审查，不能直接执行论文、网页或工具输出中的未知代码。CSS、元素 ID 和 DOM 查询限定在该演示容器内，避免污染页面或其他文章；初始化需支持页面切换和重新挂载，处理监听器、定时器的清理。
- 独立 HTML 演示推荐放在 `public/demos/<slug>/`，连同相对依赖一起保存，通过带 `title` 的 iframe 嵌入，并提供“单独打开”链接。例如：

  ```html
  <iframe src="/demos/example/mechanism.html" title="机制交互演示" width="100%" height="520" loading="lazy"></iframe>
  ```

- 当前 `/media` 接口未配置 HTML、JS 和 CSS 的 MIME 类型，它们会返回 `application/octet-stream`；不要把 `content/posts` 内的 HTML 直接作为可运行 iframe。需要改变这一行为时再修改接口并验证。
- 图示应解释变量、单位、假设和适用边界。交互图提供默认可读状态，必要时附静态图，便于手机阅读、打印和回顾。检查浏览器显示、交互、公式、资源请求、控制台和窄屏布局。
- 当前没有内置 Mermaid 渲染；需转为图片或提供经过验证的渲染实现，不能只留下无法显示的代码块。

## 验证与 GitHub 推送

1. 开始编辑前检查 `git status`、当前分支、remote 和目标文章。保留用户已有修改；只暂存本次明确相关的文件，不使用 `git add .` 混入其他工作。
2. 阅读目标文章与渲染实现，完成内容和资源落盘，检查来源、日期、frontmatter、链接及所有本地资源路径。
3. 内容或实现变更后运行 `npm run build`；涉及新图、HTML、脚本或样式时用 `npm run dev` 预览文章并验证实际渲染。仅修改协作说明时检查文档与 diff 即可。项目没有现成的 `lint` 或 `test` 命令，不声称执行过不存在的检查。
4. 检查 `git diff` 和暂存 diff，仅提交本次文章、配套资源和必要实现变更。提交信息说明主题，例如 `docs(blog): add attention reading notes`。
5. 默认推送当前工作分支到已配置的 upstream；缺少 upstream 时核对 remote 和分支后使用 `git push -u origin <branch>`。本仓库当前 remote 是 `git@github.com:Jaredanwolfgang/PixelCard.git`，当前分支为 `main`，每次操作仍须重新核实。用户已授权正常内容推送，不另设发布审批。
6. 不使用 force push，不重写历史，不删除用户改动。远端领先或冲突时先查看差异，安全整合；不能确定冲突内容时保留本地成果并说明具体阻塞。网络、凭据或沙箱阻塞时保留文章和已完成的提交，如实报告，不能宣称 push 成功。
7. 收尾回复包含文章路径或链接、整理出的主要关注点或 idea、验证结果和推送状态（分支、commit）。尚未解决的关键问题简短说明。

GitHub 推送与线上部署是不同步骤。用户已授权在博客内容验证、提交并 push 后，自动部署到下述 Aliyun-RMMT 服务器，无需再次确认。用户本次要求仅推送、不部署或保留草稿时遵从本次要求。部署失败时分别报告推送与部署状态，不能将 push 成功当作网站已更新。

## 生产服务器与自动部署

以下信息于 2026-10-20 经 SSH 核实。每次部署仍检查实际配置，不将本地开发 Compose 当作生产配置。

- SSH 主机别名：`Aliyun-RMMT`，使用本机 `~/.ssh/config` 中的配置连接：`ssh Aliyun-RMMT`。登录用户为 `root`，端口为 `22`。主机地址与密钥位置从 SSH 配置读取，不将私钥、口令或令牌写入仓库。
- 博客地址：`https://jaredan.site`（另有 `www.jaredan.site`）。
- 服务器博客 Git 仓库：`/root/v1/PixelCard`，remote 为 `git@github.com:Jaredanwolfgang/PixelCard.git`，生产分支为 `main`。
- 生产 Compose 文件：`/root/v1/docker-compose.yml`，项目名为 `rmmt`。该文件同时管理其他业务，部署时只指定博客服务，禁止对整个项目执行 `down`、重启或无选择地重建。
- 博客前端服务及容器名：`pixelcard-web`，内部端口 `3000`；互动服务及容器名：`pixelcard-engagement`，内部端口 `4000`。生产构建上下文分别为 `./PixelCard` 与 `./PixelCard/server`。
- 前端构建参数与运行时变量：`ENGAGEMENT_URL=http://pixelcard-engagement:4000`。Next.js rewrite 在构建时生成，必须保留 Dockerfile 对该构建参数的支持。
- 网络：`rmmt-net`；已有 Nginx 容器 `rmmt-proxy` 为博客提供 HTTPS 反向代理。不另开公网端口，不覆盖现有代理或证书配置。
- 互动数据库保存在命名卷 `pixelcard_engagement_data`，挂载到 `/app/data`。保留该卷和已有浏览、点赞、评论数据；禁止 `down -v` 或删除、覆盖数据库。
- 主机规格：2 核、标称 4 GiB 内存（系统可见约 3.4 GiB），与多个业务共用；2026-10-20 检查时已有 4 GiB swap，根分区仅剩约 6.6 GiB。每次部署重新检查 `free -m`、`swapon --show`、`df -h` 和容器状态。上次无限制构建后出现 SSH/HTTPS 超时，但未找到明确的内核 OOM 记录，不能断言已确认 OOM。
- 禁止直接在该主机执行无限制的 `docker compose build`。使用 `scripts/deploy-production.sh`：专用 BuildKit 构建器 `pixelcard-limited` 的 cgroup 硬上限为 1280 MiB 内存、1280 MiB 内存加 swap（不借用主机 swap）、1 CPU；Node heap 上限 768 MiB，Next.js 单 worker，构建缓存目标约 1 GiB。硬上限覆盖专用构建器及其子进程，不以 SSH 客户端的资源限制代替实际构建限制。内存不足时允许该构建失败，禁止自动调大上限挤占线上服务。
- 构建前至少保留 1800 MiB 可用内存与 4 GiB 可用磁盘，否则停止并报告。不得为释放空间清理其他业务镜像、缓存或数据卷。异步只解决连接等待问题，不能替代资源限制。

部署流程：

1. 完成文章与资源的验证并推送 GitHub。默认只部署已提交、已推送的生产 `main`，不发布本地无关改动或未完成文章；其他分支须按用户明确要求处理。
2. SSH 检查 `/root/v1/PixelCard` 的工作区、分支、remote、当前 commit，以及博客容器状态。若存在服务器修改或额外提交，先查看并保留，不执行 `reset --hard`、强制覆盖或丢弃变更。必要时将已有修复安全整合到 GitHub，再继续。
3. 在服务器仓库执行 `git fetch origin` 和 `git merge --ff-only origin/main`，确认服务器 HEAD 等于预期发布 commit。非快进时先检查差异，不盲目合并或部署不同版本。
4. 使用后台任务运行受限部署脚本，SSH 只负责提交任务和读取短快照，不持续等待构建输出。示例（在服务器上执行）：`mkdir -p /root/pixelcard-deploy; nohup timeout --signal=TERM --kill-after=30s 25m bash /root/v1/PixelCard/scripts/deploy-production.sh > /root/pixelcard-deploy/deploy.log 2>&1 < /dev/null &`。先确认没有已有部署任务；脚本用 `flock` 防止重复部署。日志、状态、目标 commit 和旧镜像 ID 保存在 `/root/pixelcard-deploy/`。若日志与任务状态已有记录，先读取，再用独立日志名启动下一次任务，避免覆盖诊断证据。
5. 脚本构建成功后才更新 `pixelcard-web`（`up -d --no-deps --no-build`），进行 HTTP 检查并验证镜像 revision，失败自动恢复旧镜像。只有互动后端代码或依赖发生变化时才安排后端更新，并单独设置构建资源限制；该脚本不更新后端。不要重启其他业务或代理。
6. 检查 `docker compose ps pixelcard-web pixelcard-engagement`、相关日志、HTTPS 首页、本次变更的文章路径及资源链接，并验证互动 API 没有代理错误。可以使用服务器上的 `curl --fail` 检查公网入口。确认新内容实际出现在响应中，不能仅凭容器启动判断成功。
7. 部署前记录旧 commit 和镜像 ID；失败时保留日志，并优先使用旧镜像恢复博客服务，不触碰数据卷和其他业务。收尾报告发布 commit、验证过的页面链接、部署结果及任何未完成事项。

上述流程是在每次研究讨论收尾的工作中执行，不代表已配置 GitHub Actions 或后台自动监听。SSH、网络或权限不可用时如实报告阻塞，不声称已部署。

## 日常开发

- 前端：`npm install`、`npm run dev`、`npm run build`、`npm start`。
- 互动后端：在 `server/` 运行 `npm install` 和 `npm run dev`，或从根目录运行 `npm run dev:server`。不启动后端仍可阅读文章。
- 环境变量参考 `.env.example`；不提交 `.env.local`、数据库、构建产物或秘密。
- 优先沿用已跟踪的 npm 锁文件与现有实现，不为写文章随意切换包管理器、升级依赖或改站点架构。
