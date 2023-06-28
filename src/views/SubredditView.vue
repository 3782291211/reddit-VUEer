<script setup lang="ts">

import { fetchSubredditData } from '@/utils/apiRequests';
import { onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';

const { params: { subreddit } } = useRoute();
const subredditData: Ref<any> = ref([]);

onMounted(async () => {
  subredditData.value = await fetchSubredditData(subreddit as string);
  console.log(subredditData.value)
});

</script>

<template>
  <main>
    <h1>{{ subreddit }}</h1>
    <ul>
      <li v-for="sub in subredditData">
        <article>
          <h2>{{ sub.title }}</h2>
          <p>{{ sub.selftext }}</p>
        </article>
      </li>
    </ul>
  </main>
</template>

<style scoped>

ul{
    list-style: none;
}

li {
    border: 1px solid gray
}

@media (min-width: 1000px) {
  main {
  margin-left: 120px;
  margin-right: 120px
}
}
</style>