<script lang="ts" setup>

defineProps<{
    errorMsg: string
}>();

</script>

<template>

<div id="myModal" class="modal">
  <div class="modal-content">
    <button class="close" @click="$emit('close')">Dismiss</button>
    <p class="message">{{ errorMsg }}</p>
  </div>
</div>

</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.633); /* Black w/ opacity */
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #1E2129;
  margin: 50% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 60%;
  height: 8%;
  font-size: 1.5vw;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
  /* float: right; */
  font-size: 1.5vw;
  border-radius: 8px;
  padding: 8px 12px;
  border: none;
}

.close:hover {
  cursor: pointer;
  background: whitesmoke;
  scale: 0.95
}

.message {
  width: 80%;
}
</style>