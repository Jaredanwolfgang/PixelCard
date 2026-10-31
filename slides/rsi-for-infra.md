---
theme: default
title: Recursive Self-Improving Agents for AI Infrastructure
info: RSI 分类、代码进化与国产 Arm 平台上的优化目标
author: Jaredan
lang: zh-CN
favicon: /favicon.webp
class: cover-page rsi-deck
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
defaults:
  class: rsi-deck
---

<div class="eyebrow">RSI / AI INFRASTRUCTURE</div>

# Recursive Self-Improving<br>Agents for AI Infrastructure

<p class="cover-lead">自进化 Agent 与 AI 基础设施优化</p>

<div class="cover-axes"><div><b>↻</b><span>代码的迭代优化</span></div><i>×</i><div><b>→</b><span>真实系统的反馈</span></div></div>

<div class="cover-bottom"><span>肖翊成 · 2026.10.08</span><span>RSI 分类 · AlphaEvolve · 国产 Arm 平台</span></div>

---

<div class="eyebrow">01 / SELF-EVOLVING AGENTS</div>

# 自进化的对象：产物、脚手架与模型

<p class="single-note">用 AI 迭代下一版本。先区分：循环里究竟更新了什么？</p>

<div class="rsi-rows taxonomy">
<div><b>Artifacts</b><span>代码、论文、算法等产物</span><em>优化输出</em></div>
<div><b>Harness</b><span>Prompt、记忆、工具与执行流程</span><em>更新 Agent 的脚手架</em></div>
<div><b>Models</b><span>模型权重</span><em>从弱信号中学习</em></div>
</div>

<div class="big-statement">分类依据是更新对象；实际系统可以同时涉及多类。</div>

<div class="talk-footer"><span>采用 Shilong Liu 的分析框架，并非统一术语标准</span><a href="https://lsl.zone/blog/2026/a-taxonomy-of-self-evolving-agents/" target="_blank" rel="noopener">分类文章 · 2026.07.08 ↗</a></div>

---

<div class="eyebrow">02 / ARTIFACTS ITERATIVE OPTIMIZATION</div>

# 人定义目标，Agent 迭代产物

<div class="three-takeaways">
<div><b>优化对象</b><span>代码、论文、算法</span></div>
<div><b>这一层的循环</b><span>生成候选，评估结果，再继续修改</span></div>
<div><b>人的输入</b><span>任务目标与评估方式</span></div>
</div>

<p class="single-note">典型任务：Auto-Research、Kernel Optimization、Algorithm Discovery。</p>
<div class="takeaway">在这一分类下，模型权重与 Agent 脚手架保持固定。</div>

<div class="talk-footer"><span>Artifacts：Agent 产生的可评估产物</span><a href="https://lsl.zone/blog/2026/a-taxonomy-of-self-evolving-agents/" target="_blank" rel="noopener">Artifacts Iterative Optimization ↗</a></div>

---

<div class="eyebrow">03 / AGENT HARNESS SELF-IMPROVEMENT</div>

# 不更新权重，也能积累可复用的经验

<div class="rsi-rows harness">
<div><b>Prompt 与记忆</b><span>将有效规则写入 Prompt、Context Playbook 或长期记忆</span><em><a href="https://arxiv.org/abs/2507.19457" target="_blank">GEPA</a> / <a href="https://arxiv.org/abs/2510.04618" target="_blank">ACE</a> / <a href="https://arxiv.org/abs/2504.19413" target="_blank">Mem0</a></em></div>
<div><b>工具与 Skill</b><span>将重复操作固化为可执行、可复用的工具</span><em>更新 Agent 的能力集合</em></div>
<div><b>多 Agent 组织</b><span>不同 Expert 携带相关 Context，由 Router 分配任务</span><em>Context 管理与路由</em></div>
</div>

<div class="talk-footer"><span>Harness：围绕模型的执行框架；三篇论文在原稿中作为例子引用</span><a href="https://lsl.zone/blog/2026/a-taxonomy-of-self-evolving-agents/" target="_blank" rel="noopener">Harness Self-improvement ↗</a></div>

---

<div class="eyebrow">04 / MODEL LEARNING WITHOUT GOLD ANSWERS</div>

# 用弱信号学习，直接更新模型权重

