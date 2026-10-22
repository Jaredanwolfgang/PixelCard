---
theme: default
title: Diffusion 的计算，该花在深度还是步数上？
info: Loop Diffusion 文献调研 · 20 分钟汇报版
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

# Diffusion 的计算，<br>该花在深度还是步数上？

<p class="cover-lead">为什么现在关注 Loop Transformer？</p>

<div class="cover-axes"><div><b>↻</b><span>更深的内部计算</span></div><i>×</i><div><b>→</b><span>更多的去噪步数</span></div></div>

<div class="cover-bottom"><span>Jaredan</span><span>近期进展 → 代表工作 → 计算分配</span></div>

---

<div class="eyebrow">01 / 为什么现在关注</div>

# Loop 相关 arXiv 的时间分布

<PaperTimeline />

<div class="talk-footer"><span>题名筛选文献库＋补录 · 非全量；年度与季度长度不同</span><a href="17">口径与文献 ↗</a></div>

---

<div class="eyebrow">02 / 为什么研究 LOOP</div>

# 不增加参数，也能增加计算深度

<ComputeAxes />

<div class="takeaway">问题是：同样的预算，多算几层，还是多走几步？</div>

<div class="talk-footer"><span>结构示意 · 块执行数不等于 FLOPs</span><a href="https://arxiv.org/html/2610.05538v1#S2" target="_blank" rel="noopener">LiFT §2–3 ↗</a></div>

---

<div class="eyebrow">03 / LOOPED-DIT · 循环结构</div>

# 循环的是隐状态，不是重新喂入一张图

<div class="architecture"><div>A · 6 块</div><span>→</span><div class="shared">B · 5 块<br><b>↻ 4 轮</b></div><span>→</span><div>C · 6 块</div></div>

<div class="structure-metrics"><div><b>17</b><span>独立块参数组</span></div><div><b>32</b><span>一次预测的块执行数</span></div></div>

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

# 已经形成的信息，不必在每轮都大幅改写

<AttentionProjection />

XSA：$z=o-(o^\top\hat v_i)\hat v_i$

<div class="talk-footer"><span>二维投影示意 · 不是注意力对角线 mask</span><a href="https://arxiv.org/html/2609.40305v1#S2.SS2" target="_blank" rel="noopener">Looped-DiT §2.2 ↗</a></div>

---

<div class="eyebrow">06 / LOOPED-DIT · 对照实验</div>

# 两项设计，在这组实验里都带来收益

<div class="ablation-matrix"><span></span><span>无深监督</span><span>有深监督</span><span>普通注意力</span><b>56.2</b><b>57.5</b><span>XSA</span><b>58.5</b><b class="matrix-best">59.1</b></div>

<div class="comparison-band"><span>匹配训练／推理计算</span><div>深层非循环 <b>58.1</b> <i>→</i> Looped-DiT <b>59.1</b></div></div>

<div class="talk-footer"><span>B/32 · 四项评测均分 ↑ · 计算口径见参考页</span><a href="https://arxiv.org/html/2609.40305v1#S3.SS2" target="_blank" rel="noopener">Looped-DiT 表 2 / 4 ↗</a></div>

---


<div class="eyebrow">07 / ELT · 循环内自蒸馏</div>

# 一条共享轨迹，浅出口向深出口学习

<ELTTraining />

<div class="talk-footer"><span>ILSD：Intra-Loop Self Distillation · 示意为 4 轮</span><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT §4 / 图 3 ↗</a></div>


---


<div class="eyebrow">08 / ELT · 监督方式</div>

# 教师一直学真值，学生逐渐学教师

$$
\begin{aligned}
\mathcal L ={}& \mathcal L_{\mathrm{GT}}(\hat x_{L_{\max}},x_0)\\
&+\lambda\,\mathcal L_{\mathrm{GT}}(\hat x_{L_{\mathrm{int}}},x_0)\\
&+(1-\lambda)\,\mathcal L_{\mathrm{dist}}(\hat x_{L_{\mathrm{int}}},\operatorname{sg}(\hat x_{L_{\max}}))
\end{aligned}
$$

<div class="curriculum"><span>训练初期<br><b>λ = 1 · 学真值</b></span><i>线性递减 →</i><span>训练后期<br><b>λ = 0 · 学教师</b></span></div>

<div class="talk-footer"><span>sg：只截断蒸馏目标；共享参数仍由真值损失更新</span><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT §4 · 扩散损失使用 w(t) 加权 MSE ↗</a></div>


---


<div class="eyebrow">09 / ELT · 扩散实验</div>

# 共享参数，保留可用的计算深度

<div class="elt-results"><div class="table-head"><span>结构 N × L</span><span>参数量</span><span>块执行数</span><span>FID ↓</span></div><div><b>DiT · 32 × 1</b><span>2.1B</span><span>32</span><strong>3.43</strong></div><div><b>ELT · 8 × 4</b><span>539M</span><span>32</span><strong>3.16</strong></div><div><b>ELT · 16 × 2</b><span>1.1B</span><span>32</span><strong>2.83</strong></div><div class="under-capacity"><b>ELT · 1 × 32</b><span>69M</span><span>32</span><strong>10.30</strong></div></div>

