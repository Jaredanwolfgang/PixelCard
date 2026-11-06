# Slidev 汇报

## LingSheng × PyTorch 协作框架

- 主稿：`lingsheng-collaboration.md`；独立主题：`public/lingsheng-collaboration/lingsheng-theme.css`。
- `npm --prefix slides run dev:lingsheng`：本地预览；`npm --prefix slides run build:lingsheng`：生成公开静态文件，不包含演讲备注。
- 博客入口：`/slide/lingsheng-collaboration`。内容依据项目协作、任务边界和知识库文档整理，具体任务授权以项目最新记录为准。

## RSI for Infra

- 主稿：`rsi-for-infra.md`，33 页；沿用 Loop Diffusion 的共享样式。
- 原始 PDF 与原图：`public/rsi-for-infra/`；图像可在汇报中点击放大。
- `public/rsi-for-infra/style.css` 仅为本汇报增加带 `.rsi-deck` 前缀的布局。RSI 命令通过 `PIXELCARD_SLIDE_DECK` 选择独立静态目录，避免打包其他汇报图片；Vite 在入口加载样式，支持任意页深链接。
- `npm --prefix slides run dev:rsi`：`http://localhost:3032/`。
- `npm --prefix slides run build:rsi`：生成 `../public/slides/rsi-for-infra/`，公开构建不含演讲备注。
- 站点入口：`/slide/rsi-for-infra`；依据用户更正后的 `RSI-for-infra-v3.pdf`（25 页），保留原稿署名日期 2026-10-08。
- 原稿映射：1→1；2→2；3→3、8；4→4；5→5；6→6；7→7、33；8→8–10；9→11；10→12；11–16→13–18；17→19；18→20–21；19→22–24；20→24；21→25；22→26–27；23→28；24→29–30；25→31。32–33 为来源和阅读状态。
- 核对记录：`references/rsi-for-infra-sources.json`。Recursive 旧链接迁移到 `/updates/`；FlashAttention 数字按 AlphaEvolve v1 §3.3.4 修正为 32%。原稿硬件拓扑按原样保留，不将它视为经过外部核实的规格。
- 所有实验曲线均来自用户提供的 v3，未从截图估计新数据。计划中的逐比特确定性、MFU 40% 与预算申请均明确标为计划，已有 Profile 不当作优化后收益。MFU 在 CPU 平台上的分母需要统一精度与峰值口径。

## Loop Diffusion 汇报：统一版本入口

这份汇报于 2026-10-22 合并两个聊天的修改。以后只维护一份主稿，不再分别编辑“本地版”和“普通版”。

| 内容 | 唯一入口 |
|---|---|
| 汇报正文（25 页，含参考页） | `diffusion-depth-step.md` |
| 图示与交互 | `components/` |
| 讲述顺序、页码、时间安排 | `references/talk-plan.json` |
| 原文图片与数据 | `public/` 与 `references/*-figures.json` |
| 旧本地入口 | `diffusion-depth-step.local.md`，仅为主稿的符号链接 |
| 合并前快照 | `private/version-backups/`；最近一次路径见 `private/latest-version-backup.txt` |

用户已于 2026-10-22 明确授权部署当前 25 页统一版，包含本次后续研究 idea 及参考材料。合并前快照和本地预览截图仍保留在 Git 忽略目录中。后续新增内容另按当次公开范围处理；编译产物存在不代表网站已经更新。

## 预览与编译

```sh
npm --prefix slides run dev
```

统一实时预览为 `http://localhost:3031/`。两个聊天都使用这个入口，编辑同一份主稿。共享文件会反映最新修改，但聊天中的旧上下文不能当成磁盘上的最新版本；编辑前重新读取文件与 diff。同一时刻只让一个聊天修改主稿。

```sh
npm --prefix slides run build
npm --prefix slides run build:review
```

`build` 生成 `../public/slides/diffusion-depth-step/`，供博客本地路由预览；`build:review` 生成 Git 忽略的 `../dist/loop-research/`。二者读取同一主稿。旧的 `3137/slide/diffusion-depth-step` 是博客静态产物预览，需要编译和刷新；日常修改统一看 3031。

博客开发缓存使用 `.next-dev/`，生产构建使用 `.next/`，避免两个进程互相覆盖缓存。

## 已合并的内容

- 保留 XSA 同页展开、原图弹窗与 Looped-DiT 对照实验。
- 保留 ELT 的早退／Anytime 图解、逐行 Loss 说明和 sg 梯度弹窗。
- LiFT 依次讲训练目标与二维速度例子（11）、主要结果（12）、计算分配（13）、收益边界（14），最后用主要贡献小结（15）收束；保留原图弹窗与生成样本。
- 保留 Depth as Time 的内部时钟、训练流程、目标函数和 FD 后训练四个视图。
- 保留 Depth–Step dynamics 的研究定位，以及监督信号设计、有限 Compute 下动态分配长短程任务两个核心 idea。
- 后续方向按 idea 路径讲述，先行实验作为详情和参考资料，不用进度标签打断主线。

旧版本与合并前的编译产物均已备份；不要把快照复制回主稿来继续编辑。
