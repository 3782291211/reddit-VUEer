<script lang="ts" setup>
import { formatURL } from '../utils/formatURL';
import { formatHTML } from '@/utils/formatHTML';
import { removeEntities } from '@/utils/removeEntities';
import{ computed, ComputedRef, ref } from 'vue';

const props = defineProps<{ data: SingleThreadResponse }>();

const imageIndex = ref(0);
const currentIndex: ComputedRef<string> = computed(() => {
  return props.data.images[Math.abs(imageIndex.value) % props.data.images.length]
});

</script>

<template>
  <section>
    <h1>{{ data.title }}</h1>
    <div class="subtitle">
      <h2>by <router-link class="user-link" :to="{ path: '/search', query: { username: data.author } }">{{ data.author }}</router-link>, in <router-link class="subreddit-link" :to="`/${data.sub}`">{{ data.sub }}</router-link></h2>
      <div>
        <img class="svg-icon" src="../assets/icons/updown.svg">
        <span>{{ data.votes }} votes</span>
      </div>
    </div>

    <h3 v-if="data.selftext" class="op">Original post</h3>
    <article v-if="data.selftext" class="thread-description" v-html="formatHTML(data.selftext)"></article>
    <a v-if="formatURL(data.url)" :href="data.url" target="_blank" class="external">{{ formatURL(data.url) }}...</a>
    
    <div v-if="data.preview" class="caption">
      <p v-if="data.media?.reddit_video">Preview</p>
      <a :href="data.url" target="_blank">
        <div class="image-bg" :style="{ backgroundImage: `url(${removeEntities(data.preview) || data.url})`}">
          <img class="preview-img" :src="removeEntities(data.preview)" @error="e => (e.target as HTMLImageElement).src = data.url">
        </div>
      </a>
    </div>
    
    <div class="embed" v-if="data.embed" v-html="formatHTML(data.embed)"></div>

    <figure v-if="data.images.length">
      <div class="image-bg" :style="{ backgroundImage: `url(${removeEntities(currentIndex)})`}">
        <img class="gallery-img" :src="removeEntities(currentIndex)" referrerpolicy="origin">
      </div>
      <div class="gallery-buttons">
        <span name="previous">
          <font-awesome-icon @click="() => imageIndex--" icon="fa-solid fa-circle-chevron-left"/>
        </span>
        <span name=next>
          <font-awesome-icon @click="() => imageIndex++" icon="fa-solid fa-circle-chevron-right"/>
        </span>
      </div>
    </figure>
      
    <video v-if="data.media?.reddit_video" controls>
      <source :src="data.media?.reddit_video.fallback_url" type="video/mp4">
      Video not supported.
    </video>
  </section>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>