<div class="rsi-model">
<div class="rsi-key">Questions<br>Weak Signals<br>Environment Access</div>
<div><h2>监督信号从哪里来？</h2><p>伪标签与模型内部信号，或自博弈、环境交互中的反馈。</p><p class="single-note">相关范式包括 Self-training、Weak Supervision、RL、Test-time Training、Online / Continual Learning。</p></div>
</div>

<div class="takeaway">这些研究与自进化存在交集；具体方法与问题设定仍需逐一判断。</div>

<div class="talk-footer"><span>Gold answers：可直接作为监督目标的标准答案</span><a href="https://lsl.zone/blog/2026/a-taxonomy-of-self-evolving-agents/" target="_blank" rel="noopener">Model Learning without Gold Answers ↗</a></div>

---

<div class="eyebrow">05 / 三类更新之间的联系</div>

# SIA：依据反馈，选择更新脚手架或权重

<p class="rsi-intro">Kernel 优化的目标是 Artifact；搜索过程也可能需要设备 Context，以及模型本身的算子编写能力。</p>

<RsiFigure file="sia.jpg" alt="SIA 的 Feedback-Agent 在 Harness 与模型权重更新之间选择的原论文图" caption="SIA 原图，沿用原汇报 v3 第 6 页。Feedback-Agent 选择 Harness 更新或通过 RL 更新权重。" height="210px" />

<p class="single-note">论文评测涵盖法律分类、GPU 算子优化与单细胞 RNA 去噪。</p>

<div class="talk-footer"><span>组合更新的案例；不据此推断所有任务均受益</span><a href="https://arxiv.org/html/2605.27276v1" target="_blank" rel="noopener">SIA · v1 · §5–6 / 图 1 ↗</a></div>

---

<div class="eyebrow">06 / INFRA RSI · 相关工作</div>

# 优化对象覆盖 Kernel、训练与推理系统

<div class="rsi-worklist">
<div><b><a href="https://arxiv.org/abs/2506.13131v1" target="_blank">AlphaEvolve</a></b><span>LLM 与进化搜索结合，自动评估代码候选</span></div>
<div><b><a href="https://recursive.com/updates/first-steps-toward-automated-ai-research" target="_blank">Recursive</a></b><span>自动化研究循环，涉及训练与 Kernel 基准</span></div>
<div><b><a href="https://arxiv.org/abs/2512.23236v4" target="_blank">KernelEvolve</a></b><span>面向推荐模型的异构加速器 Kernel 生成与优化</span></div>
<div><b><a href="https://arxiv.org/abs/2511.15915v2" target="_blank">AccelOpt</a></b><span>利用优化记忆迭代改进新型加速器 Kernel</span></div>
<div><b><a href="https://asari.ai/blog/inference-optimization" target="_blank">Asari</a></b><span>端到端推理栈优化与实验经验复用</span></div>
<div><b><a href="https://z.ai/blog/glm-built-its-inference-infrastructure" target="_blank">GLM Infra</a></b><span>模型参与自身推理基础设施构建的官方报告</span></div>
</div>

<div class="talk-footer"><span>保留原稿清单；AccelOpt 为延伸阅读；其余方法在后文展开</span><a href="33">来源与阅读状态 ↗</a></div>

---

<div class="eyebrow">07 / ALPHAEVOLVE · 代码进化</div>

# 让自动评估结果进入下一轮搜索

<div class="rsi-split">
<div><h2>人提供任务与评估代码</h2><p>Prompt sampler 从程序库中取样，LLM 提出代码变体。</p><p>Evaluators 评估候选，有前景的结果写回程序库，支持后续搜索。</p></div>
<RsiFigure file="alphaevolve-pipeline.jpg" alt="AlphaEvolve 的人类任务定义、Prompt sampler、LLM、Evaluator 与程序数据库流程图" caption="AlphaEvolve 图 1，沿用原汇报 v3 第 3 页。" height="310px" />
</div>

<div class="talk-footer"><span>Program database 同时服务于候选保留与后续 Prompt 构造</span><a href="https://arxiv.org/html/2506.13131v1#S2" target="_blank" rel="noopener">AlphaEvolve · v1 · §2 / 图 1–2 ↗</a></div>

---

<div class="eyebrow">08 / ALPHAEVOLVE · INFRA 案例</div>

# 局部加速与端到端收益需要分开看

