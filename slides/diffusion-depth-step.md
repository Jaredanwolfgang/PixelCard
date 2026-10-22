---
theme: default
title: Diffusion 的计算，该花在深度还是步数上？
info: Loop Diffusion 文献机制与研究设想 · 约 30 分钟
author: Jaredan
lang: zh-CN
favicon: /favicon.webp
class: cover-page
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1100
fonts:
  sans: 'Inter, PingFang SC, Microsoft YaHei, sans-serif'
  mono: 'SFMono-Regular, Consolas, monospace'
  provider: none
drawings:
  enabled: false
transition: none
mdc: true
---

<div class="eyebrow">LOOP DIFFUSION / 文献调研</div>

# LoopDiffusion 范式下，<br>有限的 Compute 该花在深度还是步数上？

<p class="cover-lead">监督信号与有限 Compute 下的动态任务分配</p>

<div class="cover-axes"><div><b>↻</b><span>更深的内部计算</span></div><i>×</i><div><b>→</b><span>更多的去噪步数</span></div></div>

<div class="cover-bottom"><span>肖翊成</span><span>文献机制 → 预算证据 → 后续 idea</span></div>

---

<div class="eyebrow">01 / 为什么现在关注</div>

# Loop 研究活跃，Diffusion 仍待系统理解

<PaperTimeline />

<div class="talk-footer"><span>检索样本，非全量；年／季不等长；* Q4 截至 10/21</span><a href="25">口径与文献 ↗</a></div>

---

<div class="eyebrow">02 / 为什么研究 LOOP</div>

# 不增加参数，也能增加计算深度

<ComputeAxes />

<div class="axes-question">同样的预算，多算几层，还是多走几步？</div>

<div class="talk-footer"><span>示意：每步 1 次模型调用；不另计 CFG；块数 ≠ FLOPs</span><a href="https://arxiv.org/html/2610.05538v1#S2" target="_blank" rel="noopener">LiFT §2–3 ↗</a></div>

---

<div class="eyebrow">03 / LOOPED-DIT · 循环结构</div>

# 循环的是隐状态，不是重新喂入一张图

<div class="architecture"><div>A · 6 块</div><span>→</span><div class="shared">B · N = 5 层<br><b>↻ K = 4 轮</b></div><span>→</span><div>C · 6 块</div></div>

<div class="structure-metrics"><div><b>17</b><span>独立块参数组</span></div><div><b>32</b><span>执行深度 D</span></div></div>

<div class="big-statement">图像和文本隐状态，共同进入下一轮。</div>
<p class="single-note">先让重复计算有效，再谈推理时加深。</p>

<div class="talk-footer"><span>固定噪声输入，在 B 内细化表示</span><a href="https://arxiv.org/html/2609.40305v1#S2" target="_blank" rel="noopener">Looped-DiT §2 ↗</a></div>

---

<div class="eyebrow">04 / LOOPED-DIT · 深监督</div>

# 不让早期循环只依赖最终出口的梯度

<LoopReadouts />


<div class="talk-footer"><span>深监督不保证误差逐轮下降</span><a href="https://arxiv.org/html/2609.40305v1#S2.SS1" target="_blank" rel="noopener">Looped-DiT §2.1 ↗</a></div>

---

<div class="eyebrow">05 / LOOPED-DIT · 自调节注意力</div>

# 共享计算，也要调节更新的强度与方向

<SelfModulatingAttention />

<div class="talk-footer"><span>依据论文结构图重绘 · 图中省略 head 下标</span><a href="https://arxiv.org/html/2609.40305v1#S6.SS3" target="_blank" rel="noopener">Looped-DiT §2.2 / 附录 §6.3 ↗</a></div>

---

<div class="eyebrow">06 / LOOPED-DIT · 对照实验</div>

# 设计提升质量，Loop 改善同预算下的效果

<LoopedResults />

<div class="talk-footer"><span>B/32 四项均分；B/16 六项均分，两种口径分开</span><a href="https://arxiv.org/html/2609.40305v1#S3" target="_blank" rel="noopener">Looped-DiT 表 1 / 2 / 4，图 4 / 6 ↗</a></div>

---


<div class="eyebrow">07 / ELT · 循环内自蒸馏</div>

# 训练多个出口，推理按预算选深度

<ELTTraining />

<div class="talk-footer"><span>ILSD：循环内自蒸馏 · 图中以最多 4 轮为例</span><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT §4 / 图 3 ↗</a></div>


---


<div class="eyebrow">08 / ELT · 监督方式</div>

# 先共同学真值，再让浅出口追深出口

<ELTLoss />

<div class="talk-footer"><span>x₀：本页为干净图像，LiFT 为噪声</span><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT §4 · 扩散损失使用 w(t) 加权 MSE ↗</a></div>


---


<div class="eyebrow">09 / ELT · 扩散实验</div>

# 共享参数，保留可用的计算深度

