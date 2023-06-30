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
      <img v-if="pagination.countOffset > 25" @click="handleClick" name="previous" class="arrow" src="@/assets/left.svg"/>
      <img @click="handleClick" name="next" class="arrow" src="@/assets/right.svg"/>
    </div>
    <ul>
      <li v-for="item in data" :key="item.id" class="thread-preview">
        <ThreadPreviewCard :item="item"/>
      </li>
    </ul>
  </main>
</template>

<style scoped>

ul {
  padding: 0;
}

h1 {
  width: 95%;
  margin: 80px auto -20px;
  font-weight: 900;
}

h2 {
  border-bottom: 1px solid gray;
  padding: 5px 0;
  color: whitesmoke
}

.arrow {
  display: inline;
  height: 45px;
  width: 45px;
  padding: 5px;
  transition: padding 0.4s ease-in-out;
  margin: 0 5px
}

.arrow:hover {
  padding: 0;
}

.pagination {
  text-align: center;
  margin: 20px 0 -10px
}

@media (min-width: 1000px) {
   main {
    margin-left: 120px;
  }
  li {
    width: 70%
  }
  h1 {
    width: 70%;
    margin: 50px auto -20px;
  }
  .pagination {
    margin: -10px 0
  }
}
</style>