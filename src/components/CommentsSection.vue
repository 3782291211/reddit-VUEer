<script lang="ts" setup>
import { formatHTML } from '../utils/formatHTML';
import NestedReplies from '../components/NestedReplies.vue';
import { isTemplateNode } from '@vue/compiler-core';

defineProps<{
    data: any
}>();

const formatVotesLabel = (voteCount: number): string => {
  const suffix = (voteCount > 1 || voteCount < -1) ? 's' : '';
  return isNaN(voteCount) ? '0 votes' : `${voteCount} vote${suffix}`;
}

const computeReplyCount = (comment: JsonComment): number => {
  if (comment.numberOfReplies === 0) return 0;
  return comment.replies.data.children
  .reduce((accumulator: number, current: SingleComment) => {
    if (current.kind != 'more') return accumulator + 1;
    return accumulator;
  }, 0);
}

</script>

<template>
  <section>
    <h2 class="comments-heading">Comments</h2>
    <ul>
      <template v-for="item in data.comments" :key="item.id">
        <li v-if="item.author">
          <h3 v-if="!item.author.includes('[deleted]')">
            <router-link class="comment-author" :to="{ path: '/search', query: { username: item.author } }">{{ item.author }}</router-link>
          </h3>
          <h3 v-else>{{ item.author }}</h3>
          <div class="comment-body">
            <article v-html="formatHTML(item.body)"></article>
            <div class="flex">
              <span class="inline"><img class="svg-icon" src="../assets/icons/updown.svg">{{ formatVotesLabel(item.votes) }}</span>
              <span v-if="computeReplyCount(item)" class="float"><img class="svg-icon" src="../assets/images/bubble.svg">{{ computeReplyCount(item) > 1 ? `${computeReplyCount(item)} replies` : '1 reply' }}</span>
            </div>
          </div>
          <template v-if="computeReplyCount(item)">
            <NestedReplies :replies="item.replies.data.children"/>
          </template>
        </li>
      </template>
    </ul>
  </section>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>