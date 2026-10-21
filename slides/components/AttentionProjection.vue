<script setup>
import { ref, useId } from 'vue'
const own = ref(95)
const prefix = useId().replace(/\W/g, '')
</script>

<template>
  <div class="projection-demo" @click.stop @keydown.stop>
    <div class="projection-copy"><h2>门控</h2><p>按 token 和 head，<br>学习更新的强度。</p><h2>XSA</h2><p>投影去掉沿自身<br>value 方向的分量。</p></div>
    <div class="projection-figure">
      <svg viewBox="0 0 490 270" role="img" aria-label="XSA 将注意力输出投影到自身 value 的正交方向，二维示意">
        <defs><marker :id="prefix+'neutral'" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#81999e" /></marker><marker :id="prefix+'blue'" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#477587" /></marker><marker :id="prefix+'orange'" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#bd7850" /></marker></defs>
        <line x1="100" y1="215" x2="400" y2="215" stroke="#a9babd" stroke-width="2" :marker-end="`url(#${prefix}neutral)`" />
        <line x1="100" y1="215" x2="100" y2="48" stroke="#bd7850" stroke-width="5" :marker-end="`url(#${prefix}orange)`" />
        <line x1="100" y1="215" :x2="100+own*1.7" y2="65" stroke="#477587" stroke-width="4" :marker-end="`url(#${prefix}blue)`" />
        <line x1="100" y1="65" :x2="100+own*1.7" y2="65" stroke="#adbcbf" stroke-width="2" stroke-dasharray="5 5" />
        <text x="355" y="250" fill="#748b93" style="font-size:20px">自身 value</text><text x="15" y="37" fill="#ad6744" style="font-size:22px">投影后 z</text><text :x="125+own*1.7" y="53" fill="#3e6d7f" style="font-size:22px">原输出 o</text>
      </svg>
      <label>自身方向分量 <input aria-label="注意力输出沿自身 value 的分量" type="range" min="20" max="140" v-model.number="own" /></label>
    </div>
  </div>
</template>

<style scoped>
.projection-demo{display:grid;grid-template-columns:1fr 1.6fr;gap:30px;border:1px solid #d5ded9;border-radius:12px;background:#fff9;padding:23px 27px}.projection-copy h2{font-size:25px;color:#3c6778;margin:0 0 7px}.projection-copy h2:nth-of-type(2){margin-top:27px}.projection-copy p{font-size:24px;margin:0;line-height:1.6}.projection-figure svg{width:100%;height:255px;overflow:visible}.projection-figure label{display:flex;align-items:center;gap:20px;font-size:20px;color:#6a828b}.projection-figure input{accent-color:#517c8d;width:190px}
</style>
