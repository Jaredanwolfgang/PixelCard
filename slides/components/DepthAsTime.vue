<script setup>
import { ref } from 'vue'
import katex from 'katex'
const view=ref('clock')
const tabs=[['clock','内部时钟'],['train','怎么训练'],['loss','目标函数'],['fd','FD 后训练']]
const math=(s)=>katex.renderToString(s,{throwOnError:true,output:'htmlAndMathml'})
</script>

<template>
  <div class="depth-as-time" @click.stop @keydown.stop>
    <nav aria-label="Depth as Time 机制视图"><button v-for="[key,name] in tabs" :key="key" type="button" :aria-pressed="view===key" @click="view=key">{{ name }}</button><span>MeanFlow SiT-L/2 压缩实验</span></nav>
    <InternalClock v-if="view==='clock'" />
    <div v-else-if="view==='train'" class="depth-train">
      <div class="training-input"><b>同一份噪声 z + 类别 c</b><span>24 层教师 → K = 4 的循环学生</span></div>
      <div class="training-path"><div class="path-name">冻结的教师</div><div class="path-content"><b>H₀ → H₆ → H₁₂ → H₁₈ → H₂₄</b></div><div class="path-output"><b>x₀ᵀ</b></div></div>
      <div class="training-matches"><span>↓ 匹配对应状态</span><span>↓ 匹配最终图像</span></div>
      <div class="training-path student-path"><div class="path-name">循环的学生</div><div class="path-content"><b>h₀ → h₁ → h₂ → h₃ → h₄</b></div><div class="path-output"><b>z − v</b></div></div>
      <div class="train-setup"><div><b>从教师中间块初始化</b><span>复制并冻结输入嵌入 E 与输出头；<br>只训练共享块与时钟嵌入。</span></div><div><b>靠教师监督，无需真实图片</b><span>固定 K 分别训练；弹性训练采样 K。<br>1.2M 次更新，batch 32。</span></div></div>
      <p class="depth-note">L/2 弹性训练：每次从 {4, 6, 8, 12, 24} 均匀采样 K，学习不同区间跨度。</p>
    </div>
    <div v-else-if="view==='loss'" class="depth-loss">
      <div class="loss-equation" v-html="math('\\mathcal L_{\\mathrm{comp}}=\\mathbb E_{z,c}[\\mathcal L_{\\mathrm{state}}+\\lambda\\mathcal L_{\\mathrm{out}}],\\quad q=L/K,\\quad\\lambda=1')" />
      <div class="objective-row"><div v-html="math('\\mathcal L_{\\mathrm{state}}=\\frac1K\\sum_{k=1}^K\\frac{\\lVert h_k-H_{kq}\\rVert_2^2}{\\lVert H_{kq}\\rVert_2^2}')" /><div><b>① 每一轮，学教师对应层的状态</b><span>归一化误差，避免深层大幅值主导。</span></div></div>
      <div class="objective-row"><div v-html="math('\\mathcal L_{\\mathrm{out}}=\\lVert(z-v)-x_0^{\\mathrm T}\\rVert_2^2')" /><div><b>② 最后，学教师生成的图像</b><span>v 来自最终状态；x₀ᵀ 是教师样本。</span></div></div>
      <div class="depth-example"><b>L = 24，K = 4，q = 6：</b><span>h₁ 学 H₆，h₂ 学 H₁₂，…，h₄ 学 H₂₄。</span></div>
      <p class="depth-note">不同轮次学不同教师层；全部循环完成后，再约束最终输出。式 (7)。</p>
    </div>
    <div v-else class="depth-fd">
      <div class="fd-heading">蒸馏后，再让生成分布接近真实分布</div>
      <div class="fd-flow"><div><b>学生生成样本</b><span>SigLIP / Inception / MAE 特征</span></div><i>→</i><div><b>生成特征统计</b><span>均值与协方差</span></div></div>
      <div class="fd-distance"><b>优化 Fréchet Distance（FD）</b><span>与预先计算的真实 ImageNet 特征统计比较；三个特征空间分别归一化。</span></div>
      <div class="fd-contrast">轨迹蒸馏匹配教师样本；FD 直接匹配真实数据的特征统计。</div>
      <p class="depth-note">20K 次后训练，lr = 10⁻⁶，有效 batch 32。FID 11.75 → 4.87 包含此阶段。</p>
    </div>
    <div class="depth-view-source"><span v-if="view==='clock'">区间经 AdaLN（自适应层归一化）注入；τ 是计算进度，未校准为噪声时间。</span><span v-else-if="view==='train'">学生沿自身状态展开；教师轨迹作监督。图为结构示意。</span><span v-else-if="view==='loss'">L 为教师层数，q = L/K（原文 s）；λ = 1。</span><span v-else>FD 是额外后训练目标；不把其收益全部归于时钟或轨迹蒸馏。</span><a :href="`https://arxiv.org/html/2610.03626v1#${view==='clock'?'S5':view==='fd'?'A3.SS2':'A3.SS1'}`" target="_blank" rel="noopener">{{view==='clock'?'§5 · 式 (6)':view==='fd'?'附录 C.2':'附录 C.1'}} ↗</a></div>
  </div>
