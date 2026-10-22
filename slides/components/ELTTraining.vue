<script setup>
import { computed, ref, useId } from 'vue'
const student = ref(2)
const inference = ref(false)
const uid = useId().replace(/:/g,'')
const mark = `elt-arrow-${uid}`
const centers=[220,420,620,820]
const sx=computed(()=>centers[student.value-1])
</script>

<template>
  <div class="elt-training" @click.stop @keydown.stop>
    <div class="elt-controls"><button :aria-pressed="!inference" @click="inference=false">训练</button><button :aria-pressed="inference" @click="inference=true">推理早退</button><label>{{ inference ? '选用循环数' : '随机学生出口' }} <select aria-label="ELT 学生循环次数" v-model.number="student"><option v-for="k in [1,2,3]" :key="k" :value="k">{{ k }}</option></select></label><span>示例 Lmax = 4</span></div>
    <svg viewBox="0 0 1000 290" role="img" :aria-label="inference ? '在选定循环后经共享输出头读出，推进外部采样' : '四次共享循环，随机选中间出口作为学生，最深出口作教师，并停止蒸馏目标的梯度'">
      <defs><marker :id="mark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#8ba5ab" /></marker></defs>
      <text x="30" y="67" class="input">xₜ</text><line x1="70" y1="60" x2="148" y2="60" :marker-end="`url(#${mark})`" />
      <g v-for="(x,i) in centers" :key="x" :style="{opacity:inference&&i>=student ? .18 : 1}">
        <rect :x="x-65" y="26" width="130" height="68" rx="8" fill="#4f7b8b" /><text :x="x" y="69" text-anchor="middle" class="block">gΘ</text>
        <line v-if="i<3" :x1="x+67" y1="60" :x2="x+133" y2="60" :marker-end="`url(#${mark})`" />
        <text :x="x" y="119" text-anchor="middle" class="state">h{{ i+1 }}</text>
      </g>
      <text x="505" y="17" text-anchor="middle" class="shared">同一个 N 层模块，重复使用同一套权重</text>
      <line :x1="sx" y1="125" :x2="sx" y2="151" :marker-end="`url(#${mark})`" />
      <rect :x="sx-83" y="159" width="166" height="58" rx="7" fill="#e7e6dc" /><text :x="sx" y="195" text-anchor="middle" class="head">共享输出头</text>
      <text :x="sx" y="246" text-anchor="middle" class="output">{{ inference ? '当前预测' : '学生预测' }}</text>
      <g v-if="!inference">
        <line x1="820" y1="125" x2="820" y2="151" :marker-end="`url(#${mark})`" />
        <rect x="737" y="159" width="166" height="58" rx="7" fill="#e7e6dc" /><text x="820" y="195" text-anchor="middle" class="head">共享输出头</text>
        <text x="820" y="246" text-anchor="middle" class="output">最深教师预测</text>
        <path :d="`M 820 254 V 278 H ${sx} V 254`" stroke="#b57855" fill="none" :marker-end="`url(#${mark})`" /><text :x="(sx+820)/2" y="272" text-anchor="middle" class="distill">sg · 停止教师目标梯度</text>
      </g>
      <g v-else><line :x1="sx+90" y1="188" x2="850" y2="188" :marker-end="`url(#${mark})`" /><text x="925" y="196" text-anchor="middle" class="input">采样更新</text></g>
    </svg>
    <p>{{ inference ? '从可用出口读出后，才推进外部去噪步。' : '学生是最深路径的前缀；真值与蒸馏共同训练。' }}</p>
  </div>
</template>

<style scoped>
.elt-controls{display:flex;align-items:center;gap:12px;font-size:20px;margin-bottom:18px}.elt-controls button{font:inherit;border:1px solid #bdd0d2;border-radius:5px;background:#edf1ee;padding:5px 15px;color:#527482;cursor:pointer}.elt-controls button[aria-pressed=true]{background:#3e6b7b;color:#fff}.elt-controls label{display:flex;align-items:center;gap:12px;margin-left:22px}.elt-controls select{font:inherit;padding:2px 12px;border:1px solid #bdd0d2;border-radius:5px;background:#f8f6f0}.elt-controls>span{margin-left:auto;color:#809399;font-size:18px}.elt-training svg{display:block;width:100%;height:282px;overflow:visible}.elt-training svg line{stroke:#8ba5ab;stroke-width:2}.elt-training svg text{font-family:inherit}.input{font-size:28px;fill:#527582}.block{font-size:33px;fill:#fff;font-family:Georgia,serif!important}.state{font-size:21px;fill:#7f969d}.shared{font-size:20px;fill:#789199}.head{font-size:23px;fill:#5d7c86}.output{font-size:23px;fill:#a56845}.distill{font-size:19px;fill:#a56845;paint-order:stroke;stroke:#f8f6f0;stroke-width:9px;stroke-linejoin:round}.elt-training p{font-size:25px;color:#a56845;margin:17px 0 0}
</style>
