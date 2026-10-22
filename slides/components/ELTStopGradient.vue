<script setup>
import { computed, nextTick, ref, useId } from 'vue'
import katex from 'katex'
const open = ref(false)
const detached = ref(true)
const trigger = ref(null)
const panel = ref(null)
const uid = useId().replace(/:/g,'')
const math = (s) => katex.renderToString(s, { throwOnError: true, output: 'htmlAndMathml' })
const formula = computed(()=>math(detached.value
  ? '\\nabla_\\Theta\\mathcal L_{\\mathrm{dist}}=2w(t)\\,J_S^{\\mathsf T}(S-T)'
  : '\\nabla_\\Theta\\mathcal L_{\\mathrm{dist}}=2w(t)\\,(J_S-J_T)^{\\mathsf T}(S-T)'))
async function show(){detached.value=true;open.value=true;await nextTick();panel.value?.focus()}
function close(){open.value=false;trigger.value?.focus()}
function trap(e){
  if(e.key!=='Tab')return
  const nodes=panel.value?.querySelectorAll('button, a[href], [tabindex="0"]')
  if(!nodes?.length)return
  const first=nodes[0],last=nodes[nodes.length-1]
  if(e.target===panel.value||(!e.shiftKey&&e.target===last)||(e.shiftKey&&e.target===first)){e.preventDefault();(e.shiftKey?last:first).focus()}
}
</script>

<template>
  <span class="sg-control" @click.stop @keydown.stop>
    <button ref="trigger" class="sg-trigger" type="button" aria-haspopup="dialog" :aria-expanded="open" @click="show">为什么截断？ ↗</button>
    <div v-if="open" class="sg-shade" @click.self="close">
      <section ref="panel" role="dialog" aria-modal="true" aria-label="sg 停止梯度的意义" class="sg-dialog" tabindex="-1" @keydown.esc.stop.prevent="close" @keydown="trap">
        <header><b>sg：让浅出口追深出口</b><button type="button" aria-label="关闭 sg 图解" @click="close">关闭 ×</button></header>
        <div class="sg-modes"><button type="button" :aria-pressed="detached" @click="detached=true">论文：有 sg</button><button type="button" :aria-pressed="!detached" @click="detached=false">对照推导：无 sg</button><span>前向数值相同；改变的是反向梯度。</span></div>
        <svg viewBox="0 0 1000 164" role="img" :aria-label="detached?'蒸馏只回传学生路径，教师目标分支停止梯度':'没有停止梯度时，蒸馏会同时调整学生输出和教师输出'">
          <defs><marker :id="`sg-forward-${uid}`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#8aa0a7" /></marker><marker :id="`sg-back-${uid}`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#548475" /></marker></defs>
          <rect x="35" y="10" width="260" height="67" rx="9" fill="#e3edf0"/><text x="165" y="52" text-anchor="middle">浅出口 S</text>
          <rect x="370" y="10" width="260" height="67" rx="9" fill="#eeeadf"/><text x="500" y="52" text-anchor="middle">蒸馏误差</text>
          <rect x="705" y="10" width="260" height="67" rx="9" fill="#e3edf0"/><text x="835" y="52" text-anchor="middle">深出口 {{ detached?'sg(T)':'T' }}</text>
          <path d="M295 43 H363 M705 43 H637" fill="none" stroke="#8aa0a7" stroke-width="2" :marker-end="`url(#sg-forward-${uid})`" />
          <path d="M455 80 V109 H165 V83" fill="none" stroke="#548475" stroke-width="3" :marker-end="`url(#sg-back-${uid})`" />
          <path d="M545 80 V109 H835 V83" fill="none" :stroke="detached?'#b77653':'#548475'" stroke-width="3" :stroke-dasharray="detached?'5 5':undefined" :marker-end="detached?undefined:`url(#sg-back-${uid})`" />
          <path v-if="detached" d="M825 88 L845 68 M825 68 L845 88" stroke="#b77653" stroke-width="4" />
          <text x="235" y="149" class="gradient" text-anchor="middle">沿浅路径回传</text><text x="770" y="149" class="gradient" :style="{fill:detached?'#a56845':'#548475'}" text-anchor="middle">{{detached?'目标分支：不回传':'目标分支也被蒸馏拉动'}}</text>
        </svg>
        <div class="sg-reason">{{detached?'深预测作为本步标签，浅出口向它靠近；蒸馏不通过目标分支改变深预测。':'两端都会被蒸馏误差拉动，缩小差异也可以靠移动教师目标来实现。'}}</div>
        <div class="sg-derivative"><div v-html="formula" /><span>S = 浅出口预测，T = 深出口预测；J 为对应输出对共享参数 Θ 的雅可比。</span></div>
        <div class="sg-anchor"><b>深出口仍在训练。</b>第一项真值损失沿完整路径回传；学生也更新共享 Θ，因此下一步的教师预测仍会变化。</div>
        <footer><span>梯度图与公式为链式法则推导；不代表论文另有去掉 sg 的消融。</span><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT §4 ↗</a></footer>
      </section>
    </div>
  </span>
</template>

<style scoped>
.sg-control{display:inline-flex}.sg-trigger,.sg-dialog button{font:inherit;font-size:19px;border:1px solid #b8cbd0;border-radius:6px;background:#edf2ef;color:#466f80;padding:6px 12px;cursor:pointer;white-space:nowrap}
.sg-shade{position:absolute;inset:14px;z-index:85;background:#20394380;padding:14px;border-radius:12px;display:flex}.sg-dialog{display:flex;flex-direction:column;width:100%;min-height:0;overflow:auto;background:#f8f6f0;padding:20px 26px;border:1px solid #cbd7d4;border-radius:10px;outline:none;color:#416575;gap:14px;line-height:1.4}
.sg-dialog header{display:flex;justify-content:space-between;align-items:center;gap:16px}.sg-dialog header b{font-size:29px;font-weight:600}.sg-modes{display:flex;align-items:center;gap:10px}.sg-modes button[aria-pressed=true]{background:#456f80;color:white}.sg-modes span{font-size:19px;color:#71878f;margin-left:8px}
.sg-dialog svg{display:block;width:100%;height:164px;flex-shrink:0}.sg-dialog svg text{font:26px Inter,"PingFang SC",sans-serif;fill:#416b7b}.sg-dialog svg .gradient{font-size:23px;fill:#548475}.sg-reason{font-size:24px;color:#a56845;line-height:1.4}
.sg-derivative{padding:10px 16px;background:#e9eff0;border-radius:8px;text-align:center;line-height:1.4}.sg-derivative>div{font-size:23px;color:#355f70}.sg-derivative>span{display:block;font-size:17px;color:#71878f;margin-top:7px}.sg-anchor{font-size:21px;line-height:1.5}.sg-anchor b{color:#a56845;font-weight:600}.sg-dialog footer{display:flex;justify-content:space-between;gap:12px;font-size:16px;color:#71878f;margin-top:auto}.sg-dialog footer a{white-space:nowrap}
</style>