<div class="rsi-metrics"><div><b>23%</b><span>矩阵乘 Kernel 平均加速</span></div><div><b>1%</b><span>Gemini 总训练时间缩减</span></div><div><b>32%</b><span>特定 FlashAttention Kernel 加速</span></div></div>

<div class="rsi-worklist evidence">
<div><b>Tiling heuristic</b><span>在真实 TPU 上优化分块策略，并用留出形状检验泛化</span></div>
<div><b>编译器生成代码</b><span>修改包含 FlashAttention 的 XLA IR，检查数值正确性</span></div>
<div><b>其他层次</b><span>数据中心调度启发式，以及 TPU 算术电路 RTL 简化</span></div>
</div>

<div class="talk-footer"><span>不同任务、基线与硬件，不能合并比较；32% 按原论文修正</span><a href="https://arxiv.org/html/2506.13131v1#S3.SS3" target="_blank" rel="noopener">AlphaEvolve · §3.3.1–3.3.4 ↗</a></div>

---

<div class="eyebrow">09 / ALPHAEVOLVE · 搜索的边界</div>

# 预算、评估成本与种群多样性

<div class="three-takeaways rsi-search">
<div><b>何时停止？</b><span>以计算预算约束探索；级联评估提前淘汰弱候选</span></div>
<div><b>如何分配搜索？</b><span>平衡高分候选的继续优化与新方向的探索</span></div>
<div><b>已有最好程序后？</b><span>保留多样性，让后续搜索不只围绕单一候选展开</span></div>
</div>

<p class="single-note">原稿关注的系统问题：程序库如何同时保存效果、反馈与探索空间？</p>

<div class="talk-footer"><span>问题来自原汇报；机制依据论文，未声称存在通用最优停止规则</span><a href="https://arxiv.org/html/2506.13131v1#S2.SS4" target="_blank" rel="noopener">AlphaEvolve · §2.4–2.6 ↗</a></div>

---

<div class="eyebrow">10 / RECURSIVE · 自动化研究循环</div>

# 训练算法、训练速度与 GPU Kernel

<p class="rsi-intro">提出想法、实现代码、运行实验、验证结果，再选择下一次实验。</p>

<div class="rsi-worklist">
<div><b>NanoChat</b><span>单张 B200，5 分钟训练预算内降低验证 BPB</span></div>
<div><b>NanoGPT</b><span>8 张 H100，达到 3.28 验证 loss：79.7 s → 77.5 s</span></div>
<div><b>SOL-ExecBench</b><span>235 个 Kernel，平均 SOL 分数：0.699 → 0.754</span></div>
</div>

<p class="single-note">迭代范围包括架构、短上下文记忆、辅助损失、注意力、Optimizer、Weight Decay、编译配置与 Fused Kernel。</p>
<div class="takeaway">Reward hacking 与测量方差都需要复验；人工与 AI 持续改进作弊检查器。</div>

<div class="talk-footer"><span>2026.06.11 官方报告；不同基准的指标分别比较，未独立复现</span><a href="https://recursive.com/updates/first-steps-toward-automated-ai-research" target="_blank">官方报告与发布产物 ↗</a></div>

---

<div class="eyebrow">11 / KERNELEVOLVE · 异构硬件</div>

# 用搜索与硬件知识库补齐长尾算子

<div class="rsi-split">
<div><p>面向 MTIA、AMD、NVIDIA 与 CPU 的不同编程环境。</p><p><strong>树搜索候选</strong>，检索硬件知识，用正确性、耗时和 Profiling 反馈筛选，再将经验写回知识库。</p><p class="single-note">挑战：新芯片知识缺失、硬件差异，以及编译和评测成本。</p></div>
<RsiFigure file="kernelevolve.jpg" alt="KernelEvolve 的树搜索、硬件知识库、候选评估及多硬件执行流程原图" caption="原汇报第 10 页所引 KernelEvolve 系统图。" height="345px" />
</div>

<div class="talk-footer"><span>Meta 官方案例：MTIA 广告模型训练吞吐 >25%；NVIDIA Andromeda 推理 >60%</span><a href="https://engineering.fb.com/2026/04/02/developer-tools/kernelevolve-how-metas-ranking-engineer-agent-optimizes-ai-infrastructure/" target="_blank">Meta · 2026.04.02 ↗</a></div>

---

<div class="eyebrow">12 / ASARI · DISCOVER + BUILD</div>

# 结合静态分析、Profiling 与历史经验

