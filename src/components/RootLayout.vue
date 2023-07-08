<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
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
const inputIsBlurred: Ref<boolean> = ref(true);
const activeParam: Ref<string> = ref('');
const showMenu = ref(false);
const windowWidth: Ref<number> = ref(window.innerWidth);

onMounted(async () => {
  popularSubreddits.value = await fetchPopularSubreddits();
  window.addEventListener('resize', handleWidthChange);
});

onUnmounted(() => window.removeEventListener('resize', handleWidthChange));

/*watch([searchTerm, inputIsBlurred], async ([newSearchTerm]) => {
    if (inputIsBlurred.value) return;
    isLoading.value = true;
    searchResults.value = await searchSubreddits(newSearchTerm);
    isLoading.value = false;
});*/

watch(() => route.params, toParam => {
  activeParam.value = toParam.subreddit as string || toParam.sortBy as string;
  showMenu.value = false;
})

const handleSubmit = async () => {
  isLoading.value = true;
  searchResults.value = await searchSubreddits(searchTerm.value);
  isLoading.value = false;
  if (!searchResults.value.length) {
    noResults.value = true;
  }
}

/*const noResults: ComputedRef<boolean> = computed(() => {
    return Boolean(searchTerm.value 
    && !searchResults.value.length 
    && !inputIsBlurred.value);
})*/

const showSearchResults: ComputedRef<boolean> = computed(() => {
  return Boolean(searchResults.value.length && !inputIsBlurred.value);
});

const activeClass = (urlPathFragment: string): 
[{ currentSubreddit: boolean, currentSort: boolean}] => {
  return [{ 
    currentSubreddit : urlPathFragment.slice(2) === activeParam.value,
    currentSort: urlPathFragment === activeParam.value
  }];
}

const handleBlur = (e: FocusEvent) => {
  const targetName: string = (e.relatedTarget as any)?.name;
  console.log(targetName)
  if (targetName === "link" || targetName === 'submit') return;
  inputIsBlurred.value = true;
}

const handleFocus = () => inputIsBlurred.value = false;
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
   @handle-blur="handleBlur"
   @handle-focus="handleFocus"
   :roundTerminalBorders="roundTerminalBorders"
   :showSearchResults="showSearchResults"
   :searchResults="searchResults"
   :noResults="noResults"
   :activeClass="activeClass"
   :popularSubreddits="popularSubreddits"
   :windowWidth="windowWidth"
   :isLoading="isLoading"
   />
</template>

<style lang="css" scoped src="../assets/css/root-layout.css"/>