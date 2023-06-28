<script setup lang="ts">
import { computed, onMounted, ref, Ref, watch } from 'vue';
import { searchSubreddits } from '@/utils/apiRequests';
import { fetchPopularSubreddits } from '../utils/apiRequests';
import { useRoute } from 'vue-router';

const searchResults = ref([]);
const popularSubreddits: Ref<any> = ref([]);
const searchTerm: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const inputIsBlurred: Ref<boolean> = ref(true);
const activeParam: Ref<string> = ref('');
const route = useRoute();

onMounted(async () => {
  popularSubreddits.value = await fetchPopularSubreddits();
});

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

</script>

<template>
  <section id="feeds">
    <label for="search">Search subreddits</label>  
    <input id="search" v-model.trim="searchTerm" @blur="handleBlur" @focus="handleFocus">
    <ul v-if="showSearchResults">
      <li v-for="subreddit in searchResults">
        <a name="link" :href="`/${subreddit}`"><p class="search-results">{{ subreddit }}</p></a>
      </li>
    </uL>
    <p v-else-if="noResults">No results.</p>
    <template v-if="!showSearchResults">
    <h3>Popular subreddits</h3>
      <ul>
        <li v-for="subreddit in popularSubreddits" :key="subreddit">
          <router-link :class="[{ current : subreddit.slice(2) === activeParam }, 'popular']" :to="`/${subreddit}`">{{ subreddit }}</router-link>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
#feeds {
  width: 150px;
  position: fixed;
  top: 20%;
  left: 1%;
}

input {
  width: 100%;
  height: 25px;
  font-size: 15px;
}

label {
    display: block;
    margin-bottom: 4px
}

ul {
    list-style: none;
    padding: 0;
}
.search-results {
    background-color: whitesmoke;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 5px
}
.search-results:hover, .popular:hover, .current {
    background-color: rgb(255, 82, 3);
    color: rgb(255, 255, 255);
    cursor: pointer;
}

.popular {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 6px;
  transition: 0.4s;
  border-radius: 4px
}

@media (max-width: 1000px) {
  #feeds {
    display: none;
  }
}

@media (max-width: 1200px) {
  #feeds {
    left: 1%;
  }
}

@media (hover: hover) {
  li:hover {
    background-color: rgb(251, 200, 92);
    border-radius: 4px;
    color: black;
  }
}

</style>