<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const selected = ref(null)
const closeButton = ref(null)
const lastButton = ref(null)
const models = ['0.8B', '9B', '27B']
const dtypes = ['FP64', 'FP32', 'FP16', 'BF16']
const common = 'PyTorch + Transformers，Qwen3.5 训练入口；训练 collective 使用 Gloo，HMPI 用于启动。KML / DDR / HBM 的实际调用和驻留按每次运行记录核对。'
const cells = [
 {model:'0.8B',dtype:'FP64',status:'单步完成',time:'1,257.012 秒',mfu:'0.05134%',job:'2031562',detail:'采用 chunked loss rows 128 与指定线程布局，完成一次更新。质量、恢复和稳态尚未完成。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json'},
 {model:'0.8B',dtype:'FP32',status:'单步完成',time:'273.688 秒',mfu:'0.11789%',job:'2017736',detail:'另有小数据质量参考：256 训练 pack、64 验证 pack，3 epoch / 12 更新，总耗时 4,324 秒。验证 loss 2.292663 → 2.152970 → 2.144454 → 2.184944，末轮较第二轮回升。独立恢复的 128 rank 最终保存状态一致。',extra:'三次独立稳态窗口：中位 317.985 秒/更新、412.196 输入 token/s、估算 MFU 0.10147%。质量作业与稳态窗口计时范围不同。',source:'docs/b0-small-fp32-reference.md；docs/b0-small-fp32-steady-reference.md'},
 {model:'0.8B',dtype:'FP16',status:'单步完成',time:'449.519 秒',mfu:'0.03607%',job:'2042791',detail:'KML shgemm 候选单步：原运行时参考 5,152.312 秒，候选 449.519 秒，约 11.46 倍。128 rank 验证了 FP16 调用及一次 AdamW 更新。',extra:'这是候选运行时单步对照；完整质量、恢复和正式稳态仍待验证。',source:'experiment-evidence/b0-fp16-kml-rebuild-r1/README.md'},
 {model:'0.8B',dtype:'BF16',status:'单步完成',time:'1,028.476 秒',mfu:'0.01576%',job:'2031305',detail:'指定线程布局下完成一次更新，质量、恢复和正式稳态尚未完成。BF16 历史运行含原生混合路由，不应直接称作统一 KML 基线。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json；docs/current-results.md'},
 {model:'9B',dtype:'FP64',status:'待完成',time:'—',mfu:'—',job:'2041053',detail:'该次作业终态未获得合格的完整更新；需继续验证同精度分片加载、完整更新和输入覆盖。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json'},
 {model:'9B',dtype:'FP32',status:'单步完成',time:'1,050.106 秒',mfu:'0.31209%',job:'2034330',detail:'TP2 × FSDP64、GA1，单步最高节点记账 235.01 GiB。较早 TP4 × FSDP32、GA2 的另一节点组结果为 1,939.044 秒，不能把差值单独归因于 TP。',extra:'质量作业完成 10 / 12 次更新后退出，根因待定位；完整质量和正式稳态尚未通过。',source:'docs/current-results.md；experiment-evidence/b0-fp32-single-step-mfu.json'},
 {model:'9B',dtype:'FP16',status:'单步完成',time:'2,631.560 秒',mfu:'0.06258%',job:'2043319',detail:'TP4 × FSDP32、GA2；最高节点 worker RSS + HugeTLB 采样 219.70 GiB。目标时段捕获 KML shgemm；这是一次容量更新。',extra:'此前 TP2 作业未完成更新；质量、恢复和正式稳态仍待验证。',source:'experiment-evidence/b0-9b-fp16-tp4-r1/README.md'},
 {model:'9B',dtype:'BF16',status:'单步完成*',time:'6,932.420 秒',mfu:'0.02376%',job:'2043658',detail:'TP4 × FSDP32、GA2，最高节点 worker RSS + HugeTLB 采样 226.18 GiB。首次终态审核失败，同一审核器只读重放通过，首次失败原因尚未确认。',extra:'历史运行是原生混合路由，未证明 KML BF16 sbgemm。新 KML 候选已通过单节点 mm / bmm / addmm 前后向检查；新节点组单步在 11 月 5 日记录中待终态审核。',source:'experiment-evidence/b0-9b-bf16-tp4-r1/README.md；experiment-evidence/b0-bf16-kml-integration-r1/README.md'},
 {model:'27B',dtype:'FP64',status:'待完成',time:'—',mfu:'—',job:'2041485',detail:'该次作业终态未获得合格的完整更新；同精度分片加载和完整更新仍待验证。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json'},
 {model:'27B',dtype:'FP32',status:'单步完成',time:'2,990.728 秒',mfu:'0.35348%',job:'2037110',detail:'TP2 × FSDP64、GA1。最高节点记账 340.26 GiB；每节点申请 448 GiB，400 GiB 保护线未触发。',extra:'这是单步容量参考，完整训练、恢复和正式稳态尚未完成。',source:'docs/current-results.md；experiment-evidence/b0-fp32-single-step-mfu.json'},
 {model:'27B',dtype:'FP16',status:'待完成',time:'—',mfu:'—',job:'2046702',detail:'128 rank 完成加载并进入前向，随后有 worker 收到 SIGKILL，未完成更新；现有证据不足以将原因归为 OOM。',extra:'先前作业在加载同步阶段超时；两次尝试均保留各自结果。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json；knowledge/torch/cases/T14-matrix-worker-sigkill/case.md'},
 {model:'27B',dtype:'BF16',status:'待完成',time:'—',mfu:'—',job:'2041683',detail:'该次作业终态未获得合格的完整更新；分片加载、完整更新及训练质量仍待验证。',source:'experiment-evidence/b0-single-update-matrix-r1/matrix-summary.json'}
]
const cell = (model, dtype) => cells.find(x => x.model === model && x.dtype === dtype)
function openCell(event, item) { lastButton.value = event.currentTarget; selected.value = item; nextTick(() => closeButton.value?.focus()) }
function close() { selected.value = null; nextTick(() => lastButton.value?.focus()) }
function onKey(event) { if (event.key === 'Escape' && selected.value) { event.stopPropagation(); close() } }
onMounted(() => window.addEventListener('keydown', onKey, true))
onUnmounted(() => window.removeEventListener('keydown', onKey, true))
</script>

