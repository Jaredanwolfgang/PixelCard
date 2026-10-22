<script setup>
import { computed, ref } from 'vue'
import data from '../references/arxiv-timeline.json'
const selected = ref(null)
const periods = [...Array.from({length:8},(_,i)=>({label:String(2018+i),prefix:String(2018+i)})),...Array.from({length:4},(_,i)=>({label:`Q${i+1}`,quarter:i+1}))]
const matches = (p,b) => b.prefix ? p.date.startsWith(b.prefix) : p.date.startsWith('2026') && Math.ceil(Number(p.date.slice(5,7))/3)===b.quarter
const bins = periods.map(b=>({...b,papers:data.papers.filter(p=>matches(p,b))})).map(b=>({...b,total:b.papers.length,direct:b.papers.filter(p=>p.direct).length}))
const rows = [bins.slice(0,8),bins.slice(8)]
const chosen = computed(()=>bins.find(b=>(b.prefix||`2026 ${b.label}`)===selected.value))
const choose = b => { selected.value=b.prefix||`2026 ${b.label}` }
</script>

<template>
  <div class="arxiv-timeline" @click.stop @keydown.stop @keydown.esc="selected=null">
    <div class="timeline-legend"><span class="general">● 广义 Loop / Recurrent Transformer</span><span class="diffusion">● 其中：Loop Diffusion / Flow</span></div>
    <div v-for="(row,r) in rows" :key="r" class="period-row">
      <div class="period-label"><b>{{ r===0 ? '2018–2025' : '2026' }}</b><span>{{ r===0 ? '每年' : '每季度' }}</span></div>
      <div class="period-track" :class="{quarterly:r===1}">
        <button v-for="b in row" :key="b.label" class="period" :aria-label="`${b.prefix||'2026 '+b.label}：广义 ${b.total} 篇，Loop Diffusion ${b.direct} 篇，查看清单`" @click="choose(b)">
          <div class="period-count"><b>{{ b.total }}</b><em>{{ b.direct }}</em></div>
          <div class="stems"><i :style="{height:(b.total/55*48)+'px'}"></i><i class="diffusion-stem" :style="{height:(b.direct/55*48)+'px'}"></i></div>
          <span class="period-dot"></span><time>{{ b.label }}</time><small v-if="b.label==='Q4'">截至 10/21</small>
        </button>
      </div>
    </div>
    <p class="sample-note">检索样本 {{ data.papers.length }} 篇 · 点击数字查看清单 · 0 表示样本未收录</p>
    <div v-if="chosen" class="timeline-dialog" role="region" :aria-label="selected+'论文清单'" @keydown.esc="selected=null">
      <div class="dialog-title"><b>{{ selected }} · {{ chosen.total }} 篇 / Diffusion {{ chosen.direct }} 篇</b><button aria-label="关闭论文清单" @click="selected=null">关闭 ×</button></div>
      <p>综述题名筛选＋补录；非 arXiv 全库统计</p>
      <div class="dialog-list"><a v-for="p in chosen.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><span>{{ p.title }}</span><b v-if="p.direct">Diffusion</b></a><p v-if="!chosen.total">当前样本没有收录该年度记录，不能据此认定该年没有相关工作。</p></div>
    </div>
  </div>
</template>

<style scoped>
.arxiv-timeline{position:relative;margin-top:14px}.timeline-legend{display:flex;gap:35px;font-size:21px;margin-bottom:13px}.general{color:#3d7182}.diffusion{color:#b06442}.period-row{display:flex;align-items:center;gap:22px;margin:10px 0}.period-label{width:132px;flex-shrink:0;display:flex;flex-direction:column;color:#68818a}.period-label b{font-size:22px;font-weight:550}.period-label span{font-size:19px;margin-top:2px}.period-track{display:grid;grid-template-columns:repeat(8,1fr);width:100%;gap:12px}.period-track.quarterly{grid-template-columns:repeat(4,1fr);gap:30px}.period{position:relative;display:flex;flex-direction:column;align-items:center;background:none;border:0;color:#486675;padding:0 0 4px;cursor:pointer;font:inherit}.period-count{display:flex;align-items:center;gap:13px;height:38px}.period-count b{font-size:32px;font-weight:600;color:#3d7182}.period-count em{font-size:24px;font-style:normal;color:#b06442}.stems{height:52px;display:flex;gap:9px;align-items:flex-end;justify-content:center;width:100%;border-bottom:2px solid #bacbc9}.stems i{display:block;width:10px;min-height:2px;background:#6a96a2;border-radius:3px 3px 0 0}.stems .diffusion-stem{background:#bd805b}.period-dot{width:8px;height:8px;background:#819d9f;border-radius:50%;margin-top:-5px}.period time{font-size:21px;margin-top:5px}.period small{font-size:16px;position:absolute;top:122px;color:#b06442;white-space:nowrap}.sample-note{font-size:18px!important;margin-top:21px!important;color:#72878e}.timeline-dialog{position:absolute;inset:-10px -2px -20px;background:#f8f6f0;z-index:4;border:1px solid #afc2c5;border-radius:10px;padding:20px 24px;box-shadow:0 10px 40px #20394325}.dialog-title{display:flex;align-items:center;justify-content:space-between;font-size:23px}.dialog-title>b{color:#3d7182}.dialog-title button{font:inherit;font-size:19px;color:#a56644;background:transparent;border:0;cursor:pointer}.timeline-dialog>p{font-size:18px;margin:8px 0 12px}.dialog-list{height:238px;overflow:auto;overscroll-behavior:contain}.dialog-list>a{display:grid;grid-template-columns:100px 1fr 80px;gap:15px;padding:8px 0;border-bottom:1px solid #d8dfdb;font-size:17px;text-decoration:none;color:#3d7182}.dialog-list time{color:#7f9095}.dialog-list b{font-size:15px;color:#b06442;font-weight:500}@media print{.timeline-dialog{display:none}}
</style>
