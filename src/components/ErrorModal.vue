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

<style scoped>

h2 {
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.387)
}

.modal-content {
  background-color: #1E2129;
  margin: 40vh auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 60%;
  max-width: 900px;
  height: fit-content;
}

.flex {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
  border-radius: 8px;
  padding: 8px 12px;
  border: none;
  font-size: 16px;
}

.margin-right {
  margin-right: 10px;
}

.close:hover {
  cursor: pointer;
  background: whitesmoke;
  scale: 0.95
}

.message {
  width: 80%;
  font-size: 16px;
}

@media (max-width: 600px) {
  .modal-content {
    font-size: 3.5vw;
    width: 90%;
    height: fit-content;
    padding: 12px;
  }

  .message {
    width: 60%
  }

  .close, .message {
    font-size: 3.5vw
  }
}
</style>