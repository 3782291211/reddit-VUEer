<script setup lang="ts">

import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { fetchPopularThreads } from '../utils/apiRequests';
import { paginate } from '../utils/eventHandlers';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';

const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
})

const data: Ref<Subreddit []> = ref([]);

onMounted(async () => {
  const response = await fetchPopularThreads([null, null, 0]);
  data.value = response.popularThreads;
  pagination.value = response.pagination;
});

const handleClick = async (e: MouseEvent) => {
  const response: PopularThreadsResponse | null = await paginate(pagination.value, e);
  if (response) {
    data.value = response.popularThreads;
    pagination.value = response.pagination;
  }
}

</script>

<template>
  <main>
    <h1>Popular threads</h1>
    <!-- <img src="https://external-preview.redd.it/4pLnyfEgjuCe9UPDfsqK-10zbHyaEOrWUt0Sq3nltsk.jpg?auto=webp&amp;v=enabled&amp;s=869cc5fc8a11c09bf0ea82bb0f1dcd9e658e8e6c"> -->
    <div class="pagination">
      <button @click="handleClick" name="next">Next</button>
      <button v-if="pagination.countOffset > 25" @click="handleClick" name="previous">Previous</button>
    </div>
    <ul>
      <li v-for="item in data">
        <ThreadPreviewCard :item="item"/>
      </li>
    </ul>
  </main>
</template>

<style scoped>

ul {
  padding: 0
}

li {
  list-style-type: none;
  border: 1px solid white;
  margin: 15px auto;
  max-width: 900px;
  padding: 10px;
  padding-top: 5px;
  border-radius: 8px;
  background-color: rgb(31, 31, 31);
}

h1 {
  margin-left: 37px
}

h2 {
  border-bottom: 1px solid gray;
  padding: 5px 0;
  color: whitesmoke
}

button[name="previous"] {
  margin: 0 10px
}
.pagination {
  margin: 20px 38px
}

@media (min-width: 1000px) {
  main {
  margin-left: 120px;
  margin-right: 120px
}
}
</style>