<p class="rsi-context">vLLM v0.23 · DeepSeek v4 Pro / GLM 5.2 · 8 × B200</p>
<div class="rsi-stage-line"><b>Discover + Build</b><span>Evaluate</span><span>Verify</span><span>Self-Improve</span></div>
<div class="rsi-split">
<div><h2>优化整个推理栈</h2><p>定位 Kernel、调度器、负载均衡与配置中的优化机会，兼顾吞吐与交互速度。</p><p class="single-note">用潜在收益与数值影响缩小搜索空间。</p></div>
<RsiFigure file="asari-discover.jpg" alt="Asari 在沙箱推理栈中修改 Kernel、调度器、负载均衡与配置的流程" caption="Asari 官方报告，原汇报第 11 页。" height="250px" />
</div>
<div class="talk-footer"><span>端到端系统目标；保持模型输出行为是验收条件</span><a href="https://asari.ai/blog/inference-optimization" target="_blank">Asari · 2026.07.28 ↗</a></div>

---

<div class="eyebrow">13 / ASARI · EVALUATE</div>

# 先识别测量噪声，再判断优化是否有效

<p class="rsi-context">vLLM v0.23 · DeepSeek v4 Pro / GLM 5.2 · 8 × B200</p>
<div class="rsi-stage-line"><span>Discover + Build</span><b>Evaluate</b><span>Verify</span><span>Self-Improve</span></div>
<div class="rsi-split">
<div><p>在接近真实生产环境的沙箱中部署并测试完整推理栈。</p><p>批处理行为与硬件降频等因素会引入波动，需要控制噪声并做统计检查。</p><p class="single-note">结合端到端基准与 Microbenchmark，缩短反馈周期。</p></div>
<RsiFigure file="asari-evaluate.jpg" alt="Asari 在软件栈和硬件环境中评估候选实现的原图" caption="Asari 官方报告，原汇报第 12 页。" height="250px" />
</div>
<div class="talk-footer"><span>相同测量条件下比较；高分仍需通过正确性验证</span><a href="https://asari.ai/blog/inference-optimization" target="_blank">Asari · Evaluate ↗</a></div>

---

<div class="eyebrow">14 / ASARI · VERIFY</div>

# 验证输出分布，控制检查成本与频率

<p class="rsi-context">vLLM v0.23 · DeepSeek v4 Pro / GLM 5.2 · 8 × B200</p>
<div class="rsi-stage-line"><span>Discover + Build</span><span>Evaluate</span><b>Verify</b><span>Self-Improve</span></div>
<div class="rsi-split">
<div><p>对优化前后的 token 概率分布做统计一致性检查。</p><p>标准任务分数可能掩盖输出变化，小误差也可能在长序列中积累。</p><p class="single-note">检查过频会消耗计算，过疏则可能让搜索偏离正确性约束。</p></div>
<RsiFigure file="asari-verify.jpg" alt="Asari 在推理服务流程中进行正确性验证的原图" caption="Asari 官方报告，原汇报第 13 页。" height="250px" />
</div>
<div class="talk-footer"><span>分布匹配是该报告采用的验证方式，不能等同于所有输入上的等价证明</span><a href="https://asari.ai/blog/inference-optimization" target="_blank">Asari · Verify ↗</a></div>

---

<div class="eyebrow">15 / ASARI · SELF-IMPROVE</div>

# 将实验经验用于后续任务

<div class="rsi-stage-line"><span>Discover + Build</span><span>Evaluate</span><span>Verify</span><b>Self-Improve</b></div>
<div class="rsi-two-figures">
<RsiFigure file="asari-improve.jpg" alt="Asari 将实验中提炼的经验反馈给 Agent 的自我改进流程" caption="实验结果回写，更新后续工作方式。" height="245px" />
<RsiFigure file="asari-transfer.jpg" alt="Asari 在多个 Agent run 之间复用经验的 Knowledge Transfer 图" caption="跨 run 的经验复用，原汇报第 14 页。" height="245px" />
</div>
<p class="single-note">沉淀已出现的问题、适用条件与失败经验，减少重复探索。</p>
<div class="talk-footer"><span>原稿与官方报告中的经验复用机制；未在本次独立复现</span><a href="https://asari.ai/blog/inference-optimization" target="_blank">Asari · Self-improve ↗</a></div>

---

<div class="eyebrow">16 / GLM INFRA · 生产推理</div>

