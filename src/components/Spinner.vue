<template>
  <div class="modal">
    <div class="spinner">
      <font-awesome-icon icon="spinner" spin spin-reverse size="2xl" />
    </div>
  </div>
</template>

<style scoped>

.modal {
  backdrop-filter: blur(10px);
  overflow: hidden
}
.spinner {
    font-size: 50px;
    position: fixed;
    left: 55%;
    top: 45%;
    text-align: center;
    margin-bottom: -40px;
}

@media (max-width: 1000px) {
  .spinner {
    position: fixed;
    width: 500px;
    height: 200px;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -250px; 
  }
}
</style>