</template>

<style scoped>
.depth-as-time{line-height:1.4}.depth-as-time nav{display:flex;align-items:center;gap:12px;margin-bottom:12px}.depth-as-time nav button{font:inherit;font-size:20px;padding:6px 15px;border:1px solid #bdd0d2;border-radius:6px;background:#edf1ee;color:#527482;cursor:pointer}.depth-as-time nav button[aria-pressed=true]{background:#416b7b;color:#fff}.depth-as-time nav>span{margin-left:auto;font-size:18px;color:#7a9098}
.depth-view-source{display:flex;align-items:center;justify-content:space-between;gap:15px;font-size:17px;color:#7b9097;line-height:1.4;margin-top:10px}.depth-view-source a{white-space:nowrap}.depth-as-time .depth-note{font-size:19px;line-height:1.4;color:#6c858e;margin:10px 0 0}
.training-input{display:flex;align-items:center;gap:22px;margin-bottom:12px;color:#6b838c;font-size:20px}.training-input b{font-size:25px;color:#a56845;font-weight:500}.training-path{display:grid;grid-template-columns:132px 1fr 160px;align-items:center;background:#fff9;border:1px solid #d7dfda;border-radius:8px;padding:8px 18px;gap:16px}.path-name{font-size:22px;color:#6e858e}.path-content b{display:block;font-size:26px;font-weight:500;color:#a56845;letter-spacing:1px}.path-content span{display:block;color:#728991;font-size:19px;margin-top:4px}.path-output{text-align:center;border-left:1px solid #d7dfda;color:#728991;font-size:18px}.path-output b{font-size:24px;font-weight:500;color:#a56845}.student-path{background:#e9eff0}.student-path .path-content b,.student-path .path-output b{color:#416b7b}.training-matches{display:flex;justify-content:space-between;padding:6px 40px 6px 255px;font-size:19px;color:#8aa09f}.train-setup{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:12px}.train-setup b{display:block;font-size:22px;color:#416b7b;font-weight:500}.train-setup span{display:block;font-size:19px;color:#6c858e;line-height:1.5;margin-top:5px}
.loss-equation{font-size:24px;color:#416b7b;padding:6px 0 14px;text-align:center}.objective-row{display:grid;grid-template-columns:50% 1fr;align-items:center;padding:10px 18px;border-top:1px solid #d5ded8;gap:12px}.objective-row>div:first-child{font-size:23px;color:#416b7b}.objective-row>div:last-child{padding-right:12px}.objective-row b{display:block;font-size:23px;color:#416b7b;font-weight:500}.objective-row span{display:block;font-size:20px;color:#6c858e;margin-top:6px;line-height:1.5}.depth-example{display:flex;align-items:center;gap:16px;padding:10px 20px;margin-top:8px;border-radius:8px;background:#eeeade;color:#a56845;font-size:23px}.depth-example b{font-weight:500}.depth-example span{font-size:22px}
.fd-heading{font-size:28px;color:#a56845;margin-bottom:18px}.fd-flow{display:flex;align-items:center;justify-content:center;gap:35px}.fd-flow>div{text-align:center;padding:15px 25px;background:#e8eff0;border-radius:8px}.fd-flow b{display:block;font-weight:500;font-size:25px;color:#416b7b}.fd-flow span{display:block;font-size:19px;color:#6f878f;margin-top:5px}.fd-flow i{font-size:30px;font-style:normal;color:#8a9fa6}.fd-distance{padding:17px 20px;text-align:center;color:#a56845;font-size:24px}.fd-distance b{font-weight:500}.fd-distance span{display:block;font-size:20px;color:#6f878f;margin-top:6px}.fd-contrast{font-size:23px;line-height:1.4;color:#416b7b;margin:10px 0;padding:12px 18px;border-top:1px solid #cfdcd7}.fd-stages{display:grid;grid-template-columns:1fr 1fr;gap:25px}.fd-stages>div{border-top:1px solid #cfdcd7;padding:10px 12px}.fd-stages b{font-size:23px;font-weight:500;color:#416b7b}.fd-stages span{display:block;font-size:20px;line-height:1.5;color:#6f878f;margin-top:5px}
</style>
