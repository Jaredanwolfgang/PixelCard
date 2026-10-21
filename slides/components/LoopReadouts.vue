<script setup>
import { ref } from 'vue'
const training = ref(true)
</script>

<template>
  <div class="readout-demo" @click.stop @keydown.stop>
    <div class="readout-controls"><button :aria-pressed="training" @click="training=true">训练</button><button :aria-pressed="!training" @click="training=false">固定 K 推理</button><span>相同的噪声输入、相同的 t</span></div>
    <div class="readout-grid">
      <div v-for="i in 4" :key="i" class="readout-column">
        <div class="state-block">B → h{{ i }}</div>
        <div class="readout-head" :class="{'is-muted':!training&&i<4}"><span>↓</span><b>C(h{{ i }})</b><span>↓</span><strong>{{ training ? '同一 x₀' : i===4 ? '最终预测' : '不读出' }}</strong></div>
      </div>
    </div>
    <p>{{ training ? '共享 C 读出每轮状态，让中间轮也直接获得监督。' : '只在最后一轮执行 C；深监督不增加固定深度的推理读出。' }}</p>
  </div>
</template>

<style scoped>
.readout-demo{border:1px solid #d5ded9;background:#fff9;border-radius:12px;padding:22px 24px}.readout-controls{display:flex;align-items:center;gap:12px;margin-bottom:18px}.readout-controls button{font:inherit;font-size:21px;padding:6px 17px;border:1px solid #b8cccf;border-radius:6px;background:#edf1ee;color:#5a7680}.readout-controls button[aria-pressed=true]{background:#3e6b7b;color:white}.readout-controls>span{margin-left:auto;font-size:20px;color:#829197}.readout-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.state-block{position:relative;background:#4f7b8b;color:#fff;border-radius:8px;padding:12px;text-align:center;font-size:28px}.readout-column:not(:last-child) .state-block:after{content:'→';position:absolute;right:-18px;color:#8ca5ab}.readout-head{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:24px}.readout-head span{color:#9eb1b5}.readout-head b{background:#e8eae1;border-radius:6px;padding:3px 18px;color:#58737f;font-weight:500}.readout-head strong{font-size:24px;color:#a86b47}.readout-head.is-muted{opacity:.22}.readout-demo p{font-size:23px;color:#5c7780;margin-top:14px}
</style>
