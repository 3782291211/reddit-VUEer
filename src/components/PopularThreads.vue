<script setup lang="ts">

import { ref, onMounted, watch, computed } from 'vue';
import type { Ref } from 'vue';
import { fetchPopularThreads } from '../utils/apiRequests';
import { paginate } from '../utils/paginator';
import ThreadPreviewCard from '../components/ThreadPreviewCard.vue';
import Spinner from '../components/Spinner.vue';
import Pagination from '@/components/Pagination.vue';
import ErrorModal from '../components/ErrorModal.vue';
import BackToTopButton from '../components/BackToTopButton.vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ viewType: string }>();
const emit = defineEmits<{ (e: 'disableErrorModal'): void }>();

const route = useRoute();
const threads: Ref<Thread[] | []> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const errorMsg: Ref<string> = ref('');
const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
});

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
    emit('disableErrorModal');
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

const handlePagination = async (e: MouseEvent): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await paginate(pagination.value, e, route.params.sortBy as string, route.params.subreddit as string, null) as PopularThreadsResponse;
  if (response) {
    threads.value = response.popularThreads;
    pagination.value = response.pagination;
  }
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

const activeClass = computed(() => {
  return { 
    subredditThreads: route.params.subreddit,
    homepageThreads: route.params.sortBy
  }
});

const listClasses = computed(() => {
  return [
    { marginBottom: route.params.subreddit }, 
    'subreddit-threads-ul'
  ];
});

const h1TextContent = computed(() => {
  const params = route.params;
  return params.sortBy ? 
  `${params.sortBy[0].toUpperCase()}${params.sortBy.slice(1)} threads` 
  : params.subreddit ?
  `Popular threads in r/${route.params.subreddit}`
  : 'Popular threads';
});

</script>

<template>
  <section :class="activeClass">
    <Spinner v-if="isLoading"/>
    <template v-else-if="threads.length">
      <h1 class="subreddit-threads-title">{{ h1TextContent }}</h1>
      <Pagination :pagination="pagination" @handle-pagination="handlePagination"/>
      <ul :class="listClasses" data-cy="threads-list">
        <li v-for="item in threads" :key="item.id" class="thread-preview">
          <ThreadPreviewCard :item="item"/>
        </li>
      </ul>
      <Pagination :pagination="pagination" @handle-pagination="handlePagination"/>
      <BackToTopButton/>
    </template>
  </section>
  <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
</template>

<style lang="css" scoped src="../assets/css/popular-threads.css"></style>