<script setup lang="ts">
import { formatHTML } from '@/utils/formatHTML';
import { ref, reactive } from 'vue';
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
              <plus :id="reply.data.id" v-if="reply.data.replies" @click="toggleReplies(reply.data.id)"/>
              <p class="nested-author">{{ reply.data.author }}</p>
            </div>
            <p v-html="formatHTML(reply.data.body_html)"></p>
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

button {
    margin-left: 10px;
    opacity: 0;
    color: white
}

.nested-author {
    font-weight: 900;
    display: inline-block;
}

.toggle-nested {
    float: left;
    margin-right: 4px;
}
</style>