<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ kind: string }>()
const sampler = ref('DDIM-50')
const pairs = {
  'DDIM-50': [{seed:0,fixed:52.038,adaptive:51.877},{seed:1,fixed:51.117,adaptive:51.509},{seed:2,fixed:51.306,adaptive:51.759}],
  'DDIM-100': [{seed:0,fixed:51.678,adaptive:51.413},{seed:1,fixed:50.722,adaptive:51.212},{seed:2,fixed:50.492,adaptive:51.381}],
}
const cifarX = (v: number) => 180 + (v - 50) / 2.5 * 640
const bars = [{name:'冻结基线 S30',r:0.745129,cost:'13.935'}, {name:'联合训练 K3 / S20',r:0.979954,cost:'14.066'}, {name:'专门训练 K3 / S20',r:0.979403,cost:'14.066'}]
const zX = (v: number) => 200 + (v - 0.45) / 0.13 * 650
</script>

<template>
  <div class="experiment-evidence">
    <template v-if="kind === 'cifar'">
      <div class="chart-controls"><label>采样器 <select v-model="sampler" aria-label="CIFAR 采样器"><option>DDIM-50</option><option>DDIM-100</option></select></label><span><i class="key fixed"></i> 固定两轮 <i class="key adaptive"></i> 自适应轮数</span></div>
      <svg viewBox="0 0 960 235" role="img" :aria-label="sampler + ' 三训练种子 FID 配对比较'">
        <g v-for="(p,i) in pairs[sampler as keyof typeof pairs]" :key="p.seed">
          <text x="18" :y="52+i*62">种子 {{p.seed}}</text>
          <line :x1="cifarX(p.fixed)" :x2="cifarX(p.adaptive)" :y1="45+i*62" :y2="45+i*62" stroke="#b8c7c9" stroke-width="4"/>
          <circle :cx="cifarX(p.fixed)" :cy="45+i*62" r="8" fill="#487585"/>
          <circle :cx="cifarX(p.adaptive)" :cy="45+i*62" r="8" fill="#b06442"/>
          <text :x="cifarX(p.fixed)" :y="25+i*62" text-anchor="middle" class="value">{{p.fixed.toFixed(3)}}</text>
          <text :x="cifarX(p.adaptive)" :y="73+i*62" text-anchor="middle" class="value accent">{{p.adaptive.toFixed(3)}}</text>
        </g>
        <g v-for="v in [50,51,52]" :key="v"><text :x="cifarX(v)" y="228" text-anchor="middle" class="axis">{{v}}</text></g><text x="850" y="228" class="axis">FID ↓</text>
      </svg>
      <p class="finding">{{sampler === 'DDIM-50' ? '三种子均值：固定 51.487，自适应 51.715。' : '三种子均值：固定 50.964，自适应 51.336。'}} 两种采样器都只有 1 / 3 种子改善。</p>
      <p class="boundary">100K updates，平均循环计算量相同。当前手工调度未通过确认，不能推广为自适应深度普遍无效。</p>
    </template>

    <template v-else-if="kind === 'early'">
      <div class="early-layout"><div>
        <div class="row-label">分散保留 8 次原层 <b>1.2166</b></div><div class="bar-track"><div class="bar muted" :style="{width:'86.90%'}"></div></div>
        <div class="row-label">前 8 步保留原层 <b>1.0239</b></div><div class="bar-track"><div class="bar" :style="{width:'73.13%'}"></div></div>
        <p class="metric-note">终点潜变量 MSE 比值 ↓，原始 Euler20 = 1<br>两种保留策略均为 9.290 TFLOPs / 图</p>
      </div><div class="large-result"><strong>15.84%</strong><span>相对分散策略，终点 MSE 降低</span><small>配对 97.5% CI：7.92%–24.42%</small></div></div>
      <p class="finding">64 条新轨迹独立确认，同时通过 1.10 非劣门槛。</p>
      <p class="boundary">SiT 单层替换实验，S20、CFG4、零训练更新。支持时间调度的保真收益，尚无 FID 或实测加速证据。</p>
    </template>

    <template v-else-if="kind === 'coverage'">
      <div class="budget-table"><div class="budget-head"><span>最终 1,824-update 权重</span><span>R20 ↓</span><span>TFLOPs / 图</span></div><div v-for="(b,i) in bars" :key="b.name" class="budget-line"><span>{{b.name}}</span><div class="mini-bar"><div :style="{width: b.r*100+'%', background:i===0?'#487585':'#b06442'}"></div><b>{{b.r.toFixed(4)}}</b></div><span>{{b.cost}}</span></div></div>
      <p class="finding">同为 S20，K3 改善约 3%。相近预算下，误差仍比 S30 高约 31.5%。</p>
      <p class="boundary">各分支完成 3 遍缓存覆盖。图为事后最终权重诊断，原规则选中 update 304，预算结论相同。64 条复用开发轨迹，未做独立确认。R20 为终点 MSE 比值，非 FID。</p>
    </template>

    <template v-else-if="kind === 'noise'">
      <div class="score-grid"><div v-for="(s,i) in [55,60,57,59]" :key="i"><span>固定 K{{i+1}}</span><b>{{s}}<small> / 96</small></b></div></div>
      <p class="metric-note">修复后：48 个 held-out prompts × 2 个独立噪声，延迟匹配，judge v2 成功数 ↑</p>
      <div class="contrast-list"><div><b>混合调度 vs 固定调度</b><span>+5 / 96，95% CI [−5, 16]</span></div><div><b>跨步状态 carry vs 无状态</b><span>−3 / 96，95% CI [−10, 4]</span></div></div>
      <p class="finding">复跑没有确认收益。原 carry 正信号来自同类 prompt 共享噪声。</p>
      <p class="boundary">CI 单位为成功数量差。主比较沿用开发集选出的策略。自动评判、无人评，不能由宽区间断言所有策略等效。</p>
    </template>

    <template v-else-if="kind === 'router'">
      <svg viewBox="0 0 960 210" role="img" aria-label="状态路由代理得分及其95%区间与0.53门槛比较">
        <line :x1="zX(.53)" :x2="zX(.53)" y1="20" y2="155" stroke="#aeb8ad" stroke-dasharray="5 5" stroke-width="2"/><text :x="zX(.53)" y="183" text-anchor="middle" class="axis">通过门槛 0.53</text>
        <text x="5" y="64">状态路由</text><line :x1="zX(.473)" :x2="zX(.510)" y1="58" y2="58" stroke="#b06442" stroke-width="5"/><circle :cx="zX(.492)" cy="58" r="9" fill="#b06442"/><text :x="zX(.492)" y="37" text-anchor="middle" class="value">0.492</text>
        <text x="5" y="129">理想选臂上限</text><line :x1="zX(.531)" :x2="zX(.579)" y1="123" y2="123" stroke="#487585" stroke-width="5"/><circle :cx="zX(.554)" cy="123" r="9" fill="#487585"/><text :x="zX(.554)" y="102" text-anchor="middle" class="value">0.554</text>
      </svg>
      <p class="finding">状态特征没有预测增益：CV log-loss 0.6932，常数预测 0.6931。</p>
      <p class="boundary">240 prompts × 4 noises 开发数据。代理 z̄ 与配对 95% CI，无人工评判。建议 no-go，L007 / L009 / L010 未运行；结论仅限此次单次 Deep / Wide 选择。</p>
    </template>
  </div>