# 从首次跑通，到可承载生产流量

<div class="rsi-split glm-result">
<div><p>工程师定义目标、系统边界和反馈环境；Infra Agent 协助适配国产加速器。</p><h2>GLM-5.3-Flash</h2><p class="single-note">官方报告：不到两周，端到端吞吐约为初始基线的 3 倍。</p></div>
<RsiFigure file="glm-throughput.jpg" alt="GLM-5.3-Flash 在开发过程中端到端吞吐相对初始基线的变化曲线" caption="Z.ai 官方图 1，原汇报第 15 页。" height="260px" />
</div>
<p class="rsi-small">组合优化：线性注意力与 LM Head 的节点内 Tensor Parallel、ReplaySSM、W8A8、INT8 / FP8 / BF16 混合精度缓存量化、Layer Split，以及 Encode-Prefill-Decode（EPD）解耦。</p>
<div class="talk-footer"><span>整套系统的组合收益，不能归因于某一个技术；本次未独立复现</span><a href="https://z.ai/blog/glm-built-its-inference-infrastructure" target="_blank">Z.ai 官方报告 ↗</a></div>

---

<div class="eyebrow">17 / GLM INFRA · DENSE FEEDBACK</div>

# 局部、及时、客观的反馈

<div class="rsi-split">
<div class="rsi-feedback"><h2>正确性</h2><p>将并行策略映射到 Kernel 与输入划分，比较不同执行路径。</p><h2>系统行为</h2><p>用对照实验区分计算、通信与调度等待。</p><h2>性能</h2><p>从已有代码提取方向，在真实运行中验证，并回写适用经验。</p></div>
<RsiFigure file="glm-feedback.jpg" alt="GLM Infra Agent 的 Dense feedback：正确性、系统行为和性能的中间验证接口" caption="Z.ai 官方反馈框架，原汇报第 16 页。" height="350px" />
</div>
<div class="talk-footer"><span>Local · Cheap & timely · Objective；局部验证通过后仍需端到端验收</span><a href="https://z.ai/blog/glm-built-its-inference-infrastructure" target="_blank">From End-to-End Metrics to Attributable Feedback ↗</a></div>

---

<div class="eyebrow">18 / LX2 · 原稿硬件拓扑</div>

# 多级存储与片内拓扑

<RsiFigure file="lx2-topology.png" alt="LX2 节点拓扑：两个 Processor、四个 Die、十六个 Cluster，以及 HBM、DDR 与互连示意" caption="原汇报第 17 页；完整保留原图，具体规格以平台文档为准。" height="380px" />
<div class="talk-footer"><span>原图：38 Cores / Cluster · Local HBM 4 GB · Local DDR 32 GB</span><span>点击图像可放大查看</span></div>

---

<div class="eyebrow">19 / 目标平台</div>

# 国产 Arm 平台上的 Torch 系统优化

<p class="single-note">超智融合平台 · LX2 处理器 · Kylin Linux</p>
<div class="three-takeaways">
<div><b>优化对象</b><span>Artifacts Iterative Optimization</span></div>
<div><b>目标系统</b><span>集群上部署的 Torch 系统</span></div>
<div><b>目标效果</b><span>提升训练与推理性能</span></div>
</div>
<p class="single-note">后续可能考虑 RL 等后训练框架。</p>
<div class="talk-footer"><span>研究目标依据原汇报第 18 页；性能观测与后续计划分开呈现</span><a href="/slide/rsi-for-infra/source.pdf#page=18" target="_blank">原汇报 ↗</a></div>

---

<div class="eyebrow">20 / 平台适配的困难</div>

# 先定位差异，再建立可用的测评反馈

<div class="rsi-worklist rsi-problems">
<div><b>生态不完全</b><span>定位调用层、编译层或代码生成层的差异，确定优化位置</span></div>
<div><b>硬件知识不齐</b><span>在前期迭代中沉淀硬件约束、适用条件与失败经验</span></div>
<div><b>集群结构不同</b><span>适配分布式算法，利用多级内存与计算资源</span></div>
<div><b>Microbench 缺失</b><span>确定能快速反映精度、速度和等待时间的最小测试</span></div>
<div><b>平台噪声</b><span>识别并控制性能波动，区分测量变化与真实收益</span></div>
</div>
<div class="talk-footer"><span>原汇报第 18 页提出的问题；尚需通过 Profile 和实验定位</span><a href="/slide/rsi-for-infra/source.pdf#page=18" target="_blank">原汇报 ↗</a></div>

