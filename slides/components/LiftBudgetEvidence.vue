<script setup>
import LiftGrid from './LiftGrid.vue'
import PaperFigureDialog from './PaperFigureDialog.vue'
</script>
<template><div class="lift-budget-evidence"><LiftGrid /><PaperFigureDialog paper="lift" initial="fig5" :figure-ids="['fig5','fig9']" label="联合预算原图 ↗" /></div></template>
<style scoped>
.lift-budget-evidence :deep(.figure-trigger){position:absolute;right:48px;top:35px}.lift-budget-evidence :deep(.paper-figure-control){height:0;display:block}
</style>
