<script setup>
import { useId } from 'vue'
const budget = defineModel({type:Number,default:2})
const uid = useId().replace(/\W/g,'')
const centers=[190,390,590,790]
</script>

<template>
  <div class="anytime-demo" @keydown.stop @click.stop>
    <div class="anytime-controls"><label>调用方给定循环预算 K <input v-model.number="budget" aria-label="Anytime 推理循环预算 K" type="range" min="1" max="4" step="1"/><output>{{ budget }}</output></label><PaperFigureDialog paper="elt" initial="fig2" :figure-ids="['fig2','fig1','fig3','algorithm2']" label="Anytime 原图 / 算法 ↗" /></div>
    <svg viewBox="0 0 1000 220" role="img" :aria-label="`同一模型和同一带噪输入，按外部给定预算执行 ${budget} 轮，仅在该轮经共享输出头预测，随后更新采样状态`">
      <defs><marker :id="uid+'arrow'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#89a1a8"/></marker></defs>
      <text x="38" y="72" class="input">xₜ</text><line x1="69" y1="63" x2="115" y2="63" class="arrow" :marker-end="`url(#${uid}arrow)`"/>
      <text x="490" y="16" text-anchor="middle" class="shared">同一个 checkpoint · 同一外部时间 t · 同一套共享权重</text>
      <g v-for="(x,i) in centers" :key="x" :style="{opacity:i>=budget?.23:1}"><rect :x="x-70" y="35" width="140" height="56" rx="8" fill="#4d7888"/><text :x="x" y="72" text-anchor="middle" class="core">gΘ</text><text :x="x" y="113" text-anchor="middle" class="round">第 {{ i+1 }} 轮</text><line v-if="i<3" :x1="x+74" y1="63" :x2="x+122" y2="63" class="arrow" :marker-end="`url(#${uid}arrow)`"/></g>
      <g v-for="(x,i) in centers" :key="'head'+x" :style="{opacity:i+1===budget?1:.23}"><line :x1="x" y1="119" :x2="x" y2="140" class="arrow" :marker-end="`url(#${uid}arrow)`"/><rect :x="x-75" y="147" width="150" height="37" rx="6" fill="#dce8e1"/><text :x="x" y="173" text-anchor="middle" class="head">共享输出头</text><text :x="x" y="211" text-anchor="middle" class="exit">{{ i+1===budget ? `K = ${i+1} → 采样更新` : `K = ${i+1} 可选` }}</text></g>

    </svg>
    <div class="anytime-meaning"><b>Anytime = 一次训练，多个可用的计算预算</b><span>每次调用只执行选定出口；K 可由外部更改，论文未学习自动停机策略。</span></div>
  </div>
</template>

<style scoped>
.anytime-demo{border:1px solid #d7e0da;border-radius:10px;padding:12px 20px;background:#fff9;line-height:1.35}.anytime-controls{display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:21px;color:#416c7c}.anytime-controls label{display:flex;align-items:center;gap:15px}.anytime-controls input{width:170px;accent-color:#507e8d;cursor:ew-resize}.anytime-controls output{font-size:25px;font-weight:600;min-width:22px}.anytime-demo svg{display:block;width:100%;height:190px;margin-top:10px}.anytime-demo text{font-family:inherit}.arrow{stroke:#89a1a8;stroke-width:2;fill:none}.input{font-size:29px;fill:#4d7888}.shared{font-size:19px;fill:#7f959d}.core{font-size:30px;fill:#fff;font-family:Georgia,serif!important}.round{font-size:19px;fill:#6c8790}.head{font-size:21px;fill:#52796c}.exit{font-size:22px;fill:#a96c49}.update{font-size:20px;fill:#79919a}.anytime-meaning{border-top:1px solid #dbe3dc;margin-top:7px;padding-top:10px}.anytime-meaning b{display:block;font-size:25px;font-weight:500;color:#a46b48}.anytime-meaning span{display:block;font-size:19px;color:#718b93;margin-top:6px;line-height:1.4}
</style>
