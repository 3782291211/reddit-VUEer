<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { searchSubreddits } from '@/utils/apiRequests';
import { fetchPopularSubreddits } from '../utils/apiRequests';
import { useRoute } from 'vue-router';
import list from '../assets/list.vue';
import close from '../assets/close.vue';

const searchResults: Ref<string[]> = ref([]);
const popularSubreddits: Ref<any> = ref([]);
const searchTerm: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const inputIsBlurred: Ref<boolean> = ref(true);
const activeParam: Ref<string> = ref('');
const showMenu = ref(false);
const windowWidth = ref(window.innerWidth);
const route = useRoute();

onMounted(async () => {
  popularSubreddits.value = await fetchPopularSubreddits();
  window.addEventListener('resize', handleWidthChange);
});

onUnmounted(() => window.removeEventListener('resize', handleWidthChange));

watch([searchTerm, inputIsBlurred], async ([newSearchTerm]) => {
    if (inputIsBlurred.value) return;
    isLoading.value = true;
    searchResults.value = await searchSubreddits(newSearchTerm);
    isLoading.value = false;
});

watch(() => route.params, toParam => {
  activeParam.value = toParam.subreddit as string || '';
})

const noResults = computed(() => {
    return searchTerm.value 
    && !searchResults.value.length 
    && !inputIsBlurred.value;
})

const showSearchResults = computed(() => {
  return searchResults.value.length && !inputIsBlurred.value;
})

const handleBlur = (e: FocusEvent) => {
  const targetName = (e.relatedTarget as any).name;
  if (targetName === "link") return;
  inputIsBlurred.value = true;
 // searchResults.value = [];
}

const handleFocus = () => inputIsBlurred.value = false;
const handleWidthChange = () => windowWidth.value = window.innerWidth;
const roundTerminalBorders = (sub: string, resultsArray: string[]) => {
  if (resultsArray.indexOf(sub) === 0) return 'first';
  if (resultsArray.indexOf(sub) === resultsArray.length - 1) return 'last';
}

</script>

<template>
  <!-- <Sidebar :show-menu="showMenu" :search-term="searchTerm" :handle-blur="handleBlur" :handle-focus="handleFocus"/> -->

  <list v-if="!showMenu" class="mobile" @click="() => showMenu = true"/>
  <close v-if="showMenu" class="mobile" @click="() => showMenu = false"/>
  <section v-if="showMenu || windowWidth > 1000" id="feeds">
    <h3>Filter threads</h3>
    <div class="router-links">
      <RouterLink to="/">Popular</RouterLink>
      <RouterLink to="/">Hot</RouterLink>
      <RouterLink to="/">New</RouterLink>
      <RouterLink to="/">Best</RouterLink>
      <RouterLink to="/">Top</RouterLink>
    </div>
    <label for="search">Search subreddits</label>  
    <input id="search" v-model.trim="searchTerm" @blur="handleBlur" @focus="handleFocus">
    <ul name="search-results" v-if="showSearchResults">
      <li v-for="subreddit in searchResults" :key="subreddit">
        <a name="link" :href="`/${subreddit}`"><p :class="[roundTerminalBorders(subreddit, searchResults), 'search-results']">{{ subreddit }}</p></a>
      </li>
    </uL>
    <p class="no-results" v-else-if="noResults">No results.</p>
    <template v-if="!showSearchResults">
    <h3>Popular subreddits</h3>
      <ul name="popular-subreddits">
        <li v-for="subreddit in popularSubreddits" :key="subreddit">
          <router-link :class="[{ current : subreddit.slice(2) === activeParam }, 'popular']" :to="`/${subreddit}`">{{ subreddit }}</router-link>
        </li>
      </ul>
    </template>
  </section>
</template>

<style lang="css" scoped src="../assets/root-layout.css"/>