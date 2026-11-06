---
theme: default
title: LingSheng × PyTorch 协作框架
info: 通用 PyTorch 软件栈的模块分工、Agent 边界与知识库工作流
drawings:
  persist: false
transition: fade
mdc: true
---

<div class="cover">
<div class="eyebrow">LINGSHENG / ENGINEERING PLAYBOOK</div>
<h1>让协作跨过<br><em>模块边界</em></h1>
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
<div class="note">Qwen3.5 是规定的端到端训练基线，底层实现按通用能力选择，不依赖模型名称。</div>

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
<div class="caption">调用链可分支或跳层；编译、测试和构建贯穿各层。</div>

---

<div class="kicker">03 / RESPONSIBILITY</div>

# 策略与机制各有负责人

<div class="compare">
<div><small>上层决定</small><h2>何时、为何</h2><p>FSDP 决定参数何时聚合；调用方声明 buffer 生命周期与资源需求。</p></div>
<div><small>下层提供</small><h2>如何执行</h2><p>通信后端执行 collective；allocator 按合同分配和释放内存。</p></div>
</div>
<div class="note">数学后端、通信后端和编译后端分别维护接口，不因都叫 backend 而共享权限。</div>

---

<div class="kicker">04 / FIRST TWO CHAINS</div>

# 首轮以两条最小链路协作

<div class="chain"><b>数学链</b><div>T06<br><small>FP32 GEMM 内核</small></div><i>→</i><div>T07<br><small>ATen mm / addmm 桥接</small></div><i>→</i><div>小型 MLP<br><small>正确性与性能</small></div></div>
<div class="chain"><b>通信链</b><div>T16<br><small>FP32 AllReduce SUM</small></div><i>→</i><div>T17<br><small>c10d backend / Work</small></div><i>→</i><div>分布式张量程序<br><small>行为与性能</small></div></div>
<div class="caption">首轮范围有限：其他精度、collective 与端到端路径另按任务合同推进。负责人和运行授权以最新任务记录为准。</div>

---

<div class="kicker">05 / AGENT BOUNDARY</div>

# Agent 从任务单获得有界改动范围

<div class="steps"><div><b>01</b><strong>确认任务</strong><p>负责人、起点 SHA、文件与函数白名单、接口、预算和验收标准。</p></div><div><b>02</b><strong>独立开发</strong><p>独立分支或工作树；先查已有证据，保持接口与精度合同。</p></div><div><b>03</b><strong>提出跨界需求</strong><p>共享文件、公共 schema、资源与语义变化交对应维护者。</p></div><div><b>04</b><strong>评审与交付</strong><p>提交测试、对照、来源与限制；集成负责人验证组合。</p></div></div>
<div class="note">认领任务不等于获得共享账号、集群作业或额外资源的操作权。</div>

---

<div class="kicker">06 / KERNEL</div>

# 计算内核：实现与框架桥接分开

<div class="table-head"><span>负责人</span><span>Agent 可以修改的范围示例</span><span>需要交接的接口</span></div>
<div class="table-row"><b>T06</b><span>NEW: <code>extensions/lingsheng/T06/</code><br>独立 GEMM / BMM 实现与内部路由</span><span>能力查询、ABI、workspace、线程预算</span></div>
<div class="table-row"><b>T07</b><span>PT: <code>aten/src/ATen/native/CPUBlas*</code><br>及登记的 <code>LinearAlgebra.cpp</code> CPU 路径</span><span>dtype、stride、out / alias、回退</span></div>
<div class="note">共享算子注册与 schema 由 T08 维护；内核实现不改 Tensor 语义，也不按模型名特判。</div>

---

<div class="kicker">07 / COMMUNICATION</div>

# 通信：collective 与 c10d 各守边界

<div class="table-head"><span>负责人</span><span>Agent 可以修改的范围示例</span><span>需要交接的接口</span></div>
<div class="table-row"><b>T16</b><span>NEW: <code>extensions/lingsheng/T16/</code><br>通信包装、自有 collective、受支持库接口</span><span>rank 映射、完成、错误、线程预算</span></div>
<div class="table-row"><b>T17</b><span>NEW: <code>extensions/lingsheng/T17/</code><br>登记的 PT c10d 实现与注册入口</span><span>Work.wait、group、timeout、生命周期</span></div>
<div class="note">T18–T20 负责 DDP、FSDP 和 DTensor 策略。同步实现须如实声明阻塞，不外推异步重叠。</div>

---

<div class="kicker">08 / MEMORY</div>

# 内存：资源、分配与使用三方约定

