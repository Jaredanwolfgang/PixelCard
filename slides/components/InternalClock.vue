<script setup>
import { computed, ref } from 'vue'
const k = ref(6)
const boundary = computed(() => Array.from({length:k.value+1},(_,i)=>i*24/k.value))
</script>

<template>
  <div class="clock-demo" @click.stop @keydown.stop>
    <div class="clock-head"><label>共享块执行次数 K <select aria-label="内部时间划分次数 K" v-model.number="k"><option v-for="n in [4,6,8,12,24]" :key="n" :value="n">{{ n }}</option></select></label><span>外部任务始终是：噪声 → 干净图像</span></div>
    <div class="clock-row"><span class="row-label">教师层</span><div class="teacher"><div v-for="n in 24" :key="n" :class="{checkpoint:boundary.includes(n)}">{{ n }}</div></div></div>
    <div class="clock-row"><span class="row-label">学生循环</span><div class="student"><div v-for="n in k" :key="n" :style="{width:100/k+'%'}"><b>B</b><span v-if="k<=8">→ H{{ boundary[n] }}</span></div></div></div>
    <div class="clock-row"><span class="row-label">内部时钟 τ</span><div class="timeline"><span v-for="(n,i) in boundary" :key="n" :style="{left:(100*i/k)+'%'}">{{ i===0 ? '0' : i===k ? '1' : k<=8 ? `${i}/${k}` : '' }}</span></div></div>
    <p>每轮接收区间 (τₐ, τᵦ)，所有轮共同覆盖 [0, 1]；Hₗ 表示教师第 l 层隐状态。<br><strong>K 改变时区间也改变；四轮模型不是八轮模型的前四轮。</strong></p>
  </div>
</template>

<style scoped>
.clock-demo{background:#fff9;border:1px solid #dedfd6;border-radius:12px;padding:14px 25px;margin-top:16px}.clock-head{display:flex;align-items:center;justify-content:space-between;font-size:14px;margin-bottom:14px}.clock-head label{color:#486b7a;display:flex;align-items:center;gap:15px}.clock-head select{background:#e8eef0;border:1px solid #b9cbcf;border-radius:5px;font:inherit;padding:3px 15px}.clock-head>span{font-size:12px;color:#a36643}.clock-row{display:flex;align-items:center;margin:10px 0;gap:24px}.row-label{width:100px;font-size:13px;color:#788d94;flex-shrink:0}.teacher{display:flex;gap:3px;width:100%}.teacher>div{flex:1;text-align:center;background:#e4e8e2;border-radius:3px;font:12px monospace;padding:4px 0;color:#8a9893}.teacher .checkpoint{background:#d9a27c;color:#fff}.student{display:flex;width:100%}.student>div{border:1px solid #f8f6f0;background:#4d7888;display:flex;align-items:center;justify-content:center;border-radius:5px;padding:5px 0;color:#fff;gap:7px;font-size:15px}.student b{font-weight:500}.student span{font-size:12px;color:#c1d7dd}.timeline{height:15px;background:linear-gradient(to bottom,transparent 6px,#bbcbd0 6px,#bbcbd0 8px,transparent 8px);width:100%;position:relative}.timeline span{position:absolute;transform:translateX(-50%);top:10px;font-size:11px;color:#87989f;background:#fbfaf6;padding:0 3px}.clock-demo p{font-size:13px;color:#6d838b;margin-top:17px;line-height:1.75}.clock-demo strong{font-weight:500;color:#a36543}
</style>
