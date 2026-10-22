<script setup>
import { computed, ref, useId } from 'vue'
defineProps({showSource:{type:Boolean,default:true}})
function onKeydown(event) { if (!['Tab','Escape'].includes(event.key)) event.stopPropagation() }
const own = ref(3)
const perpendicular = ref(2)
const stage = ref(3)
const uid = useId().replace(/\W/g,'')
const endX = computed(() => 72 + own.value * 62)
const endY = computed(() => 218 - perpendicular.value * 75)
function preset(b) { own.value = 3; perpendicular.value = b; stage.value = 3 }
</script>

<template>
  <div class="xsa-demo" @click.stop @keydown="onKeydown">
    <div class="xsa-intro"><span>单个 token、单个 head · v̂ᵢ = vᵢ / ‖vᵢ‖</span><span>二维示例：v̂ᵢ = (1, 0)</span><PaperFigureDialog v-if="showSource" initial="fig2-sma" :figure-ids="['fig2-sma','fig2']" label="原论文结构 ↗" /></div>
    <div class="xsa-body">
      <div class="geometry">
        <svg viewBox="0 0 440 275" role="img" :aria-label="`二维向量示例：原输出 (${own}, ${perpendicular})，沿自身 value 的分量 (${own}, 0)，XSA 输出 (0, ${perpendicular})`">
          <defs><marker v-for="(color,key) in {axis:'#a3b5b8',original:'#48798c',removed:'#be815b',kept:'#588570'}" :key="key" :id="uid+key" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" :fill="color"/></marker></defs>
          <line x1="72" y1="218" x2="382" y2="218" class="axis" :marker-end="`url(#${uid}axis)`"/><line x1="72" y1="218" x2="72" y2="27" class="axis" :marker-end="`url(#${uid}axis)`"/>
          <text x="72" y="265" class="axis-label">自身 value 方向 v̂ᵢ</text><text x="86" y="32" class="axis-label">正交方向</text><text x="51" y="239" class="origin-label">0</text>
          <g v-if="stage>=2"><path :d="`M72 ${endY} H${endX} V218`" class="dashed"/><line v-if="own!==0" x1="72" y1="218" :x2="endX" y2="218" class="removed-vector" :marker-end="`url(#${uid}removed)`"/><text :x="Math.max(93,endX-27)" y="243" class="removed-label">pᵢ</text></g>
          <line v-if="own!==0||perpendicular!==0" x1="72" y1="218" :x2="endX" :y2="endY" class="original-vector" :style="{opacity:stage===3?.45:1}" :marker-end="`url(#${uid}original)`"/><text :x="endX+15" :y="endY-8" class="original-label">oᵢ</text>
          <g v-if="stage===3"><line v-if="perpendicular!==0" x1="72" y1="218" x2="72" :y2="endY" class="kept-vector" :marker-end="`url(#${uid}kept)`"/><circle v-else cx="72" cy="218" r="6" fill="#588570"/><text x="21" :y="perpendicular===0?198:endY+12" class="kept-label">{{ perpendicular===0 ? 'zᵢ = 0' : 'zᵢ' }}</text></g>
        </svg>
        <div class="coordinates" aria-live="polite"><span class="original">oᵢ = ({{ own }}, {{ perpendicular }})</span><span :class="['removed',{muted:stage<2}]">pᵢ = ({{ own }}, 0)</span><span :class="['kept',{muted:stage<3}]">zᵢ = (0, {{ perpendicular }})</span></div>
      </div>
      <div class="steps" role="group" aria-label="XSA 计算分步">
        <button class="step" :aria-pressed="stage===1" @click="stage=1"><span class="step-title">① Attention：加权汇总 token</span><b>oᵢ = Σⱼ αᵢⱼ vⱼ</b></button>
        <button class="step" :aria-pressed="stage===2" @click="stage=2"><span class="step-title">② 提取沿自身 value 的分量</span><b>pᵢ = (oᵢᵀv̂ᵢ) v̂ᵢ</b></button>
        <button class="step" :aria-pressed="stage===3" @click="stage=3"><span class="step-title">③ XSA：相减，得到正交输出</span><b>zᵢ = oᵢ − pᵢ</b></button>
      </div>
    </div>
    <div class="xsa-controls"><label>沿自身方向的分量 <input aria-label="XSA 示例沿自身方向的分量" v-model.number="own" type="range" min="0" max="4" step="1"/><output>{{ own }}</output></label><button :aria-pressed="perpendicular===2" @click="preset(2)">混合方向</button><button :aria-pressed="perpendicular===0" @click="preset(0)">完全平行 → z = 0</button></div>
  </div>
</template>

<style scoped>
.xsa-demo{background:#fff9;border:1px solid #d5ded9;border-radius:12px;padding:15px 20px;line-height:1.35}.xsa-intro{display:flex;justify-content:space-between;gap:20px;font-size:18px;color:#748b92;margin-bottom:10px}.xsa-intro>span:last-child{font-family:Georgia,"PingFang SC",serif;color:#a46b48}.xsa-body{display:grid;grid-template-columns:1fr 1.04fr;gap:28px;align-items:center}.geometry svg{width:100%;height:210px;display:block;overflow:visible}.geometry text{font-family:inherit}.axis{stroke:#a3b5b8;stroke-width:1.4}.axis-label{font-size:19px;fill:#7b9199}.origin-label{font-size:17px;fill:#96a7ac}.dashed{stroke:#b6c7c8;stroke-width:1.6;fill:none;stroke-dasharray:5 5}.removed-vector{stroke:#be815b;stroke-width:5}.original-vector{stroke:#48798c;stroke-width:4}.kept-vector{stroke:#588570;stroke-width:5}.original-label{fill:#48798c;font-size:25px}.removed-label{fill:#ae7049;font-size:24px}.kept-label{fill:#588570;font-size:23px}
.coordinates{display:flex;justify-content:space-between;gap:9px;font:20px Georgia,serif;white-space:nowrap}.original{color:#48798c}.removed{color:#ae7049}.kept{color:#588570}.muted{opacity:.22}.steps{display:grid;gap:9px}.step{display:flex;flex-direction:column;align-items:flex-start;gap:2px;border:1px solid #d4dfdc;border-radius:7px;background:#f0f2ed;padding:6px 12px;text-align:left;font:inherit;cursor:pointer;color:#486a79}.step[aria-pressed=true]{border-color:#648c96;background:#e6eeec}.step-title{font-size:21px}.step b{font:25px Georgia,serif;font-weight:500}.step small{font-size:17px;color:#728891}.xsa-controls{border-top:1px solid #dce4dc;margin-top:14px;padding-top:10px;display:flex;align-items:center;gap:9px}.xsa-controls label{display:flex;align-items:center;gap:12px;font-size:18px;color:#6b828b;margin-right:auto}.xsa-controls input{width:145px;accent-color:#b17951;cursor:ew-resize}.xsa-controls output{width:20px;font-size:21px;color:#a46b48;font-variant-numeric:tabular-nums}.xsa-controls button{font:inherit;font-size:18px;border:1px solid #bbcdcf;background:#edf2ef;border-radius:5px;color:#557785;padding:6px 10px;cursor:pointer}.xsa-controls button[aria-pressed=true]{background:#416f83;border-color:#416f83;color:#fff}
</style>