---

<div class="eyebrow">21 / 实验一 · 参数搜索</div>

# 用 Qwen3-0.6B 建立平台画像

<p class="single-note">先确认不同精度的计算支持，再扫描运行参数。</p>
<div class="rsi-scan">
<div><b>Batch</b><span>1 / 4 / 16 / 64 / 256</span></div>
<div><b>线程数</b><span>16 / 64 / 128 / 256</span></div>
<div><b>精度</b><span>BF16 / FP16 / FP32</span></div>
</div>
<p class="rsi-intro">产出 MFU、实测算术强度随 Batch 的曲线、线程数 × Batch 组合，以及逐模块分解数据。</p>
<div class="takeaway">计划锁定 2 个 Batch 与 1 个线程数，进入后续验证。</div>
<div class="talk-footer"><span>原汇报第 19 页的计划；MFU 需统一硬件峰值、精度与计算量口径</span><a href="/slide/rsi-for-infra/source.pdf#page=19" target="_blank">实验计划 ↗</a></div>

---

<div class="eyebrow">22 / 实验二 · 确定性校验</div>

# 固定配置后，先验证结果可重复

<div class="rsi-metrics repeat"><div><b>≥3</b><span>次同节点、同环境重跑</span></div><div><b>5</b><span>步 loss 与 grad norm</span></div></div>
<p class="big-statement">计划验收：bitwise 全等</p>
<p class="single-note">这是原稿设定的严格验收条件；当前图表并未证明已通过。</p>
<div class="takeaway">配置锁定后再验证确定性，作为优化对照的基础。</div>
<div class="talk-footer"><span>原汇报第 19 页；bitwise 全等指逐比特一致</span><a href="/slide/rsi-for-infra/source.pdf#page=19" target="_blank">实验计划 ↗</a></div>

---

<div class="eyebrow">23 / 实验三 · AI4AI 最小优化闭环</div>

# 一个真实优化，完整走过验证与回写

<RsiFigure file="optimization-loop.jpg" alt="原稿的最小优化闭环：性能分析、候选生成、分层评测、接纳与交付，共享硬件与优化知识库" caption="原汇报第 20 页的流程设计；此图为计划，非已完成的系统或实验结果。" height="300px" />
<p class="rsi-small">候选表记录前向 / 后向耗时，覆盖 Attention、SwiGLU、Embedding、RMSNorm 与 Optimizer Step。按热点占比与可优化性排序，两个 Batch 分别验收。</p>
<div class="talk-footer"><span>原稿目标：MFU 可复现提升，期望最高到 40%；40% 尚未实现或验证</span><a href="/slide/rsi-for-infra/source.pdf#page=19" target="_blank">实验与验收目标 ↗</a></div>

---

<div class="eyebrow">24 / 预计成本申请</div>

# 平台费用待确定，Agent Token 预算约 5,000 元

<div class="three-takeaways rsi-cost">
<div><b>超智灵晟平台</b><span>成本未知，待确认计费与用量</span></div>
<div><b>Coding Agent</b><span>Codex / GLM Token 使用预算约 5,000 元</span></div>
</div>
<p class="single-note">以上为原稿的预计申请金额，不代表已支出或已获批。</p>
<div class="talk-footer"><span>依据原汇报第 21 页；费用随实际平台与使用量核算</span><a href="/slide/rsi-for-infra/source.pdf#page=21" target="_blank">成本计划 ↗</a></div>

---

<div class="eyebrow">25 / 初步观测 · 线程扩展</div>

# 增加线程，收益并不持续增长

<div class="rsi-split observation">
<div><h2>同一 38 核 NUMA 域</h2><p>图中 Triad 带宽约在 16 线程达到最好值附近，FP32 GEMM（N=4096）在 32 线程附近达到峰值。</p><p class="single-note">38 线程没有继续提升；因果解释还需结合运行剖析。</p></div>
<RsiFigure file="thread-scaling.jpg" alt="同一 38 核 NUMA 域中，Triad 带宽与 FP32 GEMM 相对各自最好吞吐随线程数变化的曲线" caption="原汇报第 22 页；纵轴为各指标相对自身最好吞吐的百分比。" height="320px" />
</div>
<div class="talk-footer"><span>归一化吞吐，不能将两条曲线当作相同单位的绝对性能比较</span><a href="/slide/rsi-for-infra/source.pdf#page=22" target="_blank">原始观测 ↗</a></div>

