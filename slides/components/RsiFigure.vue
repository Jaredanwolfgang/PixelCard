<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
const props = defineProps({ file: String, alt: String, caption: String, height: { type: String, default: '320px' } })
const dialog = ref(null)
const asset = computed(() => `${import.meta.env.BASE_URL}${props.file}`)
function show() { dialog.value?.showModal() }
function close() { dialog.value?.close() }
onBeforeUnmount(close)
</script>

<template>
  <figure class="rsi-figure" @keydown.enter.stop @keydown.space.stop>
    <button type="button" class="rsi-figure-trigger" aria-haspopup="dialog" :aria-label="`放大：${alt}`" @click.stop="show">
      <img :src="asset" :alt="alt" :style="{ height }" />
    </button>
    <figcaption>{{ caption }}</figcaption>
    <Teleport to="body">
      <dialog ref="dialog" class="rsi-image-dialog" aria-label="原图放大查看" @keydown.stop @click.stop>
        <form method="dialog"><button type="submit" autofocus>关闭 ×</button><a :href="asset" target="_blank" rel="noopener">单独打开原图 ↗</a></form>
        <img :src="asset" :alt="alt" />
        <p>{{ caption }}</p>
      </dialog>
    </Teleport>
  </figure>
</template>

<style scoped>
.rsi-figure { margin:0; min-width:0; }
.rsi-figure-trigger { display:block; width:100%; padding:0; border:0; background:transparent; cursor:zoom-in; }
.rsi-figure img { display:block; width:100%; object-fit:contain; }
.rsi-figure figcaption { font-size:15px; color:#667c84; line-height:1.4; margin-top:8px; }
.rsi-image-dialog { position:fixed; inset:2vh 2vw; z-index:1000; width:96vw; height:96vh; max-width:none; max-height:none; margin:0; padding:18px; background:#f8f6f0; color:#20333b; border:2px solid #527783; overflow:auto; }
.rsi-image-dialog::backdrop { background:#20333baa; }
.rsi-image-dialog form { display:flex; align-items:center; gap:24px; margin-bottom:15px; }
.rsi-image-dialog button { padding:8px 18px; background:#203943; color:#fff; border:0; border-radius:5px; font-size:18px; cursor:pointer; }
.rsi-image-dialog a { color:#376e80; }
.rsi-image-dialog img { width:100%; height:calc(100% - 105px); object-fit:contain; }
.rsi-image-dialog p { font-size:16px; }
@media print { .rsi-image-dialog { display:none; } }
</style>
