<script lang="ts" setup>
import { formatURL } from '../utils/formatURL';
import { formatHTML } from '@/utils/formatHTML';
import { removeEntities } from '@/utils/removeEntities';

defineProps<{
    data: any
}>();
</script>

<template>
  <section>
    <h1>{{ data.title }}</h1>
    <div class="subtitle">
      <h2>by <span>{{ data.author }}</span>, in <router-link class="subreddit-link" :to="`/${data.sub}`">{{ data.sub }}</router-link></h2>
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
  </section>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>