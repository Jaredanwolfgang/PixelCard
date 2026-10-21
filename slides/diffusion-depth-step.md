---
theme: default
title: Diffusion 的计算，该花在深度还是步数上？
info: Loop Diffusion Transformer 文献调研 · 组会初稿
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

<div class="eyebrow">LOOP DIFFUSION TRANSFORMER / 文献调研</div>

# Diffusion 的计算，<br>该花在深度还是步数上？

<p class="cover-lead">已经在反复去噪了，为什么还要让 Transformer 再循环？</p>

<div class="cover-axes"><div><span>Recurrent depth</span><b>↻</b><small>在当前位置，形成更好的预测</small></div><i>×</i><div><span>Denoising steps</span><b>→</b><small>沿生成轨迹，推进更多次</small></div></div>

<div class="cover-bottom"><span>Jaredan · 组会初稿 · 约 10 分钟</span><span>Looped-DiT / LiFT / Depth as Time</span></div>

<div class="source">基于三篇论文的 v1 版本整理；图示由本文绘制，实验数字来自原文。 <span class="page-no">01 / 08</span></div>

---

<div class="eyebrow">01 / 为什么关注 LOOP</div>

# 共享参数，让推理深度成为一个可调的量

<p class="lead">参数量限制“存多少”，推理预算决定“算多久”。循环把这两个量部分分开。</p>

<ComputeAxes />

<div class="takeaway">研究的理由：同样一笔计算，可以用于改善当前预测，也可以用于增加采样更新；哪种更划算，需要实验回答。</div>

<div class="source">Recurrent depth：一次预测内部重复共享块的次数；denoising steps：外层采样更新次数。记号 K、T 为本汇报统一记号。<br>依据 <a href="https://arxiv.org/html/2609.40305v1#S2" target="_blank" rel="noopener">Looped-DiT §2</a>、<a href="https://arxiv.org/html/2610.05538v1#S2" target="_blank" rel="noopener">LiFT §2–3</a>。块执行次数是结构示意，不等于精确 FLOPs 或延迟。 <span class="page-no">02 / 08</span></div>

---

<div class="eyebrow">02 / LOOPED-DIT · 机制</div>

# Looped-DiT 怎样让重复计算有用？

<div class="architecture"><div>A · 前置 6 块</div><span>→</span><div class="shared">B · 共享 5 块<br><b>↻ 4 轮</b></div><span>→</span><div>C · 后置 6 块</div><span>→</span><div>预测 x₀</div></div>

<p class="diagram-caption">17 组独立块参数，执行 32 次块计算。循环传递隐状态；一次调用内的噪声输入保持不变。</p>

<div class="columns">
<div class="panel">
<h2>深监督：每轮都要能预测</h2>
<p>每轮隐状态经过共享后置段 C，预测<strong>同一张干净图像</strong>，让中间状态也直接获得训练信号。</p>
<div class="mini-equation">C(h₁), C(h₂), …, C(hₖ) → 同一 x₀</div>
<p class="small">训练读出各轮；固定 K 推理时只读最终轮。它不保证误差逐轮下降。</p>
</div>
<div class="panel blue">
<h2>自调节注意力：控制反复改写</h2>
<p>重复注意力更新可能破坏已形成的局部信息。论文用门控，或 XSA 投影，调节注意力输出。</p>
<p class="small">XSA（Exclusive Self Attention）去掉输出沿当前 token 自身 value 方向的分量；并非删除注意力矩阵的对角线。</p>
</div>
</div>

<div class="source"><a href="https://arxiv.org/html/2609.40305v1#S2" target="_blank" rel="noopener">Looped Diffusion Transformer v1 · §2、§2.1–2.2、附录 §6.3</a>。上图为默认分块方式的自绘示意。<span class="page-no">03 / 08</span></div>

---

<div class="eyebrow">03 / LOOPED-DIT · 证据</div>

# 两项设计都有效，但“必要”要限定实验范围

<div class="columns evidence-columns">
<div>
<div class="chart-label">四项生成评测的平均分 ↑</div>
<div class="bar-row"><span>朴素循环</span><div><i style="width: 28%"></i></div><b>56.2</b></div>
<div class="bar-row"><span>＋深监督</span><div><i style="width: 54%"></i></div><b>57.5</b></div>
<div class="bar-row"><span>＋XSA</span><div><i style="width: 74%"></i></div><b>58.5</b></div>
<div class="bar-row accent"><span>＋深监督＋XSA</span><div><i style="width: 86%"></i></div><b>59.1</b></div>
<p class="diagram-caption">Looped-DiT B/32，四轮；横轴从 54.8 起，非零基线。</p>
<div class="axis-labels"><span>54.8</span><span>57.3</span><span>59.8</span></div>
</div>
<div class="panel blue">
<h2>比较计算量，结论才站得住</h2>
<p>在训练与推理计算匹配的对照中：</p>
<div class="score-pair"><div><b>58.1</b><span>更深的非循环模型<br>＋深监督</span></div><div><b>59.1</b><span>Looped-DiT<br>＋深监督＋XSA</span></div></div>
<p class="small">单次预测均为 267 GFLOPs；参数分别为 473M / 260M。此处不是整张图的采样成本。</p>
</div>
</div>

<div class="takeaway">这组结果支持“训练设计能让循环获益”；还不能推出所有 Diffusion 模型都必须采用这两项设计。</div>

