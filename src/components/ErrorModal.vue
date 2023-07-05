<script lang="ts" setup>
import { useRouter } from 'vue-router';


defineProps<{
    errorMsg: string
}>();

const router = useRouter();

</script>

<template>

<div class="modal">
  <div class="modal-content">
    <h2>There was an error.</h2>
    <div class="flex">
      <button class="close" @click="$emit('close')">Dismiss</button>
      <button @click="() => router.go(-1)" class="close margin-right">Return</button>
      <p class="message">{{ errorMsg }}</p>
    </div>
  </div>
</div>

</template>

<style lang="css" scoped src="../assets/error-modal.css"></style>