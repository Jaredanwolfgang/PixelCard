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

<div class="hero-line">面向 LingSheng 的<span>通用 PyTorch 软件栈</span></div>

<div class="columns three">
<div><b>语义可靠</b><p>保持声明范围内的 Tensor、算子、Autograd 和分布式语义。</p></div>
<div><b>性能可复现</b><p>围绕接口、精度、资源与工作负载，验证优化和回退。</p></div>
<div><b>团队可接力</b><p>源码、配置、证据和知识条目有清晰归属与版本。</p></div>
</div>
<div class="note">Qwen3.5 用于端到端训练基线；底层优化面向可复用的 PyTorch 能力。</div>

---

<div class="kicker">02 / ARCHITECTURE</div>

# 从应用到硬件：谁调用谁

<div class="stack">
<div><strong>工作负载</strong><span>张量程序 · 模型训练与推理 · 跨工作负载验证</span></div>
<div><strong>框架能力</strong><span>nn / optim / AMP　　DDP / FSDP / DTensor</span></div>
<div><strong>框架核心</strong><span>Dispatcher / ATen / Autograd　　c10d / Work</span></div>
<div><strong>基础能力</strong><span>数学内核　　通信 collective　　线程与内存运行时</span></div>
<div><strong>系统资源</strong><span>CPU / NUMA / DDR / HBM　　工具链与 Donau</span></div>
</div>
<div class="caption">不同工作负载会经过不同路径，构建、测试与发布贯穿各层。</div>

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

<div class="kicker">EXAMPLE / START WITH A FAILURE</div>

# 例子：FP16 训练在矩阵乘时报错

<div class="case-story"><div><small>上层现象 · 假设场景</small><b>小型 MLP 的前向 / 求导测试中断</b><span>记录 dtype、shape、stride、源码与错误；测试失败的地方只是排查入口。</span></div><div><small>向下追踪调用</small><b>MLP → mm / addmm → ATen CPU → 数学库</b><span>Autograd 的反向也会调用矩阵运算；分别检查前向和各梯度的实际路径。</span></div><div><small>找到已有线索</small><b>检索 <code>$c2</code> / <code>tools/find_issue.py</code></b><span>关键词：FP16、oneDNN、primitive descriptor。命中 T07 现有案例。</span></div></div>
<div class="caption">基于 T07 FP16 matmul 真实案例整理；上层 MLP 场景是为说明协作而设计的例子。</div>

---

<div class="kicker">EXAMPLE / LOCATE THE LAYER</div>

# 同一输入对照，确定问题在哪一层

<div class="compare"><div><small>真实案例 · 默认路径</small><h2>oneDNN 报错</h2><p>33×129 与 129×65 的 FP16 矩阵相乘；默认路径创建 primitive descriptor 失败。</p></div><div><small>真实案例 · 对照路径</small><h2>限定回退通过</h2><p>相同输入在受控 context 中关闭 oneDNN，得到精确结果 129；扩大检查覆盖 mm / addmm / bmm 的前向和 VJP。</p></div></div>
<div class="note">现象指向 T07 的 CPU 数学路由，具体 oneDNN 内部根因仍未确认。回退是已验证的限定处置，不能直接当成通用修复。</div>
<div class="caption">如果前向通过而梯度异常，再由 T13 分离求导规则、梯度输入和反向算子；不预先假定是 Autograd 出错。</div>

---

<div class="kicker">EXAMPLE / COOPERATE AND VERIFY</div>

# 修复如何分工、交付和回到上层？

<div class="case-handoff"><div><b>T00 / 测试</b><span>固定输入与参考，保留失败现场；组织前向、VJP 和回归用例。</span></div><div><b>T07 / 桥接</b><span>核对 <code>CPUBlas.cpp</code> 等登记路由；在独立分支实现与验证候选。</span></div><div><b>T13 / 求导</b><span>检查梯度合同与参考；若需改公共导数规则，由 T13 落地。</span></div><div><b>T06 + T01</b><span>若采用新 GEMM 路径，由 T06 提供接口，T01 固定构建与库身份。</span></div><div><b>T25 / 组合验证</b><span>先测算子再测小型 MLP；记录实际路由、数值、回退与资源。</span></div></div>
<div class="note">真实后续：KML FP16 候选已通过指定算子及一次 0.8B 单步；本例的 Agent 分工是按当前协作合同设计的交付流程。</div>
<div class="caption">记录案例与适用范围，复核后更新 Torch 知识条目和 <code>$c2</code> 导航。涉及集群测试时按授权通过 Donau 执行。</div>

---

<div class="kicker">COLLABORATION / REQUEST</div>

# 发现跨模块问题，先形成一张协作单

