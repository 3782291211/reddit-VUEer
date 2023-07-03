<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatHTML } from '../utils/formatHTML';
import { formatURL } from '../utils/formatURL';

const { item } = defineProps<{ item: Subreddit }>();
const route = useRoute();

const showImage = ref(true);
const showThumbnail = ref(true);
const thumbnailSrc = computed(() => {
  return !showImage && !item.media && showThumbnail;
})

</script>

<template>
  <router-link :to="item.url">
    <h2>{{ item.title }}</h2>
  </router-link>
  <article>
    <div class="author-votes">
      <p class="subreddit">
        By 
        <router-link class="user-link" :to="`/search/${item.author}`">{{ item.author }}</router-link>
        in 
        <router-link v-if="!route.params.subreddit" class="subreddit-link" :to="item.subreddit">{{ item.subreddit }}</router-link>
        <span class="orange" v-else>{{ item.subreddit }}</span>
      </p>
      <div class="votes">
        <img src="../assets/icons/updown.svg">
        <span>{{ item.ups + item.downs }}</span>
      </div>
    </div>
    <a class="external" v-if="formatURL(item.src)" :href="item.src" target="_blank">{{ formatURL(item.src) + '...' }}</a>
    <router-link :to="item.url">
      <div id="v-html" v-if="item.selftext" v-html="formatHTML(item.selftext)"></div>
      <img v-if="showImage" referrerpolicy="no-referrer" :src="item.src" @error="() => showImage = false"/>
      <img v-if="thumbnailSrc" :src="item.thumbnail" @error="() => showThumbnail = false" style="display: inline"/>
    </router-link>
    <video v-if="item.media" width="400" height="300" controls>
      <source :src="item.media" type="video/mp4">
      Your browser does not support this file format.
    </video>
  </article>
</template>

<style lang="css" scoped src="../assets/css/thread-preview-card.css"></style>