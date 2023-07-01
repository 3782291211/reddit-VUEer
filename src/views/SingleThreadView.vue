<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchSingleThread } from '@/utils/apiRequests';
import { formatHTML } from '../utils/formatHTML';
import NestedReplies from '../components/NestedReplies.vue';

const { params: { subreddit, threadId, threadTitle } } = useRoute();

const data: Ref<any> = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  data.value = await fetchSingleThread(subreddit as string, threadId as string, threadTitle as string);
  isLoading.value = false;
});

watch(() => threadTitle, async () => {
  data.value = await fetchSingleThread(subreddit as string, threadId as string, threadTitle as string);
})

</script>

<template>
  <main v-if="!isLoading">
    <h1>{{ data.title }}</h1>
    <h2>by <span>{{ data.author }}</span>, in <span>{{ subreddit }}</span></h2>
    <!-- <p id="thread-body">{{ data.selftext }}</p> -->
    <article v-if="data.selftext" class="thread-description" v-html="formatHTML(data.selftext)"></article>
    <p v-else>This thread is missing a body section. Check back later!</p>
    <section v-if="data.comments.length">
      <h2>Comments</h2>
      <ul>
        <template v-for="item in data.comments" :key="item.id">
          <li v-if="item.author">
            <h3>{{ item.author }}</h3>
            <div class="comment-body">
              <article v-html="formatHTML(item.body)"></article>
              <div class="flex">
                <span class="inline"><img src="../assets/updown.svg">{{ isNaN(item.votes) ? '0' : item.votes }} votes</span>
                <span v-if="item.numberOfReplies" class="float"><img src="../assets/bubble.svg">{{ item.numberOfReplies > 1 ? `${item.numberOfReplies} replies` : '1 reply' }}</span>
              </div>
            </div>
            <template v-if="item.numberOfReplies">
              <NestedReplies :replies="item.replies.data.children"/>
            </template>
          </li>
        </template>
      </ul>
    </section>
    <p class="no-comments" v-else>There aren't any comments for this thread.</p>
  </main>
  <p v-else>Loading article and comments...</p>
</template>

<style scoped>
main {
  position: relative;
  top: 80px;
  width: 65%;
  margin-left: 320px !important;
}

ul {
    list-style: none;
    padding: 0
}

h2 {
  border-top: 1px solid gray;
  padding: 4px 0 6px;
  margin: 15px 0 25px;
}

span {
  font-style: italic;
  font-weight: 700;
}

img {
  display: inline;
  margin: -3px 4px
}

.float {
  float: right;
}

.inline {
  display: inline;
  padding: 0;
  margin-right: 15px
}

.flex {
  border-top: 1px solid gray;
  padding-top: 8px;
  display: flex;
}

h3 {
    color: black;
    background-color: whitesmoke;
    padding: 5px 10px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

li {
    border: 1px solid gray;
    margin: 20px auto;
    border-radius: 6px;
}

.thread-description {
  margin-bottom: 30px;
}
.comment-body {
    padding: 10px;
    background-color: #15171c;
    border-bottom: 1px solid rgba(128, 128, 128, 0.478);
    border-radius: 7px;
}
.no-comments {
  margin: 10px 0;
}

li p {
    padding: 0 10px
}

@media (max-width: 1000px) {
  main {
    width: 95%;
    margin: 0 auto 50px !important;

  }
}
</style>