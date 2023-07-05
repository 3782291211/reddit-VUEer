<script setup lang="ts">

import { ref, onMounted, watch, computed } from 'vue';
import type { Ref } from 'vue';
import { fetchPopularThreads } from '../utils/apiRequests';
import { paginate } from '../utils/paginator';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';
import Spinner from '../components/Spinner.vue';
import Pagination from '@/components/Pagination.vue';
import ErrorModal from '../components/ErrorModal.vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
    viewType: string
}>();

const route = useRoute();
const isLoading = ref(false);
const errorMsg = ref('');
const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
});

const threads: Ref<Subreddit []> = ref([]);

const fetchData = async (currentParam: string) => {
  isLoading.value = true;
  try {
    const homeViewParams = ['', 'popular', 'new', 'top', 'best', 'hot', 'rising'];
    let fetchArgs;
    if (homeViewParams.includes(currentParam)) {
        fetchArgs = [null, null, 0, currentParam || 'popular', null];
    } else {
        fetchArgs = [null, null, 0, null, currentParam];
    }
    const response = await fetchPopularThreads(fetchArgs as PopularThreadsArgs);
    threads.value = response.popularThreads;
    pagination.value = response.pagination;
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (props.viewType === 'home') {
    fetchData(route.params.sortBy as string);
  } else if (props.viewType === 'subreddit') {
    fetchData(route.params.subreddit as string);
  }
});

watch(() => route.params, async newParam => {
    if (newParam.sortBy) {
      fetchData(newParam.sortBy as string);
    } else if (newParam.subreddit) {
      fetchData(newParam.subreddit as string)
    }
});

const handlePagination = async (e: MouseEvent): Promise<void> => {
  isLoading.value = true;
  const response = await paginate(
    pagination.value, 
    e, 
    route.params.sortBy as string,
    route.params.subreddit as string,
    null
  ) as PopularThreadsResponse | null;
  if (response) {
    threads.value = response.popularThreads;
    pagination.value = response.pagination;
  }
  isLoading.value = false;
}

const activeClass = computed(() => {
  return { 
    subredditThreads: route.params.subreddit,
    homepageThreads: route.params.sortBy
  }
});

const sectionHeading = computed(() => {
  const param = route.params.sortBy;
  return param ? `${param[0].toUpperCase()}${param.slice(1)}` : 'Popular';
})

</script>

<template>
  <section :class="activeClass">
    <Spinner v-if="isLoading"/>
    <template v-else-if="threads.length">
      <h1 class="subreddit-threads-title">{{ sectionHeading }} threads</h1>
      <Pagination :pagination="pagination" @handle-pagination="handlePagination"/>
      <ul class="subreddit-threads-ul">
        <li v-for="item in threads" :key="item.id" class="thread-preview">
          <ThreadPreviewCard :item="item"/>
        </li>
      </ul>
    </template>
  </section>
  <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
</template>

<style lang="css" scoped src="../assets/css/popular-threads.css"></style>