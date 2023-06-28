<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, Ref, watch } from 'vue';
import { searchSubreddits } from '@/utils/apiRequests';

const searchResults = ref([]);
const searchTerm: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const inputIsBlurred: Ref<boolean> = ref(true);

// Trigger a new search with each update to the search field
watch([searchTerm, inputIsBlurred], async ([newSearchTerm]) => {
    if (inputIsBlurred.value) return;
    isLoading.value = true;
    searchResults.value = await searchSubreddits(newSearchTerm);
    isLoading.value = false;
});

const noResults = computed(() => {
    return searchTerm.value.trim() 
    && !searchResults.value.length 
    && !inputIsBlurred.value;
})

const handleBlur = (e: FocusEvent) => {
  const targetName = (e.relatedTarget as any).name;
  if (targetName === "link") return;
  inputIsBlurred.value = true;
  searchResults.value = [];
}

const handleFocus = () => inputIsBlurred.value = false;

</script>

<template>
  <section id="feeds">
    <label for="search">Search subreddits</label>  
    <input id="search" v-model="searchTerm" @blur="handleBlur" @focus="handleFocus">
    <ul v-if="searchResults.length">
      <li v-for="subreddit in searchResults">
        <a name="link" :href="`/${subreddit}`"><p class="search-results">{{ subreddit }}</p></a>
      </li>
    </uL>
    <p v-else-if="noResults">No results.</p>
    <h3>Popular subreddits</h3>
  </section>
</template>

<style scoped>
#feeds {
  width: 150px;
  position: fixed;
  top: 20%;
  left: 1%
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
.search-results:hover {
    background-color: rgb(255, 82, 3);
    color: rgb(255, 255, 255);
    cursor: pointer;
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

</style>