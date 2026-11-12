---
theme: default
title: PyTorch Adaptation for LX2 CPU platform
info: 通用 PyTorch 软件栈的模块分工、Agent 边界与知识库工作流
drawings:
  persist: false
transition: fade
mdc: true
---

<div class="cover">
<div class="eyebrow">LINGSHENG / ENGINEERING PLAYBOOK</div>
<h1 style="font-size: 43px; line-height: 1.2">PyTorch<br>Adaptation for<br><em>LX2 CPU platform</em></h1>
<p>通用 PyTorch 适配的架构、Agent 协作与知识库</p>
<div class="cover-rule"></div><div class="cover-foot">协作方案 · 2026.11</div>
<div class="orbit"><span>PT</span><i></i><b>01</b></div>
</div>

---
layout: default
---

<div class="kicker">01 / THE MISSION</div>

# 我们要交付什么？

<div class="hero-line">面向 LingSheng 的<span>通用 PyTorch 能力</span></div>
<div class="columns three"><div><b>功能</b><p>覆盖 Tensor、算子、求导和分布式语义。</p></div><div><b>性能</b><p>每个模块有自己的指标，跨负载检查整体表现。</p></div><div><b>协作</b><p>任务、代码、测试和知识条目都能追溯。</p></div></div>
<div class="note">Qwen3.5 三种规模、四种精度是端到端训练基线。</div>

---

<div class="kicker">02 / MODULE MAP</div>

# 分层结构与任务分工

<div class="layer-map">
  <div class="layer-row"><div class="layer-box full"><b>L4 · 跨负载与端到端验证 <em>T25</em></b><span>Qwen3.5 三种规模 × 四精度 · 通用负载 · 完整步时间 / MFU / loss</span></div></div>
  <div class="layer-row"><div class="layer-box full"><b>L3 · 训练功能 <em>T14 · T15 · T23 · T24</em></b><span>nn / AMP · optimizer · DataLoader · checkpoint</span></div></div>
  <div class="layer-row"><div class="layer-box"><b>L2 · 算子与求导 <em>T08–T13</em></b><span>Dispatcher · 算子 · Autograd</span></div><div class="layer-box"><b>L2 · 图编译 <em>T21 · T22</em></b><span>Dynamo · AOT · Inductor</span></div><div class="layer-box"><b>L3 · 分布式 <em>T18–T20</em></b><span>DDP · FSDP · DTensor / TP</span></div></div>
  <div class="layer-row"><div class="layer-box"><b>数学库与 ATen <em>T06 → T07</em></b><span>GEMM / BMM · 算子桥接</span></div><div class="layer-box"><b>L1 · 节点运行时 <em>T03–T05</em></b><span>线程 · DDR / HBM · 复制</span></div><div class="layer-box"><b>通信库与 c10d <em>T16 → T17</em></b><span>collective · backend / Work</span></div></div>
  <div class="layer-row"><div class="layer-box full"><b>L0 · 构建、ISA 与资源 <em>T01 · T02</em></b><span>工具链 · CPU / NUMA · 线程与内存资源</span></div></div>
</div>
<div class="map-foot"><b>贯穿各层</b>　T00 测试合同　 · 　T26 集成发布　 <span>依据 plan.html 模块框架整理</span></div>

---

<div class="kicker">EXAMPLE / FP16 MATMUL</div>

# 例子：从训练报错定位到数学路由

<div class="case-story"><div><small>上层现象 · 假设场景</small><b>小型 MLP 的 FP16 测试中断</b><span>沿 MLP → mm / addmm → ATen CPU → 数学库排查，前向和梯度分别检查。</span></div><div><small>已有案例 · 固定输入对照</small><b>默认 oneDNN 报错，限定回退通过</b><span>33×129 与 129×65 相乘；受控关闭 oneDNN 后结果为 129，扩展检查覆盖 mm / addmm / bmm 前向和 VJP。</span></div><div><small>如何接力</small><b>T25 复现 → T07 排查路由 → T13 / T00 复核</b><span>需要新 GEMM 时，T06 交付内核，T07 接入；T25 重测受影响的上层用例。</span></div></div>
<div class="caption">上层 MLP 是分工示例；底层对照来自 T07 案例。oneDNN 内部根因尚未确认，限定回退不等于通用修复。</div>

---

<div class="kicker">COLLABORATION / REQUEST</div>

# 跨模块问题：一张任务单交接

