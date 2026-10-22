<script setup>
import { computed, ref } from 'vue'
import data from '../references/loop-diffusion-papers.json'
import defaultPlan from '../references/talk-plan.json'
const props = defineProps({ talkPlan: { type: Object, default: null } })
const plan = computed(() => props.talkPlan || defaultPlan)
import timeline from '../references/arxiv-timeline.json'
const tab = ref('文献')
const tabs = ['文献','研究定位','讲述节奏','统计口径','广义清单','Looped-DiT','ELT','LiFT','Depth as Time','LoopREG']
</script>

<template>
  <div class="references-panel" @keydown.stop @click.stop>
    <nav aria-label="参考资料分类"><button v-for="name in tabs" :key="name" :aria-pressed="tab===name" @click="tab=name">{{ name }}</button></nav>
    <div class="reference-body" tabindex="0" :aria-label="tab+'参考内容'">
      <div v-if="tab==='文献'">
        <a class="reference-row" v-for="p in data.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><div><b>{{ p.name }}</b><span>{{ p.title }}</span></div><small>{{ p.direct ? '直接相关' : '相邻工作' }} · {{ p.version }}</small></a>
      </div>
      <div v-else-if="tab==='研究定位'" class="reference-prose">
        <h2>各篇论文做了什么，我们接着看什么</h2>
        <p>研究定位页分别看训练方法和深度–步数分析。同一篇论文可以同时涉及两者。Looped-DiT 用深监督和注意力调节训练循环，并在 §3.2 图 6 比较同样 FLOPs 下多循环与多采样的效果，结论适用于这些测试设置。ELT 用自蒸馏训练浅出口；§2 认为减少每步计算和减少采样步数可以配合，但没有给出同时分配两种预算的方法。</p>
        <p>LiFT 让不同深度学习不同预测目标，§4.4 和附录 A.3 比较不同 K×T 组合的效果与成本。附录 B.3–B.4 还检查预测沿深度怎样变化、换一种深度划分后最终预测是否接近，以及这些差异怎样随生成时间 t 改变。它有机制分析，但没有学出根据当前状态决定继续 Loop 还是推进采样的策略。</p>
        <p>Depth as Time 的 §4 图 5–7 观察到：每个采样步内，预测还会逐层变化。改变 MeanFlow 要到达的目标时间后，中间层可能先给出更干净的图像，再回到要求的带噪终点。§5 则进一步训练带内部时钟的共享块，压缩教师的层间计算。</p>
        <p>Depth–Step dynamics（深度和步数怎样相互影响）为任务分工提供机制背景。后续按 idea 路径展开两个设计：微调时用什么监督信号让深浅循环承担长短程任务，以及怎样依据当前状态与剩余 Compute 动态分配这两类任务。已有 checkpoint 的微调是实现基础，评估分别控制监督、调度及两者组合。</p>
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
        <p>图表使用同一个纵轴，年度与季度按类别等间距排列，横向距离不代表等长时间。<a href="https://openai.com/research/index/release/" target="_blank" rel="noopener">OpenAI 官方发布目录</a>将 GPT-6 Astra 发布记为 2026-09-03，<a href="https://openai.com/index/gpt-6-astra/" target="_blank" rel="noopener">发布原文</a>作为背景链接。节点标在 Q3 内，不将整个 Q3 当作发布之后。</p>
        <p>样本中 2026 年 8 月有 14 篇、9 月 29 篇。历史记录多只有月份，9 月包含发布前后的论文；现有数据不足以证明“发布后关注持续增加”，也不能把同月发文增加归因为 GPT-6。这些计数不支持 GPT-6 采用循环架构的判断。</p>
        <p>研究动机是对已读文献证据边界的归纳：已有 Looped-DiT、ELT、LiFT 和 LoopREG 等报告局部收益，因此不写“循环的好处没有在 Diffusion 上验证”。仍需系统研究其机制、跨设置的适用范围，以及固定预算下相对增加采样步数的收益；不据此断言既有机制研究完全空白。</p>
        <p>GET 与 Depth as Time 是单步蒸馏生成器，在广义集合中保留，但不计入直接 Loop Diffusion。FPDM 属于去噪器内部固定点迭代，计入 2024 年直接相关工作。文献库署名：{{ timeline.source.attribution }}；{{ timeline.source.license }}。复算口径和全部条目随源文档保存。</p>
      </div>
      <div v-else-if="tab==='广义清单'">
        <a class="reference-row broad-row" v-for="p in timeline.papers" :key="p.id" :href="p.url" target="_blank" rel="noopener"><time>{{ p.date }}</time><div><span>{{ p.title }}</span></div><small>{{ p.direct ? 'Loop Diffusion' : '广义相关' }}</small></a>
      </div>
      <div v-else-if="tab==='ELT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2604.09168v3#S4" target="_blank" rel="noopener">ELT v3 · §4–5、图 3、表 2 ↗</a></h2>
        <p>ILSD（Intra-Loop Self Distillation，循环内自蒸馏）每次训练随机选择中间循环数，浅出口接受真值与最深出口预测的加权监督。教师目标分支使用 stop-gradient；最深出口的真值损失始终更新共享参数；学生的真值／蒸馏权重由 λ 控制，λ 随训练从 1 线性降至 0。</p>
        <p>第 9 页将三项损失逐行对应为：深出口学真值（沿完整路径）、浅出口学真值（沿浅路径）、浅出口学深出口（蒸馏仅沿浅路径）。sg 保留教师预测的前向数值，只截断这一蒸馏目标分支的梯度，使蒸馏成为学生追教师的单向学习；不等于冻结整套教师或共享权重。弹窗的有／无 sg 梯度对照是链式法则推导：无 sg 时还会有教师目标对共享参数的导数项，两端都可被蒸馏误差拉动。深出口始终受真值损失训练，学生更新共享参数也会影响后续教师预测。这里没有声称论文做过独立的去 sg 消融，或 sg 单独保证不坍缩。</p>
        <p>为统一汇报记号，将 ELT 原文的循环数 L 改记为 K，原文的 Lmax / Lint 对应 Kmax / Kint；N 始终表示共享核心的层数，表格写作 N × K。h⁽ᵏ⁾ 是本文的第 k 轮隐状态记号，区别于教师层索引 l。</p><p>第 8 页流程图以 4 轮为结构示例，不代表论文全部训练配置。中间路径是最深路径的前缀；支持推理时在不同循环数读出；读出后才执行外部采样更新。</p>
        <p>早退类型依据附录算法 2：循环预算 L 是调用输入，执行 for range(L) 后只做一次 head 读出；没有样本相关的置信度阈值、收敛检测或学习到的 halting/router。一次调用的深度由预算指定，预算可以被外部改变；Anytime 指同一模型支持多个预算，无需为每个出口重训。论文关于跨去噪步自适应分配的讨论属于潜在延伸。</p>
        <p>ILSD 是训练中的在线联合学习：深教师仍由真值损失学习，共享参数更新；初期教师也未训练成熟，所以 λ 先为 1，之后线性减到 0。浅出口是深路径的前缀，蒸馏使其更早接近深出口的输出；不需要另一个冻结的预训练教师。§5.1 训练扩散去噪器 500K updates、batch 512；明确复用 Stable Diffusion v1.4 的预训练 VAE，masked 框架也复用预训练 tokenizer。原文未提供把现成 DiT checkpoint 转为 Loop 的后训练流程，不据此补写具体随机初始化方法。</p>
        <p>图 2 是潜在轨迹的概念示意，Solution Space 不是在线检测的停止区域。图 3 使用 MLM 头展示 masked 框架，Diffusion 对应连续预测头；完整图像在外部采样最后一步展示；中间去噪步的早退只提供当前预测，仍需推进采样。图 13 另比较多出口与完整 ILSD，DiT 中多出口训练已有明显浅层收益；不把全部收益归于蒸馏项。第 8 页的 Anytime 图按算法 2 自绘，只改变 K，固定 t、共享参数；图中的多个输出头是可选读出位置，一次调用只执行选中的出口。</p>
        <p>ELT 同时研究掩码生成与 Diffusion。扩散对照在表 2：32 层 DiT FID 3.43；8 个独立层 × 4 轮为 3.16，16 × 2 为 2.83。1 × 32 的 FID 为 10.30，说明极小共享块存在容量限制。这些行来自不同训练配置，不能称为同一 checkpoint 的扫描。摘要中的 FID 2.0 属于掩码生成，不能移用于 DiT 结果。</p>
      </div>
      <div v-else-if="tab==='Looped-DiT'" class="reference-prose">
        <h2><a href="https://arxiv.org/html/2609.40305v1#S2" target="_blank" rel="noopener">Looped-DiT v1 · §2–3、表 2 / 4 ↗</a></h2>
        <p>默认 A/B/C 为 6/5/6 块，B 执行 4 轮：独立块参数 17 组，执行 32 次。循环传递图像和文本隐状态；噪声输入不变。</p>
        <p>深监督在各轮经 C 读出，监督同一干净图像。Final + Mean 权重为 (1/3, 1/3, 1/3, 1)。固定 K 推理只读最终轮；不保证误差逐轮下降。</p>
        <p>自调节注意力有门控和 XSA（Exclusive Self Attention）两个变体。XSA 去掉注意力输出沿当前 token 自身 value 方向的分量，不等于删除注意力矩阵对角线。第 6 页结构图与 XSA 弹窗公式省略 head 下标，v̂ᵢ 为当前 token 在该注意力头中归一化的 value。SMA 在加权求和之后、Concat Heads 与 Wₒ 之前执行，Gated 和 XSA 为二选一的实现，只用于 B；每轮从当前表示重新计算调节量。XSA 不改变 α；也会去掉其他 token 输出沿 vᵢ 的分量。单头投影不放大范数，但这不保证 Wₒ 后的残差或最终图像误差逐轮减小。二维坐标仅为自绘示例。设计收益是补充 softmax 对来源权重的归一化：门控学习按 token / head 缩放输出，XSA 则以无新增参数的状态相关投影约束方向，目标是缓解重复更新对表示的侵蚀；它们并不保证识别出所有冗余或保留全部有效信息。SMA 页显示无深监督的独立消融：朴素循环 56.2、Gated 56.6、XSA 58.5。</p>
        <p>表 4，B/32 四项评测均分 ↑：朴素循环 56.2，＋深监督 57.5，＋XSA 58.5，两者结合 59.1。指标为 DPG / PRISM / CoRe / Spatial 平均分，非 FID。</p>
        <p>表 2 的训练及推理计算匹配对照：非循环深模型＋深监督 58.1，Looped-DiT＋深监督＋XSA 59.1；单次预测均为 267 GFLOPs，参数 473M / 260M。收益适用于论文测试条件，不是所有 Diffusion 模型的必要性证明。</p>
        <p>第 7 页将设计消融与结构对照分开。图 6 在 25 / 50 步配置下，用同一循环 checkpoint 的单轮＋更多步数匹配每图 FLOPs，4 轮效果更高；这不是声称所有预算下都应多 Loop。四项评测均分是 reasoning 相关能力的操作化指标，未直接测量 reasoning 用时或思考 token 效率。</p><p>效率页签的跨模型补充为表 1 的 B/16：260M、六项均分 71.5；InternVL-U 1.7B、69.0。摘要报告约 6.5 倍参数差、4.9 倍推理计算差，图 4 同时展示计算与延迟前沿；各模型使用官方设置，不能把 4.9 倍 FLOPs 差写成 4.9 倍实测速度。</p>
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
        <p>先区分经验观察与显式压缩：§3 解码单步模型的中间层，观察随深度展开的去噪样演化；§5 再将教师层间计算蒸馏为 1 或 2 个共享块。内部时钟 τ=l/L 标记教师计算进度，区间 (τₐ,τᵦ) 连同外部任务 (t,r)、类别 c 经 AdaLN（自适应层归一化）注入共享块。τ 不是通过噪声水平校准得到的时刻。</p>
        <p>附录 C.1：冻结预训练 MeanFlow 教师；共享块从教师中间层初始化，E 与 Wout 从教师复制并冻结，只训练共享块和时钟嵌入。教师与学生接收相同噪声、类别；学生沿自身状态轨迹展开，教师轨迹仅作监督。蒸馏无需真实图片：1.2M iterations、batch 32、lr 10⁻⁴，类别置空概率 0.1 支持 CFG；这不是无需训练或少量 LoRA 微调的结果。</p>
        <p>式 (7) 的状态项为平均归一化误差 Σ‖h_k−H_{kq}‖²/(K‖H_{kq}‖²)，防止深层更大的状态幅值主导损失；输出项为 λ‖(z−v)−x₀ᵀ‖²，匹配教师最终样本，v 由最终 h_K 经输出头得到，λ=1。q=L/K 为原文步距 s 的改记，避免和 LiFT 的深度坐标混淆。固定 K 分别训练；弹性学生每次从集合采 K，L/2 使用 {4,6,8,12,24}，训练更粗区间。λ 在这里为常数，区别于 ELT 的课程权重。</p>
        <p>本图为 L/2、24 层教师、1 个共享块的示意。Hₗ 指教师第 l 层隐状态。改变 K 会重新划分整个 [0,1]，外部任务始终 (t,r)=(1,0)。</p>
        <p>四轮轨迹不等于八轮轨迹的前四轮。τ 不是校准后的噪声水平；参数压缩比例也不等于计算量下降比例。</p>
        <p>参数压缩页：L/2 教师 459M、FID 4.01；单共享块学生 27.6M、K=24，FID 11.75，经 FD-loss 后训练为 4.87。附录 C.2 的 FD loss 在分别归一化的 SigLIP、Inception、MAE 空间匹配生成与真实特征统计：后训练 20K 次，lr 10⁻⁶，有效 batch 32，使用预先计算的真实 ImageNet 统计；与前面的 data-free 蒸馏分开。出处为该节所引 Yang et al.；不是仅靠轨迹蒸馏达到 4.87。学生使用 CFG，而教师将 guidance 纳入训练，不作同成本推断。
        </p><p>该工作研究单步生成及循环压缩，是相邻文献；没有计入直接 Loop Diffusion 的 11 篇。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.references-panel nav{display:flex;gap:5px;margin:15px 0 22px}.references-panel button{font:inherit;font-size:16px;border:1px solid #cad6d9;border-radius:8px;background:#edf1ef;padding:7px 8px;color:#5d747c;cursor:pointer}.references-panel button[aria-pressed=true]{background:#345d6d;color:#fff;border-color:#345d6d}.reference-body{max-height:385px;overflow:auto;padding-right:15px;overscroll-behavior:contain}.reference-row{display:grid;grid-template-columns:115px 1fr 160px;gap:18px;align-items:center;padding:12px 0;border-bottom:1px solid #dbe1dc!important;text-decoration:none!important}.reference-row time{font-size:17px;color:#829297}.reference-row b{display:block;color:#355e6d;font-size:21px;font-weight:600}.reference-row span{display:block;color:#75888e;font-size:17px;line-height:1.5}.reference-row small{font-size:16px;color:#9b6e50;text-align:right}.reference-prose p{font-size:21px;line-height:1.8;margin:16px 0}.reference-prose h2{font-size:23px}.reference-body:focus-visible{outline:2px solid #b67956;outline-offset:5px}
.timing-row{border-bottom:1px solid #dce2dc;padding:14px 0}.timing-row b{font-size:22px;color:#456d7b}.timing-row p{margin:9px 0;font-size:21px}
</style>