<div class="elt-results"><div class="table-head"><span>结构 N × K</span><span>参数量</span><span>块执行数</span><span>FID ↓</span></div><div><b>DiT · 32 × 1</b><span>2.1B</span><span>32</span><strong>3.43</strong></div><div><b>ELT · 8 × 4</b><span>539M</span><span>32</span><strong>3.16</strong></div><div><b>ELT · 16 × 2</b><span>1.1B</span><span>32</span><strong>2.83</strong></div><div class="under-capacity"><b>ELT · 1 × 32</b><span>69M</span><span>32</span><strong>10.30</strong></div></div>

<div class="big-statement compact-statement">这组实验中，单层共享块仍受容量限制。</div>

<div class="talk-footer"><span>ImageNet 256² · 同执行深度；各行来自不同训练配置</span><a href="https://arxiv.org/html/2604.09168v3#S5.SS2" target="_blank" rel="noopener">ELT 表 2 · 摘要 FID 2.0 属于 MaskGIT ↗</a></div>


---

<div class="eyebrow">10 / LIFT · 训练目标</div>

# u* 是样本对的速度，深度 s 控制修正进度

<LiftTraining />

<div class="talk-footer"><span>蓝箭头为参考，预测可偏离；Ktrain：训练循环数；d：速度维数；sg：目标停梯度</span><a href="https://arxiv.org/html/2610.05538v1#S3.SS1" target="_blank" rel="noopener">LiFT §3.1 式 (4–7) ↗</a></div>

---

<div class="eyebrow">11 / LIFT · 主要结果</div>

# 深度外推有效，较大模型取得更好的质量与成本

<LiftEvidence />

<div class="talk-footer"><span>ImageNet 256² · 无 CFG · FID-50k；B/2 未优于 Dense</span><a href="https://arxiv.org/html/2610.05538v1#S4.SS2" target="_blank" rel="noopener">LiFT §4.2–4.3 / 表 2 / 图 3–4 ↗</a></div>

---

<div class="eyebrow">12 / LIFT · 计算分配</div>

# 多 Loop 与多 Step，收益不等价

<LiftBudgetEvidence />

<div class="takeaway compact">这组实验中，25 步 × 4 轮，比 50 步 × 2 轮更省、也更好。</div>

<div class="talk-footer"><span>同 checkpoint · ImageNet 256² · 无 CFG · FID ↓</span><a href="https://arxiv.org/html/2610.05538v1#A1.SS3" target="_blank" rel="noopener">LiFT 表 6 ↗</a></div>

---

<div class="eyebrow">13 / LIFT · 收益的边界</div>

# 不能只把预算堆到循环深度上

<div class="budget-comparison"><div class="budget-header"><span>采样步数 T × 循环 K</span><span>TFLOPs / 图 ↓</span><span>FID ↓</span></div><div class="budget-row budget-best"><b>25 × 4</b><span>7.397</span><strong>13.165</strong></div><div class="budget-row"><b>10 × 16</b><span>11.027</span><strong>15.094</strong></div><div class="budget-row"><b>10 × 32</b><span>21.785</span><strong>16.435</strong></div></div>

<div class="big-statement compact-statement">更多循环，不等于更好的质量。</div>
<p class="single-note">这三个实测配置里，25 × 4 同时更省、更好。</p>

<div class="talk-footer"><span>同一 checkpoint；非等成本三点；训练深度处也未优于同尺度 Dense</span><a href="https://arxiv.org/html/2610.05538v1#A1.SS3" target="_blank" rel="noopener">LiFT 表 6 ↗</a></div>

---

<div class="eyebrow">14 / LIFT · 主要贡献</div>

# 让循环成为可用的推理计算维度

<LiftContributions />

<p class="single-note">本文的深度由预算指定；尚未实现按样本状态动态分配。</p>

<div class="talk-footer"><span>ImageNet 256² · 无 CFG；收益依赖模型规模与计算配置</span><a href="https://arxiv.org/html/2610.05538v1#S6" target="_blank" rel="noopener">LiFT §3–4 / §6 ↗</a></div>

---

<div class="eyebrow">15 / DEPTH AS TIME · 内部时间</div>

# 内部时钟，标记共享块要完成哪段计算

<DepthAsTime />

---


<div class="eyebrow">16 / DEPTH AS TIME · 压缩结果</div>

# 参数压缩，与计算压缩分开看

<div class="depth-results"><div><span>MeanFlow 教师</span><b>459M</b><strong>FID 4.01</strong></div><i>→</i><div><span>单共享块 · K = 24</span><b>27.6M</b><strong>11.75 → 4.87</strong><small>轨迹蒸馏 → FD-loss 后训练</small></div></div>

<div class="big-statement compact-statement">参数压缩 16.6 倍，仍执行 24 次共享块。</div>
<p class="single-note">浅循环需要针对粗时间区间训练；直接少跑会失效。</p>

