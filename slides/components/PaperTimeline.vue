<script setup>
import data from '../references/loop-diffusion-papers.json'
const direct = data.papers.filter(p => p.direct)
const visual = direct.filter(p => p.group === 'visual')
const recent = visual.filter(p => p.date >= '2026-09-30' && p.date <= '2026-10-13')
const rows = [data.papers.filter(p => p.date < '2026-09'), data.papers.filter(p => p.date >= '2026-09')]
</script>

<template>
  <div class="paper-timeline">
    <div class="timeline-stats">
      <div><b>{{ direct.length }}</b><span>篇直接相关工作</span></div>
      <div><b>{{ visual.length }}</b><span>篇涉及视觉生成</span></div>
      <div><b>{{ recent.length }}</b><span>篇视觉新作 / 两周</span></div>
    </div>
    <div v-for="(row,i) in rows" :key="i" class="timeline-row" :style="{'--columns':row.length}">
      <a v-for="p in row" :key="p.id" :href="p.url" target="_blank" rel="noopener" class="paper-card" :class="{adjacent: !p.direct, masked:p.group==='masked'}">
        <time :datetime="p.date">{{ p.date.slice(5).replace('-','.') }}</time>
        <strong>{{ p.name }}</strong>
        <span>{{ p.summary }}</span>
      </a>
    </div>
    <div class="timeline-caption">2026 年首发时间线 · 蓝：视觉 · 棕：语言／结构化生成 · 虚线：相邻工作，不计入 6 篇</div>
  </div>
</template>

<style scoped>
.timeline-stats{display:flex;gap:40px;align-items:center;margin:20px 0 29px}.timeline-stats>div{display:flex;gap:13px;align-items:center}.timeline-stats b{font-size:51px;line-height:1;color:#ac603e;font-weight:650}.timeline-stats span{font-size:20px;max-width:235px;line-height:1.45;color:#4a6671}.timeline-row{display:grid;grid-template-columns:repeat(var(--columns),1fr);gap:16px;position:relative;padding-top:12px;margin-top:17px}.timeline-row:before{content:'';position:absolute;left:0;right:0;top:0;height:2px;background:#b8c9cc}.paper-card{position:relative;display:flex;flex-direction:column;gap:6px;background:#e8eff0;border:1px solid #cad9dc!important;border-radius:10px;padding:11px 16px;text-decoration:none!important}.paper-card:before{content:'';position:absolute;left:23px;top:-17px;width:8px;height:8px;border-radius:50%;background:#58808d;box-shadow:0 0 0 4px #f8f6f0}.paper-card time{font-size:19px;color:#64818b;line-height:1.2}.paper-card strong{font-size:23px;color:#264e5f!important;font-weight:600;line-height:1.4}.paper-card span{font-size:18px;color:#617b84;line-height:1.4}.paper-card.masked{background:#f0e8dc;border-color:#e2d2bd!important}.paper-card.masked:before{background:#b4825b}.paper-card.masked strong{color:#8f6441!important}.paper-card.adjacent{background:transparent;border:1px dashed #aebbbd!important}.paper-card.adjacent strong{color:#71828a!important;font-size:21px}.timeline-caption{font-size:16px;color:#6b7e84;margin-top:18px}
</style>
