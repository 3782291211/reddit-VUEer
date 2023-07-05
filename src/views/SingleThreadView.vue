<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { RouteParams } from 'vue-router';
import { useRoute } from 'vue-router';
import { fetchSingleThread } from '@/utils/apiRequests';
import Spinner from '../components/Spinner.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import SingleThreadBody from '../components/SingleThreadBody.vue';
import CommentsSection from '../components/CommentsSection.vue';

const route = useRoute();
const data: Ref<any> = ref([]);
const isLoading = ref(false);
const errorMsg = ref('');

const fetchData = async (newParams: RouteParams | null) => {
  try {
    const { subreddit, threadId, threadTitle } = newParams || route.params;
    isLoading.value = true;
    const response = await fetchSingleThread(subreddit as string, threadId as string, threadTitle as string);
    data.value = response;
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchData(null));

watch(() => route.params, params => {
  if (route.path.includes('/comments/')) fetchData(params);
});

</script>

<template>
  <main>
    <Spinner v-if="isLoading"/>
    <div v-else-if="data.title">
      <SingleThreadBody :data="data"/>
      <CommentsSection v-if="data.comments?.length" :data="data"/>
      <p class="no-comments" v-else>There aren't any comments for this thread.</p>
    </div>
    <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
  </main>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>