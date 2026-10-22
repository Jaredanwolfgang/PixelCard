<script setup>
import { nextTick, ref } from 'vue'
const open = ref(false)
const trigger = ref(null)
const panel = ref(null)
const groups = [
  { title:'基本记号 · 全篇统一', url:'https://arxiv.org/html/2609.40305v1#S2', rows:[
    ['l','一次网络调用中的层位置；区分层索引与循环轮数。'],
    ['t','当前噪声水平或生成时间，表示生成轨迹上的位置。'],
    ['T','整条轨迹的采样更新次数，决定用多少步完成生成。'],
    ['K','一次预测中共享核心的总循环次数，改变内部计算深度。'],
    ['k','当前是第几轮，k = 1, …, K。'],
    ['A / B / C，N','前段 / 共享核心 / 后段；本汇报 N 为共享核心 B 的层数。Looped-DiT 原文用 N 表示总循环数、r 表示当前轮次，本汇报对应改记为 K、k。'],
    ['D','展开后的执行深度。本例 D = 6 + NK + 6；ELT 无这两个固定段，D = NK。'],
    ['xₜ / x₀','当前时间 t 的带噪状态 / 干净图像（或干净潜变量）。本图按 t 递减去噪；其他论文的时间约定可能相反。Δt 为相邻时间点的间隔，不必均匀。'],
    ['h⁽ᵏ⁾ / Hₗ','第 k 轮后的学生隐状态 / 教师第 l 层的隐状态。'],
    ['计数假设','本页每次采样更新调用模型一次，不另计 CFG；此时全程块执行数为 TD。多次函数求值或额外 CFG 分支需另计，块执行数不等于 FLOPs。'],
  ]},
  { title:'ELT · 循环出口与监督', url:'https://arxiv.org/html/2604.09168v3#S4', rows:[
    ['gΘ','含 N 层的共享核心变换；Θ 表示其参数。'],
    ['Kmax / Kint','最深出口 / 随机中间出口的循环次数。为统一记号，本文将 ELT 原文的 Lmax / Lint 改记为 Kmax / Kint；原文 N × L 在本文写作 N × K。'],
    ['x̂ₖ / λ','第 k 轮出口的预测 / 学生真值损失的权重；蒸馏项权重为 1−λ。'],
    ['ℒGT / ℒdist，sg','真值损失 / 蒸馏损失；sg 表示停止该目标分支的梯度。扩散损失中的 w(t) 是时间相关权重。'],
  ]},
  { title:'LiFT 与 Depth as Time · 两种内部坐标', url:'https://arxiv.org/html/2610.05538v1#S3.SS1', rows:[
    ['s','LiFT 的归一化深度坐标；不同 K 重新划分深度，最终均到 s = 1。不是外部生成时间 t。'],
    ['u₀ / u* / ūₛ','LiFT：初始速度预测 / 目标速度 / 深度 s 对应的参考目标；u₀ 下标 0 表示深度起点。'],
    ['τ / (τₐ, τᵦ)','Depth as Time 的内部时钟 / 当前共享块覆盖的内部时间区间；τ=l/L 标记教师计算进度，通过 AdaLN 条件化，不代表实际噪声水平。'],
    ['L / q','Depth as Time：教师总层数 / 每轮跨过的教师层数 q=L/K。原文步距 s 改记 q，避免与 LiFT 的深度坐标 s 混淆。'],
    ['h_k / H_{kq} / x₀ᵀ','Depth as Time：学生第 k 轮状态 / 对应教师层状态 / 教师最终样本；学生最终样本 z−v 的 v 由 h_K 经输出头得到。'],
    ['(t, r)','外部生成任务的起止时间；当前 Depth as Time 示例固定为 (1, 0)，不随内部循环 K 改变。'],
  ]},
  { title:'注意力与实验指标', url:'https://arxiv.org/html/2609.40305v1#S2.SS2', rows:[
    ['i / j / h','当前 token / 来源 token / attention head 的索引；h 作为 head 下标时，区别于隐状态 h⁽ᵏ⁾。'],
    ['u / Wq / Wk / Wv / Wₒ','归一化隐状态 / query、key、value 的投影参数 / 拼接多头后的输出投影。uᵢ 是当前 token 的表示。'],
    ['αᵢⱼ / vᵢ / v̂ᵢ','从 token i 到来源 j 的注意力权重 / 当前 token 自身的 value / 其单位向量 vᵢ / ‖vᵢ‖。'],
    ['oᵢ / pᵢ / zᵢ','注意力加权输出 / 沿自身 value 方向的分量 / 扣除该分量后的输出。pᵢ 为二维教学图的辅助记号。'],
    ['Gᵢ / w / b / σ','调节算子：门控时为标量，XSA 时为投影矩阵；w、b 是门控可学习参数，σ 为 sigmoid。I 为单位矩阵，ᵀ 表示转置。'],
    ['FID / TFLOPs / CFG','生成分布距离（越低越好）/ 10¹² 次浮点运算 / classifier-free guidance。TFLOPs 为计算量，不是实测延迟；CFG 可能增加模型计算。'],
  ]},
]
async function show() { open.value = true; await nextTick(); panel.value?.focus() }
function close() { open.value = false; trigger.value?.focus() }
function trap(event) {
  if (event.key !== 'Tab') return
  const nodes = panel.value?.querySelectorAll('button, [tabindex="0"]')
  if (!nodes?.length) return
  const first = nodes[0], last = nodes[nodes.length - 1]
  if (event.target === panel.value || (!event.shiftKey && event.target === last) || (event.shiftKey && event.target === first)) {
    event.preventDefault(); (event.shiftKey ? last : first).focus()
  }
}
</script>

