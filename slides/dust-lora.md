---
theme: default
title: DUST-LoRA：无反向传播的低秩适配
info: 理论、实验设计与结果
lang: zh-CN
class: cover-page
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1100
fonts:
  sans: 'Inter, PingFang SC, Microsoft YaHei, sans-serif'
  provider: none
drawings:
  enabled: false
transition: none
---

<div class="eyebrow">DISTRIBUTED MACHINE LEARNING / PROJECT DEFENSE</div>

# DUST-LoRA<br>无反向传播的低秩适配

<p class="cover-lead">从输出扰动估计，到完整切空间与真实模型实验</p>
<div class="cover-axes"><div><b>∂</b><span>梯度估计</span></div><i>×</i><div><b>↗</b><span>分布式探测</span></div></div>
<div class="cover-bottom"><span>课程项目汇报</span><span>理论 · 实验设计 · 结果与局限</span></div>

---

<div class="eyebrow">01 / RESEARCH QUESTION</div>

# 不经过 Transformer 反向传播，能训练 LoRA 吗？

<div class="three-takeaways">
<div><b>准确性</b><span>前向扰动能否恢复与 BP 接近的更新？</span></div>
<div><b>任务效果</b><span>真实语言模型上，学习轨迹和生成质量如何？</span></div>
<div><b>资源代价</b><span>多卡分摊探针后，时间和显存是否划算？</span></div>
</div>
<div class="takeaway compact">主要发现：短程学习可接近 BP；当前计算成本很高，长输入显存也可能更高。</div>

---

<div class="eyebrow">02 / DUST · INTUITION</div>

# 用前向扰动，估计中间层的误差信号

<div class="architecture"><div>干净前向<br><b>记录输入与损失</b></div><span>→</span><div class="shared">扰动层输出<br><b>重新前向</b></div><span>→</span><div>损失变化<br><b>加权扰动</b></div><span>→</span><div>局部更新<br><b>输入 × 误差</b></div></div>

$$
\widehat{e} \;\propto\; \frac{1}{K}\sum_{k=1}^{K} \bigl(L(y+\sigma\epsilon_k)-L(y)\bigr)\,\frac{\epsilon_k}{\sigma}
$$

<p class="single-note">示意：扰动方向 εₖ 与损失变化共同提供局部下降信息；具体分配依模块而异。</p>
<div class="talk-footer"><span>原版还包括注意力内部信用、输出头及残差标量的专门估计</span><a href="https://qlabs.sh/research/dust">DUST 原论文 ↗</a></div>

---

<div class="eyebrow">03 / DUST · DISTRIBUTION</div>

# 同一批数据，多卡分摊不同扰动

<div class="architecture"><div class="shared">共同 batch<br><b>固定模型</b></div><span>→</span><div>GPU 1<br>方向子集</div><div>GPU 2<br>方向子集</div><div>…<br>方向子集</div><span>→</span><div>聚合估计<br><b>更新参数</b></div></div>
<div class="columns"><div class="panel blue"><h2>通信对象</h2><p>聚合各卡的估计结果，而不是把扰动次数当成新数据。</p></div><div class="panel"><h2>关键代价</h2><p>每个方向都需要额外前向；并行可以分摊，不能消除总工作量。</p></div></div>
<div class="talk-footer"><span>原论文目标为无反向传播预训练；本项目研究 LoRA 微调扩展</span><a href="https://github.com/qlabs-eng/dust">官方实现 ↗</a></div>

---

<div class="eyebrow">04 / LORA</div>

# 冻结底座，只更新低秩适配器

$$
Y=XW^{\mathsf T}+sXA^{\mathsf T}B^{\mathsf T},\qquad s=\alpha/r
$$

<div class="architecture"><div>输入 <b>X</b></div><span>→</span><div class="shared">冻结权重 <b>W</b></div><span>＋</span><div>低秩路径 <b>A → B</b></div><span>→</span><div>输出 <b>Y</b></div></div>
<p class="single-note">参数只在 A、B 中训练；r 控制低秩维度。问题转化为：如何估计适配器梯度？</p>
<div class="talk-footer"><span>固定底座并对比相同 LoRA 位置</span><a href="https://arxiv.org/abs/2106.09685">LoRA 论文 ↗</a></div>

