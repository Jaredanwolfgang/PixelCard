<script setup>
import { computed, ref } from 'vue'
import data from '../references/arxiv-timeline.json'
const selected = ref(null)
const periods = [...Array.from({length:8},(_,i)=>({label:String(2018+i),prefix:String(2018+i)})),...Array.from({length:4},(_,i)=>({label:`2026 Q${i+1}`,quarter:i+1}))]
const matches = (p,b) => b.prefix ? p.date.startsWith(b.prefix) : p.date.startsWith('2026') && Math.ceil(Number(p.date.slice(5,7))/3)===b.quarter
const bins = periods.map((b,i)=>({...b,x:71+i*78,papers:data.papers.filter(p=>matches(p,b))})).map(b=>({...b,total:b.papers.length,direct:b.papers.filter(p=>p.direct).length}))
const chosen = computed(()=>bins.find(b=>b.label===selected.value))
const choose = b => { selected.value=b.label }
const release = data.contextEvents.find(e=>e.id==='gpt-6-astra')
const monthCount = month => data.papers.filter(p=>p.date.startsWith(month)).length
const diffusionTotal = data.papers.filter(p=>p.direct).length
const barHeight = n => n/60*130
</script>

<template>
  <div class="arxiv-timeline" @click.stop @keydown.stop @keydown.esc="selected=null">
    <div class="chart-legend"><span class="general">● Loop / Recurrent Transformer</span><span class="diffusion">● 其中：Diffusion / Flow</span></div>
    <div class="release-context"><span>8 月 {{ monthCount('2026-08') }} 篇 → 9 月 {{ monthCount('2026-09') }} 篇<span class="context-qualifier">（检索样本）</span></span><a :href="release.url" target="_blank" rel="noopener">9/3 · GPT-6 Astra 发布 ↗</a></div>
    <svg class="publication-chart" viewBox="0 0 1000 226" role="group" aria-labelledby="publication-chart-title publication-chart-desc">
      <title id="publication-chart-title">循环 Transformer 与 Loop Diffusion 预印本数量</title>
      <desc id="publication-chart-desc">2018–2025 各年和 2026 各季度统一在一个类别轴上；蓝色为广义集合，棕色为扩散子集。时间段长短不同，柱高表示样本数量，不表示发表速率。GPT-6 Astra 于第三季度内的 9 月 3 日发布，虚线不将整个第三季度视为发布之后。</desc>
      <g v-for="tick in [0,20,40,60]" :key="tick"><line x1="35" :y1="165-barHeight(tick)" x2="981" :y2="165-barHeight(tick)" class="chart-grid" /><text x="25" :y="171-barHeight(tick)" text-anchor="end" class="axis-tick">{{ tick }}</text></g>
      <line :x1="bins[10].x+1" y1="7" :x2="bins[10].x+1" y2="165" class="release-marker" /><text :x="bins[10].x-8" y="19" text-anchor="end" class="release-label">9/3 · Q3 内</text>
      <g v-for="b in bins" :key="b.label" class="chart-bin" role="button" tabindex="0" :aria-label="`${b.label}：广义 ${b.total} 篇，Loop Diffusion ${b.direct} 篇，查看清单`" @click="choose(b)" @keydown.enter.prevent="choose(b)" @keydown.space.prevent="choose(b)">
        <rect :x="b.x-34" y="26" width="71" height="192" class="hit-area" />
        <rect v-if="b.total" :x="b.x-23" :y="165-barHeight(b.total)" width="20" :height="barHeight(b.total)" rx="3" class="general-bar" /><text :x="b.x-13" :y="155-barHeight(b.total)" text-anchor="middle" class="general-count">{{ b.total }}</text>
        <rect v-if="b.direct" :x="b.x+7" :y="165-barHeight(b.direct)" width="20" :height="barHeight(b.direct)" rx="2" class="diffusion-bar" /><text v-if="b.direct" :x="b.x+17" :y="155-barHeight(b.direct)" text-anchor="middle" class="diffusion-count">{{ b.direct }}</text>
        <text :x="b.x" y="193" text-anchor="middle" class="period-label">{{ b.prefix || '2026' }}</text><text v-if="b.quarter" :x="b.x" y="217" text-anchor="middle" class="quarter-label">Q{{ b.quarter }}{{ b.quarter===4 ? '*' : '' }}</text>
      </g>
    </svg>
    <div class="research-gap"><p>本次收录 <b>{{ data.papers.length }}</b> 篇，其中 <b>{{ diffusionTotal }}</b> 篇直接涉及 Loop Diffusion。</p><strong>已有局部收益；机制与适用边界仍待系统验证。</strong></div>
    <div v-if="chosen" class="timeline-dialog" role="region" :aria-label="selected+'论文清单'">
      <div class="dialog-title"><b>{{ selected }} · {{ chosen.total }} 篇 / Diffusion {{ chosen.direct }} 篇</b><button aria-label="关闭论文清单" @click="selected=null">关闭 ×</button></div>
      <p>题名筛选＋补录，非全量；0 表示样本未收录</p>
      <div class="dialog-list"><a v-for="p in chosen.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><span>{{ p.title }}</span><b v-if="p.direct">Diffusion</b></a><p v-if="!chosen.total">当前样本没有收录该年度记录，不能据此认定该年没有相关工作。</p></div>
    </div>
  </div>
