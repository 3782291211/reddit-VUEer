<script setup lang="ts">
import { fetchSubredditData } from '@/utils/apiRequests';
import { computed, onMounted, ref, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatHTML } from '@/utils/formatHTML';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';
import Spinner from '../components/Spinner.vue';
import backgroundUrl from "@/assets/images/abstract.jpg";

const route = useRoute();
const subredditData: Ref<any> = ref([]);
const isLoading = ref(false);

const fetchData = async (subreddit: string = '') => {
  isLoading.value = true;
  try {
    const response = await fetchSubredditData(subreddit || route.params.subreddit as string);
    subredditData.value = response;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchData());

watch(() => route.params.subreddit, async toParams => {
  if (!route.path.startsWith('/r')) return;
  fetchData(toParams as string);
});

const arrangeArgs = computed(() => {
  const args = [subredditData.value[1]?.publicDescription, subredditData.value[1]?.description];
  return args.map(arg => arg || '');
});


</script>

<template>
  <main>
    <div v-if="subredditData.length" class="overlay">
      <div class="header" :style="{ backgroundImage: `url(${subredditData[1]?.banner || backgroundUrl })`}">
        <img v-if="subredditData[1].icon" class="icon" :src="subredditData[1].icon">
        <h1>r/{{ route.params.subreddit }}</h1>
        <img v-if="subredditData[1].header" class="header-img" :src="subredditData[1].header">
      </div>
    </div>
    <Spinner v-if="isLoading" />
    <section v-else>
      <article v-html="formatHTML(arrangeArgs[0], arrangeArgs[1])" class="thread-description"></article>
      <ul>
        <li v-for="thread in subredditData[0]" :key="thread.id" class="thread-preview">
          <ThreadPreviewCard :item="thread"/>
        </li>
      </ul>
    </section>
  </main>
</template>

<style lang="css" scoped src="../assets/css/subreddit-view.css"/>

<!-- onMounted(async () => {
  isLoading.value = true;
  subredditData.value = await fetchSubredditData(route.params.subreddit as string);
  isLoading.value = false;
});*/

/*watch(() => route.params.subreddit, async toParams => {
  if (!route.path.startsWith('/r')) return; 
  // to prevent throwing error from fetchSubredditData when a user navigates from /r/:subreddit to /:sortBy
  isLoading.value = true;
  subredditData.value = await fetchSubredditData(toParams as string);
  isLoading.value = false;
}); -->