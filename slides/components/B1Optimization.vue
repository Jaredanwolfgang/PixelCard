<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
const props = defineProps({ group: { type: String, required: true } })
const selected = ref(null), closeButton = ref(null), lastButton = ref(null)
const entries = [
 {group:'compute', name:'KML BF16 GEMM', tag:'T06 · T07', old:'两次独立、反序的三步训练更新，KML 相对 Torch 耗时分别下降 46.91% 和 44.90%，完整状态对照通过。', conditions:'单进程合成门控 MLP，2048 token、H5120、I4352，本地 TP4 分片尺寸；32 worker，BF16 输入、FP32 累加。无 TP / FSDP 通信，不代表整模收益。', b1:'桥接源码迁入 experimental/；新环境需构建原生桥接，核验 ABI、数值、实际调用与性能。', source:'source/validation/hbm-vendor-training-results.md'},
 {group:'compute', name:'KuTACC GEMM', tag:'T06 · T07', old:'历史测试中投影更快，但完整 MLP 三步更新慢于 Torch：Torch 0.518329 秒，KuTACC + DDR arena 0.553721 秒，普通 KuTACC 0.570581 秒。', conditions:'独立进程、固定合成门控 MLP 及旧版线程和运行时；这是完整模块更新的负结果，保留作后续对照。', b1:'实验桥接和构建器已迁入；新运行时需重新构建、核验接口与整步性能。', source:'source/validation/hbm-vendor-training-results.md'},
 {group:'compute', name:'特定形状 VJP', tag:'T06 · T13', old:'独立确认中，单 decoder 层反向最大耗时由 76.199 秒降至 30.245 秒；128 rank 状态比较通过原容差。', conditions:'八节点 128 rank、TP4 / FSDP32、每 rank 37 线程，预训练第 45 层与 suffix128 loss；结果属于单层模块。', b1:'算子 VJP 实验源码已迁入；当前 FP32 数学接口、高阶导与函数变换等资格待补。', source:'source/validation/eight-node-vjp-confirm-results.json'},
 {group:'compute', name:'MoE 路由与分组', tag:'T06 · T25', old:'包含输入收集导数优化的专家模块完整更新，历史合成用例耗时下降 85.14%。', conditions:'固定 E256 / H64 / I32 / top8 的合成路由模块；真实大模型专家并行收益尚待验证。', b1:'分组计算及相关导数源码已迁入；需核验 B1 数值、覆盖和真实工作负载。', source:'source/docs/optimization-results.md'},
 {group:'compute', name:'SwiGLU 融合', tag:'T09', old:'KuTACC 调度的浮点前后向与训练参数、梯度语义通过旧版验证。', conditions:'旧原生 profile 为四核、512-bit SVE 和硬件 BF16；Tensor 子类使用 PyTorch 表达式回退。', b1:'融合源码已迁入；需重新验证通用 shape / layout、各精度和新运行时。', source:'source/docs/optimization-results.md；source/docs/compatibility.md'},
 {group:'compute', name:'RMSNorm', tag:'T10', old:'KuTACC 调度的浮点前后向与训练参数、梯度语义通过旧版验证。', conditions:'旧原生 profile 为四核 SVE / BF16；接口使用零中心 offset 参数，乘性权重需转换。', b1:'RMSNorm 原生实现已迁入；新运行时与精度、形状覆盖待重新验证。', source:'source/docs/optimization-results.md；source/docs/usage.md'},
 {group:'compute', name:'因果卷积', tag:'T11 · T14', old:'展开计算和 autocast 参数桥接通过前后向及恢复组合检查。', conditions:'旧版因果卷积及对应训练组合；FP32 VJP 快路径保留特定尺寸限制。', b1:'卷积与 autocast 桥接源码已迁入；需核对旧尺寸、dtype 及新运行时的适用性。', source:'source/docs/optimization-results.md；docs/b1-initial-optimization-baseline.md'},
 {group:'compute', name:'Gated Delta', tag:'T12 · T13', old:'长 BF16 模块直接对照耗时下降 24.30% / 24.97%，由两个独立节点确认。', conditions:'合并三角求解并简化递推图；结果限定于旧版长 BF16 模块，不能直接推算整模收益。', b1:'递推和求解实现已迁入；需在 B1 重新验证形状、精度、梯度及性能。', source:'source/docs/optimization-results.md'},
 {group:'runtime', name:'HMPI 后端', tag:'T16 · T17', old:'旧版字节传输、缓冲生命周期及小模型跨节点正确性通过。', conditions:'可选 C++ 后端，需独立构建并匹配 MPI、Gloo 与 PyTorch C++ ABI；旧结果不等于新环境性能。', b1:'HMPI Python 包装与 C++ 后端已迁入；新 Torch ABI、四精度归约与 Work 生命周期待验证。', source:'source/docs/optimization-results.md；source/docs/compatibility.md'},
 {group:'runtime', name:'Gloo ring 布局', tag:'T16', old:'归档包含 ring shard 布局相关机制与验证材料；迁入映射未给出可单独归因的性能结果。', conditions:'按旧实现的分片布局与接口使用；与 HMPI 后端和 FSDP 策略分别核对。', b1:'布局头文件已迁入；需按新通信合同验证数据类型、布局和生命周期。', source:'docs/b1-initial-optimization-baseline.md'},
 {group:'runtime', name:'FSDP scratch 池', tag:'T04 · T19', old:'旧版 FSDP scratch 缓冲生命周期及小模型跨节点正确性通过。', conditions:'显式复用 AllGather scratch，CPU copy-out 完成后归还租约；旧结果受旧版 FSDP 接口约束。', b1:'缓冲池与生命周期合同源码已迁入；新 FSDP 内部接口和复用行为待核验。', source:'source/docs/optimization-results.md；source/docs/compatibility.md'},
 {group:'runtime', name:'HugeTLB / HBM', tag:'T04', old:'旧实验验证所有权、驻留、释放与通信 scratch 正确性；汇总记录的限定实验收益为 1.258%。', conditions:'显式实验接口，默认关闭；使用前检查可用 NUMA、大页、DDR 策略与实际驻留。该数值不能推广为 HBM 训练收益。', b1:'大页、HBM 和 ScratchArena 代码已迁入；需在 B1 核对资源、驻留、生命周期和性能。', source:'source/docs/optimization-results.md；source/docs/compatibility.md'},
 {group:'runtime', name:'绑核与运行时检查', tag:'T01 · T02 · T03', old:'旧版保留原生线程池、绑核和运行时身份检查；已有小模型验证按固定资源配置执行。', conditions:'原生接口的既有 profile 使用四核、SVE / BF16；线程数、CPU 范围、SDK 或源码变化均需重新验证。', b1:'资源辅助与身份检查已迁入；新构建的运行时 profile、合法 mask 与线程策略待建立。', source:'source/docs/compatibility.md；docs/b1-initial-optimization-baseline.md'},
 {group:'runtime', name:'数据打包与缓存', tag:'T23', old:'旧版对每个模型独立处理 Dolly 的 15,011 行，各生成 1,365 × 2,048 的 packed / cache，并核对 token 与 label 对应。', conditions:'使用各模型独立 tokenizer snapshot；结果是数据准备与一致性检查，不是训练吞吐收益。', b1:'SFT 打包、缓存和顺序控制代码已迁入；新基线按冻结的数据身份与任务合同接线。', source:'source/docs/optimization-results.md'},
 {group:'runtime', name:'Checkpoint 与恢复', tag:'T24', old:'缩小 Qwen 双节点训练 100 步，以及跨作业 DCP 从第 50 步恢复到第 100 步，状态、控制与 RNG 一致。', conditions:'适用于旧版缩小模型和相应 checkpoint 格式；完整模型恢复仍待验证。', b1:'控制状态、原子发布和严格加载源码已迁入；与 B0 恢复合同及新 checkpoint 格式的对接待验证。', source:'source/docs/optimization-results.md；docs/b1-initial-optimization-baseline.md'}
]
const items = computed(() => entries.filter(x => x.group === props.group))
function open(event, item) { lastButton.value = event.currentTarget; selected.value = item; nextTick(() => closeButton.value?.focus()) }
function close() { selected.value = null; nextTick(() => lastButton.value?.focus()) }
function onKey(event) { if (event.key === 'Escape' && selected.value) { event.stopPropagation(); close() } }
onMounted(() => window.addEventListener('keydown', onKey, true))
onUnmounted(() => window.removeEventListener('keydown', onKey, true))
</script>
<template>
<div class="b1-interactive" @click.stop @keydown.stop>
 <div class="b1-items"><button v-for="item in items" :key="item.name" :aria-label="`查看 ${item.name} 的旧实验与 B1 状态`" @click="open($event,item)"><span>{{ item.tag }}</span><strong>{{ item.name }}</strong><small>查看旧结果与 B1 状态 ↗</small></button></div>
 <div class="b1-hint">点击各项查看历史结果、适用条件与 B1 验证状态。</div>
 <div v-if="selected" class="b1-overlay" @click.self="close"><section class="b1-dialog" role="dialog" aria-modal="true" aria-labelledby="b1-dialog-title">
  <div class="b1-dialog-head"><div><small>旧版证据 / B1 迁入 · {{ selected.tag }}</small><h2 id="b1-dialog-title">{{ selected.name }}</h2></div><button ref="closeButton" class="b1-close" aria-label="关闭详情" @click="close">×</button></div>
  <div class="b1-dialog-body"><div><h3>旧版本实验结果</h3><p>{{ selected.old }}</p></div><div><h3>适用条件</h3><p>{{ selected.conditions }}</p></div><div><h3>B1 当前验证状态</h3><p>{{ selected.b1 }}</p></div><div><h3>记录来源</h3><p class="b1-source">{{ selected.source }}</p><p class="b1-source">source/ 指旧版归档 legacy/torch-cpu-opt-20261103-3eb140d9/source/；docs/ 指项目主仓文档。</p></div></div>
  <div class="b1-dialog-foot">旧环境结果与 B1 新环境资格分别记录 · 按 Esc 返回</div>
 </section></div>
