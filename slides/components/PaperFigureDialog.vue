<script setup>
import { computed, nextTick, ref } from 'vue'
import loopedSource from '../references/looped-dit-figures.json'
import eltSource from '../references/elt-figures.json'
import liftSource from '../references/lift-figures.json'
const props = defineProps({ paper:{type:String,default:'looped-dit'}, initial:{type:String,default:'fig4'}, figureIds:{type:Array,default:()=>[]}, label:{type:String,default:'查看论文原图 ↗'} })
const source = computed(()=>props.paper==='lift'?liftSource:props.paper==='elt'?eltSource:loopedSource)
const paperName = computed(()=>props.paper==='lift'?'LiFT':props.paper==='elt'?'ELT':'Looped-DiT')
const open = ref(false)
const selectedId = ref(props.initial)
const zoomed = ref(false)
const failed = ref(false)
const trigger = ref(null)
const dialog = ref(null)
const figures = computed(()=>source.value.figures.filter(f=>!props.figureIds.length||props.figureIds.includes(f.id)))
const selected = computed(()=>figures.value.find(f=>f.id===selectedId.value)||figures.value[0])
const index = computed(()=>figures.value.indexOf(selected.value))
const asset = computed(()=>`${import.meta.env.BASE_URL}${selected.value.file}`)
const pdfLink = computed(()=>selected.value.url||`${source.value.source}#page=${selected.value.page}`)
async function show(){open.value=true;zoomed.value=false;failed.value=false;await nextTick();dialog.value?.focus()}
function close(){open.value=false;trigger.value?.focus()}
function change(id){selectedId.value=id;zoomed.value=false;failed.value=false}
function move(delta){change(figures.value[(index.value+delta+figures.value.length)%figures.value.length].id)}
function trap(e){
 if(e.key!=='Tab')return
 const nodes=dialog.value?.querySelectorAll('button:not(:disabled), select, a[href], [tabindex="0"]')
 if(!nodes?.length)return
 const first=nodes[0],last=nodes[nodes.length-1]
 if(e.target===dialog.value||(!e.shiftKey&&e.target===last)||(e.shiftKey&&e.target===first)){e.preventDefault();(e.shiftKey?last:first).focus()}
}
</script>

<template>
  <span class="paper-figure-control" @click.stop @keydown.stop>
    <button ref="trigger" class="figure-trigger" type="button" aria-haspopup="dialog" :aria-expanded="open" @click="show">{{ label }}</button>
    <div v-if="open" class="figure-shade" @click.self="close">
      <section ref="dialog" class="figure-dialog" role="dialog" aria-modal="true" :aria-label="paperName+' 论文原图'" tabindex="-1" @keydown.esc.stop.prevent="close" @keydown="trap">
        <header><b>{{ paperName }} · 论文原图</b><select aria-label="选择论文图表" :value="selected.id" @change="change($event.target.value)"><option v-for="f in figures" :key="f.id" :value="f.id">{{ f.title }}</option></select><button type="button" @click="close" aria-label="关闭论文原图">关闭 ×</button></header>
        <div class="figure-stage" :class="{'is-zoomed':zoomed}" tabindex="0" aria-label="原图查看区域，可滚动"><img v-if="!failed" :src="asset" :alt="`${source.version}，${selected.page ? `PDF 第 ${selected.page} 页，` : ''}${selected.title}`" :width="selected.width" :height="selected.height" @error="failed=true"/><p v-else>图片未加载，请打开下方原始 PDF。</p></div>
        <p class="figure-note">{{ selected.note }}</p>
        <footer><div class="figure-actions"><button type="button" @click="move(-1)">← 上一张</button><button type="button" @click="move(1)">下一张 →</button><button type="button" :aria-pressed="zoomed" @click="zoomed=!zoomed">{{ zoomed?'适合窗口':'放大查看' }}</button></div><a :href="pdfLink" target="_blank" rel="noopener">{{ selected.originalLabel || `原 PDF · 第 ${selected.page} 页 ↗` }}</a></footer>
        <div class="figure-credit">{{ source.attribution }} · {{ source.version }} · {{ source.license }} · {{ source.extraction || 'PDF 直接截取，未改动图表内容' }}</div>
      </section>
    </div>
  </span>
</template>

<style scoped>
.paper-figure-control{display:inline-flex;vertical-align:middle;line-height:1.4}.figure-trigger{font:inherit;font-size:17px;color:#416f83;background:#eaf0ee;border:1px solid #b9cdd0;border-radius:6px;padding:5px 10px;cursor:pointer;white-space:nowrap}.figure-shade{position:absolute;inset:12px;z-index:90;background:#20394380;padding:12px;border-radius:12px;display:flex}.figure-dialog{display:flex;flex-direction:column;min-height:0;width:100%;padding:16px 20px;border:1px solid #cbd7d4;border-radius:10px;background:#f8f6f0;outline:none;color:#416575;gap:10px}.figure-dialog header{display:flex;align-items:center;gap:15px}.figure-dialog header b{font-size:25px;font-weight:600;margin-right:auto;white-space:nowrap}.figure-dialog button,.figure-dialog select{font:inherit;font-size:18px;padding:5px 10px;border:1px solid #b7ccd0;border-radius:5px;background:#edf2ef;color:#416f83;cursor:pointer}.figure-dialog select{max-width:460px}.figure-stage{flex:1;min-height:0;background:#fff;border:1px solid #d8e0dc;overflow:auto;display:flex;align-items:center;justify-content:center;overscroll-behavior:contain}.figure-stage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;flex-shrink:0}.figure-stage.is-zoomed{display:block}.figure-stage.is-zoomed img{width:160%;height:auto;max-width:none;max-height:none}.figure-dialog .figure-note{font-size:19px;line-height:1.45;color:#9e6847;margin:0!important}.figure-dialog footer{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:18px}.figure-actions{display:flex;gap:8px}.figure-dialog footer a{white-space:nowrap}.figure-credit{font-size:15px;color:#7b9097;line-height:1.35}
</style>
