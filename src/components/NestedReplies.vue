<script setup lang="ts">
import { onMounted } from 'vue';
import { formatHTML } from '@/utils/formatHTML';

const props = defineProps(['replies']);
onMounted(() => {
   // console.log(props.replies)
})

</script>

<template>
  <ul>
    <li v-for="reply in props.replies" :key="reply.data.id">
        {{ console.log(reply) }}
        <template v-if="reply.data.replies">
            <NestedReplies :replies="reply.data.replies.data.children"/>
        </template>
        <div v-else>
            <p class="nested-author">{{ reply.data.author }}</p>
            <p v-html="formatHTML(reply.data.body_html)"></p>
        </div>
    </li>
  </ul>
</template>

<style scoped>
ul {
    list-style: none;
}

.nested-author {
    font-style: bold;
    color: red
}
</style>