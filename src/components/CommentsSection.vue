<script lang="ts" setup>
import { formatHTML } from '../utils/formatHTML';
import NestedReplies from '../components/NestedReplies.vue';

defineProps<{ threadData: SingleThreadResponse }>();

const formatVotesLabel = (voteCount: number): string => {
  const suffix = (voteCount > 1 || voteCount < -1) ? 's' : '';
  return isNaN(voteCount) ? '0 votes' : `${voteCount} vote${suffix}`;
}

const computeReplyCount = (comment: FormattedComment): number => {
  if (comment.numberOfReplies === 0) return 0;
  const replies = (comment.replies as NestedReplies).data.children as CommentData[];
  return replies.reduce((accumulator: number, current: CommentData) => {
    if (current.kind !== 'more') return accumulator + 1;
    return accumulator;
  }, 0);
}
</script>

<template>
  <section>
    <h2 class="comments-heading">Comments</h2>
    <ul>
      <template v-for="comment in threadData.comments" :key="comment.id">
        <li v-if="comment.author">

          <div class="comment-header">
            <h3 v-if="!comment.author.includes('[deleted]')">
              <router-link class="comment-author" :to="{ path: '/search', query: { username: comment.author }}">{{ comment.author }}</router-link>
            </h3>
            <h3 v-else>{{ comment.author }}</h3>
            <p>{{ comment.createdAt }} ago</p>
          </div>
          
          <div class="comment-body">
            <article v-html="formatHTML(comment.body)"></article>
            <div class="flex">
              <span class="inline"><img class="svg-icon" src="../assets/icons/updown.svg">{{ formatVotesLabel(comment.votes) }}</span>
              <span v-if="computeReplyCount(comment)" class="float"><img class="svg-icon" src="../assets/images/bubble.svg">{{ computeReplyCount(comment) > 1 ? `${computeReplyCount(comment)} replies` : '1 reply' }}</span>
            </div>
          </div>
          <template v-if="computeReplyCount(comment)">
            <NestedReplies :replies="(comment.replies as NestedReplies).data.children"/>
          </template>
        </li>
      </template>
    </ul>
  </section>
</template>

<style lang="css" scoped src="../assets/css/single-thread-view.css"></style>