<div class="steps"><div><b>01</b><strong>发现者</strong><p>记录症状、最小复现、预期 / 实测和受影响模块。</p></div><div><b>02</b><strong>共同定界</strong><p>相关维护者确认接口、责任、可改文件与分支起点。</p></div><div><b>03</b><strong>关联任务</strong><p>拆成实现、交叉验证与组合验证，记录依赖和接收人。</p></div><div><b>04</b><strong>交付回执</strong><p>每项附 commit、测试、结论、未覆盖项和下一步。</p></div></div>
<div class="note">沟通载体：关联同一案例的任务单 / Issue 与模块 PR；任务状态和证据回填仓库记录。</div>
<div class="caption">正式流程已写入仓库；具体人员与跨模块写入范围在任务单确认。</div>

---

<div class="kicker">COLLABORATION / CROSS REVIEW</div>

# 交叉验证针对的是具体提交

<div class="case-handoff"><div><b>实现方</b><span>在自己的任务分支提交候选，提供基线 SHA、候选 SHA、接口和测试命令。</span></div><div><b>其他模块 Agent</b><span>在独立工作树检出指定 SHA，先复现失败，再验证候选与保护项。</span></div><div><b>提出补丁</b><span>跨模块修复可在独立分支准备补丁；先由相关维护者确认任务范围和文件白名单。</span></div><div><b>模块维护者</b><span>审阅接口和补丁，在本模块分支接收或落实共享文件修改；PR 记录接受 / 退回原因。</span></div><div><b>验证与集成</b><span>T00 维护公共判据；非候选实现者独立验收。T25 复验受影响负载，T26 固定版本与回退。</span></div></div>
<div class="note">跨模块补丁先确认文件白名单；共享文件交唯一维护者落地。最终验收必须有非候选实现者的独立复核。</div>

---

<div class="kicker">COLLABORATION / REVIEW MAP</div>

# 任务分工：接口两侧交叉复核

<div class="case-handoff"><div><b>公共与运行时</b><span>T00 ↔ 相关模块；T01 ↔ T02 / 依赖方；T02 ↔ T03 / T04 / T16；T03 ↔ T02 / T06；T04 ↔ T02 / T05 / T19；T05 ↔ T04 / 调用方。</span></div><div><b>数学与算子</b><span>T06 ↔ T07 / T00；T07 ↔ T06 / T13 / T08；T08 ↔ 算子方 / T13；T09–T10 ↔ T08 / T13；T11 ↔ T06 / T07 / T08 / T13；T12 ↔ T06 / T07 / T13 / T04。</span></div><div><b>求导与训练</b><span>T13 ↔ 算子方 / T00；T14 ↔ T13 / T15；T15 ↔ T14 / T24。</span></div></div>
<div class="caption">按受影响接口选择复核方；这是角色安排，具体人员和任务仍待分配。T00 自己的候选也由其他合格人员独立复核。</div>

---

<div class="kicker">COLLABORATION / REVIEW MAP</div>

# 任务分工：通信、编译与集成

<div class="case-handoff"><div><b>通信与分布式</b><span>T16 ↔ T17 / T02 / T03；T17 ↔ T16 / T18–T20；T18 ↔ T17 / T13 / T25；T19 ↔ T17 / T04 / T24；T20 ↔ T17 / T07 / T24。</span></div><div><b>编译与输入</b><span>T21 ↔ T13 / T22；T22 ↔ T21 / T06 / T07；T23 ↔ T02 / T24 / T25；T24 ↔ T15 / T19 / T20 / T23。</span></div><div><b>验证与发布</b><span>T25 ↔ 被测模块 / T00，复验受影响负载；T26 ↔ T01 / T00 / T25 和所选模块，固定实际 SHA、制品与回退。</span></div></div>
<div class="note">首轮仍是 T06–T07 数学链与 T16–T17 通信链；每个模块按自己的接口和指标验收，端到端基线用于产品组合验证。</div>

---

<div class="kicker">COLLABORATION / EXAMPLE</div>

# 回到 FP16 案例：一张单串起三次交接

<div class="chain"><b>发现</b><div>T25<br><small>上层失败 + 复现材料</small></div><i>→</i><div>T07<br><small>路由候选 + commit</small></div><i>→</i><div>T13 / T00<br><small>独立前向 / VJP 复核</small></div></div>
<div class="columns two compact"><div><b>需要底层实现时</b><p>T07 向 T06 发接口与 shape 请求；T06 在自己的分支交实现和合同测试，T07 用固定提交接入。</p></div><div><b>跨仓交付时</b><p>模块仓先评审合并并记录实际 SHA；平台主仓再通过独立 PR 更新子模块指针、配置与证据。</p></div></div>
<div class="caption">每次回执写明：检出的 SHA、实际命令与环境、预期 / 实测、结论、接收人和未解决问题。</div>

