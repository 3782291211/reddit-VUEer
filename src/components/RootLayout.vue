<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { searchSubreddits } from '@/utils/apiRequests';
import { fetchPopularSubreddits } from '../utils/apiRequests';
import { useRoute } from 'vue-router';
import RootLayoutTemplate from './RootLayoutTemplate.vue';

const route = useRoute();
const searchResults: Ref<string[] | []> = ref([]);
const popularSubreddits: Ref<string[] | []> = ref([]);
const searchTerm: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const noResults: Ref<boolean> = ref(false);
const formIsFocussed: Ref<boolean> = ref(false);
const timeoutID: Ref<ReturnType<typeof setTimeout> | null> = ref(null);
const activeParam: Ref<string> = ref('');
const showMenu = ref(false);
const windowWidth: Ref<number> = ref(window.innerWidth);

onMounted(async () => {
  popularSubreddits.value = await fetchPopularSubreddits();
  window.addEventListener('resize', handleWidthChange);
  window.addEventListener('click', hideResults);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleWidthChange);
  window.removeEventListener('click', hideResults);
  clearTimeout(timeoutID.value as ReturnType<typeof setTimeout>);
});

watch(() => route.params, toParam => {
  activeParam.value = toParam.subreddit as string || toParam.sortBy as string;
  showMenu.value = false;
})

const handleSubmit = async () => {
  if (!searchTerm.value) return;
  noResults.value = false;
  formIsFocussed.value = true;
  isLoading.value = true;
  searchResults.value = await searchSubreddits(searchTerm.value);
  isLoading.value = false;
  if (!searchResults.value.length) {
    noResults.value = true;
    timeoutID.value = setTimeout(() => {
      noResults.value = false;
    }, 5000);
  }
}

const activeClass = (urlPathFragment: string): 
[{ currentSubreddit: boolean, currentSort: boolean}] => {
  return [{ 
    currentSubreddit : urlPathFragment.slice(2) === activeParam.value,
    currentSort: urlPathFragment === activeParam.value
  }];
}

const hideResults = (e: MouseEvent) => {
  const targetName: string = (e.target as HTMLInputElement).name;
  if (targetName === 'search' || targetName === 'submit') return;
  if ((e.target as HTMLElement).id === 'feeds') return;
  formIsFocussed.value = false;
}

const handleFocus = () => formIsFocussed.value = true;
const handleWidthChange = () => windowWidth.value = window.innerWidth;
const roundTerminalBorders = (sub: string, resultsArray: string[]): "first" | "last" | void => {
  if (resultsArray.indexOf(sub) === 0) return 'first';
  if (resultsArray.indexOf(sub) === resultsArray.length - 1) return 'last';
}

</script>

<template>
   <RootLayoutTemplate
   v-model.trim="searchTerm"
   @handle-submit="handleSubmit"
   @handle-focus="handleFocus"
   :roundTerminalBorders="roundTerminalBorders"
   :showSearchResults="Boolean(formIsFocussed && searchResults.length)"
   :searchResults="searchResults"
   :noResults="noResults"
   :activeClass="activeClass"
   :popularSubreddits="popularSubreddits"
   :windowWidth="windowWidth"
   :isLoading="isLoading"
   />
</template>

<style lang="css" scoped src="../assets/css/root-layout.css"/>