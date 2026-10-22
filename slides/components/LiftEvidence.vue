<script setup>
import { ref } from 'vue'
import PaperFigureDialog from './PaperFigureDialog.vue'
const mode = ref('depth')
</script>
<template>
  <div class="lift-evidence" @click.stop @keydown.stop>
    <nav aria-label="LiFT 主要结果"><button :aria-pressed="mode==='depth'" @click="mode='depth'">深度外推</button><button :aria-pressed="mode==='compute'" @click="mode='compute'">质量与成本</button><span>原文数据摘录 · FID ↓</span></nav>
    <template v-if="mode==='depth'">
      <div class="evidence-context">同一 LiFT L/2 R10 · 训练 K = 2 · 固定采样 T = 50</div>
      <div class="depth-pair"><div><span>训练深度 K = 2</span><b>20.30</b><small>8.07 TFLOPs / 图</small></div><i>→</i><div><span>推理加深至 K = 8</span><b>10.95</b><small>28.24 TFLOPs / 图</small></div></div>
      <div class="evidence-conclusion">无需重训，推理深度达到训练时的 4 倍。</div>
      <div class="evidence-bottom"><span>这是增加计算后的质量收益；继续加深到 32 轮略有回退。</span><PaperFigureDialog paper="lift" initial="fig3" :figure-ids="['fig3','fig8']" label="外推曲线与矩阵原图 ↗" /></div>
    </template>
    <template v-else>
      <div class="evidence-context">跨尺度比较：LiFT L/2 R10 与 Dense DiT-XL/2</div>
      <div class="cost-table"><div class="table-head"><span>模型 / 推理配置</span><span>FID ↓</span><span>TFLOPs / 图 ↓</span></div><div><b>LiFT · T = 50，K = 8</b><strong>10.95</strong><strong>28.24</strong></div><div><b>Dense XL/2 · T = 250</b><span>14.30</span><span>59.31</span></div></div>
      <div class="evidence-conclusion">更低 FID，约少 60% 参数、52% 推理 FLOPs。</div>
      <div class="evidence-bottom"><span>此处训练成本也不同；同尺度对照另见图 4。</span><PaperFigureDialog paper="lift" initial="fig4" :figure-ids="['fig4','fig7']" label="成本曲线与生成样本原图 ↗" /></div>
    </template>
  </div>
</template>
<style scoped>
.lift-evidence{margin-top:2px}.lift-evidence nav{display:flex;align-items:center;gap:24px;font-size:21px;margin-bottom:20px}.lift-evidence nav button{font:inherit;background:none;border:0;border-bottom:2px solid transparent;color:#62808a;padding:3px 0;cursor:pointer}.lift-evidence nav button[aria-pressed=true]{color:#a45836;border-bottom-color:#a45836}.lift-evidence nav>span{margin-left:auto;font-size:18px;color:#7c9094}.evidence-context{font-size:23px;color:#456a79}.depth-pair{display:flex;align-items:center;justify-content:center;gap:90px;margin:25px 0}.depth-pair>div{display:flex;flex-direction:column;gap:4px}.depth-pair span{font-size:24px;color:#577883}.depth-pair b{font-size:65px;font-weight:600;line-height:1.3;color:#a45836}.depth-pair small{font-size:20px;color:#7c9094}.depth-pair i{font-style:normal;font-size:40px;color:#91a7ae}.evidence-conclusion{font-size:29px;color:#a45836;margin-top:16px}.evidence-bottom{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:14px;font-size:19px;color:#71868d;line-height:1.45}.cost-table{margin-top:16px}.cost-table>div{display:grid;grid-template-columns:1.6fr .75fr 1fr;gap:24px;align-items:center;border-bottom:1px solid #d9e0d9;padding:8px 0;font-size:26px}.cost-table .table-head{font-size:20px;color:#7b8f94;padding:0 0 10px}.cost-table b{font-size:24px;color:#456a79;font-weight:500}.cost-table strong{font-size:33px;font-weight:600;color:#a45836}
</style>
