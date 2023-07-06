<script setup lang="ts">
import { fetchSubredditBody } from '@/utils/apiRequests';
import { computed, onMounted, ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { formatHTML } from '@/utils/formatHTML';
import Spinner from '../components/Spinner.vue';
import backgroundUrl from "@/assets/images/abstract.jpg";
import PopularThreads from '../components/PopularThreads.vue';
import ErrorModal from '@/components/ErrorModal.vue';

const route = useRoute();
const subredditBody: Ref<SubredditBodyResponse | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);
const errorMsg: Ref<string> = ref('');
const disableErrorModal: Ref<boolean> = ref(false);

const fetchData = async (subreddit: string = '') => {
  isLoading.value = true;
  try {
    const response: SubredditBodyResponse = 
      await fetchSubredditBody(subreddit || route.params.subreddit as string);
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
  subredditBody.value = null;
  fetchData(toParams as string);
});

const renderHTML: ComputedRef<boolean> = computed(() => {
  return !!subredditBody.value!.publicDescription || !!subredditBody.value!.description;
});

const arrangeArgs: ComputedRef<string[]> = computed(() => {
  const args = [subredditBody.value!.publicDescription, subredditBody.value!.description];
  return args.map(arg => arg || '');
});

</script>

<template>
  <main class="subreddit-view">
    <Spinner v-if="isLoading"/>
    <ErrorModal v-if="errorMsg && !disableErrorModal" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
    <template v-else-if="subredditBody">
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
      <article v-if="renderHTML" v-html="formatHTML(arrangeArgs[0], arrangeArgs[1])" class="thread-description"></article>
      </section>
    </template>
    <PopularThreads view-type="subreddit" @disable-error-modal="() => disableErrorModal = true"/>
  </main>
</template>

<style lang="css" scoped src="../assets/css/subreddit-view.css"/>

<!-- A note about the formatHTML helper function
  A subredditBody object contains a 'description' property and a 'publicDescription' property, containing different HTML content. One or both may either be a string or null. We provide both pieces of information as arguments to the formatHTML function which knows how to deal with falsy arguments.-->