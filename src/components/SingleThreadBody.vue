<script lang="ts" setup>
import { formatURL } from '../utils/formatURL';
import { formatHTML } from '@/utils/formatHTML';
import { removeEntities } from '@/utils/removeEntities';
import{ computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

const props = defineProps<{ data: SingleThreadResponse }>();

const imageIndex: Ref<number> = ref(0);
const currentIndex: ComputedRef<string> = computed(() => {
  return props.data.images[Math.abs(imageIndex.value) % props.data.images.length]
});

</script>

<template>
  <section>
    <h1>{{ removeEntities(data.title) }}</h1>
    <div class="subtitle">
      <h2>by <router-link class="user-link" :to="{ path: '/search', query: { username: data.author } }">{{ data.author }}</router-link>, in <router-link class="subreddit-link" :to="`/${data.sub}`">{{ data.sub }}</router-link></h2>
      <div>
        <img class="svg-icon" src="../assets/icons/updown.svg">
        <span>{{ data.votes }} votes</span>
      </div>
    </div>
    <p class="time">{{ data.createdAt }} ago</p>

    <h3 v-if="data.selftext" class="op">Original post</h3>
    <article v-if="data.selftext" class="thread-description" v-html="formatHTML(data.selftext)"></article>
    <a v-if="formatURL(data.url)" :href="data.url" target="_blank" class="external">{{ formatURL(data.url) }}...</a>
 
    <div v-if="!data.media?.reddit_video && data.preview" class="caption">
      <p v-if="data.media?.reddit_video">Preview</p>
      <a :href="data.url" target="_blank">
        <div class="image-bg" :style="{ backgroundImage: `url(${removeEntities(data.preview) || data.url})`}">
          <img :class="[{limitHeight: data.media?.reddit_video}, 'preview-img']" :src="removeEntities(data.preview)">
        </div>
      </a>
    </div>
    
    <!-- <div class="embed" v-if="data.embed" v-html="formatHTML(data.embed)"></div> -->

    <transition-group v-if="data.images.length" name="gallery" tag="div">
    <figure v-if="data.images.length"  class="image-bg" :key="currentIndex" :style="{ backgroundImage: `url(${removeEntities(currentIndex)})`}">
      <img class="gallery-img" :src="removeEntities(currentIndex)" referrerpolicy="origin">
      <div class="gallery-buttons">
        <span name="previous">
          <font-awesome-icon @click="() => imageIndex--" icon="fa-solid fa-circle-chevron-left"/>
        </span>
        <span name=next>
          <font-awesome-icon @click="() => imageIndex++" icon="fa-solid fa-circle-chevron-right"/>
        </span>
      </div>
    </figure>
    </transition-group>
      
    <video-player
    v-if="data.media?.reddit_video" 
    class="video-player vjs-big-play-centered"
    :src="data.media?.reddit_video.dash_url"
    :poster="removeEntities(data.preview)"
    controls
    :loop="true"
    :volume="0.6"/>
  </section>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>