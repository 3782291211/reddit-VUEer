<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Not found.</h1>
    <font-awesome-icon icon="fa-solid fa-face-flushed" shake />
    <router-link class="not-found" :to="{path: '/'}">Return to home.</router-link>
  </main>
</template>

<style scoped>
main {
    width: 50%;
    text-align: center;
    margin: 0 auto;
    position: relative;
    top: 30vh
}

a {
    width: fit-content;
    margin: 10px auto;
    padding: 4px 8px;
    border-radius: 7px
}

svg {
    height: 70px;
    margin: 10px;
    color: indianred;
}

h1 {
    margin-bottom: 15px
}

@media (max-width: 500px) {
    main {
        top: 20vh;
        width: 100%
    }
}
</style>