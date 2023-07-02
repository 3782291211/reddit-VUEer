<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { RouteParams } from 'vue-router';
import { useRoute } from 'vue-router';
import { fetchSingleThread } from '@/utils/apiRequests';
import { formatHTML } from '../utils/formatHTML';
import { formatURL } from '../utils/formatURL';
import NestedReplies from '../components/NestedReplies.vue';
import Spinner from '../components/Spinner.vue';
import { removeEntities } from '@/utils/removeEntities';

const route = useRoute();
const data: Ref<any> = ref([]);
const isLoading = ref(false);

const fetchData = (newParams: RouteParams | null) => {
  const { subreddit, threadId, threadTitle } = newParams || route.params;
  isLoading.value = true;
  fetchSingleThread(subreddit as string, threadId as string, threadTitle as string)
  .then(response => {
    data.value = response;
    isLoading.value = false;
  })
  .catch(err => {
    console.log(err);
    isLoading.value = false;
  })
}

const formatVotesLabel = (voteCount: number): string => {
  const suffix = (voteCount > 1 || voteCount < -1) ? 's' : '';
  return isNaN(voteCount) ? '0 votes' : `${voteCount} vote${suffix}`;
}

onMounted(() => fetchData(null));

watch(() => route.params, params => {
  if (route.path.includes('/comments/')) fetchData(params);
});

</script>

<template>
  <main>
    <Spinner v-if="isLoading"/>
    <div v-else-if="data.title">
      <h1>{{ data.title }}</h1>

      <div class="subtitle">
        <h2>by <span>{{ data.author }}</span>, in <span>{{ data.sub }}</span></h2>
        <div>
          <img class="svg-icon" src="../assets/icons/updown.svg">
          <span>{{ data.votes }} votes</span>
        </div>
      </div>
      
      <h3 v-if="data.selftext" class="op">Original post</h3>
      <article v-if="data.selftext" class="thread-description" v-html="formatHTML(data.selftext)"></article>

      <a v-if="formatURL(data.url)" :href="data.url" target="_blank" class="external">{{ formatURL(data.url) }}...</a>

      <div v-if="data.preview" class="caption">
        <p v-if="data.preview && data.media?.reddit_video">Preview</p>
        <a :href="data.url" target="_blank"><img class="preview-img" :src="removeEntities(data.preview)"></a>
      </div>
      
      <div class="embed" v-if="data.embed" v-html="formatHTML(data.embed)"></div>

      <ul v-if="data.images.length">
        <li v-for="image in data.images" :key="image" name="gallery-img">
          <img class="gallery-img" :src="removeEntities(image)" referrerpolicy="origin" @error="() => console.log('yayaya')">
        </li>
      </ul>
      <video v-if="data.media?.reddit_video" controls>
        <source :src="data.media?.reddit_video.fallback_url" type="video/mp4">
        Video not supported.
      </video>
      <section v-if="data.comments?.length">
        <h2 class="comments-heading">Comments</h2>
        <ul>
          <template v-for="item in data.comments" :key="item.id">
            <li v-if="item.author">
              <h3>{{ item.author }}</h3>
              <div class="comment-body">
                <article v-html="formatHTML(item.body)"></article>
                <div class="flex">
                  <span class="inline"><img class="svg-icon" src="../assets/icons/updown.svg">{{ formatVotesLabel(item.votes) }}</span>
                  <span v-if="item.numberOfReplies" class="float"><img class="svg-icon" src="../assets/images/bubble.svg">{{ item.numberOfReplies > 1 ? `${item.numberOfReplies} replies` : '1 reply' }}</span>
                </div>
              </div>
              <template v-if="item.numberOfReplies">
                <NestedReplies :replies="item.replies.data.children"/>
              </template>
            </li>
          </template>
        </ul>
      </section>
      <p class="no-comments" v-else>There aren't any comments for this thread.</p>
    </div>
  </main>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"> </style>

<!-- onMounted(async () => {
  isLoading.value = true;
  const { subreddit, threadId, threadTitle } = route.params;
  data.value = await fetchSingleThread(subreddit as string, threadId as string, threadTitle as string);
  isLoading.value = false;
});

watch(() => route.params, async (params) => {
  isLoading.value = true;
  const { subreddit, threadId, threadTitle } = params;
  data.value = await fetchSingleThread(subreddit as string, threadId as string, threadTitle as string);
  isLoading.value = false;
}); -->