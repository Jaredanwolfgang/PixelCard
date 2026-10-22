<script setup>
import PaperFigureDialog from './PaperFigureDialog.vue'
</script>
<template>
  <div class="lift-contributions" @click.stop @keydown.stop>
    <div><b>按深度组织监督</b><p>从初始速度到目标速度构造参考路径，<br>每个深度学习对应的修正进度。</p><PaperFigureDialog paper="lift" initial="fig2" :figure-ids="['fig2']" label="方法原图 ↗" /></div>
    <div><b>推理深度可外推</b><p>保持 checkpoint 不变，推理时增加循环，<br>在较大共享核心上继续改善生成质量。</p><PaperFigureDialog paper="lift" initial="fig3" :figure-ids="['fig3','fig8']" label="外推结果原图 ↗" /></div>
    <div><b>联合分配预算</b><p>分别调节 Loop 与 Step，在已测配置中，<br>改善质量、参数量与推理 FLOPs 的取舍。</p><PaperFigureDialog paper="lift" initial="fig4" :figure-ids="['fig4','fig5','fig9','fig7']" label="计算与样本原图 ↗" /></div>
  </div>
</template>
<style scoped>
.lift-contributions{margin-top:8px;display:grid;gap:12px}.lift-contributions>div{display:grid;grid-template-columns:215px 1fr auto;gap:20px;align-items:center;padding:16px 0;border-bottom:1px solid #d6dfd9}.lift-contributions b{font-size:27px;color:#a45836;font-weight:600}.lift-contributions p{font-size:24px;line-height:1.55;margin:0!important;color:#3d5d6b}
</style>