<div class="steps"><div><b>01</b><strong>发现</strong><p>记录现象、最小复现、环境和基线 SHA。</p></div><div><b>02</b><strong>定界</strong><p>维护者确认接口、接收人、修改范围和复核人。</p></div><div><b>03</b><strong>实现与复核</strong><p>各自在独立工作树处理；复核者检出固定候选 SHA。</p></div><div><b>04</b><strong>接收与集成</strong><p>维护者接收补丁；T25 复验，T26 固定版本与回退。</p></div></div>
<div class="note">跨模块补丁先确认文件范围；共享文件由唯一维护者落地。候选实现者以外的人完成最终复核。</div>
<div class="caption">任务单关联 Issue / PR，记录命令、结果、证据和未解决问题。</div>

---

<div class="kicker">COLLABORATION / CROSS REVIEW</div>

# 交叉验证：看同一个候选提交

<div class="case-handoff"><div><b>实现者</b><span>提供基线与候选 SHA、接口、测试命令和预期。</span></div><div><b>复核者</b><span>在独立工作树复现失败或核对可靠失败证据，再测试候选、保护项和受影响接口。</span></div><div><b>维护者</b><span>确认补丁与接口，记录接收或退回原因；共享文件交对应维护者修改。</span></div><div><b>集成方</b><span>T00 维护公共判据，T25 复验受影响负载，T26 固定版本组合和回退。</span></div></div>
<div class="caption">最终验收不能由候选实现者独自完成；复核记录包含实际 SHA、环境、命令、结果和证据。</div>

---

<div class="kicker">04 / FIRST TWO CHAINS</div>

# 首轮先跑通数学和通信两条链

<div class="chain"><b>数学链</b><div>T06<br><small>FP32 GEMM 内核</small></div><i>→</i><div>T07<br><small>ATen mm / addmm 桥接</small></div><i>→</i><div>小型 MLP<br><small>正确性与性能</small></div></div>
<div class="chain"><b>通信链</b><div>T16<br><small>FP32 AllReduce SUM</small></div><i>→</i><div>T17<br><small>c10d backend / Work</small></div><i>→</i><div>分布式张量程序<br><small>行为与性能</small></div></div>
<div class="caption">两条链先验证 FP32；其他精度和功能按计划接入。</div>

---

<div class="kicker">06 / KERNEL</div>

# 计算内核：实现与框架桥接分开

<div class="table-head"><span>负责人</span><span>Agent 可以修改的范围示例</span><span>需要交接的接口</span></div>
<div class="table-row"><b>T06</b><span>NEW: <code>extensions/lingsheng/T06/</code><br>独立 GEMM / BMM 实现与内部路由</span><span>能力查询、ABI、workspace、线程预算</span></div>
<div class="table-row"><b>T07</b><span>PT: <code>aten/src/ATen/native/CPUBlas*</code><br>及登记的 <code>LinearAlgebra.cpp</code> CPU 路径</span><span>dtype、stride、out / alias、回退</span></div>
<div class="note">T08 维护共享算子注册与 schema；内核按通用条件选择，保持 Tensor 语义。</div>

---

<div class="kicker">07 / COMMUNICATION</div>

# 通信：collective 与 c10d 各守边界

<div class="table-head"><span>负责人</span><span>Agent 可以修改的范围示例</span><span>需要交接的接口</span></div>
<div class="table-row"><b>T16</b><span>NEW: <code>extensions/lingsheng/T16/</code><br>通信包装、自有 collective、受支持库接口</span><span>rank 映射、完成、错误、线程预算</span></div>
<div class="table-row"><b>T17</b><span>NEW: <code>extensions/lingsheng/T17/</code><br>登记的 PT c10d 实现与注册入口</span><span>Work.wait、group、timeout、生命周期</span></div>
<div class="note">T18–T20 负责 DDP、FSDP 和 DTensor 策略；T17 在接口中说明同步与完成语义。</div>

---

<div class="kicker">LIBRARIES / OWNERSHIP</div>

# 框架和底层库分别在哪里修改？

<div class="case-handoff"><div><b>Torch 本体</b><span>ATen 路由、c10d、allocator、Autograd 等框架行为，在对应 PyTorch 文件修改与评审。</span></div><div><b>自有适配</b><span>自研 kernel、库包装和 backend 按任务登记；B1 已有 torch._cpu_opt，新任务也可使用拟新增的 NEW 扩展目录。</span></div><div><b>可获取源码的库</b><span>底层算法确需修改时，使用固定上游版本的补丁或对应 fork，明确许可并做库级验证。</span></div><div><b>厂商二进制</b><span>登记来源、版本、ABI 与制品 SHA；按授权使用受支持接口。</span></div></div>
<div class="note">先用原生库测试验证机制，再用 Torch 接口与上层负载验证接入；跨仓通过版本清单关联。</div>

---

<div class="kicker">LIBRARIES / KML & HMPI</div>

# KML 与 HMPI：按源码和改动范围选择

