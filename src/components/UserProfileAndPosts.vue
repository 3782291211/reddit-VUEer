<script lang="ts" setup>
import anonymousAvatar from '@/assets/images/anonymous.webp';
import Pagination from './Pagination.vue';
import hearts from '@/assets/icons/hearts.vue';
import { formatHTML } from '@/utils/formatHTML';
import { formatRouteDescriptor } from '@/utils/formatRouteDescriptor';
import { removeEntities } from '@/utils/removeEntities';
import { computed } from 'vue';

const props = defineProps<{
    userProfileData: any,
    userPosts: any,
    pagination: any,
    noResults: boolean,
    searchTerm: string
}>();

const showPagination = computed(() => {
  return props.pagination.afterQuery || props.pagination.beforeQuery;
});

const h2Margin = `margin-bottom: ${showPagination ? '25px' : '10px'}`;

</script>

<template>
<section>
    <h2>Profile</h2>

    <div class="profile">
      <div>
        <h3>{{ userProfileData.name }}</h3>
        <div class="flex">
          <p>Karma: {{ userProfileData.karma }}</p>
          <hearts/>
        </div>
        <p v-if="userProfileData.banned">User is banned.</p>
      </div>
      <img :src="userProfileData.icon" @error="(e: Event) => (e.target as HTMLImageElement).src = anonymousAvatar" :alt="userProfileData.name">
    </div>
    
    <template v-if="userPosts.length">
      <h2 :style="h2Margin">Posts</h2>
      <Pagination v-if="showPagination" :pagination="pagination" @handle-pagination="$emit('handle-pagination', $event)"/>
      <ul>
        <li class="thread-preview" v-for="comment in userPosts" :key="comment.id">
          <template v-if="comment.body">
            <div class="post-header">
              <p class="op">Replied to &quot;<router-link :to="formatRouteDescriptor('thread', comment.link)" class="title">{{ comment.originalPost }}</router-link>&quot;</p>
              <router-link :to="formatRouteDescriptor('subreddit', comment.link)" class="subreddit-link">{{ comment.subreddit }}</router-link>
            </div>
            <p>{{ comment.author }} wrote:</p>
            <blockquote class="italic" v-html="formatHTML(comment.body)"></blockquote>
          </template>

          <template v-else>
            <div class="post-header">
              <p class="op-no-border">{{ comment.author }} posted a new thread in {{ comment.subreddit }}</p>
              <router-link :to="formatRouteDescriptor('subreddit', comment.link)" class="subreddit-link">{{ comment.subreddit }}</router-link>
            </div>
            <p class="new-thread"><router-link :to="formatRouteDescriptor('thread', comment.link)" class="title">{{ removeEntities(comment.newThread) }}</router-link></p>
        </template>
      </li>
    </ul>
    </template>
    <p v-else-if="noResults" class="no-results">{{ `hmmm...${userProfileData.name} hasn\'t posted anything.` }}</p>
  </section>
</template>

<style scoped lang="css" src="../assets/css/user-view.css"></style>