<div class="columns three">
<div><b>T02 · 资源</b><p>提供合法 CPU 与内存 allowed mask，描述拓扑与预算。</p></div>
<div><b>T04 · 分配</b><p>NEW 的 T04 目录及登记的 PT <code>c10/core/CPUAllocator.*</code> 接口段。</p></div>
<div><b>调用方 · 生命周期</b><p>显式声明大小、对齐、位置、所有权与释放时机。</p></div>
</div>
<div class="note">HBM 是内存策略，不自动成为新的 Tensor device；公共 allocator 接口变化需单独约定迁移。</div>

---

<div class="kicker">09 / COLLABORATION</div>

# Git 把协作变成可追溯交付

<div class="steps"><div><b>01</b><strong>固定起点</strong><p>从约定 commit 创建 <code>task/Txx-…</code> 或 <code>docs/…</code>。</p></div><div><b>02</b><strong>各仓提交</strong><p>只暂存本任务文件；每个仓库独立提交，保留其他人的修改。</p></div><div><b>03</b><strong>先模块后主仓</strong><p>先推送并评审 Torch fork，主仓再更新子模块 SHA。</p></div><div><b>04</b><strong>集成与回退</strong><p>通过 PR 评审；固定 commit、制品和配置，保留回退依据。</p></div></div>
<div class="caption">NEW = 平台主仓；PT = 主仓中的 PyTorch 子模块。任务卡给出职责上限，领取时还要收窄为具体文件与函数。</div>

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
<div class="caption">也可在项目中使用 <code>$c2</code>。查询工具是入口；结果的适用性仍要按当前任务判断。</div>

---

<div class="kicker">12 / EXCEPTION FLOW</div>

# 没有适用答案时，建立独立复现

<div class="steps five"><div><b>01</b><strong>保留现场</strong><p>输入、输出与源码身份。</p></div><div><b>02</b><strong>记录检索</strong><p>命中、条件和不匹配项。</p></div><div><b>03</b><strong>最小复现</strong><p>固定输入、参考与唯一变化项。</p></div><div><b>04</b><strong>负责人复核</strong><p>区分症状、根因和证据不足。</p></div><div><b>05</b><strong>回填结论</strong><p>确认后发布条目并更新导航。</p></div></div>
<div class="note">新对照使用独立输出；多 rank 问题保留最小必要分组。集群复现仍遵循授权预算与 Donau 规则。</div>

---

<div class="kicker">13 / KNOWLEDGE LIFECYCLE</div>

# 一次发现，怎样变成团队知识？

<div class="chain wide"><div>案例<br><small>cases/ 与最小复现</small></div><i>→</i><div>复核<br><small>条件、对照与证据</small></div><i>→</i><div>确认条目<br><small>entries/ 与适用范围</small></div><i>→</i><div>导航<br><small>$c2 与关键词重查</small></div></div>
<div class="columns two compact"><div><b>条目应包含</b><p>稳定 ID、症状、版本、触发条件、测试、预期与实测、证据及已验证处置。</p></div><div><b>来源库另有生命周期</b><p>C2 候选先进入 inbox，经验证或维护者批准后进入 kb，并更新索引。</p></div></div>
<div class="caption">案例、条目和 skill 导航在确认后同一提交更新；未确认结论留在案例区。</div>

---

<div class="kicker">14 / ACCEPTANCE</div>

# 模块先验证，组合再验收

<div class="columns three"><div><b>正确性</b><p>固定输入与参考；覆盖适用 dtype、shape、layout、梯度和错误行为。</p></div><div><b>模块性能</b><p>固定制品、资源和计时口径，预热后进行独立配对对照。</p></div><div><b>组合结果</b><p>跨工作负载检查兼容、回退和端到端影响，不能用局部倍率代替。</p></div></div>
<div class="note">规定基线：Qwen3.5 0.8B / 9B / 27B × FP64 / FP32 / FP16 / BF16；记录完整训练时间、MFU 与足够 epoch 的 loss。未完成项如实标注。</div>

---

<div class="kicker">15 / WORKING AGREEMENT</div>

# 一次任务交付的最小清单

<div class="checklist"><div><span>01</span>任务单明确负责人、边界、接口和基线</div><div><span>02</span>代码在正确仓库与分支，跨模块需求有维护者</div><div><span>03</span>正确性、性能、失败和未覆盖范围都有证据</div><div><span>04</span>异常案例与知识条目能通过关键词重新找到</div><div><span>05</span>提交、制品、配置和回退路径可供他人复现</div></div>

---

<div class="end-slide"><div class="eyebrow">LINGSHENG / ENGINEERING PLAYBOOK</div><h1>接口清楚，<br><em>协作才能并行。</em></h1><p>以任务合同划定边界，以证据连接模块，以知识库保留经验。</p><div class="end-rule"></div><small>依据项目 README、分层设计、任务包、分支管理及知识库流程整理。具体授权与状态以仓库最新记录为准。</small></div>