</template>

<style scoped>
.experiment-evidence{font-size:22px;line-height:1.5;margin-top:10px}.chart-controls{display:flex;justify-content:space-between;align-items:center;color:#5a737e;font-size:20px}.chart-controls select{background:#eeeade;border:1px solid #c8ceca;border-radius:5px;padding:3px 12px;color:#20333b;margin-left:8px}.key{display:inline-block;width:11px;height:11px;border-radius:50%;margin-left:16px}.fixed{background:#487585}.adaptive{background:#b06442}svg{width:100%;height:235px;overflow:visible}svg text{font-size:22px;fill:#20333b}.value{font-size:19px!important}.axis{font-size:18px!important;fill:#607984!important}.accent{fill:#b06442!important}.experiment-evidence .finding{color:#a45836;font-size:27px;line-height:1.45;margin:16px 0 12px}.experiment-evidence .boundary{font-size:18px;color:#5a737e;line-height:1.55;margin:8px 0}.early-layout{display:grid;grid-template-columns:1.05fr 1fr;gap:40px;margin:32px 0 24px}.row-label{display:flex;justify-content:space-between;margin:16px 0 8px;font-size:22px}.bar-track{background:#eeeadf;height:24px}.bar{height:100%;background:#b06442}.bar.muted{background:#8ba4ad}.metric-note{font-size:19px!important;color:#607984;line-height:1.6}.large-result{display:flex;flex-direction:column;justify-content:center;gap:12px}.large-result strong{font-size:68px;line-height:1.1;color:#b06442}.large-result span{font-size:22px}.large-result small{font-size:18px;color:#607984}.budget-table{margin:30px 0}.budget-head,.budget-line{display:grid;grid-template-columns:290px 1fr 170px;gap:18px;align-items:center;padding:14px 0;border-bottom:1px solid #d5ded8}.budget-head{font-size:18px;color:#607984}.budget-line>span:last-child{text-align:center}.mini-bar{position:relative;height:34px;background:#eeeade;display:flex;align-items:center}.mini-bar>div{position:absolute;height:100%;opacity:.22}.mini-bar>b{position:relative;margin-left:15px;font-size:23px}.score-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #d5ded8;border-bottom:1px solid #d5ded8;padding:20px 0;margin:22px 0 12px}.score-grid>div{text-align:center}.score-grid span{display:block;font-size:21px;color:#607984}.score-grid b{font-size:47px;font-weight:600}.score-grid small{font-size:20px;font-weight:400;color:#607984}.contrast-list>div{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #d5ded8;padding:10px 0;font-size:22px}.contrast-list b{font-weight:500}.contrast-list span{color:#a45836}
</style>