---

<div class="eyebrow">26 / 初步观测 · GEMM</div>

# 多组矩阵形状与精度下，32 线程附近较快

<div class="rsi-split observation">
<div><p>原稿覆盖不同大小的矩阵，以及 FP32、BF16 与 FP16。</p><p>各组测试大多在 32 线程附近取得较短耗时，继续增线程的收益有限。</p><p class="single-note">原稿将其与内核态开销和同步等待联系；需 Profile 进一步核验。</p></div>
<RsiFigure file="gemm-scaling.jpg" alt="九组矩阵形状与精度下，前向、反向和总 GEMM 耗时随线程数变化的原始图" caption="原汇报第 22 页；各子图的矩阵形状、精度、时间单位保留在图内。" height="365px" />
</div>
<div class="talk-footer"><span>当前样本内的观测，未据此确定所有负载的通用最优线程数</span><span>点击原图查看各子图</span></div>

---

<div class="eyebrow">27 / 初步观测 · 数据局部性</div>

# 跨 Die、跨 CPU 后，通信与数据访问成本上升

<div class="rsi-two-figures locality">
<RsiFigure file="numa-bandwidth.jpg" alt="同核数下不同 NUMA 页面放置，以及跨 Socket 配置的 Triad 带宽对比，单位 GB/s" caption="原稿第 23 页：Triad 带宽，单位 GB/s。" height="230px" />
<RsiFigure file="distributed-training.jpg" alt="Qwen3-0.6B、global batch 4、sequence 128、FP32、Gloo 下不同分布式模式的每步耗时" caption="Qwen3-0.6B · Global batch 4 · Seq 128 · FP32 / Gloo；单位 s/step。" height="245px" />
</div>
<p class="single-note">原稿提出优先保证同 Die 内访问；分布式结果仅适用于图中这些配置。</p>
<div class="talk-footer"><span>带宽与训练耗时是不同指标；当前图表未单独分离全部通信开销</span><a href="/slide/rsi-for-infra/source.pdf#page=23" target="_blank">原始观测 ↗</a></div>

---

<div class="eyebrow">28 / 初步观测 · MFU</div>

# 原稿中的 MFU 很低，先核对口径再定位瓶颈

<RsiFigure file="mfu-threads.jpg" alt="Qwen3-0.6B 在 FP32、BF16 与 FP16 下，Batch 1 和 Batch 4 的 MFU 随执行线程数变化" caption="原汇报第 24 页；曲线使用原图的峰值计算口径，尚未重新核算。" height="220px" />
<div class="rsi-formula">MFU = 每步模型 FLOPs ÷（同精度硬件峰值 FLOP/s × 设备数 × 每步耗时）</div>
<p class="rsi-small">原稿公式写作 GPU Peak；用于 LX2 时须换成对应 CPU 的精度与指令峰值，并明确有效线程、设备范围和模型 FLOPs 的估算方法。</p>
<div class="talk-footer"><span>原稿希望从算子层继续定位；单凭低 MFU 还不能确认具体瓶颈</span><a href="/slide/rsi-for-infra/source.pdf#page=24" target="_blank">原图与原始公式 ↗</a></div>

---

<div class="eyebrow">29 / 初步观测 · MFU 与资源放置</div>

# 跨 NUMA 与跨 Die 配置下，MFU 进一步下降

<div class="rsi-split observation">
<div><p>BF16 AMP / B1 / 32 线程 / Memory node 1。</p><p>原图比较一个 NUMA 域、两个 NUMA 域，以及跨 Die 交错放置。</p><p class="single-note">需统一峰值分母，并结合内存流量、等待时间与通信轨迹分析。</p></div>
<RsiFigure file="mfu-placement.jpg" alt="固定 BF16 AMP、B1、32 线程和 Memory node 1 下，不同 NUMA 与 Die 放置的 MFU 比较" caption="原汇报第 24 页；保留原图的中位数与重复测量点。" height="330px" />
</div>
<div class="talk-footer"><span>资源放置与计算效率相关；此图本身不构成单一原因的证明</span><a href="/slide/rsi-for-infra/source.pdf#page=24" target="_blank">原始观测 ↗</a></div>

---