<div class="columns two"><div><b>KML · 软件包与适配接口</b><p>官方提供 KML 软件包与接口；公开的 kml_adapter 是适配项目。完整实现源码及当前包的再分发权限仍需按具体版本核实。</p><p>Torch 路由改 Torch；自研 KML wrapper / kernel 放扩展目录。厂商二进制登记版本和 SHA。</p></div><div><b>HMPI · 存在公开源码</b><p>官方公开 HMPI、HUCX、XUCG 仓库。仅改 PyTorch backend 时维护适配层；确需改 collective / 通信协议时，考虑对应组件 fork。</p><p>固定兼容版本、commit、构建与 ABI；具体版本许可证逐项核对。</p></div></div>
<div class="caption">小幅上游改动可先维护版本化 patch；长期、多处修改再评估独立 fork。两种方式都固定上游版本并保留构建与测试证据。</div>
<div class="caption">来源：<a href="https://www.hikunpeng.com/document/detail/en/kunpengaccel/math-lib/devg-kml/kunpengaccel_kml_16_0004.html">KML 官方获取说明</a> · <a href="https://gitee.com/openeuler/kml_adapter">kml_adapter</a> · <a href="https://github.com/kunpengcompute/hmpi">HMPI 源码与构建说明</a></div>

---

<div class="kicker">08 / MEMORY</div>

# 内存：资源、分配与使用三方约定

<div class="columns three">
<div><b>T02 · 资源</b><p>提供合法 CPU 与内存 allowed mask，描述拓扑与预算。</p></div>
<div><b>T04 · 分配</b><p>NEW 的 T04 目录及登记的 PT <code>c10/core/CPUAllocator.*</code> 接口段。</p></div>
<div><b>调用方 · 生命周期</b><p>显式声明大小、对齐、位置、所有权与释放时机。</p></div>
</div>
<div class="note">HBM 通过内存策略接入；公共 allocator 接口变化由相关维护者约定迁移。</div>

---

<div class="kicker">09 / COLLABORATION</div>

# Git：固定版本，逐仓交付

<div class="steps"><div><b>01</b><strong>固定起点</strong><p>从约定 commit 创建 <code>task/Txx-…</code> 或 <code>docs/…</code>。</p></div><div><b>02</b><strong>各仓提交</strong><p>只暂存本任务文件；每个仓库独立提交，保留其他人的修改。</p></div><div><b>03</b><strong>先模块后主仓</strong><p>先推送并评审 Torch fork，主仓再更新子模块 SHA。</p></div><div><b>04</b><strong>集成与回退</strong><p>通过 PR 评审；固定 commit、制品和配置，保留回退依据。</p></div></div>
<div class="caption">NEW 是平台主仓，PT 是其中的 PyTorch 子模块。任务单将职责细化到具体文件与函数。</div>

---

<div class="kicker">MODULE GOALS / T00–T06</div>

# 基础设施与数学内核的目标

<ModuleGoals :start="0" :end="6" />

---

<div class="kicker">MODULE GOALS / T07–T13</div>

# 框架算子与求导的目标

<ModuleGoals :start="7" :end="13" />

---

<div class="kicker">MODULE GOALS / T14–T20</div>

# 精度、更新与分布式的目标

<ModuleGoals :start="14" :end="20" />

---

<div class="kicker">MODULE GOALS / T21–T26</div>

# 编译、数据、验证与发布的目标

<ModuleGoals :start="21" :end="26" />

---

<div class="kicker">PROGRESS / B0 MATRIX</div>

# B0：12 格中已有 8 格完成单步

<LingShengMatrix />

<div class="caption">统计快照：2026-11-05。</div>

---

<div class="kicker">PROGRESS / B1 SOURCE</div>

# B1 同步了旧版本的哪些优化？

<B1Optimization group="compute" />

<div class="caption">2026-11-04 版本记录：B0 8deb919，旧优化 3eb140d，B1 7b21092。来源：docs/b1-initial-optimization-baseline.md。</div>

---

<div class="kicker">PROGRESS / B1 RUNTIME</div>

# B1 迁入：通信、内存与训练支持

<B1Optimization group="runtime" />

<div class="caption">入口 <code>torch._cpu_opt</code> 需显式调用；B1 各项能力与性能仍需在新环境验证。</div>

---

<div class="section-slide"><div class="eyebrow">PART II / KNOWLEDGE</div><h1>知识库<br><em>是协作的一部分</em></h1><p>从检索原文，到独立验证，再到可复用的结论。</p><div class="section-number">02</div></div>

---

<div class="kicker">KNOWLEDGE / ARCHITECTURE</div>

# 知识库分为平台知识和项目经验

