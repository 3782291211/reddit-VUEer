<script lang="ts" setup>
import { fetchTrendingThreads } from '@/utils/apiRequests';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { formatRouteDescriptor } from '@/utils/formatRouteDescriptor';

const trendingThreads: Ref<Thread[] | []> = ref([]);
const currentIndex: Ref<number> = ref(0);
const intervalId: Ref<ReturnType<typeof setInterval> | null> = ref(null);
const intervalIsPaused: Ref<boolean> = ref(false);

onMounted(async () => {
    trendingThreads.value = await fetchTrendingThreads();
    intervalId.value = setInterval(() => {
        if (!intervalIsPaused.value) currentIndex.value++;
    }, 6000);
})

onUnmounted(() => {
  clearInterval(intervalId.value as ReturnType<typeof setInterval>);
})

const nextIndex: ComputedRef<number> = 
    computed(() => Math.abs(currentIndex.value) % trendingThreads.value.length);

</script>

<template>
  <section class="container">
    <div class="trending-threads">
      <h2>Trending threads</h2>
      <div class="buttons">
        <font-awesome-icon @click="() => currentIndex--" icon="fa-solid fa-circle-chevron-left"/>
        <font-awesome-icon v-if="intervalIsPaused" @click="() => intervalIsPaused = false" icon="fa-solid fa-circle-play"/>
        <font-awesome-icon v-else @click="() => intervalIsPaused = true" icon="fa-solid fa-circle-pause"/>
        <font-awesome-icon @click="() => currentIndex++" icon="fa-solid fa-circle-chevron-right"/>
      </div>
      <transition-group v-if="trendingThreads.length" name="fade" tag="ul">
        <li v-for="i in [currentIndex]" :key="i">

          <router-link :to="formatRouteDescriptor('thread', trendingThreads[nextIndex].url)">
            <div class="image-bg" :style="{ backgroundImage: `url(${trendingThreads[nextIndex].src})`}">
              <img :src=" trendingThreads[nextIndex].src" class="trending-image"/>
            </div>
          </router-link>

          <div class="trending-info">
            
            <router-link :to="formatRouteDescriptor('thread', trendingThreads[nextIndex].url)">
              <p class="title">{{ trendingThreads[nextIndex].title }}</p>
            </router-link>
            <p class="subtitle">by
            
            <router-link :to="{ path: '/search', query: { username: trendingThreads[nextIndex].author } }">
              <span class="author">{{ trendingThreads[nextIndex].author }}</span>
            </router-link>
            in 

            <router-link :to="formatRouteDescriptor('subreddit', trendingThreads[nextIndex].url)">
              <span class="trending-subreddit">{{ trendingThreads[nextIndex].subreddit }}</span>
            </router-link>

            </p>
          </div>
        </li>
      </transition-group>
      <div v-else>
        <p class="loading-text">Fetching threads...</p>
        <font-awesome-icon id="spinner" icon="fa-solid fa-circle-notch" spin/>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped src="../assets/css/trending.css"></style>