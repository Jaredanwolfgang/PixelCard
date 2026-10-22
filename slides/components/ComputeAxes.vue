<script setup>
import { computed, ref } from 'vue'
const k = ref(4)
const steps = ref(25)
const coreLayers = 5
const blocks = computed(() => 12 + coreLayers * k.value)
</script>

<template>
  <div class="compute-demo" @keydown.stop @click.stop>
    <div class="controls">
      <label><span>循环次数 <i>K</i></span><input aria-label="循环次数 K" v-model.number="k" type="range" min="1" max="8" step="1" /><output>{{ k }}</output></label>
      <label><span>采样步数 <i>T</i></span><input aria-label="采样步数 T" v-model.number="steps" type="range" min="1" max="100" step="1" /><output>{{ steps }}</output></label>
      <NotationGuide />
    </div>
    <div class="lanes">
      <div class="lane">
        <div class="lane-label"><b>层位置 <i>l</i></b><span>同一噪声输入 x<sub>t</sub>、同一 t</span></div>
        <div class="block anchor-block"><b>A</b><small>6 层</small></div><span class="arrow">→</span>
        <div class="loop-wrap"><div class="loop-label">同一个 B · N = 5 层 · 共享权重</div><div class="loop-cells"><div class="block repeat" v-for="n in k" :key="n"><b>B</b><small>第 {{ n }} 轮</small></div></div></div>
        <span class="arrow">→</span><div class="block anchor-block"><b>C</b><small>6 层</small></div><span class="arrow">→</span><div class="prediction">预测</div>
      </div>
      <div class="lane outer">
        <div class="lane-label"><b>生成时间 <i>t</i></b><span>总共 T = {{ steps }} 次更新</span></div>
        <template v-if="steps > 2"><div class="state">噪声</div><span class="arrow">→ … →</span><div class="state">x<sub>t</sub></div><span class="arrow">→</span><div class="state">x<sub>t−Δt</sub></div><span class="arrow">→ … →</span></template>
        <template v-else><div class="state">噪声 x<sub>t</sub></div><span class="arrow">→</span><template v-if="steps === 2"><div class="state">x<sub>t−Δt</sub></div><span class="arrow">→</span></template></template><div class="state final">图像 x<sub>0</sub></div>
      </div>
    </div>
    <div class="count" aria-live="polite">
      <div><b>17</b><span>独立块参数组 · 6 + N + 6</span></div>
      <div><b>{{ blocks }}</b><span>执行深度 D = 6 + NK + 6</span></div>
      <div><b>{{ (steps * blocks).toLocaleString() }}</b><span>全程块执行数 · T × D</span></div>
    </div>
    <div class="later-symbols"><span>后文：<i>s</i> 深度坐标 · <i>τ</i> 内部时钟</span><span>都区别于外部生成时间 <i>t</i></span></div>
  </div>
</template>

<style scoped>
.compute-demo{background:#fff9;border:1px solid #dedfd6;border-radius:12px;padding:13px 20px 10px;line-height:1.35}
.controls{display:flex;gap:24px;align-items:center;font-size:20px;color:#506b76;border-bottom:1px solid #e4e8e0;padding-bottom:10px}
.controls label{display:flex;align-items:center;gap:10px;white-space:nowrap}.controls input{accent-color:#527e8e;width:150px;cursor:ew-resize}.controls output{min-width:36px;font-size:23px;font-weight:600;font-variant-numeric:tabular-nums}.controls i,.lane-label i,.later-symbols i{font-family:Georgia,serif}
.lanes{margin-top:18px}.lane{display:flex;align-items:center;gap:9px;min-height:59px}.lane-label{width:205px;flex-shrink:0;color:#294a58}.lane-label b{display:block;font-size:21px;font-weight:500}.lane-label>span{display:block;font-size:16px;color:#738991;white-space:nowrap}
.block{width:46px;height:47px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0;line-height:1.2}.block b{font-size:21px;font-weight:500}.block small{font-size:13px;white-space:nowrap;margin-top:3px}.anchor-block{background:#e7e8df;color:#666f69}
.loop-wrap{position:relative;background:#e9f1f3;border:1px dashed #799eaa;padding:10px 8px 7px;border-radius:9px;min-width:230px}.loop-label{white-space:nowrap;position:absolute;top:-16px;font-size:16px;background:#fbfaf6;color:#4f7a89;padding:0 5px}.loop-cells{display:flex;gap:5px;justify-content:center}.repeat{background:#467080;color:white;width:43px}
.prediction{font-size:19px;color:#a45c3c;white-space:nowrap}.arrow{color:#98a9aa;white-space:nowrap;font-size:21px}.outer{margin-top:7px;gap:15px}.state{padding:6px 14px;background:#f1e2d4;color:#9e603e;border-radius:6px;font:21px Georgia,serif;white-space:nowrap}.state.final{background:#dae6df;color:#527760;font-family:inherit;font-size:19px}
.count{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:24px;border-top:1px solid #e4e8e0;margin-top:12px;padding-top:8px}.count b{display:block;font-size:31px;font-weight:600;line-height:1.2;color:#456d7d;font-variant-numeric:tabular-nums}.count span{font-size:17px;color:#617980;white-space:nowrap}.later-symbols{display:flex;justify-content:space-between;border-top:1px solid #e4e8e0;margin-top:10px;padding-top:7px;font-size:17px;color:#6d838b}
</style>
