<template>
  <div class="depth-roles">
    <svg viewBox="0 0 1000 350" role="img" aria-labelledby="depth-role-title depth-role-desc">
      <title id="depth-role-title">深浅循环分工的二维生成分布示意</title>
      <desc id="depth-role-desc">灰色等密度轮廓代表目标分布。橙色长箭头表示深循环把握较大跨度的移动方向，蓝色短箭头表示浅循环在局部修正。箭头为研究假设，不是模型实测轨迹。</desc>
      <defs>
        <marker id="depth-long-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#b06442" /></marker>
        <marker id="depth-short-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#376e80" /></marker>
      </defs>
      <path d="M45 300H935 M65 320V30" stroke="#bec8c5" fill="none" stroke-width="1.5" />
      <text x="900" y="326" class="axis">z₁</text><text x="35" y="38" class="axis">z₂</text>
      <g fill="#dfe5df" fill-opacity=".28" stroke="#aebfb5" stroke-width="1.5">
        <ellipse cx="710" cy="153" rx="208" ry="104" transform="rotate(-16 710 153)" />
        <ellipse cx="710" cy="153" rx="157" ry="76" transform="rotate(-16 710 153)" />
        <ellipse cx="710" cy="153" rx="108" ry="51" transform="rotate(-16 710 153)" />
        <ellipse cx="710" cy="153" rx="57" ry="27" transform="rotate(-16 710 153)" />
        <ellipse cx="435" cy="234" rx="107" ry="55" transform="rotate(12 435 234)" />
        <ellipse cx="435" cy="234" rx="66" ry="31" transform="rotate(12 435 234)" />
      </g>
      <g fill="none" stroke="#b06442" stroke-width="5" marker-end="url(#depth-long-arrow)">
        <path d="M132 265Q205 157 337 148" />
        <path d="M367 146Q492 61 625 94" />
      </g>
      <g fill="none" stroke="#376e80" stroke-width="3.5" marker-end="url(#depth-short-arrow)">
        <path d="M631 97L653 116" /><path d="M656 119L680 132" /><path d="M683 134L708 144" />
        <path d="M369 175L391 196" /><path d="M394 199L417 217" /><path d="M420 220L439 228" />
      </g>
      <circle cx="132" cy="265" r="6" fill="#20333b" />
      <text x="100" y="292" class="label">起始样本</text>
      <text x="170" y="100" class="deep">深循环 · 长程方向</text>
      <text x="730" y="242" class="shallow">浅循环 · 局部修正</text>
      <path d="M755 218L714 157" stroke="#376e80" stroke-width="1.5" fill="none" />
      <text x="728" y="46" class="label">目标分布的等密度轮廓</text>
    </svg>
    <div class="hypothesis">希望深度改变所学信息的尺度，而不只是重复同一种预测。</div>
    <div class="note">z₁、z₂ 为抽象状态坐标，无物理单位；箭头长度表示设想中的更新尺度。</div>
  </div>
</template>
<style scoped>
.depth-roles{margin-top:-12px}.depth-roles svg{display:block;width:100%;height:350px}.axis{fill:#7e9297;font-size:20px}.label{fill:#6b8187;font-size:20px}.deep{fill:#b06442;font-size:25px;font-weight:600}.shallow{fill:#376e80;font-size:25px;font-weight:600}.hypothesis{color:#a45836;font-size:26px;margin-top:0}.note{color:#6b8187;font-size:18px;margin-top:6px}
</style>