---

<div class="eyebrow">05 / WHY THE ORIGINAL EXTENSION FAILED</div>

# Prompt 没有直接损失，仍然影响未来答案

<div class="architecture"><div>Prompt<br><b>无监督标签</b></div><span>→</span><div class="shared">注意力与后续层<br><b>跨 token 影响</b></div><span>→</span><div>Answer<br><b>计算损失</b></div></div>
<div class="columns"><div class="panel"><h2>旧版直接信用</h2><p>只看当前位置损失变化，可能遗漏 prompt 对未来答案的贡献。</p></div><div class="panel blue"><h2>v2 的处理</h2><p>对同一参数方向联合扰动所有相关位置，以整个监督目标评价。</p></div></div>
<div class="talk-footer"><span>遗漏未来路径可能让估计为零，甚至与真实梯度反向</span><span>机制示意 · 非实验图</span></div>

---

<div class="eyebrow">06 / LOCAL GRADIENT</div>

# 从输出误差，映射到 LoRA 参数

<p class="single-note">令 E = ∇ᵧF，其中 F 是完整监督目标；对当前层使用局部链式法则：</p>

$$
G_A=s(EB)^{\mathsf T}X, \qquad G_B=sE^{\mathsf T}(XA^{\mathsf T})
$$

<div class="three-takeaways"><div><b>有效输入</b><span>与未来监督目标相连的 prompt 位置也须保留。</span></div><div><b>行空间</b><span>A 的梯度落在有效输入行空间，用正交基 Q 表示。</span></div><div><b>特殊初值</b><span>只有 B = 0 时，Gₐ = 0，才可暂时省略 A 方向。</span></div></div>

---

<div class="eyebrow">07 / COMPLETE TANGENT FRAME</div>

# 沿 LoRA 真正能改变输出的方向探测

$$
J(u)=sD\left[(XQ)U_A^{\mathsf T}B^{\mathsf T}+(XA^{\mathsf T})U_B^{\mathsf T}\right]
$$

<div class="architecture"><div>坐标方向 <b>u</b><br>同时覆盖 A、B</div><span>→</span><div class="shared">输出变化 <b>J(u)</b><br>覆盖相关 token</div><span>→</span><div>完整目标 <b>F</b><br>正负扰动差分</div></div>
<p class="single-note">D 标记能影响监督目标的位置；Q 覆盖有效输入行空间。完整目标自然包含未来信用。</p>
<div class="talk-footer"><span>这是项目的输出干预估计器，不是原 DUST 算法的原样实现</span><span>机制示意</span></div>

---

<div class="eyebrow">08 / ESTIMATOR</div>

# 完整方向消除线性化采样误差

$$
\frac{1}{M}\sum_{j=1}^{M}u_j u_j^{\mathsf T}=I,\qquad
\widehat g=\frac{1}{M}\sum_{j=1}^{M}u_j\frac{F(Y+\sigma J(u_j))-F(Y-\sigma J(u_j))}{2\sigma}
$$

<div class="columns"><div class="panel blue"><h2>能保证什么</h2><p>完整 Hadamard 框架在局部线性目标上恢复梯度；列协方差为单位阵。</p></div><div class="panel"><h2>不能保证什么</h2><p>非线性有限差分误差、浮点误差仍在；不是全局收敛证明。</p></div></div>
<div class="talk-footer"><span>截取列后各行不一定两两正交；三阶光滑条件下截断误差为 O(σ²)</span><span>理论适用于固定参数点与 batch</span></div>

---

<div class="eyebrow">09 / IMPLEMENTATION</div>

# 计算上：缓存、合批、多卡分担

<div class="three-takeaways"><div><b>缓存与后缀重放</b><span>复用冻结前缀，重复执行干预位置后的计算。</span></div><div><b>四探针合批</b><span>一次处理四个探针；总方向数并未减少。</span></div><div><b>多卡并行</b><span>每卡分担方向并聚合结果，训练数据预算保持一致。</span></div></div>
<div class="takeaway compact">末层采用已知读出路径的解析局部导数：不调用 Transformer backward，但并非纯黑盒。</div>

