<script setup lang="ts">
import { formatHTML } from '@/utils/formatHTML';
import { reactive } from 'vue';
import plus from '../assets/icons/plus.vue';

const props = defineProps(['replies']);
const showReplies: { [key: string]: boolean } = reactive({ id: false });

const toggleReplies = (id: string) => {
  showReplies[id] = !showReplies[id];
}

</script>

<template>
  <ul>
    <li v-for="reply in props.replies" :key="reply.data.id">
        <div v-if="reply.data.body_html" class="terminal-reply">
            <div class="reply-header">
              <plus v-if="reply.data.replies" :id="reply.data.id" @click="toggleReplies(reply.data.id)"/>
              <p class="nested-author">{{ reply.data.author }}</p>
            </div>
            <article v-html="formatHTML(reply.data.body_html)"></article>
        </div>
        <template v-if="reply.data.replies && showReplies[reply.data.id]">
            <NestedReplies :replies="reply.data.replies.data.children"/>
        </template>
    </li>
  </ul>
</template>

<style lang="css" scoped src="../assets/css/nested-replies.css"></style>