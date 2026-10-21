<script setup>
import { ref } from 'vue'
import data from '../references/loop-diffusion-papers.json'
import plan from '../references/talk-plan.json'
const tab = ref('文献')
const tabs = ['文献','讲述节奏','统计口径','ELT','Looped-DiT','LoopREG','LiFT','Depth as Time']
</script>

<template>
  <div class="references-panel" @keydown.stop @click.stop>
    <nav aria-label="参考资料分类"><button v-for="name in tabs" :key="name" :aria-pressed="tab===name" @click="tab=name">{{ name }}</button></nav>
    <div class="reference-body" tabindex="0" :aria-label="tab+'参考内容'">
      <div v-if="tab==='文献'">
        <a class="reference-row" v-for="p in data.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><div><b>{{ p.name }}</b><span>{{ p.title }}</span></div><small>{{ p.direct ? '直接相关' : '相邻工作' }} · {{ p.version }}</small></a>
      </div>
      <div v-else-if="tab==='讲述节奏'" class="reference-prose">
        <h2>{{ plan.mainSlides }} 页主体 · 建议 {{ plan.targetMinutes }} 分钟</h2>
        <div v-for="section in plan.sections" :key="section.pages" class="timing-row"><b>{{ section.pages }} 页 · {{ section.title }} · {{ section.minutes }} 分钟</b><p>{{ section.cue }}</p></div>
      </div>
      <div v-else-if="tab==='统计口径'" class="reference-prose">
        <h2>截至 {{ data.checkedAt }} 的已核实样本</h2>
        <p>统计 2026 年 4—10 月首次提交 arXiv 的直接相关工作：视觉 4 篇，语言／结构化掩码扩散 2 篇。Depth as Time 另列，不计入 6 篇。</p>
        <p>日期统一为 arXiv 首发日期（UTC），按论文 ID 去重。R-MDM 的 9 月修订不算新论文；预印本发布数量也不等于会议录用数量。视觉方向的 Looped-DiT、LiFT、LoopREG 在 9/30—10/13 两周内首发。</p>
        <p>纳入：在 Diffusion／Flow 预测内部循环共享 Transformer 块或共享去噪器。排除：仅重复外层采样、缓存、静态剪枝，以及没有扩散实验的循环语言模型。</p>
        <p>这是本次检索的下限，非全量统计；展示近期工作集中出现，不声称整个领域的热度排名。LoopMDM、R-MDM 依据原始摘要；LoopREG 核对方法与主要实验；ELT 核对方法与扩散实验。</p>
      </div>
      <div v-else-if="tab==='ELT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT v3 · §4–5、图 3、表 2 ↗</a></h2>
        <p>ILSD（Intra-Loop Self Distillation，循环内自蒸馏）每次训练随机选择中间循环数，浅出口同时学习真值与最深出口的预测。教师目标分支使用 stop-gradient；浅、深路径的真值损失均更新同一套共享参数。</p>
        <p>主图以 4 轮为结构示例，不代表论文全部训练配置。中间路径是最深路径的前缀；支持推理时在不同循环数读出。</p>
        <p>ELT 同时研究掩码生成与 Diffusion。扩散对照在表 2：32 层 DiT FID 3.43；8 个独立层 × 4 轮为 3.16，16 × 2 为 2.83。摘要中的 FID 2.0 属于掩码生成，不能移用于 DiT 结果。</p>
      </div>
      <div v-else-if="tab==='Looped-DiT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2609.40305v1#S2" target="_blank" rel="noopener">Looped-DiT v1 · §2–3、表 2 / 4 ↗</a></h2>
        <p>默认 A/B/C 为 6/5/6 块，B 执行 4 轮：独立块参数 17 组，执行 32 次。循环传递图像和文本隐状态；噪声输入不变。</p>
        <p>深监督在各轮经 C 读出，监督同一干净图像。Final + Mean 权重为 (1/3, 1/3, 1/3, 1)。固定 K 推理只读最终轮；不保证误差逐轮下降。</p>
        <p>自调节注意力有门控和 XSA（Exclusive Self Attention）两个变体。XSA 去掉注意力输出沿当前 token 自身 value 方向的分量，不等于删除注意力矩阵对角线。本页公式省略 head 下标，v̂ᵢ 为当前 token 在该注意力头中归一化的 value。</p>
        <p>表 4，B/32 四项评测均分 ↑：朴素循环 56.2，＋深监督 57.5，＋XSA 58.5，两者结合 59.1。指标为 DPG / PRISM / CoRe / Spatial 平均分，非 FID。</p>
        <p>表 2 的训练及推理计算匹配对照：非循环深模型＋深监督 58.1，Looped-DiT＋深监督＋XSA 59.1；单次预测均为 267 GFLOPs，参数 473M / 260M。收益适用于论文测试条件，不是所有 Diffusion 模型的必要性证明。</p>
      </div>
      <div v-else-if="tab==='LoopREG'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2610.17877v1#S3" target="_blank" rel="noopener">LoopREG v1 · §3–4、表 1 / 4 ↗</a></h2>
        <p>循环块与表征监督位置共置。训练只对最后一次访问后的状态施加表征对齐，不是对所有轮做 Looped-DiT 式深监督。冻结 DINOv2 教师特征仅在训练时使用。</p>
        <p>继承 REG 的图像与语义 token 联合速度目标，并对终点经投影后的特征做负余弦对齐。共享块没有独立的循环序号嵌入或每轮参数。</p>
        <p>本页为 SiT-B/2 同一训练 2 轮的 checkpoint：推理 K=2→3，FID 14.71→5.34，Recall 0.631→0.508；单次调用执行块数 13→14。FID 改善不等于覆盖率也改善。</p>
        <p>ImageNet 256²，400K updates，EMA，50K 样本，250 次去噪调用，Euler–Maruyama SDE，CFG=1。不同于 LiFT 的 Euler 配置，不跨论文比较 FID 排名。4.91 是另一个训练 3 轮、推理 5 轮的配置，未混入本页对照。</p>
      </div>
      <div v-else-if="tab==='LiFT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2610.05538v1#S3.SS1" target="_blank" rel="noopener">LiFT v1 · §3.1、§4.4、附录 A.3 表 6 ↗</a></h2>
        <p>u₀ 为 prelude 的初始速度预测，u* 为训练目标，sg 为 stop-gradient。另有 prelude 辅助损失。s 是深度坐标，不是外部去噪时间；直线仅定义在预测空间。</p>
        <p>网格：ImageNet-1k 256²，L/2-R10，270.24M 参数，训练 2 轮、500k updates，Euler，无 CFG。同 checkpoint、配对噪声与类别，FID-50k。24 个网格点未插值，未含表中另两点 T=50、K=3/5。</p>
        <p>1 TFLOP = 10¹² 次浮点运算，网格为每图成本，不含 VAE 解码；不是实测延迟。结构示意中的块执行次数也不等于精确 FLOPs。</p>
        <p><a href="https://arxiv.org/abs/1706.08500" target="_blank" rel="noopener">FID 的原始来源</a>：比较特征分布的距离，越低越好。预算选择器只在这 24 个实测点中找最佳，不代表全局最优或在线分配规则。</p>
      </div>
      <div v-else class="reference-prose">
        <h2><a href="https://arxiv.org/html/2610.03626v1#S5" target="_blank" rel="noopener">Depth as Time v1 · §5、附录 C.1 ↗</a></h2>
        <p>单步 MeanFlow 教师的层间计算被蒸馏为 1 或 2 个共享块；内部时间区间 (τₐ, τᵦ) 经 AdaLN 条件化。训练匹配教师隐状态与最终输出。</p>
        <p>本图为 L/2、24 层教师、1 个共享块的示意。Hₗ 指教师第 l 层隐状态。改变 K 会重新划分整个 [0,1]，外部任务始终 (t,r)=(1,0)。</p>
        <p>四轮轨迹不等于八轮轨迹的前四轮。τ 不是校准后的噪声水平；参数压缩比例也不等于计算量下降比例。</p>
        <p>该工作研究单步生成及循环压缩，是相邻文献；没有计入直接 Loop Diffusion 的 6 篇。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.references-panel nav{display:flex;gap:8px;margin:15px 0 22px}.references-panel button{font:inherit;font-size:18px;border:1px solid #cad6d9;border-radius:8px;background:#edf1ef;padding:8px 12px;color:#5d747c;cursor:pointer}.references-panel button[aria-pressed=true]{background:#345d6d;color:#fff;border-color:#345d6d}.reference-body{max-height:385px;overflow:auto;padding-right:15px;overscroll-behavior:contain}.reference-row{display:grid;grid-template-columns:115px 1fr 160px;gap:18px;align-items:center;padding:12px 0;border-bottom:1px solid #dbe1dc!important;text-decoration:none!important}.reference-row time{font-size:17px;color:#829297}.reference-row b{display:block;color:#355e6d;font-size:21px;font-weight:600}.reference-row span{display:block;color:#75888e;font-size:17px;line-height:1.5}.reference-row small{font-size:16px;color:#9b6e50;text-align:right}.reference-prose p{font-size:21px;line-height:1.8;margin:16px 0}.reference-prose h2{font-size:23px}.reference-body:focus-visible{outline:2px solid #b67956;outline-offset:5px}
.timing-row{border-bottom:1px solid #dce2dc;padding:14px 0}.timing-row b{font-size:22px;color:#456d7b}.timing-row p{margin:9px 0;font-size:21px}
</style>