<div class="knowledge-grid"><div><b>C2 平台知识</b><p>工具链、KML、Donau、CPU / NUMA、HBM、MPI 与 profiling。</p><small>.agents/skills/c2-platform-reference/kb/</small></div><div><b>项目集群知识</b><p>项目实际用到的环境与平台事实。</p><small>knowledge/cluster/</small></div><div><b>Torch 已确认条目</b><p>经过复核的问题、触发条件和已验证处置。</p><small>knowledge/torch/entries/</small></div><div><b>排查案例</b><p>未确认、已排除或仍在调查的问题与证据。</p><small>knowledge/torch/cases/</small></div></div>
<div class="caption">新版 C2 知识从 MAP.md 导航；旧 .c2/kb/ 保留历史快照。查询不等于授权运行集群任务。</div>

---

<div class="kicker">KNOWLEDGE / ENTRY POINTS</div>

# 三个入口，分别解决什么问题？

<div class="case-handoff"><div><b>遇到异常</b><span>项目 <code>$c2</code> / <code>tools/find_issue.py</code>：查 Torch 条目、C2 平台来源、集群知识和案例。</span></div><div><b>查平台用法</b><span><code>c2-platform-reference</code>：从知识地图进入具体条目，核对版本和验证范围。</span></div><div><b>评估应用</b><span><code>c2-platform-evaluate</code>：结合代码、配置与已有运行证据，给出利用情况和就绪检查。</span></div><div><b>反馈知识</b><span><code>kb-feedback</code>：用户要求提交时，按规范提交问题或经验；反馈仍是待审核候选。</span></div></div>
<div class="caption">应用评估基于现有证据，不自动连接集群或启动任务。</div>

---

<div class="kicker">KNOWLEDGE / LOOKUP</div>

# 遇到问题：先搜索，再读原文

<div class="codeblock"><small>在项目根目录执行</small><pre>python3 tools/find_issue.py SIGBUS
.c2/bin/c2 find UCX_TLS
.c2/bin/c2 show 'toolchain/kml#link-blas-gemm-with-kblas'</pre></div>
<div class="columns three compact"><div><b>搜索</b><p>用报错、符号、dtype 或配置键；多词按任一词命中。</p></div><div><b>核对</b><p>阅读版本、节点、输入、测试条件和证据。</p></div><div><b>验证</b><p>保留原现场，在相同条件下检查处置是否适用。</p></div></div>
<div class="caption">示例命令均为本地查询；集群复现须遵守现有任务授权和 Donau 规则。</div>

---

<div class="kicker">KNOWLEDGE / EXAMPLE</div>

# 例子：用 SIGBUS 记录缩小排查范围

<div class="case-story"><div><small>搜索</small><b>find_issue.py SIGBUS</b><span>同时返回已确认条目、平台来源、集群知识和案例；命中不代表条件相同。</span></div><div><small>阅读条目</small><b>T02 · KML 与 HugeTLB 内存策略</b><span>核对记录的 Torch / KML 版本、绑定时机、NUMA 与实际页驻留。</span></div><div><small>复用结论</small><b>先比对环境，再按任务验证</b><span>记录支持的特定策略与限定回归；其他精度、模型或节点不能直接套用。</span></div></div>
<div class="caption">条目来源：knowledge/torch/entries/T02-kml-hugetlb-policy.md；旧失败和对照仍在案例与实验记录中。</div>

---

<div class="kicker">KNOWLEDGE / LIFECYCLE</div>

# 经验怎样进入知识库？

<div class="chain"><div>保留现场<br><small>输入、版本、原始结果</small></div><i>→</i><div>建立案例<br><small>最小复现与对照</small></div><i>→</i><div>负责人复核<br><small>确认范围与证据</small></div><i>→</i><div>发布条目<br><small>更新导航并重查</small></div></div>
<div class="columns two compact"><div><b>项目问题</b><p>证据不足留在 cases/；确认后更新 entries/ 和项目 $c2 导航。</p></div><div><b>C2 平台知识</b><p>维护方审核候选并更新发布内容；项目按需执行 <code>sh ./kb_sync.sh</code> 同步知识。</p></div></div>
<div class="caption">2026-11-11 本地记录：内容版本 release-t1kZ0U。同步只更新平台知识和文档，不更新 skill 本体或项目案例。</div>

---

<div class="kicker">14 / ACCEPTANCE</div>

# 如何验收优化？

<div class="columns three"><div><b>正确性</b><p>固定输入与参考；覆盖适用 dtype、shape、layout、梯度和错误行为。</p></div><div><b>模块性能</b><p>固定制品、资源和计时口径，预热后进行独立配对对照。</p></div><div><b>组合结果</b><p>跨工作负载检查兼容、回退和端到端表现。</p></div></div>
<div class="note">端到端基线覆盖 Qwen3.5 0.8B / 9B / 27B 与四种精度，记录训练时间、MFU 和足够 epoch 的 loss。</div>
