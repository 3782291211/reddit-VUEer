<script setup lang="ts">
import { watch, ref, Ref, onMounted, onUnmounted } from 'vue';
import { searchThreads } from '@/utils/apiRequests';
import { useRoute } from 'vue-router';

const searchTerm = ref('');
const searchResults: Ref<any[]> = ref([]);
const inputIsBlurred = ref(true);
const route = useRoute();

const handleBlur = (e: FocusEvent) => {
  const targetName = (e.relatedTarget as any).name;
  console.log(targetName);
  if (targetName === "link") return;
  inputIsBlurred.value = true;
}

const handleSubmit = async () => {
  searchResults.value = await searchThreads(searchTerm.value);
}

//watch([searchTerm, inputIsBlurred], async ([newSearchTerm]) => {
  // searchResults.value = await searchThreads(newSearchTerm);
//});

watch(() => route.path, () => inputIsBlurred.value = true);

</script>

<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <input v-model.trim="searchTerm" type="text" @blur="handleBlur" @focus="() => inputIsBlurred = false" placeholder="Search threads" :class="{searching: searchResults.length && !inputIsBlurred}">
      <input type="submit" value="Search">
      <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat />
    </form>
    <ul v-if="searchResults.length && !inputIsBlurred" name="search-results">
      <li v-for="thread in searchResults" :key="thread.id">
        <router-link name="link" :to="`${thread.link}`" :class="['search-results']">{{ thread.title }}</router-link>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section {
    position: relative;
    top: 14px;
    margin: auto;
    width: 60%;
    max-width: 500px;
    text-align: center;
}

ul {
    text-align: left;
    background-color: whitesmoke;
    position: absolute;
    top: 28px;
    list-style: none;
    padding: 6px;
    z-index: 2;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.search-results {
  border-bottom: 1px solid rgba(128, 128, 128, 0.389);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; 
  -webkit-box-orient: vertical;
}

input[type="text"] {
    position: relative;
    text-align: center;
    color: black;
    border-radius: 18px;
    padding: 8px 8px;
    width: 99%;
    border: 1px solid rgb(216, 65, 41);
    box-shadow: 0 0 10px 0 #e94f0db3;
}

input[type="submit"] {
    position: relative;
    border-radius: 18px;
    border: 1px solid rgb(241, 71, 253);
    padding: 6px 4px 6px 9px;
    bottom: 31.5px;
    left: 42%;
    width: 85px;
    background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
    color: white;
    font-weight: 700;
    text-align: left;
}

.searching {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 6px 8px 8px;
}

.icon {
    position: relative;
    bottom: 31px;
    left: 37%;
    color: black
}

@media (max-width: 850px) {
  section {
    width: 40%;
  }
}
</style>