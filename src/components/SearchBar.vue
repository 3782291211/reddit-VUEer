<script setup lang="ts">
import { watch, ref, Ref, onMounted, onUnmounted, computed } from 'vue';
import { searchThreads } from '@/utils/apiRequests';
import { useRoute } from 'vue-router';

const searchTerm = ref('');
const searchResults: Ref<any[]> = ref([]);
const showResults = ref(true);
const isLoading = ref(false);
const showAlert = ref(false);
const alertID: Ref<NodeJS.Timeout | null> = ref(null);
const route = useRoute();

const handleSubmit = async () => {
  showResults.value = true;
  isLoading.value = true;
  searchResults.value = await searchThreads(searchTerm.value);
  isLoading.value = false;

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
onUnmounted(() => clearTimeout(alertID.value as NodeJS.Timeout));

watch(() => route.path, () => showResults.value = false);

const roundedBorder = computed(() => {
  return {
    searching: searchResults.value.length,
    rounded: isLoading.value
  }
});

</script>

<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <input v-model.trim="searchTerm" @blur="() => searchTerm = ''" type="text" placeholder="Search threads" :class="roundedBorder">
      <div v-if="isLoading" class="spinner">
        <font-awesome-icon icon="spinner" spin spin-reverse size="2xl" />
      </div>
      <template v-else>
        <input type="submit" value="Search">
        <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" beat/>
      </template>
    </form>
    <ul v-if="searchResults.length && showResults" name="search-results">
      <li v-for="thread in searchResults" :key="thread.id">
        <router-link name="link" :to="`${thread.link}`" :class="['search-results']">{{ thread.title }}</router-link>
      </li>
    </ul>
    <p class="alert" v-if="showAlert">No results.</p>
  </section>
</template>

<style lang="css" scoped src="../assets/css/searchbar.css"></style>