---

<div class="kicker">03 / RESPONSIBILITY</div>

# 策略与机制各有负责人

<div class="compare">
<div><small>上层决定</small><h2>何时、为何</h2><p>FSDP 决定参数何时聚合；调用方声明 buffer 生命周期与资源需求。</p></div>
<div><small>下层提供</small><h2>如何执行</h2><p>通信后端执行 collective；allocator 按合同分配和释放内存。</p></div>
</div>
<div class="note">数学、通信和编译后端各自维护接口，跨模块改动由对应负责人协作完成。</div>

---

<div class="kicker">04 / FIRST TWO CHAINS</div>

# 首轮以两条最小链路协作

<div class="chain"><b>数学链</b><div>T06<br><small>FP32 GEMM 内核</small></div><i>→</i><div>T07<br><small>ATen mm / addmm 桥接</small></div><i>→</i><div>小型 MLP<br><small>正确性与性能</small></div></div>
<div class="chain"><b>通信链</b><div>T16<br><small>FP32 AllReduce SUM</small></div><i>→</i><div>T17<br><small>c10d backend / Work</small></div><i>→</i><div>分布式张量程序<br><small>行为与性能</small></div></div>
<div class="caption">首轮先跑通 FP32 数学与通信链，其他精度和功能按任务计划逐步接入。</div>

---

<div class="kicker">05 / AGENT BOUNDARY</div>

# Agent 按任务单开展开发

<div class="steps"><div><b>01</b><strong>确认任务</strong><p>负责人、起点 SHA、文件与函数白名单、接口、预算和验收标准。</p></div><div><b>02</b><strong>独立开发</strong><p>独立分支或工作树；先查已有证据，保持接口与精度合同。</p></div><div><b>03</b><strong>提出跨界需求</strong><p>提交复现或独立补丁，与对应维护者确认接入范围。</p></div><div><b>04</b><strong>评审与交付</strong><p>提交测试、对照、来源与限制；集成负责人验证组合。</p></div></div>
<div class="note">集群账号、作业和资源由当前负责人按授权安排。</div>

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

# Torch 与底层库：改动放在哪一层？

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

# Git 把协作变成可追溯交付

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

<div class="section-slide"><div class="eyebrow">PROJECT STATUS / 2026.11.05</div><h1>从 B0 参考<br><em>走向 B1 优化</em></h1><p>先建立可比较的训练与模块参考，再逐项验证迁入的优化。</p><div class="section-number">B0</div></div>

---

<div class="kicker">PROGRESS / B0 MATRIX</div>

# B0：12 格中已有 8 格完成单步

<LingShengMatrix />

<div class="caption">统计快照：2026-11-05。点击每个格子查看该模型与精度的实验记录。</div>

---

<div class="kicker">PROGRESS / B1 SOURCE</div>

# B1 同步了旧版本的哪些优化？

<B1Optimization group="compute" />

<div class="caption">数学、反向、算子与注意力：旧版源码已迁入 B1，详情保留旧环境的结果与条件。</div>

---

<div class="kicker">PROGRESS / B1 RUNTIME</div>

# B1 迁入：通信、内存与训练支持

<B1Optimization group="runtime" />

<div class="caption">新入口为 <code>torch._cpu_opt</code>，需显式调用；各项 B1 新环境资格仍按任务单验证。</div>

---

<div class="kicker">PROGRESS / B1 EVIDENCE</div>

# B1 的代码已整合，性能从这里重新验证

<div class="b1-path"><div><small>B0 源码参考</small><b>8deb919</b><span>对应已有 B0 实测构建输入</span></div><i>＋</i><div><small>旧优化来源</small><b>3eb140d</b><span>保留原件及历史验证材料</span></div><i>→</i><div><small>B1 源码基线</small><b>7b21092</b><span>模块化迁入与版本记录</span></div></div>
<div class="columns two compact"><div><b>旧环境留下的线索</b><p>例如 BF16 MLP、Gated Delta、单层反向和 MoE 均有历史模块结果，保留各自的配置与限制。</p></div><div><b>B1 下一步</b><p>先建立新运行时身份，再逐模块验证数值、调用覆盖与性能，最后检查组合和训练结果。</p></div></div>
<div class="note">B1 的训练时间、MFU、loss、恢复和模块性能目前待测；旧环境结果继续作为历史证据。</div>
<div class="caption">来源：<code>docs/b1-initial-optimization-baseline.md</code> 与配套版本记录；状态依据 2026-11-04 源码集成记录。</div>

---

<div class="section-slide"><div class="eyebrow">PART II / KNOWLEDGE</div><h1>知识库<br><em>是协作的一部分</em></h1><p>从检索原文，到独立验证，再到可复用的结论。</p><div class="section-number">02</div></div>

---

