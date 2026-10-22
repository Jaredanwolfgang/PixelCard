<script setup>
import { ref } from 'vue'
import data from '../references/loop-diffusion-papers.json'
import plan from '../references/talk-plan.json'
import timeline from '../references/arxiv-timeline.json'
const tab = ref('文献')
const tabs = ['文献','讲述节奏','统计口径','广义清单','Looped-DiT','ELT','LiFT','Depth as Time','LoopREG']
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
        <h2>年度／季度统计：{{ timeline.papers.length }} 篇检索样本</h2>
        <p>蓝色为广义 Loop / Recurrent Transformer 记录，棕色为其中 {{ data.papers.filter(p=>p.direct).length }} 篇 Loop Diffusion / Flow：在去噪器内部重复共享 Transformer 层或固定点模块，含视觉、语言和语音。</p>
        <p>广义集合：从 <a :href="timeline.source.url" target="_blank" rel="noopener">Azizi 等人公开综述文献库的固定版本</a>中筛选题名包含 loop* / recurs* / recurr* / universal，且包含 transformer / language model 的 arXiv 记录；排除已明确的非 Transformer 条目，补录本次扩散清单、ALBERT 与 Huginn。题名筛选会漏掉采用其他命名的相关工作，不能当作全库总量。</p>
        <p>综述快照为 {{ timeline.corpusSnapshot }}；补录截至 {{ timeline.checkedAt }}。按 arXiv ID 去重，修订不计新论文。历史日期沿用综述的首发月份元数据，未逐条重新核对；扩散补录按原始页面 v1 日期核对，不能从 ID 数字推定首发月份。</p>
        <p>2018–2025 每年一个点，2026 每季度一个点；时间段长度不同，不直接比较增长率。Q4 只覆盖到 10/21，检索也非穷尽。0 表示当前样本未收录，不能据此认定当年没有相关论文。</p>
        <p>GET 与 Depth as Time 是单步蒸馏生成器，在广义集合中保留，但不计入直接 Loop Diffusion。FPDM 属于去噪器内部固定点迭代，计入 2024 年直接相关工作。文献库署名：{{ timeline.source.attribution }}；{{ timeline.source.license }}。复算口径和全部条目随源文档保存。</p>
      </div>
      <div v-else-if="tab==='广义清单'">
        <a class="reference-row broad-row" v-for="p in timeline.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><div><span>{{ p.title }}</span></div><small>{{ p.direct ? 'Loop Diffusion' : '广义相关' }}</small></a>
      </div>
      <div v-else-if="tab==='ELT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT v3 · §4–5、图 3、表 2 ↗</a></h2>
        <p>ILSD（Intra-Loop Self Distillation，循环内自蒸馏）每次训练随机选择中间循环数，浅出口接受真值与最深出口预测的加权监督。教师目标分支使用 stop-gradient；最深出口的真值损失始终更新共享参数；学生的真值／蒸馏权重由 λ 控制，λ 随训练从 1 线性降至 0。</p>
        <p>第 8 页流程图以 4 轮为结构示例，不代表论文全部训练配置。中间路径是最深路径的前缀；支持推理时在不同循环数读出；读出后才执行外部采样更新。</p>
        <p>ELT 同时研究掩码生成与 Diffusion。扩散对照在表 2：32 层 DiT FID 3.43；8 个独立层 × 4 轮为 3.16，16 × 2 为 2.83。1 × 32 的 FID 为 10.30，说明极小共享块存在容量限制。这些行来自不同训练配置，不能称为同一 checkpoint 的扫描。摘要中的 FID 2.0 属于掩码生成，不能移用于 DiT 结果。</p>
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
        <p>补充案例为 SiT-B/2 同一训练 2 轮的 checkpoint：推理 K=2→3，FID 14.71→5.34，Recall 0.631→0.508；单次调用执行块数 13→14。FID 改善不等于覆盖率也改善。</p>
        <p>ImageNet 256²，400K updates，EMA，50K 样本，250 次去噪调用，Euler–Maruyama SDE，CFG=1。不同于 LiFT 的 Euler 配置，不跨论文比较 FID 排名。4.91 是另一个训练 3 轮、推理 5 轮的配置，与前述对照分开报告。</p>
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
        <p>第 15 页参数压缩：L/2 教师 459M、FID 4.01；单共享块学生 27.6M、K=24，FID 11.75，经 FD-loss 后训练为 4.87。FD loss 直接优化生成与真实数据的特征统计距离，出处为论文附录 C.2 所引 Yang et al.；不是仅靠轨迹蒸馏达到 4.87。学生使用 CFG，而教师将 guidance 纳入训练，不作同成本推断。
        </p><p>该工作研究单步生成及循环压缩，是相邻文献；没有计入直接 Loop Diffusion 的 11 篇。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.references-panel nav{display:flex;gap:6px;margin:15px 0 22px}.references-panel button{font:inherit;font-size:17px;border:1px solid #cad6d9;border-radius:8px;background:#edf1ef;padding:8px 10px;color:#5d747c;cursor:pointer}.references-panel button[aria-pressed=true]{background:#345d6d;color:#fff;border-color:#345d6d}.reference-body{max-height:385px;overflow:auto;padding-right:15px;overscroll-behavior:contain}.reference-row{display:grid;grid-template-columns:115px 1fr 160px;gap:18px;align-items:center;padding:12px 0;border-bottom:1px solid #dbe1dc!important;text-decoration:none!important}.reference-row time{font-size:17px;color:#829297}.reference-row b{display:block;color:#355e6d;font-size:21px;font-weight:600}.reference-row span{display:block;color:#75888e;font-size:17px;line-height:1.5}.reference-row small{font-size:16px;color:#9b6e50;text-align:right}.reference-prose p{font-size:21px;line-height:1.8;margin:16px 0}.reference-prose h2{font-size:23px}.reference-body:focus-visible{outline:2px solid #b67956;outline-offset:5px}
.timing-row{border-bottom:1px solid #dce2dc;padding:14px 0}.timing-row b{font-size:22px;color:#456d7b}.timing-row p{margin:9px 0;font-size:21px}
</style>
