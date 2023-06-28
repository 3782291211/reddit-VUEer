<script setup lang="ts">

import { computed, ref } from 'vue';
import { formatHTML } from '../utils/formatHTML';
import { formatURL } from '../utils/formatURL';

const { item } = defineProps<{ item: Subreddit }>();

const showImage = ref(true);
const showThumbnail = ref(true);
const thumbnailSrc = computed(() => {
  return !showImage && !item.media && showThumbnail;
})

</script>

<template>
  <a :href="item.url">
    <h2>{{ item.title }}</h2>
    <article>
      <span>By {{ item.author }}</span>
      <span>{{ item.created }}</span>
      <p>{{ item.subreddit }}</p>
      <p>Ups: {{ item.ups }} | downs: {{ item.downs }}</p>
      <a class="external" v-if="formatURL(item.src)" :href="item.src">{{ formatURL(item.src) + '..' }}</a>
      <img v-if="showImage" referrerpolicy="no-referrer" :src="item.src" @error="() => showImage = false"/>
      <img v-if="thumbnailSrc" :src="item.thumbnail" @error="() => showThumbnail = false" style="display: inline"/>
      <div id="v-html" v-if="item.selftext" v-html="formatHTML(item.selftext)"></div>
      <video v-if="item.media" width="400" height="300" controls>
        <source :src="item.media" type="video/mp4">
        Your browser does not support this file format.
      </video>
    </article>
  </a>
</template>

<style>

article {
  padding: 10px 0;
}

#v-html {
  max-height: 300px;
  overflow-y: auto;
}

#v-html p {
  margin: 7px 0;
}

img {
  display: block;
  max-height: 350px;
  margin: 0 auto
}

a.external {
  color: orange
}

video {
  display: block;
  margin: 0 auto
}

.body {
  color: orange
}

@media (hover: hover) {
  a.external:hover {
    background-color: rgb(251, 200, 92);
    padding: 4px;
    border-radius: 4px;
    color: black
  }
}

</style>