<template>
  <button ref="trigger" class="notation-trigger" type="button" aria-haspopup="dialog" :aria-expanded="open" @click="show">全部记号 ↗</button>
  <div v-if="open" class="notation-shade" @click.self="close">
    <section ref="panel" class="notation-panel" role="dialog" aria-modal="true" aria-label="全篇参数与记号" tabindex="-1" @keydown.esc.stop.prevent="close" @keydown="trap">
      <header><div><b>全篇参数与记号</b><span>统一汇报记号；论文原有记号的对应关系另作说明。</span></div><button type="button" @click="close" aria-label="关闭记号表">关闭 ×</button></header>
      <div class="notation-scroll" tabindex="0">
        <section v-for="group in groups" :key="group.title"><h2><a :href="group.url" target="_blank" rel="noopener">{{ group.title }} ↗</a></h2><table><thead><tr><th scope="col">记号</th><th scope="col">在本汇报中的含义</th></tr></thead><tbody><tr v-for="row in group.rows" :key="row[0]"><th scope="row">{{ row[0] }}</th><td>{{ row[1] }}</td></tr></tbody></table></section>
        <p>来源：各节标题链接至原文；Depth as Time 另见第 14–15 页，指标出处见第 17 页。D、h⁽ᵏ⁾ 与统一后的 K 为汇报记号；本页 A/B/C = 6/5/6 沿用 Looped-DiT 的结构示例。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.notation-trigger{margin-left:auto;font:inherit;font-size:17px;white-space:nowrap;border:1px solid #bfcfd0;border-radius:6px;background:#edf2ef;color:#486d7b;padding:5px 10px;cursor:pointer}
.notation-shade{position:absolute;inset:15px;z-index:80;background:#20394380;border-radius:12px;padding:18px;display:flex}
.notation-panel{background:#f8f6f0;border:1px solid #cad6d3;border-radius:10px;padding:20px 24px;width:100%;display:flex;flex-direction:column;min-height:0;color:#294955;outline:none}
.notation-panel header{display:flex;justify-content:space-between;gap:20px;align-items:center;border-bottom:1px solid #d5ded9;padding-bottom:14px}.notation-panel header b{font-size:28px;font-weight:600}.notation-panel header span{display:block;font-size:17px;color:#71868e;margin-top:4px}.notation-panel header button{font:inherit;font-size:19px;background:#e6eeed;border:1px solid #b7cbd0;border-radius:6px;padding:7px 14px;white-space:nowrap;cursor:pointer;color:#416979}
.notation-scroll{overflow:auto;overscroll-behavior:contain;min-height:0;padding-right:8px}.notation-scroll h2{font-size:22px!important;margin:17px 0 9px!important;color:#a46846}.notation-scroll table{width:100%;border-collapse:collapse;font-size:19px;line-height:1.6;margin:0}.notation-scroll th,.notation-scroll td{border:1px solid #d9dfd9;padding:8px 12px;text-align:left}.notation-scroll thead{background:#e9eff0}.notation-scroll tbody th{width:210px;font-weight:500;font-family:Georgia,serif;color:#3e697b}.notation-scroll tbody tr:nth-child(even){background:#efeee7}.notation-scroll p{font-size:16px!important;color:#71868e;margin:16px 0!important}
</style>
