<template><div class="plan-validation">
<div><b>监督信号</b><span>固定调度，比较原 Loss 与分工 Loss</span></div>
<div><b>分配指标</b><span>固定 checkpoint，同预算比较固定、随机与指标调度</span></div>
<div><b>机制证据</b><span>检查长程方向误差、短程修正误差与任务分配记录</span></div>
<div><b>最终收益</b><span>比较同预算生成质量，计入指标开销与实际延迟</span></div>
<p class="validation-result">在相同计算预算下，分别评估监督信号与动态分配的作用。</p>
<p class="validation-note">分配指标在未见样本上评估；最终生成质量用 FID 衡量，决策开销计入总预算。</p>
</div></template>
<style scoped>.plan-validation>div{display:grid;grid-template-columns:180px 1fr;gap:22px;align-items:center;border-bottom:1px solid #d5ded8;padding:17px 0}.plan-validation b{font-size:25px;font-weight:600;color:#3c6878}.plan-validation span{font-size:23px;line-height:1.5}.plan-validation strong{font-size:21px;color:#a45836;font-weight:600}.plan-validation .validation-result{font-size:25px;color:#a45836;margin:20px 0 10px!important}.plan-validation .validation-note{font-size:18px;color:#607984;line-height:1.5;margin:8px 0!important}</style>
