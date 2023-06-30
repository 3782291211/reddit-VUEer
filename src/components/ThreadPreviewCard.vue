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
      <div class="author-votes">
        <p>By {{ item.author }} in {{ item.subreddit }}</p>
        <div class="votes">
          <img src="../assets/updown.svg">
          <span>{{ item.ups + item.downs }}</span>
        </div>
      </div>
      <a class="external" v-if="formatURL(item.src)" :href="item.src" target="_blank">{{ formatURL(item.src) + '...' }}</a>
      <img v-if="showImage" referrerpolicy="no-referrer" :src="item.src" @error="() => showImage = false"/>
      <img v-if="thumbnailSrc" :src="item.thumbnail" @error="() => showThumbnail = false" style="display: inline"/>
      <div id="v-html" v-if="item.selftext" v-html="formatHTML(item.selftext)"></div>
      <video v-if="item.media" width="400" height="300" controls>
        <source :src="item.media" type="video/mp4">
        Your browser does not support this file format.
      </video>
      <!-- <div v-else v-html="formatHTML(item.embed)"></div> -->
    </article>
  </a>
</template>

<style>
h2 {
  border-bottom: 1px solid rgb(66, 62, 62);
  padding: 7px 0;
}

.votes > * {
  display: inline;
  margin: -2px 3px
}

.author-votes {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
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
  max-width: 100%;
  max-height: 400px;
  margin: 0 auto
}

a.external {
  color: orange
}

video {
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;;
  max-height: 400px
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