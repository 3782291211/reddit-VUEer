<script setup lang="ts">
import { formatHTML } from '@/utils/formatHTML';
import { computed, reactive } from 'vue';
import plusOrMinus from '../assets/icons/plusOrMinus.vue';

const props = defineProps(['replies']);
const showReplies: { [key: string]: boolean } = reactive({ id: false });

const toggleReplies = (id: string) => {
  showReplies[id] = !showReplies[id];
}

const showNestedReplies = (reply: any) => {
  return reply.data.replies
    && reply.data.replies.data.children[0].kind !== 'more'
    && showReplies[reply.data.id];
}

const showExpandButton = (reply: any) => {
  return reply.data.replies
    && reply.data.replies.data.children[0].kind !== 'more';
}

</script>

<template>
  <ul>
    <li v-for="reply in props.replies" :key="reply.data.id">
      <div v-if="reply.data.body_html" class="terminal-reply">
        <div class="reply-header">
          <plusOrMinus v-if="showExpandButton(reply)" :id="reply.data.id" @click="toggleReplies(reply.data.id)" :shape="showReplies[reply.data.id] ? 'minus' : 'plus'"/>
          <p class="nested-author">{{ reply.data.author }}</p>
        </div>
        <article v-html="formatHTML(reply.data.body_html)"></article>
      </div>
      <template v-if="showNestedReplies(reply)">
        <NestedReplies :replies="reply.data.replies.data.children"/>
      </template>
    </li>
  </ul>
</template>

<style lang="css" scoped src="../assets/css/nested-replies.css"></style>