---

<div class="eyebrow">10 / EXPERIMENT DESIGN</div>

# 从梯度准确性，走到质量与资源权衡

<div class="exp-grid"><div><b>① SmolLM2 / E2E</b><p>135M · 四方法对照<br>确认修复与学习轨迹</p></div><div><b>② Qwen2.5 / E2E</b><p>0.5B–14B · 五档规模<br>观察质量、时间和显存</p></div><div><b>③ Qwen2.5 / NQ</b><p>3B 质量与长输入容量<br>检验采样与显存反例</p></div></div>
<div class="takeaway compact">配对 BP-LoRA：相同起点、数据与适配位置；比较时保留卡数和精度边界。</div>
<div class="talk-footer"><span>E2E：餐馆属性到描述；NQ：基于证据窗口的问答</span><span>均为短程、单种子实验</span></div>

---

<div class="eyebrow">11 / MAIN SETTINGS</div>

# 关键配置与评价口径

<div class="dust-table"><div><b>配置</b><b>E2E / Qwen2.5</b><b>NQ / 3B 质量实验</b></div><div><span>训练预算</span><span>64 步 × 全局 batch 4</span><span>16 步 × 全局 batch 4</span></div><div><span>LoRA</span><span>末两层 down_proj；r=4，α=8</span><span>末两层或中间＋末层；r=4，α=8</span></div><div><span>优化与方向</span><span>AdamW 1e−3；σ=0.002；完整框架</span><span>AdamW 1e−3；完整或 4096 对</span></div><div><span>评价</span><span>4521 参考 NLL；547 MR 生成</span><span>128 条验证；1355 监督 token NLL</span></div><div><span>GPU</span><span>BP 4 卡；DUST 8 卡 A800</span><span>配对双方均 4 卡</span></div></div>
<div class="talk-footer"><span>NLL 越低越好；BLEU/chrF 衡量生成与参考的重合程度</span><span>训练集与测试集口径见参考页</span></div>

---

<div class="eyebrow">12 / SMOLLM2 PILOT</div>

# 完整方向接近 BP，旧方案留下明显差距

<div class="dust-table"><div><b>方法</b><b>dev NLL ↓</b><b>BLEU ↑</b><b>空回答 / 547 ↓</b></div><div><span>BP-LoRA</span><span>2.31112</span><span>10.16</span><span>75</span></div><div><span>v1 直接信用</span><span>2.32568</span><span>8.19</span><span>149</span></div><div><span>开源估计器接入</span><span>2.69860</span><span>0.00</span><span>547</span></div><div class="highlight"><span>v2 完整方向</span><span>2.31103</span><span>10.17</span><span>73</span></div></div>
<p class="single-note">64 步、一个种子；BP 与 v2 的微小差异不构成 v2 优于 BP 的证据。</p>
<div class="talk-footer"><span>开源列仅为本框架下的估计器对照；没有复现原项目完整训练流程</span><span>全部验证集，非测试集</span></div>

---

<div class="eyebrow">13 / SMOLLM2 COST</div>

# 学习曲线接近，计算成本仍远高于 BP

<img class="result-figure" src="/fig_smol_pilot.png" alt="SmolLM2 E2E 四种方法的学习曲线与更新耗时" />
<div class="talk-footer"><span>64 步更新：BP 单卡 3.32 s；v2 八卡 114.77 s，约 34.6 倍</span><span>共享负载；曲线使用 128 条 dev 子集</span></div>

---

<div class="eyebrow">14 / QWEN SCALE</div>

# 扩展到 14B：四档生成接近，7B 是反例

<img class="result-figure" src="/learning_curves.png" alt="Qwen2.5 五档模型的验证负对数似然学习曲线" />
<div class="talk-footer"><span>局部梯度检查五档通过；0.5B、1.5B、3B、14B 的 BLEU 差≤0.21</span><span>曲线：固定 128 条验证参考</span></div>

---

