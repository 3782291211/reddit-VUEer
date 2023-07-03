<script setup lang="ts">
import { fetchSubredditBody } from '@/utils/apiRequests';
import { computed, onMounted, ref, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatHTML } from '@/utils/formatHTML';
import Spinner from '../components/Spinner.vue';
import backgroundUrl from "@/assets/images/abstract.jpg";
import PopularThreads from '../components/PopularThreads.vue';
import ErrorModal from '@/components/ErrorModal.vue';

const route = useRoute();
const subredditBody: Ref<any> = ref({});
const isLoading = ref(false);
const errorMsg = ref('');

const fetchData = async (subreddit: string = '') => {
  isLoading.value = true;
  try {
    const response = await fetchSubredditBody(subreddit || route.params.subreddit as string);
    subredditBody.value = response;
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchData());

watch(() => route.params.subreddit, async toParams => {
  if (!route.path.startsWith('/r')) return;
  fetchData(toParams as string);
});

const arrangeArgs = computed(() => {
  const args = [subredditBody.value?.publicDescription, subredditBody.value?.description];
  return args.map(arg => arg || '');
});

</script>

<template>
  <main class="subreddit-view">
    <Spinner v-if="isLoading"/>
    <template v-else-if="Object.keys(subredditBody).length">
      <section>
        <div class="overlay">
          <div class="header" :style="{ backgroundImage: `url(${subredditBody?.banner || backgroundUrl })`}">
            <img v-if="subredditBody.icon" class="icon" :src="subredditBody.icon">
            <h1>r/{{ route.params.subreddit }}</h1>
            <div class="flex">
              <h2 v-if="subredditBody.category">{{ subredditBody.category }}</h2>
              <h2 :class="{borderLeft : subredditBody.category}" v-if="subredditBody.subscribers">{{ subredditBody.subscribers }} subscribers</h2>
            </div>
            <img v-if="subredditBody.header" class="header-img" :src="subredditBody.header">
          </div>
        </div>
      <article v-html="formatHTML(arrangeArgs[0], arrangeArgs[1])" class="thread-description"></article>
      </section>
      <PopularThreads view-type="subreddit"/>
    </template>
    <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
  </main>
</template>

<style lang="css" scoped src="../assets/css/subreddit-view.css"/>