<script setup>
import katex from 'katex'
const math = (s) => katex.renderToString(s, { throwOnError: true, output: 'htmlAndMathml' })
const rows = [
  { prefix: '\\mathcal L =', formula: '\\mathcal L_{\\mathrm{GT}}(\\hat x_{K_{\\max}},x_0)', title: '① 深出口学真值', note: '始终保留；沿完整循环路径回传。' },
  { prefix: '+', formula: '\\lambda\\,\\mathcal L_{\\mathrm{GT}}(\\hat x_{K_{\\mathrm{int}}},x_0)', title: '② 浅出口学真值', note: '训练初期为主；沿浅出口路径回传。' },
  { prefix: '+', formula: '(1-\\lambda)\\,\\mathcal L_{\\mathrm{dist}}(\\hat x_{K_{\\mathrm{int}}},\\operatorname{sg}(\\hat x_{K_{\\max}}))', title: '③ 浅出口学深出口', note: '后期为主；蒸馏只沿浅路径回传。' },
]
</script>

<template>
  <div class="elt-loss" @click.stop @keydown.stop>
    <div class="loss-rows" aria-label="ELT 三项损失及各自学习目标">
      <div v-for="row in rows" :key="row.title" class="loss-row">
        <div class="loss-formula"><span class="loss-prefix" v-html="math(row.prefix)" /><span v-html="math(row.formula)" /></div>
        <div class="loss-goal"><b>{{ row.title }}</b><span>{{ row.note }}</span></div>
      </div>
    </div>
    <div class="sg-strip"><div><b>sg：本步把深出口的预测当作标签</b><span>只截断蒸馏目标分支；深出口仍学真值，共享权重持续更新。</span></div><ELTStopGradient /></div>
    <div class="loss-curriculum"><span>浅出口：<b>λ = 1 · 学真值</b></span><i>随训练线性过渡 →</i><b>λ = 0 · 学教师</b></div>
    <div class="loss-origin"><span>联合训练去噪器 500K updates · 复用预训练 VAE</span><PaperFigureDialog paper="elt" initial="fig13" :figure-ids="['fig13','algorithm2']" label="多出口 / ILSD 消融 ↗" /></div>
  </div>
</template>

<style scoped>
.loss-rows{border:1px solid #d6dfda;border-radius:10px;overflow:hidden;background:#fff8}
.loss-row{display:grid;grid-template-columns:58% 42%;align-items:center;min-height:74px;border-bottom:1px solid #d6dfda}.loss-row:last-child{border-bottom:0;background:#e8eff099}
.loss-formula{display:flex;align-items:center;gap:13px;padding:12px 12px 12px 18px;font-size:24px;color:#355f70}.loss-formula :deep(.katex){font-size:1.12em}.loss-prefix{width:66px;flex-shrink:0;text-align:right}
.loss-goal{padding:6px 12px 6px 20px;border-left:1px solid #d6dfda;line-height:1.3}.loss-goal b{font-size:23px;font-weight:600;color:#416b7b}.loss-goal span{display:block;font-size:19px;color:#71868d;margin-top:3px}
.sg-strip{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:10px;padding:8px 16px;background:#eeeade;border-radius:8px;line-height:1.4}.sg-strip b{display:block;font-size:22px;font-weight:500;color:#a06242}.sg-strip span{display:block;font-size:18px;color:#6b8188;margin-top:3px}
.loss-curriculum{display:flex;justify-content:center;align-items:center;gap:26px;font-size:22px;line-height:1.4;margin-top:10px;color:#6d858c}.loss-curriculum b{font-weight:500;color:#a06242}.loss-curriculum i{font-style:normal;font-size:19px}
.loss-origin{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;font-size:18px;line-height:1.4;color:#71868d}
</style>
