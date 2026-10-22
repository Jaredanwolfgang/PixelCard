<script setup>
import katex from 'katex'
import LiftVelocityExample from './LiftVelocityExample.vue'
import PaperFigureDialog from './PaperFigureDialog.vue'
const math = (s) => katex.renderToString(s, { throwOnError: true, output: 'htmlAndMathml' })
const trajectory = String.raw`\mathcal L_{\mathrm{LiFT}}=\mathbb E\!\left[\frac{1}{K_{\mathrm{train}}}\sum_{k=1}^{K_{\mathrm{train}}}\frac{\|u_k-\bar u_{s_k}\|_2^2}{d}\right]`
const total = String.raw`\mathcal L_{\mathrm{train}}=\mathcal L_{\mathrm{LiFT}}+\lambda\,\mathbb E\!\left[\frac{\|u_0-u^\star\|_2^2}{d}\right]`
</script>

<template>
  <div class="lift-training" @click.stop @keydown.stop>
    <div class="original-control"><PaperFigureDialog paper="lift" initial="fig2" :figure-ids="['fig2']" label="查看论文原图 · Figure 2 ↗" /></div>
    <LiftVelocityExample />
    <div class="training-objective" aria-label="LiFT 完整训练目标：深度轨迹损失与初始预测辅助损失">
      <div class="objective-row"><span class="objective-math" v-html="math(trajectory)" /><span class="objective-goal">各轮预测 → 对应参考速度</span></div>
      <div class="objective-row"><span class="objective-math" v-html="math(total)" /><span class="objective-goal">初始预测 → 目标速度<br><small>主实验 λ = 0.01</small></span></div>
    </div>
  </div>
</template>

<style scoped>
.original-control{height:0;line-height:0}.original-control :deep(.figure-trigger){position:absolute;right:48px;top:35px}
.training-objective{border-top:1px solid #cbd7d2;margin-top:9px;padding-top:7px;display:grid;gap:3px}
.objective-row{display:grid;grid-template-columns:72% 28%;align-items:center;min-height:43px;gap:0}
.objective-math{font-size:22px;line-height:1.4;color:#355f70}.objective-math :deep(.katex){font-size:1em}
.objective-goal{font-size:20px;line-height:1.35;color:#a45836;padding-left:12px;border-left:1px solid #d6dfd9}.objective-goal small{font-size:17px;color:#71878c}
</style>