<div class="eyebrow">30 / 初步观测 · 模块耗时</div>

# Attention 与 SwiGLU 是当前优化候选

<RsiFigure file="module-profile.jpg" alt="BF16 AMP、B1、S1024、32 线程下，Attention、SwiGLU、LM head、RMSNorm、Embedding 等模块的前后向耗时" caption="原汇报第 25 页；steps 2–5 中位数，点为四步观测；Profiler 诊断，非加速比样本。" height="310px" />
<p class="single-note">Attention 后向约 4.001 s/step，SwiGLU 后向约 2.251 s/step；按占比与可优化性选择下一步。</p>
<div class="talk-footer"><span>BF16 AMP · B1 · S1024 · 32 线程；当前尚无优化后的对照结果</span><a href="/slide/rsi-for-infra/source.pdf#page=25" target="_blank">原始 Profile ↗</a></div>

---

<div class="eyebrow">31 / 参考资料 · 分类与机制</div>

# 分类框架、Harness 与组合更新

<div class="rsi-references">
<p><a href="https://lsl.zone/blog/2026/a-taxonomy-of-self-evolving-agents/" target="_blank">A Taxonomy of Self-evolving Agents</a><span>Shilong Liu · 2026.07.08；分类框架与术语来源，已核对正文。</span></p>
<p><a href="https://arxiv.org/abs/2507.19457" target="_blank">GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning</a><span>反思驱动的 Prompt 进化；本次仅作 Harness 例子，未精读。</span></p>
<p><a href="https://arxiv.org/abs/2510.04618" target="_blank">Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models</a><span>ACE：演化可复用的上下文；仅核对摘要与分类文章。</span></p>
<p><a href="https://arxiv.org/abs/2504.19413" target="_blank">Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory</a><span>长期记忆的提取、整合与检索；本次仅作背景引用。</span></p>
<p><a href="https://arxiv.org/html/2605.27276v1" target="_blank">SIA: Self Improving AI with Harness &amp; Weight Updates</a><span>v1 · §5–6：Feedback-Agent 选择更新对象；已核对机制与评测任务，未复现。</span></p>
</div>

<div class="talk-footer"><span>阅读范围限于本次汇报；背景工作不据此声称已全面评估</span><a href="33">Infra 文献与原稿 ↗</a></div>

---

<div class="eyebrow">32 / 参考资料 · INFRA 与原稿</div>

# Infra 相关工作与材料边界

<div class="rsi-references compact">
<p><a href="https://arxiv.org/html/2506.13131v1" target="_blank">AlphaEvolve: A coding agent for scientific and algorithmic discovery</a><span>v1 · 2025.06.16 · 已核对 §2、§3.3；原稿 32.5% 按 §3.3.4 修正为 32%。</span></p>
<p><a href="https://recursive.com/updates/first-steps-toward-automated-ai-research" target="_blank">First Steps Toward Automated AI Research</a><span>2026.06.11 官方报告；已核对测评设置、结果与评估机制，未独立复现。</span></p>
<p><a href="https://arxiv.org/abs/2512.23236v4" target="_blank">KernelEvolve: Scaling Agentic Kernel Coding for Heterogeneous AI Accelerators at Meta</a><span>v4 · 2026.07.06；核对架构与 Meta 2026.04.02 官方案例，未独立复现。</span></p>
<p><a href="https://arxiv.org/abs/2511.15915v2" target="_blank">AccelOpt: A Self-Improving LLM Agentic System for AI Accelerator Kernel Optimization</a><span>v2 · 2026.04.15；仅核对摘要，未精读实现与实验。</span></p>
<p><a href="https://asari.ai/blog/inference-optimization" target="_blank">Speeding up end-to-end inference with self-improving agents</a><span>Asari · 2026.07.28；浏览官方机制说明，未独立验证性能数字。</span></p>
<p><a href="https://z.ai/blog/glm-built-its-inference-infrastructure" target="_blank">Toward Recursive Self-Improvement: How GLM Built Its Own Inference Infrastructure</a><span>已核对官方报告中的组合优化与 Dense feedback；吞吐为作者报告值。</span></p>

</div>

<div class="talk-footer"><span>原稿 v3：肖翊成 · 2026.10.08；网页核对：2026.10.31（上海）</span><a href="/slide/rsi-for-infra/source.pdf" target="_blank">原始 PDF（25 页）↗</a></div>
