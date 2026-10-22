<script setup>
import { nextTick, ref, useId } from 'vue'
const mode = ref('xsa')
const xsaOpen = ref(false)
const xsaDialog = ref(null)
let xsaTrigger = null
async function showXsa(event) {
  mode.value = 'xsa'
  xsaTrigger = event.currentTarget
  xsaOpen.value = true
  await nextTick()
  xsaDialog.value?.focus()
}
function closeXsa() { xsaOpen.value = false; xsaTrigger?.focus() }
function trapXsa(event) {
  if (event.key !== 'Tab') return
  const nodes = xsaDialog.value?.querySelectorAll('button, input, a[href], [tabindex="0"]')
  if (!nodes?.length) return
  const first = nodes[0], last = nodes[nodes.length - 1]
  if (event.target === xsaDialog.value || (!event.shiftKey && event.target === last) || (event.shiftKey && event.target === first)) {
    event.preventDefault(); (event.shiftKey ? last : first).focus()
  }
}
const uid = useId().replace(/\W/g,'')
</script>

<template>
  <div class="sma-demo" @click.stop @keydown.stop>
    <div class="sma-controls"><span>B 内 · Softmax 管来源权重，SMA 管写回更新</span><PaperFigureDialog initial="fig2-sma" :figure-ids="['fig2-sma','fig2']" label="论文图 2 ↗" /><button :aria-pressed="mode==='gate'" @click="mode='gate'">Gated Attention</button><button :aria-pressed="mode==='xsa'" aria-haspopup="dialog" :aria-expanded="xsaOpen" @click="showXsa">XSA · 展开 ↗</button></div>
    <svg viewBox="0 0 1000 390" role="group" :aria-label="mode==='xsa' ? 'XSA：当前 token 的 value 定义投影，作用于注意力输出之后、拼接头和输出投影之前' : '门控注意力：当前 token 隐状态产生可学习标量门控，缩放注意力头输出'">
      <defs><marker :id="uid+'arrow'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#8da4aa" /></marker><marker :id="uid+'blue'" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#416f83" /></marker></defs>
      <text x="192" y="21" class="caption" text-anchor="middle">u：归一化 token 表示</text>
      <path d="M192 29 V40 H72 V52 M192 29 V52 M192 40 H312 V52" class="wire" :marker-end="`url(#${uid}arrow)`" />
      <g v-for="(name,i) in ['Wq','Wk','Wv']" :key="name"><rect :x="25+120*i" y="54" width="94" height="40" rx="7" class="node"/><text :x="72+120*i" y="82" text-anchor="middle" class="math">{{ name }}</text><line :x1="72+120*i" y1="95" :x2="72+120*i" y2="115" class="wire" :marker-end="`url(#${uid}arrow)`" /></g>
      <rect x="25" y="119" width="334" height="58" rx="8" class="node" /><text x="192" y="155" text-anchor="middle" class="main-text">Scaled Dot-Product Attention</text>
      <line x1="192" y1="178" x2="192" y2="218" class="wire" :marker-end="`url(#${uid}arrow)`" /><text x="215" y="207" class="math">oᵢ = Σⱼ αᵢⱼ vⱼ</text>
      <circle cx="192" cy="239" r="18" class="operator"/><text x="192" y="250" class="times" text-anchor="middle">×</text>
      <line x1="192" y1="258" x2="192" y2="284" class="wire" :marker-end="`url(#${uid}arrow)`" /><text x="215" y="277" class="math blue">zᵢ = Gᵢ oᵢ</text>
      <rect x="65" y="288" width="254" height="38" rx="7" class="node"/><text x="192" y="315" text-anchor="middle" class="main-text">Concat Heads</text>
      <line x1="192" y1="327" x2="192" y2="346" class="wire" :marker-end="`url(#${uid}arrow)`"/><rect x="145" y="350" width="94" height="37" rx="7" class="node"/><text x="192" y="377" text-anchor="middle" class="math">Wₒ</text><text x="260" y="376" class="caption">输出投影 → 写回残差流</text>
      <g :style="{opacity:mode==='gate'?1:.75}"><path d="M240 16 H440 V77 H488" class="condition" :marker-end="`url(#${uid}blue)`"/><text x="418" y="51" class="source-label">uᵢ</text><rect x="493" y="32" width="470" height="107" rx="10" class="option"/><text x="516" y="63" class="option-title">Gated Attention</text><text x="516" y="91" class="caption">按当前 token 自适应减弱更新强度</text><text x="516" y="122" class="formula">Gᵢ = σ(wᵀuᵢ + b)</text></g>
      <text x="720" y="169" text-anchor="middle" class="or">两种实现，二选一</text>
      <g class="xsa-module" role="button" tabindex="0" aria-label="展开 XSA 投影演示" aria-haspopup="dialog" :aria-expanded="xsaOpen" :style="{opacity:mode==='xsa'?1:.75}" @click="showXsa" @keydown.enter.stop.prevent="showXsa" @keydown.space.stop.prevent="showXsa"><path d="M312 96 H413 V236 H488" class="condition" :marker-end="`url(#${uid}blue)`"/><text x="421" y="218" class="source-label">vᵢ</text><rect x="493" y="190" width="470" height="112" rx="10" class="option"/><text x="516" y="223" class="option-title">Exclusive Self-Attention</text><text x="949" y="221" text-anchor="end" class="expand-hint">展开 ↗</text><text x="516" y="251" class="caption">不加参数，过滤沿自身 value 的写入</text><text x="516" y="285" class="formula">Gᵢ = I − v̂ᵢv̂ᵢᵀ</text></g>
      <path :d="`M963 ${mode==='gate'?85:246} H985 V329 H388 V239 H214`" class="condition" :marker-end="`url(#${uid}blue)`"/><text x="365" y="265" class="source-label">Gᵢ</text>
      <text x="493" y="365" class="bottom-note">Loop：共享权重，逐轮重算调节量</text>
    </svg>
    <div class="sma-benefit"><div><b>{{ mode==='xsa' ? 'XSA：约束写回方向，无新增参数' : 'Gated：学习按当前状态放轻更新' }}</b></div><div class="sma-evidence"><span>无深监督：56.2 → <b>{{ mode==='xsa' ? '58.5' : '56.6' }}</b></span><PaperFigureDialog initial="table4" :figure-ids="['table4']" label="消融原表 ↗" /></div></div>
    <div v-if="xsaOpen" class="xsa-shade" @click.self="closeXsa">
      <section ref="xsaDialog" class="xsa-dialog" role="dialog" aria-modal="true" aria-label="XSA 投影演示" tabindex="-1" @keydown.esc.stop.prevent="closeXsa" @keydown="trapXsa">
        <header><h2>XSA：扣掉沿自身 value 的输出分量</h2><button type="button" aria-label="关闭 XSA 投影演示" @click="closeXsa">返回结构图 ×</button></header>
        <div class="xsa-content"><AttentionProjection :show-source="false" /><p class="xsa-key-point">权重 α 不变；其他 token 沿 vᵢ 的分量也会被扣掉。</p></div>
        <footer><span>二维示意，非实验数据 · 约束 Wₒ 前的 head 输出</span><a href="https://arxiv.org/html/2609.40305v1#S6.SS3" target="_blank" rel="noopener">Looped-DiT 附录 §6.3 ↗</a></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.xsa-module{cursor:pointer;outline:none}.xsa-module:hover .option,.xsa-module:focus-visible .option{stroke:#a56c4b;stroke-width:3}.expand-hint{font-size:17px;fill:#a56c4b}.xsa-shade{position:absolute;inset:15px;z-index:80;background:#20394380;padding:16px;border-radius:12px;display:flex}.xsa-dialog{background:#f8f6f0;border:1px solid #c9d6d3;border-radius:10px;padding:18px 22px;width:100%;min-height:0;display:flex;flex-direction:column;gap:16px;outline:none}.xsa-dialog header{display:flex;align-items:center;justify-content:space-between;gap:18px}.xsa-dialog header h2{font-size:28px;margin:0!important;line-height:1.35}.xsa-dialog header button{font:inherit;font-size:18px;color:#416f83;background:#edf2ef;border:1px solid #bbced0;border-radius:6px;padding:7px 12px;cursor:pointer;white-space:nowrap}.xsa-content{min-height:0;overflow-y:auto;overscroll-behavior:contain;flex:1}.xsa-dialog .xsa-key-point{font-size:23px;color:#a46b48;line-height:1.4;margin:13px 0 0!important}.xsa-dialog footer{font-size:17px;line-height:1.4;color:#718991;display:flex;justify-content:space-between;gap:16px}.xsa-dialog footer a{white-space:nowrap}
.sma-controls{display:flex;align-items:center;gap:8px;margin-bottom:9px}.sma-controls>span{font-size:19px;color:#738991;margin-right:auto}.sma-controls button{font:inherit;font-size:18px;padding:5px 12px;background:#edf1ef;border:1px solid #bfd0d2;border-radius:6px;color:#527584;cursor:pointer}.sma-controls button[aria-pressed=true]{background:#416f83;color:white}
.sma-benefit{display:flex;justify-content:space-between;align-items:center;gap:22px;border-top:1px solid #d4ded8;padding-top:9px;margin-top:8px}.sma-benefit b{display:block;font-size:23px;line-height:1.3;color:#a56c4b;font-weight:500}.sma-benefit>div>span{display:block;font-size:17px;color:#768c93;margin-top:3px;line-height:1.3}.sma-evidence{display:flex;align-items:center;gap:12px}.sma-evidence>span{font-size:18px!important;white-space:nowrap}.sma-evidence b{display:inline;font-size:25px}.sma-demo svg{width:100%;height:315px;display:block;overflow:visible}.sma-demo svg text{font-family:inherit}.wire{fill:none;stroke:#8da4aa;stroke-width:2}.node{fill:#fff9;stroke:#bdc9c8;stroke-width:2}.condition{fill:none;stroke:#416f83;stroke-width:2.7;stroke-linejoin:round}.option{fill:#e9f0f2;stroke:#81a7b6;stroke-width:2;stroke-dasharray:5 4}.operator{stroke:#416f83;stroke-width:2.5;fill:#f8f6f0}.caption{font-size:21px;fill:#71868f}.main-text{font-size:23px;fill:#344f5b}.math{font-size:25px;fill:#58727e;font-family:Georgia,serif!important}.blue{fill:#416f83}.times{font-size:37px;fill:#416f83}.option-title{font-size:26px;fill:#315a6b;font-weight:600}.formula{font-size:28px;fill:#315a6b;font-family:Georgia,serif!important}.or{font-size:20px;fill:#a56c4b}.source-label{font-size:23px;fill:#416f83;font-family:Georgia,serif!important}.bottom-note{font-size:22px;fill:#a56c4b}
</style>
