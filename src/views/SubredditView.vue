<script setup lang="ts">

import { fetchSubredditData } from '@/utils/apiRequests';
import { onMounted, ref, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatHTML } from '@/utils/formatHTML';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';

const route = useRoute();
const subredditData: Ref<any> = ref([]);

onMounted(async () => {
  subredditData.value = await fetchSubredditData(route.params.subreddit as string);
});

watch(() => route.params.subreddit, async toParams => {
  subredditData.value = await fetchSubredditData(toParams as string);
});

/*
    subscribers: data.active_user_count,
    description: data.description_html,
    headerImg: data.header_img,
    publicDescription: data.public_description_html
*/
</script>

<template>
  <main>
    <h1>r/{{ route.params.subreddit }}</h1>
    <article v-html="formatHTML(subredditData[1]?.description)" class="thread-description"></article>
    <ul>
      <li v-for="thread in subredditData[0]" :key="thread.id" class="thread-preview">
        <ThreadPreviewCard :item="thread"/>
      </li>
    </ul>
  </main>
</template>

<style lang="css" scoped src="../assets/subreddit-view.css"/>