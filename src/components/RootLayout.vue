<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { searchSubreddits } from '@/utils/apiRequests';
import { fetchPopularSubreddits } from '../utils/apiRequests';
import { useRoute } from 'vue-router';
import list from '../assets/icons/list.vue';
import close from '../assets/icons/close.vue';
import SearchBar from '../components/SearchBar.vue';

const route = useRoute();
const searchResults: Ref<string[] | []> = ref([]);
const popularSubreddits: Ref<string[] | []> = ref([]);
const searchTerm: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const inputIsBlurred: Ref<boolean> = ref(true);
const activeParam: Ref<string> = ref('');
const showMenu = ref(false);
const windowWidth: Ref<number> = ref(window.innerWidth);

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
  activeParam.value = toParam.subreddit as string || toParam.sortBy as string;
  showMenu.value = false;
})

const noResults: ComputedRef<boolean> = computed(() => {
    return Boolean(searchTerm.value 
    && !searchResults.value.length 
    && !inputIsBlurred.value);
})

const showSearchResults: ComputedRef<boolean> = computed(() => {
  return Boolean(searchResults.value.length && !inputIsBlurred.value);
});

const activeClass = (urlPathFragment: string) => {
  return [{ 
    currentSubreddit : urlPathFragment.slice(2) === activeParam.value,
    currentSort: urlPathFragment === activeParam.value
  }];
}

const handleBlur = (e: FocusEvent) => {
  const targetName: string = (e.relatedTarget as any)?.name;
  if (targetName === "link") return;
  inputIsBlurred.value = true;
}

const handleFocus = () => inputIsBlurred.value = false;
const handleWidthChange = () => windowWidth.value = window.innerWidth;
const roundTerminalBorders = (sub: string, resultsArray: string[]) => {
  if (resultsArray.indexOf(sub) === 0) return 'first';
  if (resultsArray.indexOf(sub) === resultsArray.length - 1) return 'last';
}

</script>

<template>
  <header>
    <h2 class="banner">reddit VUEer</h2>
    <router-link id="home" :to="{ path: '/' }"><font-awesome-icon icon="fa-solid fa-icons" beat-fade style="--fa-animation-duration: 3.5s"/></router-link>
    <SearchBar v-if="windowWidth > 1000"/>
  </header>
  <div class="menu-controls">
    <list v-if="!showMenu" class="mobile" @click="() => showMenu = true"/>
    <close v-if="showMenu" class="mobile" @click="() => showMenu = false"/>
  </div>
  <section v-if="showMenu || windowWidth > 1000" id="feeds">
    <h3 class="filter">Filter threads</h3>
    <div class="router-links" id="router-links">
      <router-link :class="activeClass('popular')" :to="{name: 'popular', params: { sortBy: 'popular' }}">Popular</router-link>
      <router-link :class="activeClass('top')" to="/top" data-cy="top-link">Top</router-link>
      <router-link :class="activeClass('rising')" to="/rising" data-cy="rising-link">Rising</router-link>
      <router-link :class="activeClass('hot')" to="/hot" data-cy="hot-link">Hot</router-link>
      <router-link :class="activeClass('new')" to="/new" data-cy="new-link">New</router-link>
      <router-link :class="activeClass('best')" to="/best" data-cy="best-link">Best</router-link>
    </div>
    <label v-if="windowWidth < 1000">Search threads</label> 
    <SearchBar v-if="windowWidth < 1000" :class="{mobileSearchbar: windowWidth < 1000}"/>
    <label v-if="windowWidth < 1000" class="search-users">Search users</label>  
    <label for="search" class="search-subreddits">Search subreddits</label>  
    <div class="flex">
      <input id="search" v-model.trim="searchTerm" @blur="handleBlur" @focus="handleFocus">
      <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat />
    </div>
    <ul name="search-results" v-if="showSearchResults">
      <li v-for="subreddit in searchResults" :key="subreddit">
        <a name="link" :href="`/${subreddit}`"><p :class="[roundTerminalBorders(subreddit, searchResults), 'search-results']">{{ subreddit }}</p></a>
      </li>
    </uL>
    <p class="no-results" v-else-if="noResults">No results.</p>
    <template v-if="!showSearchResults">
    <h3>Popular subreddits</h3>
      <ul v-if="popularSubreddits.length" name="popular-subreddits">
        <li v-for="subreddit in popularSubreddits" :key="subreddit">
          <router-link :class="[...activeClass(subreddit), 'popular']" :to="`/${subreddit}`">{{ subreddit }}</router-link>
        </li>
      </ul>
      <font-awesome-icon v-else icon="spinner" spin transform="right-90% up-19" spin-reverse size="2xl" />
    </template>
  </section>
</template>

<style lang="css" scoped src="../assets/css/root-layout.css"/>