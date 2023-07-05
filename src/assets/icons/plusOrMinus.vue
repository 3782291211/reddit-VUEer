<script lang="ts" setup>
defineProps<{
  shape: string
}>();
</script>

<template>
<svg v-if="shape === 'plus'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ff5203" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
</svg>

<svg v-else-if="shape === 'minus'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
</svg>

</template>

<style scoped>
svg {
  margin-right: 5px;
  margin-bottom: -6px;
}

svg:hover {
  fill: white;
  height: 20px;
  width: 20px;
}
</style>