<template>
<div class="ls-matrix-interactive" @click.stop @keydown.stop>
 <div class="ls-matrix-row ls-matrix-head"><span>Qwen3.5</span><span v-for="dtype in dtypes" :key="dtype">{{ dtype }}</span></div>
 <div v-for="model in models" :key="model" class="ls-matrix-row">
  <b>{{ model }}</b>
  <button v-for="dtype in dtypes" :key="dtype" :class="{ pending: cell(model,dtype).status === '待完成' }" :aria-label="`${model} ${dtype}：${cell(model,dtype).status}，查看实验数据`" @click="openCell($event,cell(model,dtype))">
   <strong>{{ cell(model,dtype).status }}</strong><small>{{ cell(model,dtype).time === '—' ? '查看状态 ↗' : cell(model,dtype).time + ' ↗' }}</small>
  </button>
 </div>
 <div class="matrix-hint">点击格子查看 B0 实验数据和参考库。数字是八节点单次更新，MFU 为估算值。</div>
 <div v-if="selected" class="matrix-overlay" @click.self="close">
  <section class="matrix-dialog" role="dialog" aria-modal="true" aria-labelledby="matrix-dialog-title">
   <div class="dialog-head"><div><small>QWEN3.5 / B0 参考 · 2026.11.05</small><h2 id="matrix-dialog-title">{{ selected.model }} <em>{{ selected.dtype }}</em></h2></div><button ref="closeButton" class="close-button" aria-label="关闭详情" @click="close">×</button></div>
   <div class="dialog-metrics"><div><small>当前状态</small><b>{{ selected.status }}</b></div><div><small>完整单步</small><b>{{ selected.time }}</b></div><div><small>估算 MFU</small><b>{{ selected.mfu }}</b></div><div><small>记录作业</small><b>{{ selected.job }}</b></div></div>
   <div class="dialog-body"><div><h3>实验结果</h3><p>{{ selected.detail }}</p><p v-if="selected.extra">{{ selected.extra }}</p></div><div><h3>参考库与测量</h3><p>{{ common }}</p><p>模块工具包括 torch.utils.benchmark、OpInfo / gradcheck 与原生 GEMM、通信测试；TorchBench 子集仍是后续计划。</p></div><div><h3>记录来源</h3><p class="source-path">{{ selected.source }}</p><p class="source-path">补充：docs/benchmark-guide.md</p></div></div>
   <div class="dialog-foot">估算 MFU 使用候选 FLOPs 和标称峰值；认证 MFU 尚未完成。按 Esc 返回矩阵。</div>
  </section>
 </div>