<div class="big-statement compact-statement">这组实验中，单层共享块仍受容量限制。</div>

<div class="talk-footer"><span>ImageNet 256² · 同执行深度；各行来自不同训练配置</span><a href="https://arxiv.org/html/2604.09168v3#S5.SS2" target="_blank" rel="noopener">ELT 表 2 · 摘要 FID 2.0 属于 MaskGIT ↗</a></div>


---

<div class="eyebrow">10 / LIFT · 训练目标</div>

# 不同深度，给不同的中间目标

$$
\bar u_s=(1-s)\,\operatorname{sg}(u_0)+s\,u^\star
$$

<div class="target-path"><div><b>u₀</b><span>初始速度预测</span></div><i></i><div><b>ūₛ</b><span>当前深度的参考目标</span></div><i></i><div><b>u*</b><span>目标速度</span></div></div>

<div class="big-statement">不同 K，最终都到 s = 1。</div>
<p class="single-note">s 是计算深度坐标，不是外部去噪时间。</p>

<div class="talk-footer"><span>预测空间中的参考路径示意</span><a href="https://arxiv.org/html/2610.05538v1#S3.SS1" target="_blank" rel="noopener">LiFT §3.1 ↗</a></div>

---

<div class="eyebrow">11 / LIFT · 计算分配</div>

# 多 Loop 与多 Step，收益不等价

<LiftGrid />

<div class="takeaway compact">这组实验中，25 步 × 4 轮，比 50 步 × 2 轮更省、也更好。</div>

<div class="talk-footer"><span>同 checkpoint · ImageNet 256² · 无 CFG · FID ↓</span><a href="https://arxiv.org/html/2610.05538v1#A1.SS3" target="_blank" rel="noopener">LiFT 表 6 ↗</a></div>

---

<div class="eyebrow">12 / LIFT · 收益的边界</div>

# 不能只把预算堆到循环深度上

<div class="budget-comparison"><div class="budget-header"><span>步数 × 轮数</span><span>TFLOPs / 图 ↓</span><span>FID ↓</span></div><div class="budget-row budget-best"><b>25 × 4</b><span>7.397</span><strong>13.165</strong></div><div class="budget-row"><b>10 × 16</b><span>11.027</span><strong>15.094</strong></div><div class="budget-row"><b>10 × 32</b><span>21.785</span><strong>16.435</strong></div></div>

<div class="big-statement compact-statement">更多循环，不等于更好的质量。</div>
<p class="single-note">这三个实测配置里，25 × 4 同时更省、更好。</p>

<div class="talk-footer"><span>同一 checkpoint 与评估协议；非等成本三点</span><a href="https://arxiv.org/html/2610.05538v1#A1.SS3" target="_blank" rel="noopener">LiFT 表 6 ↗</a></div>

---

<div class="eyebrow">13 / DEPTH AS TIME · 内部时间</div>

# 用内部时间，组织共享块的计算

<InternalClock />

<div class="big-statement compact-statement">重新划分内部时间，仍然走到同一终点。</div>
<p class="single-note">内部时钟 τ ≠ 外部去噪时间。</p>

<div class="talk-footer"><span>24 层教师的轨迹蒸馏示意</span><a href="https://arxiv.org/html/2610.03626v1#S5" target="_blank" rel="noopener">Depth as Time §5 ↗</a></div>

---


<div class="eyebrow">14 / DEPTH AS TIME · 压缩结果</div>

# 参数压缩，与计算压缩分开看

<div class="depth-results"><div><span>MeanFlow 教师</span><b>459M</b><strong>FID 4.01</strong></div><i>→</i><div><span>单共享块 · K = 24</span><b>27.6M</b><strong>11.75 → 4.87</strong><small>轨迹蒸馏 → FD-loss 后训练</small></div></div>

<div class="big-statement compact-statement">参数压缩 16.6 倍，仍执行 24 次共享块。</div>
<p class="single-note">浅循环需要针对粗时间区间训练；直接少跑会失效。</p>

<div class="talk-footer"><span>ImageNet 256² · FID-50k；学生使用 CFG，非同成本比较</span><a href="https://arxiv.org/html/2610.03626v1#A3" target="_blank" rel="noopener">Depth as Time 附录 C / 表 1–2 ↗</a></div>


---

<div class="eyebrow">15 / 回到研究问题</div>

# 先看监督什么，再看计算花在哪里

<div class="method-comparison"><div><b>Looped-DiT</b><span>各出口追同一干净图像，调节注意力更新</span></div><div><b>ELT</b><span>浅出口向最深出口蒸馏</span></div><div><b>LiFT</b><span>各深度追预测空间中的不同参考目标</span></div><div><b>Depth as Time</b><span>匹配教师的层间轨迹与最终输出</span></div></div>

<div class="closing">最后，在相同预算下比较深度与步数。</div>

<div class="talk-footer"><a href="17">讲述节奏、口径与参考资料 ↗</a><a href="/blog/diffusion-depth-step" target="_blank">完整文献笔记 ↗</a></div>

---

<div class="eyebrow">参考 / 按需查看，不计入主体 16 页</div>

# 来源、实验设置与统计口径

<ReferencePanel />
