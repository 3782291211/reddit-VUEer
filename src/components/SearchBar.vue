<script setup lang="ts">
import { watch, ref, Ref, onMounted, onUnmounted } from 'vue';
import { searchThreads } from '@/utils/apiRequests';
import { useRoute } from 'vue-router';

const searchTerm = ref('');
const searchResults: Ref<any[]> = ref([]);
const showResults = ref(true);
const route = useRoute();

const handleSubmit = async () => {
  showResults.value = true;
  searchResults.value = await searchThreads(searchTerm.value);
}

//const emit = defineEmits(['showingResults']);

const handleClick = (e: Event) => {
  if ((e.target as any).name === "link") return;
  showResults.value = false;
}

onMounted(() => document.addEventListener('click', handleClick));
onUnmounted(() => document.removeEventListener('click', handleClick));

watch(() => route.path, () => {
  showResults.value = false;
});

/*watch(() => showResults.value, () => {
  emit('showingResults', showResults.value);
})*/

</script>

<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <input v-model.trim="searchTerm" type="text" placeholder="Search threads" :class="{searching: searchResults.length}">
      <input type="submit" value="Search">
      <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat />
    </form>
    <ul v-if="searchResults.length && showResults" name="search-results">
      <li v-for="thread in searchResults" :key="thread.id">
        <router-link name="link" :to="`${thread.link}`" :class="['search-results']">{{ thread.title }}</router-link>
      </li>
    </ul>
  </section>
</template>

<style scoped>

section {
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 2;
  margin-left: 10px
}

form {
  margin-top: 13px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

input[type="text"] {
    /* width: 35%; */
    /* max-width: 500px; */
    width: 500px;
    color: black;
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding: 8px 20px;
    border: 1px solid rgb(86, 82, 87);
    box-shadow: 0 0 10px 0 #e94f0db3;
    z-index: 2;
}

input[type="submit"] {
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    border: 1px solid rgb(86, 82, 87);
    padding: 8px 8px;
    width: 85px;
    background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
    color: white;
    font-weight: 700;
    text-align: left;
    z-index: 2;
}

ul {
    background-color: whitesmoke;
    position: absolute;
    top: 35px;
    /* left: 28%;
    top: 35px; */
    /* width: 41.9%; */
    margin: auto auto auto -14px;
    max-width: 570px;
    list-style: none;
    padding: 13px 6px 0;
    z-index: 1;
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

.icon {
  position: relative;
  right: 26px;
  color: whitesmoke;
  z-index: 2;
}

.searching {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 6px 8px 8px;
}


@media (max-width: 1000px) {
  section {
    display: none;
  } 
}

</style>