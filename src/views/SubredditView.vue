<script setup lang="ts">

import { fetchSubredditData } from '@/utils/apiRequests';
import { onMounted, ref, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';

const route = useRoute();
const subredditData: Ref<any> = ref([]);

onMounted(async () => {
  subredditData.value = await fetchSubredditData(route.params.subreddit as string);
});

watch(() => route.params.subreddit, async toParams => {
  subredditData.value = await fetchSubredditData(toParams as string);
});

</script>

<template>
  <main>
    <h1>r/{{ route.params.subreddit }}</h1>
    <ul>
      <li v-for="thread in subredditData" :key="thread.id">
        <ThreadPreviewCard :item="thread"/>
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