<div class="eyebrow">15 / QUALITY AND COST</div>

# 7B：更低 NLL，不等于更好的生成

<div class="columns"><div class="panel blue"><h2>7B · BP / DUST</h2><p>NLL：1.435 / <b>1.417</b><br>BLEU：<b>52.78</b> / 51.51<br>选中 checkpoint：40 / 64 步</p></div><div class="panel"><h2>64 步更新成本</h2><p>0.5B：DUST / BP <b>156×</b><br>14B：DUST / BP <b>2563×</b></p><p>BP 四卡，DUST 八卡；计时不含验证与加载。</p></div></div>
<div class="takeaway compact">生成差距可能与 checkpoint 选择及训练轨迹有关；同一步完整评估尚未完成。</div>
<div class="talk-footer"><span>单种子；完整 dev 评估 547 个 MR，不是独立测试集</span><span>不把不同卡数比值当作强扩展效率</span></div>

---

<div class="eyebrow">16 / NQ · DIRECTION BUDGET</div>

# 方向数减少四倍，训练更快但质量下降

<img class="result-figure" src="/quality.png" alt="NQ 上末两层和中间层的 BP、完整方向及采样方向验证损失曲线" />
<div class="talk-footer"><span>末两层 16 步 NLL：BP 2.3068 / 完整 2.3021 / 4096 对采样 2.7841</span><span>3B · 四卡 · 单种子</span></div>

---

<div class="eyebrow">17 / NQ · MEMORY</div>

# 长输入下，当前实现没有显存优势

<img class="result-figure" src="/length_cost.png" alt="NQ 3B 不同输入长度的峰值显存和冷更新耗时" />
<div class="talk-footer"><span>3B 长度 2048：BP 8.48 GiB，DUST 19.89 GiB（单卡 allocated 峰值）</span><span>单次冷更新；方向数也随长度增加</span></div>

---

<div class="eyebrow">18 / TAKEAWAYS</div>

# 我们得到的答案

<div class="three-takeaways"><div><b>方法</b><span>完整 LoRA 切空间 + 全目标差分，修复未来信用遗漏。</span></div><div><b>证据</b><span>局部梯度与短程学习可接近 BP；7B 和采样实验保留反例。</span></div><div><b>代价</b><span>重复前向计算昂贵；长输入下的单卡显存更高。</span></div></div>
<div class="takeaway compact">定位：梯度恢复与精度—成本权衡的研究原型，尚非高效替代 BP 的方案。</div>

---

<div class="eyebrow">19 / NEXT STEPS</div>

# 下一步：先解释代价，再扩大实验

<div class="three-takeaways"><div><b>显存归因</b><span>固定方向数，比较每批 1 / 2 / 4 探针与缓存峰值。</span></div><div><b>方向预算</b><span>4096 / 8192 / 完整方向，多方向种子先做梯度诊断。</span></div><div><b>公平效率</b><span>固定质量阈值与 GPU 数，实测时间和 GPU-hours。</span></div></div>
<div class="talk-footer"><span>上述为待验证计划；还需多种子、更长训练及 7B 同步 checkpoint 评估</span><span>研究局限</span></div>

---

<div class="eyebrow">20 / SOURCES</div>

# 参考资料与证据边界

<div class="source-list">
<p><a href="https://qlabs.sh/research/dust">DUST: Pretraining Transformers Without Backpropagation</a> · 原论文与方法背景</p>
<p><a href="https://arxiv.org/abs/2106.09685">LoRA: Low-Rank Adaptation of Large Language Models</a> · 低秩适配</p>
<p><a href="https://github.com/walawalagoose/parallel_dml_hw">DUST-LoRA 项目仓库</a> · docs/v2/THEORY.md、EXPERIMENTS.md、QWEN25_RESULTS.md、nq_20261104/REPORT.md</p>
<p>结果图来自项目 results/v2；E2E 和 NQ 均为单种子、短程实测，未提供多种子区间或独立测试集生成结果。</p>
<p><a href="https://doi.org/10.48550/arXiv.2609.00065">Scientific Agent Skills</a> · 科研写作流程参考</p>
</div>
