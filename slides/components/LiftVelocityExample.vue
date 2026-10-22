<script setup>
import { computed, ref } from 'vue'
const s = ref(0.5)
const value = computed(() => Number(s.value))
const target = computed(() => [1 + 3 * value.value, 3 - value.value])
const number = (n) => Number(n.toFixed(2)).toString()
const end = computed(() => ({ x: 62 + 62 * target.value[0], y: 244 - 62 * target.value[1] }))
</script>

<template>
  <div class="lift-velocity" @keydown.stop @click.stop>
    <div class="example-head"><span>① 样本空间：训练标签从哪里来</span><span>② 速度空间：同一个输入，不同深度的目标</span></div>
    <div class="plots">
      <svg viewBox="0 0 470 285" role="img" aria-label="二维训练样本对：噪声 x0 为负二负一，数据 x1 为二一，t 等于二分之一时输入 xt 为零零，目标速度为四二">
        <defs><marker id="lift-pair-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#b06442" /></marker></defs>
        <g fill="#dfe6e4" stroke="#aebfb8" stroke-width="1.3">
          <ellipse cx="80" cy="207" rx="53" ry="43" /><ellipse cx="80" cy="207" rx="31" ry="25" />
          <ellipse cx="328" cy="83" rx="65" ry="35" transform="rotate(-20 328 83)" /><ellipse cx="328" cy="83" rx="39" ry="21" transform="rotate(-20 328 83)" />
          <ellipse cx="355" cy="208" rx="57" ry="29" transform="rotate(12 355 208)" /><ellipse cx="355" cy="208" rx="33" ry="17" transform="rotate(12 355 208)" />
        </g>
        <text x="24" y="142" class="muted">噪声分布 ρ₀</text><text x="304" y="30" class="muted">数据分布 ρ₁</text>
        <path d="M80 207L328 83" stroke="#b06442" stroke-width="3" marker-end="url(#lift-pair-arrow)" />
        <circle cx="80" cy="207" r="5" fill="#20333b" /><circle cx="328" cy="83" r="5" fill="#b06442" />
        <circle cx="204" cy="145" r="6" fill="#376e80" stroke="#f8f6f0" stroke-width="2" />
        <text x="18" y="271" class="coordinate">x₀ = (−2, −1)</text><text x="291" y="134" class="coordinate">x₁ = (2, 1)</text>
        <text x="150" y="196" class="input">xₜ = (0, 0)</text><text x="158" y="224" class="muted">固定 t = 0.5</text>
        <text x="117" y="86" class="target">u* = (4, 2)</text><text x="117" y="112" class="muted">这对样本的路径速度</text>
      </svg>
      <svg viewBox="0 0 470 285" role="img" :aria-label="`共同原点的速度向量：初始预测一三，目标四二，当前 s 为 ${value}，中间参考为 ${target}`">
        <defs>
          <marker v-for="(color, key) in {initial:'#89989a',reference:'#376e80',final:'#b06442'}" :key="key" :id="`lift-velocity-${key}`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" :fill="color" /></marker>
        </defs>
        <path d="M42 244H420 M62 264V25" fill="none" stroke="#c3ccc7" stroke-width="1.5" />
        <text x="371" y="271" class="muted">分量 1</text><text x="5" y="18" class="muted">分量 2</text><text x="39" y="267" class="muted">0</text>
        <path d="M124 58L310 120" fill="none" stroke="#b8c3bf" stroke-width="2" stroke-dasharray="5 5" />
        <path d="M62 244L124 58" stroke="#89989a" stroke-width="2.5" marker-end="url(#lift-velocity-initial)" />
        <path d="M62 244L310 120" stroke="#b06442" stroke-width="3" marker-end="url(#lift-velocity-final)" />
        <path :d="`M62 244L${end.x} ${end.y}`" stroke="#376e80" stroke-width="4" marker-end="url(#lift-velocity-reference)" />
        <circle :cx="end.x" :cy="end.y" r="5" fill="#376e80" />
        <text x="74" y="30" class="muted">u₀ = D(h₀) = (1, 3)</text>
        <text x="320" y="119" class="target">u* = (4, 2)</text>
        <text x="228" y="62" class="input">ūₛ = ({{ number(target[0]) }}, {{ number(target[1]) }})</text>
        <path :d="`M232 70L${end.x + 6} ${end.y - 6}`" stroke="#376e80" stroke-width="1" fill="none" />
        <text x="252" y="214" class="muted">虚线：参考目标的路径</text>
      </svg>
    </div>
    <div class="example-controls"><label>计算深度 s <input aria-label="LiFT 计算深度坐标 s" v-model.number="s" type="range" min="0" max="1" step="0.25" /> <b>{{ number(value) }}</b></label><span>ūₛ = (1 − s) · sg(u₀) + s · u*</span></div>
    <div class="example-note">u* = x₁ − x₀；u₀ = D(P(xₜ, t)) 为 Prelude 读出；(1, 3) 为示例。</div>
  </div>
</template>

<style scoped>
.lift-velocity{margin-top:-20px}.example-head{display:grid;grid-template-columns:1fr 1fr;gap:22px;color:#466d7b;font-size:21px;font-weight:600}.plots{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:0}.plots svg{display:block;width:100%;height:215px;overflow:visible}.muted{fill:#71878c;font-size:19px}.coordinate{fill:#4b626b;font-size:22px}.target{fill:#b06442;font-size:21px;font-weight:600}.input{fill:#376e80;font-size:21px;font-weight:600}.example-controls{display:flex;justify-content:space-between;align-items:center;gap:20px;border-top:1px solid #d7dfd9;padding-top:6px;font-size:21px;color:#486d7b;line-height:1.4}.example-controls label{display:flex;align-items:center;gap:13px;white-space:nowrap}.example-controls input{width:145px;accent-color:#376e80}.example-controls b{width:40px;font-weight:500}.example-controls>span{font-family:Georgia,'PingFang SC',serif;font-size:22px;color:#a45836}.example-note{font-size:18px;color:#6c8288;margin-top:8px}
</style>
