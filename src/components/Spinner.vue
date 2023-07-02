<template>
    <div class="spinner">
      <font-awesome-icon icon="spinner" spin spin-reverse size="2xl" />
    </div>
</template>

<style scoped>
.spinner {
    font-size: 50px;
    position: fixed;
    left: 55%;
    top: 45%;
    text-align: center;
    margin-bottom: -40px
}

@media (max-width: 1000px) {
  .spinner {
    left: 39%;
}
}
</style>