</template>

<style scoped>
.arxiv-timeline{position:relative;margin-top:6px}.chart-legend{display:flex;gap:33px;font-size:21px;margin-bottom:11px}.general{color:#3d7182}.diffusion{color:#b06442}.release-context{display:flex;align-items:center;justify-content:space-between;color:#627e88;font-size:20px;margin-bottom:3px}.release-context a{font-size:20px;color:#a56948!important}.context-qualifier{font-size:17px;color:#8c9c9d}.publication-chart{display:block;width:100%;height:auto;overflow:visible}.chart-grid{stroke:#d8e1dc;stroke-width:1}.axis-tick{font-size:17px;fill:#92a4a8}.release-marker{stroke:#b78b6c;stroke-width:1.4;stroke-dasharray:4 5}.release-label{font-size:17px;fill:#a57858;paint-order:stroke;stroke:#f8f6f0;stroke-width:6px;stroke-linejoin:round}.chart-bin{cursor:pointer;outline:none}.hit-area{fill:transparent;stroke:none}.chart-bin:hover .hit-area,.chart-bin:focus-visible .hit-area{fill:#e2e9e34d;stroke:#9eb6bc;stroke-width:1}.general-bar{fill:#6895a2}.diffusion-bar{fill:#bb7c55}.general-count{font-size:21px;fill:#3d7182;font-weight:600}.diffusion-count{font-size:20px;fill:#a56845;font-weight:500}.period-label{font-size:19px;fill:#526e7b}.quarter-label{font-size:17px;fill:#758a91}.research-gap{margin-top:8px;border-top:1px solid #dce2db;padding-top:11px}.research-gap p{margin:0 0 3px!important;font-size:24px;color:#587784}.research-gap b{font-size:30px;color:#a56845;font-weight:600}.research-gap strong{font-size:26px;color:#a56845;font-weight:500}.timeline-dialog{position:absolute;inset:-8px -2px 0;background:#f8f6f0;z-index:4;border:1px solid #afc2c5;border-radius:10px;padding:20px 24px;box-shadow:0 10px 40px #20394325}.dialog-title{display:flex;align-items:center;justify-content:space-between;font-size:23px}.dialog-title>b{color:#3d7182}.dialog-title button{font:inherit;font-size:19px;color:#a56644;background:transparent;border:0;cursor:pointer}.timeline-dialog>p{font-size:18px;margin:8px 0 12px}.dialog-list{height:255px;overflow:auto;overscroll-behavior:contain}.dialog-list>a{display:grid;grid-template-columns:100px 1fr 80px;gap:15px;padding:8px 0;border-bottom:1px solid #d8dfdb;font-size:17px;text-decoration:none;color:#3d7182}.dialog-list time{color:#7f9095}.dialog-list b{font-size:15px;color:#b06442;font-weight:500}@media print{.timeline-dialog{display:none}}
</style>
