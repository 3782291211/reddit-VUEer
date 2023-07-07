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
    width: 40%;
    text-align: center;
    margin: 0 auto;
    position: relative;
    top: 30vh;
    left: 50px;
    background-color: #15171c;
    border-radius: 20px
}

a {
    width: fit-content;
    margin: 20px auto 0;
    padding: 4px 8px;
    border-radius: 7px
}

svg {
    height: 200px;
    margin: 10px;
    color: indianred;
}

h1 {
    margin-bottom: 15px;
    padding-top: 40px;
}

@media (max-width: 1000px) {
    main {
        left: 0;
        top: 20vh;
        width: 80%
    }
}

@media (max-width: 500px) {
    main {
        width: 90%
    }

    svg {
        height: 100px
    }
}
</style>