</div>
</template>

<style scoped>
.ls-matrix-interactive{margin-top:18px}.ls-matrix-row{display:grid;grid-template-columns:1.15fr repeat(4,1fr);gap:10px;align-items:stretch;margin-bottom:8px}.ls-matrix-row>b{display:flex;align-items:center;font-size:17px;padding-left:12px}.ls-matrix-head span{color:#688079;font-size:12px;padding:0 12px}.ls-matrix-row button{border:1px solid transparent;text-align:left;background:#d8e9de;color:#25584b;padding:10px 12px;cursor:pointer}.ls-matrix-row button:hover,.ls-matrix-row button:focus-visible{border-color:#df694b;background:#c8e1d1;outline:2px solid #df694b;outline-offset:1px}.ls-matrix-row button.pending{background:#e9e8dd;color:#718078}.ls-matrix-row button strong,.ls-matrix-row button small{display:block}.ls-matrix-row button strong{font-size:14px}.ls-matrix-row button small{font-size:11px;margin-top:3px}.matrix-hint{font-size:12px;color:#657b74;margin-top:15px}.matrix-overlay{position:absolute;inset:0;background:rgba(10,32,29,.7);z-index:100;display:flex;justify-content:center;align-items:center;padding:24px}.matrix-dialog{width:780px;max-height:490px;background:#f7f7ee;box-shadow:0 18px 60px #102c2a70;padding:20px 25px;display:flex;flex-direction:column;color:#102c2a}.dialog-head{display:flex;justify-content:space-between;align-items:flex-start}.dialog-head small{font-size:10px;letter-spacing:.1em;color:#c65f42;font-weight:700}.dialog-head h2{font-size:26px!important;margin:4px 0 12px!important;color:#102c2a}.dialog-head h2 em{font-style:normal;color:#df694b}.close-button{border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#35554c;padding:0 3px}.dialog-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;border-top:1px solid #a9beb0;border-bottom:1px solid #a9beb0;padding:9px 0}.dialog-metrics small,.dialog-metrics b{display:block}.dialog-metrics small{font-size:10px;color:#698079}.dialog-metrics b{font-size:15px;margin-top:2px}.dialog-body{overflow-y:auto;min-height:0;padding:8px 4px 2px 0}.dialog-body>div{margin:8px 0}.dialog-body h3{font-size:13px;margin:0 0 3px;color:#b9573d}.dialog-body p{font-size:12px;line-height:1.45;margin:2px 0!important;color:#29433d}.dialog-body .source-path{font-size:10px;overflow-wrap:anywhere;color:#6b8078}.dialog-foot{font-size:10px;color:#687c75;border-top:1px solid #d0ddd0;padding-top:7px;margin-top:5px}
</style>
