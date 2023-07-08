<script lang="ts" setup>
import list from '../assets/icons/list.vue';
import close from '../assets/icons/close.vue';
import SearchBar from '../components/SearchBar.vue';
import { ref } from 'vue';

defineProps<{
  windowWidth: number,
  roundTerminalBorders: (sub: string, resultsArray: string[]) =>  "first" | "last" | void ,
  activeClass: (urlPathFragment: string) => [{ currentSubreddit: boolean, currentSort: boolean}],
  searchResults: string[],
  showSearchResults: boolean,
  noResults: boolean,
  popularSubreddits: string[],
  modelValue: string
}>();

defineEmits<{
  (e: 'update:modelValue'): void,
  (e: 'handleFocus'): void,
  (e: 'handleBlur', eventObject: FocusEvent): void
}>();

const showMenu = ref(false);

</script>

<template>
  <div>
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
        <router-link :class="activeClass('popular')" :to="{name: 'popular', params: { sortBy: 'popular' }}" data-cy="popular-link">Popular</router-link>
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
        <input id="search" :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" @blur="$emit('handleBlur', $event)" @focus="$emit('handleFocus')" data-cy="sidebar-search">
        <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat />
      </div>
      <ul name="search-results" v-if="showSearchResults" data-cy="sidebar-search-results">
        <li v-for="subreddit in searchResults" :key="subreddit">
          <a name="link" :href="`/${subreddit}`"><p :class="[roundTerminalBorders(subreddit, searchResults), 'search-results']">{{ subreddit }}</p></a>
        </li>
      </uL>
      <p class="no-results" v-else-if="noResults">No results.</p>
      <template v-if="!showSearchResults">
      <h3>Popular subreddits</h3>
        <ul v-if="popularSubreddits.length" name="popular-subreddits" data-cy="popular-subreddits">
          <li v-for="subreddit in popularSubreddits" :key="subreddit">
            <router-link :class="[...activeClass(subreddit), 'popular']" :to="`/${subreddit}`">{{ subreddit }}</router-link>
          </li>
        </ul>
        <font-awesome-icon v-else icon="spinner" spin transform="right-90% up-19" spin-reverse size="2xl" />
      </template>
    </section>
  </div>
  </template>

<style lang="css" scoped src="../assets/css/root-layout.css"/>