<div class="talk-footer"><span>ImageNet 256² · FID-50k；学生使用 CFG，非同成本比较</span><a href="https://arxiv.org/html/2610.03626v1#A3" target="_blank" rel="noopener">Depth as Time 附录 C / 表 1–2 ↗</a></div>


---

<div class="eyebrow">17 / 回到研究问题</div>

# 监督信号与计算分配：后续研究的两个重点

<ResearchPosition />

<div class="talk-footer"><a href="25">讲述节奏、口径与参考资料 ↗</a><a href="/blog/diffusion-depth-step" target="_blank">完整文献笔记 ↗</a></div>

---

<div class="eyebrow">18 / 研究路径 · 预训练模型微调</div>

# 实现基础：利用已有 checkpoint 开展微调

<FeasibilityResults />

<div class="talk-footer"><span>SiT / Looped-DiT 两条实现路径 · 先行实验仅作参考</span><a href="24">实验与计划对应记录 ↗</a></div>

---

<div class="eyebrow">19 / 后续方向 · 深度分工设想</div>

# 深循环把握大跨度方向，浅循环做局部修正

<div class="plan-role-figure"><DepthRolesPlan /></div>

<div class="talk-footer"><span>自绘二维分布示意，无实验数据；颜色表示负责该段更新的循环深度</span><span>深度 K 与外部步长 Δt 分别控制</span></div>

---

<div class="eyebrow">20 / 拟研究的创新点一 · 监督信号</div>

# 监督信号设计：让不同深度学出长短程分工

<div class="method-comparison"><div><b>长程任务</b><span>探索让深循环学习较大跨度更新的方向信息</span></div><div><b>短程任务</b><span>探索让浅循环学习局部残差与细节修正</span></div><div><b>微调目标</b><span>为不同任务设计监督目标、Loss 权重与训练过程</span></div></div>

<div class="big-statement compact-statement">核心设计：不同深度分别学什么。</div><p class="single-note" style="font-size:21px">候选路径：长程方向监督与短程残差监督。</p>

<div class="talk-footer"><span>研究设想 · 候选监督路径</span><span>研究设想 · 监督信号设计</span></div>

---

<div class="eyebrow">21 / 拟研究的创新点二 · 动态计算分配</div>

# 分配指标设计：有限 Compute 下动态选择长短程任务

<div class="method-comparison"><div><b>判断指标</b><span>根据当前生成状态，估计两类任务的单位计算收益</span></div><div><b>动态决策</b><span>结合剩余预算，选择长程推进或短程修正</span></div><div><b>指标设计约束</b><span>推理时可计算，判断开销也计入总预算</span></div></div>

<div class="big-statement compact-statement">核心设计：下一份计算花在哪里。</div><p class="single-note" style="font-size:21px">候选信号：方向稳定性、局部修正需求；结合当前状态与剩余预算。</p>

<div class="talk-footer"><span>研究设想 · 候选分配信号</span><span>总 Compute ≤ 预算 B；K 与 Δt 分别控制</span></div>

---

<div class="eyebrow">22 / 评估方案 · 分别检验两个创新点</div>

# 两项 idea 的评估路径：监督、分配与组合收益

<PlanValidation />

<div class="talk-footer"><span>讨论建议 · 角色交换与步长控制用于检验分工解释</span><span>研究设想 · 评估方案</span></div>

---

<div class="eyebrow">实验参考 / 2026-10-22 更新</div>

# 研究路径与先行实验资料

<div class="experiment-source-list">
<div><b>CIFAR-10 三种子</b><span>RESULTS.md · Confirmatory three-training-seed result</span></div>
<div><b>E3.5 早期保留</b><span>e3_5_early_preservation_v1/report.md · §3、§5</span></div>
<div><b>E3.8 完整覆盖</b><span>e3_8_fixed_s_coverage_v1/report.md · Primary / final checkpoints</span></div>
<div><b>独立噪声复跑</b><span>looped_dit_alloc/v2fix_20261021/RESULTS.md</span></div>
<div><b>单次选臂路由</b><span>looped_dit_router/gnode6_router_M0M1_20261021_145453/RESULTS.md</span></div>
</div>

<p class="single-note" style="font-size:21px">这些先行实验供实现选型和对照设计参考。后续围绕监督信号与动态任务分配展开，具体目标与评估方案见前文。</p>

<ExperimentSourceLinks />

<style>
.experiment-source-list>div{display:grid;grid-template-columns:215px 1fr;gap:18px;border-bottom:1px solid #d5ded8;padding:13px 0;font-size:20px}.experiment-source-list b{font-weight:600;color:#416575}.experiment-source-list span{font-size:17px;align-self:center;overflow-wrap:anywhere}
</style>


---

<div class="eyebrow">文献参考 / 按需查看</div>

# 来源、实验设置与统计口径

<ReferencePanel />