<div class="source"><a href="https://arxiv.org/html/2609.40305v1#S3.SS3" target="_blank" rel="noopener">Looped-DiT v1 · 表 4</a>：DPG、PRISM、CoRe、Spatial 平均分；<a href="https://arxiv.org/html/2609.40305v1#S3.SS2" target="_blank" rel="noopener">表 2</a>：训练 / 推理计算匹配对照。图按原始数字绘制；1 GFLOP = 10⁹ 次浮点运算。<span class="page-no">04 / 08</span></div>

---

<div class="eyebrow">04 / LIFT · 训练目标</div>

# LiFT：不让每个深度都立刻追同一个目标

<p class="lead">把初始速度预测到训练目标之间的路径，变成各个深度的监督。</p>

$$
\bar u_s=(1-s)\,\operatorname{sg}(u_0)+s\,u^\star,\qquad s\in[0,1]
$$

<div class="target-path"><div><b>u₀</b><span>初始预测</span></div><i></i><div><b>ūₛ</b><span>随深度改变的参考目标</span></div><i></i><div><b>u*</b><span>目标速度</span></div></div>

<div class="columns">
<div><h2>深度预算可以变</h2><p>训练随机采样中间坐标；推理按所选 K 均匀划分，最后都到 s = 1。</p></div>
<div><h2>含义要分清</h2><p>s 是<strong>计算深度坐标</strong>，不是外部去噪时间；直线路径定义在预测空间。</p></div>
</div>

<div class="source"><a href="https://arxiv.org/html/2610.05538v1#S3.SS1" target="_blank" rel="noopener">LiFT: Loop Flow Transformers Loop in Depth, Flow in Time v1 · §3.1</a>。sg 为 stop-gradient；u₀ 为 prelude 的预测，另有辅助损失。<br>本文自绘参考路径，不表示隐状态沿直线运动。<span class="page-no">05 / 08</span></div>

---

<div class="eyebrow">05 / LIFT · 计算预算</div>

# 更多 loop 和更多 step，收益并不等价

<LiftGrid />

<div class="takeaway compact">25 步 × 4 轮：7.397 TFLOPs / FID 13.165；50 步 × 2 轮：8.070 / 20.304。前者在这组设置下更省、也更好。</div>

<div class="source"><a href="https://arxiv.org/html/2610.05538v1#A1.SS3" target="_blank" rel="noopener">LiFT v1 · §4.4、附录 A.3 表 6</a>。ImageNet-1k 256²，L/2-R10（270.24M），训练 2 轮、500k updates，无 CFG，Euler；同 checkpoint。<br><a href="https://arxiv.org/abs/1706.08500" target="_blank" rel="noopener">FID</a>：生成特征分布距离，此处评估 50k 图，越低越好；1 TFLOP = 10¹² 次浮点运算，不含 VAE 解码。24 点未插值，未含额外 K=3、5 两点。<br>★ 仅为该实测网格内预算最优，不代表全局最优或在线决策规则。<span class="page-no">06 / 08</span></div>

---

<div class="eyebrow">06 / DEPTH AS TIME · 内部时间</div>

# 一次前向里，也能组织一条内部计算轨迹

<p class="lead">先观察单步生成模型的中间层，再用带“内部时间”的共享块蒸馏教师轨迹。</p>

<InternalClock />

<div class="columns tight">
<div><h2>训练对齐什么？</h2><p>学生隐状态匹配对应教师层，并匹配最终输出。内部区间 (τₐ, τᵦ) 通过 AdaLN 条件化共享块。</p></div>
<div><h2>改变 K 意味着什么？</h2><p>重新划分整段内部时间，终点仍相同。K 小，不等于少走了一段外部去噪时间。</p></div>
</div>

<div class="source"><a href="https://arxiv.org/html/2610.03626v1#S5" target="_blank" rel="noopener">Depth as Time in One-Step Generative Models v1 · §5、附录 C.1</a>。图示为 L/2 单共享块、24 层教师的对齐方式；外部任务固定 (t,r)=(1,0)。<br>τ 是归一化内部时钟，不是经校准的噪声水平。模型压缩不等于计算按参数压缩比例下降。<span class="page-no">07 / 08</span></div>

---

<div class="eyebrow">07 / 这次调研说明了什么</div>

# Loop 值得研究，因为它改变了计算的使用方式

<table class="summary-table"><thead><tr><th>代表工作</th><th>最重要的贡献</th><th>读结果时保留的边界</th></tr></thead><tbody><tr><td><a href="https://arxiv.org/html/2609.40305v1" target="_blank" rel="noopener">Looped-DiT</a></td><td>深监督与注意力调节，让重复计算有效</td><td>同一目标的迭代细化；收益依赖训练设计</td></tr><tr><td><a href="https://arxiv.org/html/2610.05538v1" target="_blank" rel="noopener">LiFT</a></td><td>深度相关监督，并联合扫描 K 与 T</td><td>已有预算网格，尚不能给出通用分配结论</td></tr><tr><td><a href="https://arxiv.org/html/2610.03626v1" target="_blank" rel="noopener">Depth as Time</a></td><td>把层间计算显式组织成内部时间轨迹</td><td>内部时间与外部生成时间仍需区分</td></tr></tbody></table>

<div class="closing">先让额外计算有用，再在相同预算下比较它该花在哪里。</div>

<div class="closing-links"><a href="/blog/diffusion-depth-step" target="_blank">完整文献笔记 ↗</a><a href="/slide">返回汇报目录 ↗</a><span>方向键翻页 · O 总览 · 工具栏全屏</span></div>

<div class="source">阅读范围：三篇论文 v1，均为作者报告的结果；本汇报未进行复现实验，不跨数据集、指标或引导设置排列性能名次。<span class="page-no">08 / 08</span></div>
