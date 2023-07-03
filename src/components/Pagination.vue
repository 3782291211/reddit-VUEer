<script setup lang="ts">

defineProps<{
    pagination: Pagination
}>();

</script>

<template>
  <div class="pagination">
    <img v-if="pagination.countOffset > 25" @click="$emit('handlePagination', $event)" name="previous" class="arrow" src="@/assets/images/left.svg"/>
    <img @click="$emit('handlePagination', $event)" name="next" class="arrow" src="@/assets/images/right.svg"/>
  </div>
</template>

<style lang="css" scoped src="../assets/css/popular-threads.css"></style>