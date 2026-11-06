<script setup>
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'
import goals from './module-goals.json'
const props=defineProps({ start:{type:Number,required:true}, end:{type:Number,required:true} })
const items=computed(()=>goals.slice(props.start,props.end+1))
const selected=ref(null), closeButton=ref(null), lastButton=ref(null)
function open(event,item){ lastButton.value=event.currentTarget; selected.value=item; nextTick(()=>closeButton.value?.focus()) }
function close(){ selected.value=null; nextTick(()=>lastButton.value?.focus()) }
function onKey(e){if(e.key==='Escape' && selected.value){e.stopPropagation(); close()}}
onMounted(()=>window.addEventListener('keydown',onKey,true)); onUnmounted(()=>window.removeEventListener('keydown',onKey,true))
</script>
<template>
<div class="goal-list" @click.stop @keydown.stop>
 <div class="goal-grid"><button v-for="item in items" :key="item.id" :aria-label="`查看 ${item.id} ${item.title} 的目标和指标`" @click="open($event,item)"><small>{{ item.id }}</small><b>{{ item.title }}</b><span>查看交付与指标 ↗</span></button></div>
 <p class="goal-hint">点击模块查看首项交付、衡量指标和建议验收；具体任务执行前冻结。</p>
 <div v-if="selected" class="goal-overlay" @click.self="close"><section class="goal-dialog" role="dialog" aria-modal="true" aria-labelledby="goal-title">
  <div class="goal-head"><div><small>{{ selected.id }} / 模块目标</small><h2 id="goal-title">{{ selected.title }}</h2></div><button ref="closeButton" class="goal-close" aria-label="关闭目标详情" @click="close">×</button></div>
  <div class="goal-body"><div><h3>首项交付</h3><p>{{ selected.deliverable }}</p></div><div><h3>如何衡量</h3><p>{{ selected.metrics }}</p></div><div><h3>{{ selected.kind }}</h3><p>{{ selected.target }}</p></div><div><h3>共同约定</h3><p v-if="selected.kind==='性能任务建议'">性能建议值：目标集配对加速比几何均值 ≥ 1.05、95% 区间下界 &gt; 1.00；保护项耗时比 95% 上界 ≤ 1.03，峰值内存 ≤ 基线 1.05 倍且满足上限。由任务负责人在测量前冻结。</p><p v-else-if="selected.kind==='能力任务建议'">声明的必测集合全部通过，新增失败为零；skip 不计为通过。既有功能满足回归和资源预算。</p><p v-else>组合验证按冻结的正确性、回归、资源和质量合同记录，建议值在执行前确定。</p></div></div>
  <div class="goal-foot">依据 docs/lingsheng-collaborator-task-packages.md；建议目标不是已取得的结果 · Esc 返回</div>
 </section></div>
</div>
</template>
<style scoped>
.goal-list{margin-top:8px}.goal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}.goal-grid button{text-align:left;background:#e0ede3;border:1px solid #bfd1c2;color:#173a31;min-height:93px;padding:10px 12px;cursor:pointer}.goal-grid button:hover,.goal-grid button:focus-visible{outline:2px solid #df694b;outline-offset:1px}.goal-grid small,.goal-grid b,.goal-grid span{display:block}.goal-grid small{font-size:11px;color:#bf5d42}.goal-grid b{font-size:14px;margin:5px 0 4px}.goal-grid span{font-size:10px;color:#61796f}.goal-hint{font-size:12px!important;color:#657b74;margin-top:15px!important}.goal-overlay{position:absolute;inset:0;background:rgba(10,32,29,.7);z-index:100;display:flex;justify-content:center;align-items:center;padding:24px}.goal-dialog{width:780px;max-height:490px;background:#f7f7ee;box-shadow:0 18px 60px #102c2a70;padding:20px 25px;display:flex;flex-direction:column;color:#102c2a}.goal-head{display:flex;justify-content:space-between;border-bottom:1px solid #a9beb0}.goal-head small{font-size:10px;letter-spacing:.1em;color:#c65f42;font-weight:700}.goal-head h2{font-size:24px!important;margin:5px 0 12px!important;color:#102c2a}.goal-close{border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#35554c;padding:0 3px}.goal-body{overflow-y:auto;min-height:0;padding:5px 5px 2px 0}.goal-body>div{margin:10px 0}.goal-body h3{font-size:13px;margin:0 0 4px;color:#b9573d}.goal-body p{font-size:12px;line-height:1.5;margin:0!important;color:#29433d}.goal-foot{font-size:10px;color:#687c75;border-top:1px solid #d0ddd0;padding-top:7px;margin-top:5px}
</style>
