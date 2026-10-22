# Diffusion depth–step 汇报的文献与统计

- 主体：16 页，按 Looped-DiT（4–7）、ELT（8–10）、LiFT（11–13）、Depth as Time（14–15）连续讲述；第 17 页提供细节与补充阅读。
- `talk-plan.json`：20 分钟讲述安排。
- `loop-diffusion-papers.json`：13 篇扩散／相关文献，11 篇直接相关，GET 与 Depth as Time 单步蒸馏工作另列。新补充工作只读原始摘要，不据此补写机制和实验细节。
- `arxiv-timeline.json`：164 条 arXiv 元数据记录及统计依据。**这是检索样本，不是 arXiv 全库统计，也不是会议发表数量。**

## 时间轴的集合与来源

基础数据来自 Azizi、Baghaei Potraghloo、Pedram 的 *Looped Language Models: A Survey and Meta-Analysis of Recurrent-Depth Transformers* 作者公开文献库，快照 2026-10-06：

[固定 commit 的 core_papers.csv](https://github.com/ArminAzizi98/looped-lm-survey/blob/2976898f522532e81380e1531c89217677842dae/data/core_papers.csv)，CC BY 4.0。

从该表筛选题名符合以下两个正则表达式的 arXiv 记录，忽略大小写，再按 ID 去重：

```text
(loop\w*|recurs\w*|recurr\w*|universal)
(transformer|language model)
```

排除表列于 JSON 的 `excluded`：CHASE 是状态空间／混合架构；CosmicFish-HRM 的题名和已提供记录不足以确认 Transformer 深度共享。补入本次扩散文献清单、ALBERT 与 Huginn；具体 ID 位于 `manualSupplements`。这是题名检索与明确补录，不声称覆盖所有命名不同的循环架构。

历史首发月份沿用综述作者的元数据，未对全部历史条目重新核对；补录的扩散论文核对原始 arXiv 摘要与 v1 submission history。不从 ID 的年月推断实际首发月份，例如 GET 的 2401.08639 对应页面记载首发于 2023-12-12。

直接 Loop Diffusion / Flow 指在去噪器内部复用共享 Transformer 层或固定点模块，含视觉、语言和语音。仅有外部采样循环、理论等价或连接、缓存、独立层的静态跳过不计。GET 与 Depth as Time 作为单步蒸馏生成器计入广义集合，但不计直接扩散子集。FPDM 的内部固定点去噪器计入直接子集。

## 复算结果

| 时段 | 广义集合 | 其中 Loop Diffusion / Flow |
|---|---:|---:|
| 2018 | 1 | 0 |
| 2019 | 2 | 0 |
| 2020 | 0 | 0 |
| 2021 | 4 | 0 |
| 2022 | 3 | 0 |
| 2023 | 6 | 0 |
| 2024 | 10 | 1 |
| 2025 | 19 | 0 |
| 2026 Q1 | 15 | 0 |
| 2026 Q2 | 38 | 4 |
| 2026 Q3 | 55 | 3 |
| 2026 Q4，截至 10/21 | 11 | 3 |

按日期前四位分年；2026 按首发月份的 `ceil(month / 3)` 分季。两列都是**该样本中的记录数**：0 只表示未收录，不证明当年没有相关论文。年度与季度时长不同，不能直接比较增长率；Q4 尚未结束，补录检索也非穷尽。柱形高度统一使用每篇相同的比例，不把两行各自归一化。

时间轴可点击查看每期清单；参考页的“广义清单”提供全部 164 条来源链接。

## 机制和实验的边界

- ELT 流程为四轮示意，随机学生是最深路径的前缀。sg 仅截断蒸馏目标；最深出口的真值损失仍更新共享参数。学生的 λ 从 1 线性降至 0。扩散表格来自原文表 2，不混入 MaskGIT 的 FID 2.0。
- Depth as Time 的 16.6 倍是参数压缩，单块仍执行 K=24。FID 11.75 是轨迹蒸馏后，4.87 包含 FD-loss 后训练；学生 CFG 与教师设置不同，不据此声称同成本。
- 只公开既有论文机制、贡献和来源；不包含聊天中的未公开组合方案或实验 idea。
