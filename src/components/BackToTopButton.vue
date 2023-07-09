<script lang="ts" setup>
const scrollToTop = () => window.scroll({
    top: 0,
    behavior: 'smooth'
});
</script>

<template>
<button @click="scrollToTop" class="'back-to-top'">Back to top</button>
</template>

<style scoped>
button {
  display: block;
  margin: 40px auto 0;
  padding: 9px;
  color: white;
  font-size: 15px;
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
  transition: scale 0.3s ease-in-out;
}

button:hover {
    scale: 0.9
}

@media (max-width: 600px) {
    button {
        font-size: 13px;
        padding: 7px;
    }
}
</style>