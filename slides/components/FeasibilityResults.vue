<script setup>
import mapping from '../references/experiment-plan-mapping.json'
import PlanEvidenceDialog from './PlanEvidenceDialog.vue'
</script>
<template><div class="feasibility-plan">
  <div class="plan-head"><span>实现路径</span><span>拟设计的微调过程</span></div>
  <div v-for="path in mapping.paths" :key="path.id" class="plan-path">
    <div><b>路径 {{path.id}} · {{path.id==='A'?'SiT':'Looped-DiT'}}</b><p>{{path.original_goal}}</p></div>
    <div><p>{{path.id==='A'?'设计共享块初始化、输入混合与循环微调流程。':'复用已有循环结构，围绕任务分工设计新 Loss。'}}</p><PlanEvidenceDialog v-if="path.id==='A'" label="查看 SiT 先行实验 ↗" context="路径 A：SiT 共享循环改造" :boundary="path.boundary" :kinds="['coverage','early']" /><PlanEvidenceDialog v-else label="查看冻结模型先行实验 ↗" context="路径 B：已有 Loop 结构，更改 Loss 后微调" :boundary="path.boundary" :kinds="['noise','router']" /></div>
  </div>
  <p class="plan-reference">参考 · <a href="https://arxiv.org/html/2610.00673v1#S4" target="_blank" rel="noopener">Looped Qwen §4</a>：输入混合与训练稳定化思路。</p>
  <p class="plan-conclusion">实现路径服务于两项核心 idea：监督信号与动态任务分配。</p>
</div></template>
<style scoped>.feasibility-plan{margin-top:-5px}.plan-head,.plan-path{display:grid;grid-template-columns:330px 1fr;gap:22px;border-bottom:1px solid #d5ded8;align-items:start}.plan-head{font-size:17px;color:#607984;padding:4px 0 10px}.plan-path{padding:10px 0}.plan-path b{font-size:24px;color:#3c6878;font-weight:600}.plan-path p{font-size:20px;line-height:1.5;margin:4px 0 6px!important}.plan-path strong{font-size:24px;font-weight:600;color:#a45836;margin-top:3px}.feasibility-plan .plan-reference{font-size:19px;color:#607984;margin:16px 0 10px!important;line-height:1.5}.feasibility-plan .plan-conclusion{font-size:25px;color:#a45836;margin:10px 0 6px!important}.feasibility-plan .plan-limit{font-size:19px;color:#607984;margin:6px 0!important;line-height:1.45}</style>