<div class="kicker">10 / KNOWLEDGE MAP</div>

# 四类知识，各自回答不同问题

<div class="knowledge-grid"><div><b>平台来源</b><p>C2 的平台、工具链、数学库、通信和 Donau 用法。</p><small>固定版本的 C2 索引与原文</small></div><div><b>项目集群知识</b><p>项目范围内的环境与已记录的平台事实。</p><small>knowledge/cluster/</small></div><div><b>Torch 已确认条目</b><p>经过复核的触发条件、测试和处置。</p><small>knowledge/torch/entries/</small></div><div><b>排查案例</b><p>尚在调查、未复现或已排除的问题与证据。</p><small>knowledge/torch/cases/</small></div></div>

---

<div class="kicker">11 / LOOKUP</div>

# 遇到异常：先查，再核对适用范围

<div class="codeblock"><small>项目根目录</small><pre>python3 tools/find_issue.py ReduceScatter BF16
.c2/bin/c2 find UCX_TLS
.c2/bin/c2 show 'toolchain/kml#link-blas-gemm-with-kblas'</pre></div>
<div class="columns three compact"><div><b>01 搜索</b><p>用错误片段、符号、dtype 或配置键定位。</p></div><div><b>02 读原文</b><p>核对版本、节点、精度、布局和日期。</p></div><div><b>03 同条件验证</b><p>保留原始现场，验证处置前后结果。</p></div></div>
<div class="caption">也可在项目中使用 <code>$c2</code>。找到条目后，结合当前任务核对适用条件。</div>

---

<div class="kicker">12 / EXCEPTION FLOW</div>

# 没有适用答案时，建立独立复现

<div class="steps five"><div><b>01</b><strong>保留现场</strong><p>输入、输出与源码身份。</p></div><div><b>02</b><strong>记录检索</strong><p>命中、条件和不匹配项。</p></div><div><b>03</b><strong>最小复现</strong><p>固定输入、参考与唯一变化项。</p></div><div><b>04</b><strong>负责人复核</strong><p>区分症状、根因和证据不足。</p></div><div><b>05</b><strong>回填结论</strong><p>确认后发布条目并更新导航。</p></div></div>
<div class="note">新对照保存在独立目录；多 rank 问题使用复现所需的最小分组，集群运行按预算通过 Donau 提交。</div>

---

<div class="kicker">13 / KNOWLEDGE LIFECYCLE</div>

# 一次发现，怎样变成团队知识？

<div class="chain wide"><div>案例<br><small>cases/ 与最小复现</small></div><i>→</i><div>复核<br><small>条件、对照与证据</small></div><i>→</i><div>确认条目<br><small>entries/ 与适用范围</small></div><i>→</i><div>导航<br><small>$c2 与关键词重查</small></div></div>
<div class="columns two compact"><div><b>条目应包含</b><p>稳定 ID、症状、版本、触发条件、测试、预期与实测、证据及已验证处置。</p></div><div><b>来源库另有生命周期</b><p>C2 候选先进入 inbox，经验证或维护者批准后进入 kb，并更新索引。</p></div></div>
<div class="caption">结论确认后，在同一提交中更新案例、条目和 skill 导航；待验证的问题继续留在案例区。</div>

---

<div class="kicker">14 / ACCEPTANCE</div>

# 模块先验证，组合再验收

<div class="columns three"><div><b>正确性</b><p>固定输入与参考；覆盖适用 dtype、shape、layout、梯度和错误行为。</p></div><div><b>模块性能</b><p>固定制品、资源和计时口径，预热后进行独立配对对照。</p></div><div><b>组合结果</b><p>跨工作负载检查兼容、回退和端到端表现。</p></div></div>
<div class="note">端到端基线覆盖 Qwen3.5 0.8B / 9B / 27B 与四种精度，记录训练时间、MFU 和足够 epoch 的 loss。</div>

---

<div class="kicker">15 / WORKING AGREEMENT</div>

# 一次任务交付的最小清单

<div class="checklist"><div><span>01</span>任务单明确负责人、边界、接口和基线</div><div><span>02</span>代码在正确仓库与分支，跨模块需求有维护者</div><div><span>03</span>正确性、性能、失败和未覆盖范围都有证据</div><div><span>04</span>异常案例与知识条目能通过关键词重新找到</div><div><span>05</span>提交、制品、配置和回退路径可供他人复现</div></div>

---

<div class="end-slide"><div class="eyebrow">LINGSHENG / ENGINEERING PLAYBOOK</div><h1>从接口出发，<br><em>一起把链路跑通。</em></h1><p>任务单明确分工，测试连接模块，知识库记录可复用的经验。</p><div class="end-rule"></div><small>参考项目 README、分层设计、任务包、分支管理与知识库文档。</small></div>