</div>
</template>
<style scoped>
.b1-interactive{margin-top:12px}.b1-items{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.b1-items button{text-align:left;border:1px solid #bccfc0;background:#e1eee4;color:#143a30;padding:12px 13px;min-height:99px;cursor:pointer}.b1-items button:hover,.b1-items button:focus-visible{outline:2px solid #df694b;outline-offset:1px;background:#d4e8d8}.b1-items span,.b1-items strong,.b1-items small{display:block}.b1-items span{font-size:10px;color:#b6573d}.b1-items strong{font-size:15px;margin:7px 0 4px}.b1-items small{font-size:10px;color:#61796f}.b1-hint{margin-top:17px;font-size:12px;color:#647b72}.b1-overlay{position:absolute;inset:0;background:rgba(10,32,29,.7);z-index:100;display:flex;justify-content:center;align-items:center;padding:24px}.b1-dialog{width:780px;max-height:490px;background:#f7f7ee;box-shadow:0 18px 60px #102c2a70;padding:20px 25px;display:flex;flex-direction:column;color:#102c2a}.b1-dialog-head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #a9beb0}.b1-dialog-head small{font-size:10px;letter-spacing:.08em;color:#c65f42;font-weight:700}.b1-dialog-head h2{font-size:25px!important;margin:5px 0 12px!important;color:#102c2a}.b1-close{border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#35554c;padding:0 3px}.b1-dialog-body{overflow-y:auto;min-height:0;padding:5px 4px 2px 0}.b1-dialog-body>div{margin:10px 0}.b1-dialog-body h3{font-size:13px;margin:0 0 4px;color:#b9573d}.b1-dialog-body p{font-size:13px;line-height:1.5;margin:0!important;color:#29433d}.b1-dialog-body .b1-source{font-size:10px;color:#6b8078;overflow-wrap:anywhere}.b1-dialog-foot{font-size:10px;color:#687c75;border-top:1px solid #d0ddd0;padding-top:7px;margin-top:5px}
</style>
