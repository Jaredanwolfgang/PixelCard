<script setup>
import mapping from '../references/experiment-plan-mapping.json'
defineProps({ stage: String })
</script>
<template><div class="plan-progress"><b>{{ mapping.stages[stage].headline }}</b><p>{{ mapping.stages[stage].evidence }}</p></div></template>
<style scoped>.plan-progress{margin:17px 0 10px;border-left:3px solid #b06442;padding-left:15px}.plan-progress b{font-size:25px;font-weight:600;color:#a45836}.plan-progress p{font-size:19px;line-height:1.5;color:#5a737e;margin:6px 0!important}</style>
