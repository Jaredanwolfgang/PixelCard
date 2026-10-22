<script setup>
import { computed, ref, watch } from 'vue'
import katex from 'katex'
const k = ref(4)
const selected = ref(1)
watch(k,()=>{selected.value=1})
const boundary = computed(() => Array.from({length:k.value+1},(_,i)=>i*24/k.value))
const start = computed(()=>boundary.value[selected.value-1])
const end = computed(()=>boundary.value[selected.value])
const math = (s) => katex.renderToString(s,{throwOnError:true,output:'htmlAndMathml'})
const interval = computed(()=>math(`h_{${selected.value}}=B_\\theta(h_{${selected.value-1}};(${selected.value-1}/${k.value},${selected.value}/${k.value}),(t,r),c)\\quad\\longrightarrow\\quad H_{${end.value}}`))
</script>

<template>
  <div class="clock-demo" @click.stop @keydown.stop>
    <div class="clock-definition"><b>τ = l / 24</b><span>归一化层位置；区间告诉共享块“从哪算到哪”。</span></div>
    <div class="clock-chart">
      <div class="clock-head"><label>划分示例 K <select aria-label="内部时间划分次数 K" v-model.number="k"><option v-for="n in [4,6,8,12,24]" :key="n" :value="n">{{ n }}</option></select></label><span>外部任务固定：(t, r) = (1, 0)</span></div>
      <div class="clock-row"><span class="row-label">教师层 l</span><div class="teacher"><div v-for="n in 24" :key="n" :class="{covered:n>start&&n<=end,checkpoint:boundary.includes(n)}">{{ boundary.includes(n) ? n : '' }}</div></div></div>
      <div class="clock-row"><span class="row-label">学生第 k 轮</span><div class="student" :class="{dense:k>8}"><button v-for="n in k" :key="n" type="button" :aria-label="`查看第 ${n} 轮的内部区间`" :aria-pressed="selected===n" @click="selected=n"><b>B<sub v-if="k<=8">θ</sub></b><span v-if="k<=8">→ H<sub>{{ boundary[n] }}</sub></span></button></div></div>
      <div class="clock-row clock-axis"><span class="row-label">内部时钟 τ</span><div class="timeline"><span v-for="(n,i) in boundary" :key="n" :style="{left:(100*i/k)+'%'}">{{ i===0?'0':i===k?'1':k<=8?`${i}/${k}`:'' }}</span></div></div>
    </div>
    <div class="clock-interval"><div v-html="interval" /><span>第 {{ selected }} 轮跨过教师第 {{ start }} → {{ end }} 层的计算；h 是学生状态，H 是教师监督目标。</span></div>
  </div>
</template>

<style scoped>
.clock-definition{display:flex;align-items:center;gap:20px;font-size:22px;line-height:1.4;margin-bottom:10px;color:#6c838c}.clock-definition b{color:#a56845;font-size:25px;font-weight:500;white-space:nowrap}
.clock-chart{background:#fff9;border:1px solid #dedfd6;border-radius:10px;padding:10px 22px 14px}.clock-head{display:flex;align-items:center;justify-content:space-between;font-size:21px;margin-bottom:8px}.clock-head label{color:#486b7a;display:flex;align-items:center;gap:12px}.clock-head select{background:#e8eef0;border:1px solid #b9cbcf;border-radius:5px;font:inherit;padding:2px 12px}.clock-head>span{font-size:20px;color:#a36643}.clock-row{display:flex;align-items:center;margin:8px 0;gap:20px}.row-label{width:125px;font-size:20px;color:#788d94;flex-shrink:0}.teacher{display:flex;gap:3px;width:100%}.teacher>div{flex:1;text-align:center;background:#e4e8e2;border-radius:3px;font:18px monospace;height:24px;line-height:24px;color:#8a9893}.teacher .covered{background:#e5c6ab}.teacher .checkpoint{background:#b68967;color:#fff}.teacher .covered.checkpoint{background:#ad5e3c;box-shadow:inset 0 0 0 2px #8c5237}.student{display:flex;width:100%}.student button{flex:1;min-width:0;border:1px solid #f8f6f0;background:#dfe8e9;display:flex;align-items:center;justify-content:center;border-radius:5px;height:39px;color:#577786;gap:7px;font:inherit;font-size:24px;cursor:pointer}.student button[aria-pressed=true]{background:#4d7888;color:#fff;outline:2px solid #b57855;outline-offset:-2px}.student b{font-weight:500}.student sub{font-size:15px}.student span{font-size:19px}.student.dense button{font-size:18px}.clock-axis{margin-bottom:5px}.timeline{height:18px;background:linear-gradient(to bottom,transparent 6px,#bbcbd0 6px,#bbcbd0 8px,transparent 8px);width:100%;position:relative}.timeline span{position:absolute;transform:translateX(-50%);top:9px;font-size:18px;color:#87989f;background:#fbfaf6;padding:0 3px}
.clock-interval{background:#e9eff0;border-radius:8px;padding:7px 16px;margin-top:10px;line-height:1.4;text-align:center;color:#416b7b}.clock-interval>div{font-size:22px}.clock-interval>span{display:block;font-size:18px;color:#70868e;margin-top:7px}.clock-boundary{font-size:21px;color:#a56845;margin-top:12px;line-height:1.4}
</style>
