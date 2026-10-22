<script setup>
import { computed, ref, useId } from 'vue'
const student = ref(2)
const view = ref('train')
const inference = computed(()=>view.value==='inference')
function setView(next) { if(next==='train'&&student.value===4) student.value=2; view.value=next }
const uid = useId().replace(/:/g,'')
const mark = `elt-arrow-${uid}`
const centers=[220,420,620,820]
const sx=computed(()=>centers[student.value-1])
</script>

<template>
  <div class="elt-training" @click.stop @keydown.stop>
    <div class="elt-controls"><button :aria-pressed="view==='train'" @click="setView('train')">训练 · ILSD</button><button :aria-pressed="inference" @click="setView('inference')">推理 · 预算早退</button><button :aria-pressed="view==='anytime'" @click="setView('anytime')">Anytime 图解</button><label v-if="view!=='anytime'">{{ inference ? '指定 K' : '随机 Kint' }} <select aria-label="ELT 学生循环次数" v-model.number="student"><option v-for="k in (inference?[1,2,3,4]:[1,2,3])" :key="k" :value="k">{{ k }}</option></select></label><PaperFigureDialog paper="elt" initial="fig3" :figure-ids="['fig3','fig2','algorithm2']" label="论文图 / 算法 ↗" /></div>
    <ELTAnytime v-if="view==='anytime'" v-model="student" />
    <div v-else>
    <div class="elt-explanation">{{ inference ? '本次调用执行指定的 K 轮，再读出；没有置信度或收敛度触发的自动停止。' : '只训最深出口，浅出口未必可用；ILSD 让浅出口向深出口的预测靠近。' }}</div>
    <svg viewBox="0 0 1000 290" role="img" :aria-label="inference ? '在选定循环后经共享输出头读出，推进外部采样' : '四次共享循环，随机选中间出口作为学生，最深出口作教师，并停止蒸馏目标的梯度'">
      <defs><marker :id="mark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#8ba5ab" /></marker></defs>
      <text x="30" y="67" class="input">xₜ</text><line x1="70" y1="60" x2="148" y2="60" :marker-end="`url(#${mark})`" />
      <g v-for="(x,i) in centers" :key="x" :style="{opacity:inference&&i>=student ? .18 : 1}">
        <rect :x="x-65" y="26" width="130" height="68" rx="8" fill="#4f7b8b" /><text :x="x" y="69" text-anchor="middle" class="block">gΘ</text>
        <line v-if="i<3" :x1="x+67" y1="60" :x2="x+133" y2="60" :marker-end="`url(#${mark})`" />
        <text :x="x" y="119" text-anchor="middle" class="state">h<tspan class="state-index" baseline-shift="super">({{ i+1 }})</tspan></text>
      </g>
      <text x="505" y="17" text-anchor="middle" class="shared">同一个 N 层模块，重复使用同一套权重</text>
      <line :x1="sx" y1="125" :x2="sx" y2="151" :marker-end="`url(#${mark})`" />
      <rect :x="sx-83" y="159" width="166" height="58" rx="7" fill="#e7e6dc" /><text :x="sx" y="195" text-anchor="middle" class="head">共享输出头</text>
      <text :x="sx" y="246" text-anchor="middle" class="output">{{ inference ? '预测 → 采样更新' : '学生预测' }}</text>
      <g v-if="!inference">
        <line x1="820" y1="125" x2="820" y2="151" :marker-end="`url(#${mark})`" />
        <rect x="737" y="159" width="166" height="58" rx="7" fill="#e7e6dc" /><text x="820" y="195" text-anchor="middle" class="head">共享输出头</text>
        <text x="820" y="246" text-anchor="middle" class="output">最深教师预测</text>
        <path :d="`M 820 254 V 278 H ${sx} V 254`" stroke="#b57855" fill="none" :marker-end="`url(#${mark})`" /><text :x="(sx+820)/2" y="272" text-anchor="middle" class="distill">sg · 停止教师目标梯度</text>
      </g>

    </svg>
    <p>{{ inference ? '预算可变 ≠ 模型自主判断退出；一次调用只做一次读出。' : '教师与学生共享参数、共同训练；教师目标停梯度，深出口仍学真值。' }}</p>
    </div>
  </div>
</template>

<style scoped>
.elt-explanation{font-size:21px;color:#6c858e;line-height:1.45;margin-bottom:12px}
.elt-controls{display:flex;align-items:center;gap:12px;font-size:19px;margin-bottom:12px}.elt-controls button{font:inherit;border:1px solid #bdd0d2;border-radius:5px;background:#edf1ee;padding:5px 11px;color:#527482;cursor:pointer}.elt-controls button[aria-pressed=true]{background:#3e6b7b;color:#fff}.elt-controls label{display:flex;align-items:center;gap:12px;margin-left:4px}.elt-controls select{font:inherit;padding:2px 12px;border:1px solid #bdd0d2;border-radius:5px;background:#f8f6f0}.elt-controls>span{margin-left:auto;color:#809399;font-size:18px}.elt-training svg{display:block;width:100%;height:242px;overflow:visible}.elt-training svg line{stroke:#8ba5ab;stroke-width:2}.elt-training svg text{font-family:inherit}.input{font-size:28px;fill:#527582}.block{font-size:33px;fill:#fff;font-family:Georgia,serif!important}.state{font-size:21px;fill:#7f969d}.state-index{font-size:14px}.shared{font-size:20px;fill:#789199}.head{font-size:23px;fill:#5d7c86}.output{font-size:23px;fill:#a56845}.distill{font-size:19px;fill:#a56845;paint-order:stroke;stroke:#f8f6f0;stroke-width:9px;stroke-linejoin:round}.elt-training p{font-size:23px;color:#a56845;margin:12px 0 0}
</style>
