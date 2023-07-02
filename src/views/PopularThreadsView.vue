<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { fetchPopularThreads } from '../utils/apiRequests';
import { paginate } from '../utils/eventHandlers';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';
import Spinner from '../components/Spinner.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref(false);

const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
})

const data: Ref<Subreddit []> = ref([]);

const fetchData = async (sortBy: string) => {
  isLoading.value = true;
  try {
    const response = await fetchPopularThreads([null, null, 0, sortBy || 'popular']);
    data.value = response.popularThreads;
    pagination.value = response.pagination;
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchData(route.params.sortBy as string));

watch(() => route.params.sortBy, async sortBy => fetchData(sortBy as string));

const handleClick = async (e: MouseEvent) => {
  isLoading.value = true;
  const response: PopularThreadsResponse | null = await paginate(
    pagination.value, 
    e, 
    route.params.sortBy as string
  );
  if (response) {
    data.value = response.popularThreads;
    pagination.value = response.pagination;
  }
  isLoading.value = false;
}

</script>

<template>
  <main>
    <h1>{{ route.params.sortBy }} threads</h1>
    <Spinner v-if="isLoading" />
    <section v-else>
      <div class="pagination">
        <img v-if="pagination.countOffset > 25" @click="handleClick" name="previous" class="arrow" src="@/assets/images/left.svg"/>
        <img @click="handleClick" name="next" class="arrow" src="@/assets/images/right.svg"/>
      </div>
      <ul>
        <li v-for="item in data" :key="item.id" class="thread-preview">
          <ThreadPreviewCard :item="item"/>
        </li>
      </ul>
    </section>
  </main>
</template>

<style lang="css" scoped src="../assets/css/popular-threads.css"></style>



<!-- const fetchData = (sortBy = 'popular') => {
  isLoading.value = true;
  fetchPopularThreads([null, null, 0, sortBy])
  .then(response => {
    data.value = response.popularThreads;
    pagination.value = response.pagination;
    isLoading.value = false;
  })
  .catch(() => {
    isLoading.value = false;
  })
}

onMounted(async () => {
  isLoading.value = true;
  const response = await fetchPopularThreads([null, null, 0, 'popular']);
  data.value = response.popularThreads;
  pagination.value = response.pagination;
  isLoading.value = false;
});*/

/*watch(() => route.params.sortBy, async sortBy => {
  isLoading.value = true;
  const response = await fetchPopularThreads([null, null, 0, sortBy as string]);
  data.value = response.popularThreads;
  pagination.value = response.pagination;
  isLoading.value = false;
}); -->