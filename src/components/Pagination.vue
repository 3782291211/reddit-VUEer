<script setup lang="ts">

defineProps<{
    pagination: Pagination
}>();

</script>

<template>
  <div :class="[{ subredditPagination: $route.params.subreddit }, 'pagination']">
    <img v-if="pagination.countOffset > 25" @click="$emit('handlePagination', $event)" name="previous" class="arrow" src="@/assets/images/left.svg" data-cy="popular-previous"/>
    <img v-if="pagination.afterQuery && pagination.countOffset >= 25"  @click="$emit('handlePagination', $event)" name="next" class="arrow" src="@/assets/images/right.svg" data-cy="popular-next"/>
  </div>
</template>

<style lang="css" scoped src="../assets/css/popular-threads.css"></style>