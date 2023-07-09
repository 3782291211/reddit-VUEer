<script lang="ts" setup>
import { useRouter } from 'vue-router';

defineProps<{
    errorMsg: string
}>();

const router = useRouter();

</script>

<template>

<div class="modal">
  <div class="modal-content" data-cy="error-modal">
    <h2>There was an error.</h2>
    <div class="flex">
      <div class="buttons-flex">
        <button @click="() => router.go(-1)" class="close margin-right">Return</button>
        <button class="close" @click="$emit('close')" data-cy="error-modal-dismiss">Dismiss</button>
      </div>
      <p class="message" data-cy="error-modal-msg">{{ errorMsg }}</p>
    </div>
  </div>
</div>

</template>

<style lang="css" scoped src="../assets/css/error-modal.css"></style>