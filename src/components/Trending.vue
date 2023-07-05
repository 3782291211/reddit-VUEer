<script lang="ts" setup>
import { fetchTrendingThreads } from '@/utils/apiRequests';
import { computed, onMounted, onUnmounted, ref, Ref } from 'vue';
import { formatRouteDescriptor } from '@/utils/formatRouteDescriptor';

const trendingThreads: Ref<any> = ref([]);
const currentIndex = ref(0);
const intervalId: Ref<ReturnType<typeof setInterval> | null> = ref(null);
const intervalIsPaused = ref(false);

onMounted(async () => {
    trendingThreads.value = await fetchTrendingThreads();
    intervalId.value = setInterval(() => {
        if (!intervalIsPaused.value) currentIndex.value++;
    }, 6000);
})

onUnmounted(() => {
  clearInterval(intervalId.value as ReturnType<typeof setInterval>);
})

const nextIndex = computed(() => Math.abs(currentIndex.value) % trendingThreads.value.length);

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
            <img :src=" trendingThreads[nextIndex].src" class="trending-image"/>
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

<style scoped>

.container {
    margin-left: 195px
}
.trending-threads {
  position: relative;
  top: 130px;
  margin: 0 auto 60px;
  width: 69%;
  height: 500px;
  background-color: rgba(0, 0, 0, 0.702);
  border-radius: 8px;
  box-shadow: 0 0 9px 3px black;
  transition: all 0.2s ease-in-out;
}

.trending-threads:hover {
   transform: translateY(5px);
   box-shadow: 0 0 4px 1px black;
}

.trending-subreddit {
    transition: all 0.3s linear;
}

svg {
    height: 30px;
    color: #db6937;
    transition: all 0.3s ease;
}

svg:hover {
  scale: 1.2;
}

.buttons {
  margin: 0 auto;
  position: relative;
  top: -40px;
  z-index: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 25%;
}

.trending-info {
  background-color: rgba(0, 0, 0, 0.656);
  backdrop-filter: blur(5px);
  color: white;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  border-top: 1px solid #8b817ca5;
}
.subtitle {
  padding: 0 6px 10px;
  margin: 0 8px;
}

.title {
  font-size: 22.5px;
  line-height: 1.3;
  padding: 5px 12px 0;
  margin-bottom: 6px;
}

h2 {
  position: relative;
  z-index: 1;
  background-color: #000000b6;
  backdrop-filter: blur(5px);
  padding: 8px;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  font-weight: 700;
  border-bottom: 1px solid #655650c0;
}

.author {
  color: orange;
  margin: 0;
  padding: 0 2px;
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer
}

.author:hover {
  color: rgb(123, 123, 245)
}

ul {
  list-style: none;
}

.trending-image {
  object-fit: cover;
  width: auto;
  max-width: 100%;
  height: 100%;
  padding: 0;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);
  border-radius: 10px;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active  {
  transition: all 0.6s ease-in-out;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

#spinner {
    width: 40px;
    height: 40px;
    margin: auto;
    position: relative;
    top: 140px;
    left: 48%;
}

.loading-text {
    color: #db6937;
    text-align: center;
    position: relative;
    top: 120px
}

@media (max-width: 1000px) {
  .trending-threads {
    width: 95%;
    margin: 0 auto 50px;
    top: 100px;
    border-radius: 3px;
  }

  .container {
    margin: auto
  }

  .buttons {
    margin: 0 5px 0 auto;
    justify-content: space-between;
  }

  .title, h2 {
    font-size: 18px
  }
}

@media (max-width: 400px) {
  .trending-threads {
    height: 350px
  }

  #spinner {
    top: 90px;
  }

  svg {
    height: 20px;
    width: 20px
  }

.loading-text {
    top: 75px;
    left: 10px
}

}
</style>