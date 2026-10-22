<script setup>
import { computed, ref, watch } from 'vue'
import data from '../../content/posts/diffusion-depth-step/images/lift-grid.json'
const budget = ref(8.1)
const selected = ref(data.rows.find(p => p[0] === 25 && p[1] === 4))
const best = computed(() => [...data.rows].filter(p => p[2] <= budget.value).sort((a,b) => a[3] - b[3])[0])
watch(budget, () => { if (best.value) selected.value = best.value })
const point = (t,k) => data.rows.find(p => p[0] === t && p[1] === k)
const color = p => p[2] > budget.value ? '#edece6' : `hsl(194 25% ${34 + (p[3]-10.9)/38*42}%)`
</script>

<template>
  <div class="lift-demo" @keydown.stop @click.stop>
    <div class="toolbar"><label>预算上限 <select aria-label="每图计算预算" v-model.number="budget"><option v-for="b in [4,8.1,16,32,64,220]" :key="b" :value="b">{{ b }} TFLOPs / 图</option></select></label><span>纵 T · 横 K · 灰色超预算 · FID ↓</span></div>
    <div class="body">
      <div class="heatmap" role="group" aria-label="LiFT 实测深度与步数网格">
        <div class="axis">T / K</div><div v-for="k in [1,2,4,8,16,32]" :key="'h'+k" class="heading">{{ k }}</div>
        <template v-for="t in [10,25,50,100]" :key="t"><div class="heading row-heading">{{ t }}</div><button v-for="k in [1,2,4,8,16,32]" :key="t+'-'+k" type="button" :style="{background: color(point(t,k)), color: point(t,k)[2] > budget ? '#8a918e' : '#fff'}" :class="{selected:selected === point(t,k), best:best === point(t,k)}" :aria-label="`${t} 步 ${k} 轮，FID ${point(t,k)[3]}，${point(t,k)[2]} TFLOPs`" :aria-pressed="selected === point(t,k)" @click="selected=point(t,k)">{{ point(t,k)[3].toFixed(2) }}<span v-if="best === point(t,k)" class="best-mark">★</span></button></template>
      </div>
      <div class="detail" aria-live="polite">
        <div class="config">T = {{ selected[0] }} <span>×</span> K = {{ selected[1] }}</div>
        <div class="stats"><div><b>{{ selected[3].toFixed(3) }}</b><small>FID ↓</small></div><div><b>{{ selected[2].toFixed(3) }}</b><small>TFLOPs / 图</small></div></div>
        <div class="verdict"><strong>★ 预算内最佳：{{ best[0] }} 步 × {{ best[1] }} 轮</strong></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lift-demo{margin-top:10px}.toolbar{display:flex;align-items:center;justify-content:space-between;font-size:19px;margin-bottom:18px;color:#78878b}.toolbar label{display:flex;gap:12px;align-items:center;color:#385b6a;font-size:21px}.toolbar select{padding:5px 12px;font:inherit;background:#e8eef0;border:1px solid #b9cbcf;border-radius:5px;color:#385b6a}.toolbar>span{font-size:17px}.body{display:grid;grid-template-columns:1.65fr 1fr;gap:30px}.heatmap{display:grid;grid-template-columns:70px repeat(6,1fr);gap:6px;align-items:center}.heading{text-align:center;font-size:21px;color:#687f88;height:24px}.row-heading{height:auto;font-size:17px}.axis{white-space:nowrap;font-size:18px;color:#75878f}.heatmap button{height:49px;border-radius:5px;border:2px solid transparent;position:relative;font-family:inherit;font-size:21px;cursor:pointer;font-variant-numeric:tabular-nums}.heatmap button.selected{outline:2px solid #b56a47;outline-offset:1px;z-index:1}.best-mark{position:absolute;right:3px;top:0;font-size:14px;color:#ffe1b8}.detail{background:#eeede5;border-radius:12px;padding:20px 22px}.detail-label{font-size:18px;color:#7a898a;letter-spacing:2px}.config{font-size:25px;color:#2b5262;margin-top:8px;font-weight:600}.config span{font-size:18px;color:#97a6a7;margin:0 9px}.stats{display:flex;gap:25px;margin-top:17px}.stats b{display:block;font-size:32px;font-weight:600;color:#a45c3c}.stats small{font-size:18px;color:#819095}.verdict{border-top:1px solid #d7ded8;margin-top:17px;padding-top:12px;font-size:17px;color:#657e7b;line-height:1.9}.verdict strong{font-weight:500;color:#526a74}
</style>
