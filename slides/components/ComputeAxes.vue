<script setup>
import { computed, ref } from 'vue'
const k = ref(4)
const steps = ref(25)
const blocks = computed(() => 12 + 5 * k.value)
</script>

<template>
  <div class="compute-demo" @keydown.stop @click.stop>
    <div class="controls">
      <label>循环 K <input aria-label="循环次数 K" v-model.number="k" type="range" min="1" max="8" /><b>{{ k }}</b></label>
      <label>采样步数 T <select aria-label="采样步数 T" v-model.number="steps"><option v-for="t in [10,25,50,100]" :key="t" :value="t">{{ t }}</option></select></label>
    </div>
    <div class="lanes">
      <div class="lane"><span class="lane-label">Loop：输入固定</span><div class="block anchor-block">A</div><span>→</span><div class="loop-wrap"><div class="loop-label">共享参数</div><div class="loop-cells"><div class="block repeat" v-for="i in k" :key="i">B<sub>{{ i }}</sub></div></div></div><span>→</span><div class="block anchor-block">C</div><span>→</span><div class="prediction">预测</div></div>
      <div class="lane outer"><span class="lane-label">Step：状态推进</span><div class="state">xₜ</div><span>→</span><div class="state">xₜ₋Δₜ</div><span>→</span><div class="ellipsis">… {{ steps }} 次更新 …</div><span>→</span><div class="state final">图像</div></div>
    </div>
    <div class="count"><div><b>17</b><span>独立块参数组</span></div><div><b>{{ blocks }}</b><span>每次预测的块执行数</span></div><div><b>{{ (steps * blocks).toLocaleString() }}</b><span>整条轨迹的块执行数</span></div></div>
  </div>
</template>

<style scoped>
.compute-demo{background:#fff9;border:1px solid #dedfd6;border-radius:12px;padding:14px 22px}.controls{display:flex;gap:48px;align-items:center;font-size:20px;color:#506b76;border-bottom:1px solid #e4e8e0;padding-bottom:8px}.controls label{display:flex;align-items:center;gap:16px}.controls input{accent-color:#527e8e;width:170px}.controls b{min-width:25px;font-size:21px}.controls select{background:#eef2f0;border:1px solid #bfcecf;padding:3px 15px;border-radius:5px;color:#203943;font:inherit}.lanes{margin-top:12px}.lane{display:flex;align-items:center;gap:10px;min-height:55px}.lane-label{width:180px;flex-shrink:0;font-size:20px;color:#294a58}.lane-label small{font-size:18px;color:#7d8d93}.block{width:40px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:18px;flex-shrink:0}.anchor-block{background:#e7e8df;color:#666f69}.loop-wrap{position:relative;background:#e9f1f3;border:1px dashed #799eaa;padding:10px 10px 7px;border-radius:9px;min-width:100px}.loop-label{white-space:nowrap;position:absolute;top:-13px;font-size:17px;background:#f8f6f0;color:#4f7a89;padding:0 5px}.loop-cells{display:flex;gap:7px}.repeat{background:#467080;color:white;width:40px}.repeat sub{font-size:17px}.prediction{font-size:20px;color:#a45c3c}.outer{margin-top:6px;gap:17px}.state{padding:6px 16px;background:#f1e2d4;color:#9e603e;border-radius:6px;font:20px Georgia,serif}.state.final{background:#dae6df;color:#527760;font-family:inherit;font-size:17px}.ellipsis{font-size:20px;color:#829097}.lane>span:not(.lane-label){color:#98a9aa}.count{display:flex;align-items:center;gap:40px;border-top:1px solid #e4e8e0;margin-top:14px;padding-top:10px}.count>div{min-width:110px}.count b{display:block;font-size:34px;font-weight:600;line-height:1.2;color:#456d7d}.count span{font-size:18px;color:#617980}.count p{font-size:18px;line-height:1.8;margin:0 0 0 auto;color:#849094}
</style>
