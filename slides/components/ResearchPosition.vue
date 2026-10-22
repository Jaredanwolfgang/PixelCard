<script setup>
const papers = [
  { name:'Looped-DiT', focus:'训练：深监督 + 注意力调节', relation:'同预算对比：多循环 vs 多采样', url:'https://arxiv.org/html/2609.40305v1#S3.SS2' },
  { name:'ELT', focus:'训练：用自蒸馏训练浅出口', relation:'主要调循环数，未同时优化采样步数', url:'https://arxiv.org/html/2604.09168v3#S2' },
  { name:'LiFT', focus:'训练：不同深度用不同预测目标', relation:'比较 K × T；分析不同 t 下的预测变化', url:'https://arxiv.org/html/2610.05538v1#S4.SS4' },
  { name:'Depth as Time', focus:'分析逐层变化，蒸馏成共享块', relation:'分析每步内的逐层变化，以及目标区间的影响', url:'https://arxiv.org/html/2610.03626v1#S4' },
]
</script>

<template>
  <div class="research-position">
    <table class="position-table">
      <thead><tr><th scope="col">工作</th><th scope="col">主要做什么</th><th scope="col">对深度与步数的分析</th></tr></thead>
      <tbody><tr v-for="paper in papers" :key="paper.name"><th scope="row"><a :href="paper.url" target="_blank" rel="noopener">{{ paper.name }}</a></th><td>{{ paper.focus }}</td><td>{{ paper.relation }}</td></tr></tbody>
    </table>
    <p class="position-question">Depth–Step dynamics：多循环一轮，在不同去噪阶段有什么作用？</p>
    <div class="dynamics-focus"><b>后续 idea 的两个核心设计</b><span>创新点一：设计微调监督，让不同深度学习长短程任务。</span><span>创新点二：设计分配指标，在有限 Compute 下动态选择任务。</span></div>
  </div>
</template>

<style scoped>
.position-table{width:100%;border-collapse:collapse;table-layout:fixed;margin:0;line-height:1.4}.position-table th,.position-table td{border:0;border-bottom:1px solid #d7dfda;text-align:left;padding:8px 12px;vertical-align:middle}.position-table thead th{font-size:19px;font-weight:500;color:#7b9097;padding:0 12px 8px}.position-table thead th:first-child{width:19%}.position-table thead th:nth-child(2){width:36%}.position-table tbody th{font-size:23px;font-weight:600;color:#416b7b;padding-left:12px}.position-table tbody th a{color:inherit;border-bottom:1px solid #416b7b30;text-decoration:none}.position-table td{font-size:20px;color:#536f7a}.position-table td:last-child{color:#345b6b}.position-table tbody tr:last-child{background:#e8eff080}
.position-question{font-size:21px;line-height:1.4;color:#a56845;margin:8px 0 0!important}.dynamics-focus{background:#203943;border-radius:8px;color:#f8f6f0;padding:8px 18px;margin-top:8px;line-height:1.4}.dynamics-focus b{display:block;font-size:24px;font-weight:500}.dynamics-focus span{display:block;font-size:22px;color:#d0dfe0;margin-top:5px}
</style>
