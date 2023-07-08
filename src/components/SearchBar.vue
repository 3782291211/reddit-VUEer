<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted, computed } from 'vue';
import type { Ref } from 'vue';
import { searchThreads } from '@/utils/apiRequests';
import { useRoute } from 'vue-router';

const searchTerm = ref('');
const searchResults: Ref<SearchThreadsResponse | []> = ref([]);
const showResults = ref(true);
const isLoading = ref(false);
const showAlert = ref(false);
const alertID: Ref<ReturnType<typeof setTimeout> | null> = ref(null);
const route = useRoute();

const handleSubmit = async () => {
  isLoading.value = true;
  searchResults.value = await searchThreads(searchTerm.value);
  isLoading.value = false;
  showResults.value = true;
  searchTerm.value = ''

  if(!searchResults.value.length) {
    showAlert.value = true;
    alertID.value = setTimeout(() => {
      showAlert.value = false;
    }, 4000);
  }
}

const handleClick = (e: Event) => {
  if ((e.target as any).name === "link") return;
  showResults.value = false;
}

onMounted(() => document.addEventListener('click', handleClick));
onUnmounted(() => document.removeEventListener('click', handleClick));
onUnmounted(() => clearTimeout(alertID.value as ReturnType<typeof setTimeout>));

watch(() => route.path, () => showResults.value = false);

const roundedBorder = computed(() => {
  return {
    searching: searchResults.value.length,
    rounded: isLoading.value,
    fullWidth: isLoading.value
  }
});

</script>

<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <input v-model.trim="searchTerm" type="text" placeholder="Search threads" :class="roundedBorder">
      <div v-if="isLoading" class="spinner">
        <font-awesome-icon icon="spinner" spin spin-reverse size="2xl" />
      </div>
      <template v-else>
        <input type="submit" value="Search" :disabled="!searchTerm">
        <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat/>
      </template>
    </form>
    <ul v-if="searchResults.length && showResults" name="search-results">
      <li v-for="thread in searchResults" :key="thread.id">
        <router-link name="link" :to="`${thread.link}`" :class="['search-results']">{{ thread.title }}</router-link>
      </li>
    </ul>
    <p class="alert" v-if="showAlert">No results.</p>
    <router-link to="/search" id="users">Users
      <font-awesome-icon icon="user" transform="right-5"/>
    </router-link>
  </section>
</template>

<style lang="css" scoped src="../assets/css/searchbar.css"></style>