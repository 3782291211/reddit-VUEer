<script setup lang="ts">
import { formatHTML } from '@/utils/formatHTML';
import { reactive } from 'vue';
import plus from '../assets/plus.vue';

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

<style scoped>
ul {
    list-style: none;
    padding-left: 20px;
    margin: 8px 0;
}
.terminal-reply {
    padding-left: 10px;
    margin-bottom: 10px
}

/* Adjust spacing between nested comments */
.reply-header {
  margin: 12px 0 5px 2px;
}
.nested-author {
  font-weight: 900;
  display: inline-block;
}

ul {
  margin: 0;
}

article {
  background-color: #15171c;
  margin-top: 2px;
  margin-right: 10px;
  margin-bottom: -2px;
  padding: 7px 12px 1px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.296);
}

p {
  margin: 0;
}

button {
    margin-left: 10px;
    opacity: 0;
    color: white
}

.toggle-nested {
    float: left;
    margin-right: 4px;
}
</style>