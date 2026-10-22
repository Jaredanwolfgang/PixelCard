<script setup>
import LiftVelocityExample from './LiftVelocityExample.vue'
import PaperFigureDialog from './PaperFigureDialog.vue'
</script>

<template>
  <div class="lift-training" @click.stop @keydown.stop>
    <div class="original-control"><PaperFigureDialog paper="lift" initial="fig2" :figure-ids="['fig2']" label="查看论文原图 · Figure 2 ↗" /></div>
    <LiftVelocityExample />
  </div>
</template>

<style scoped>
.original-control{height:0;line-height:0}.original-control :deep(.figure-trigger){position:absolute;right:48px;top:35px}
</style>
