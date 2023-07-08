<script lang="ts" setup>
import anonymousAvatar from '@/assets/images/anonymous.webp';
import Pagination from './Pagination.vue';
import hearts from '@/assets/icons/hearts.vue';
import { formatHTML } from '@/utils/formatHTML';
import { formatRouteDescriptor } from '@/utils/formatRouteDescriptor';
import { removeEntities } from '@/utils/removeEntities';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';

const props = defineProps<{
    userProfileData: ProfileData,
    userPosts: Post[],
    pagination: Pagination,
    noResults: boolean,
    searchTerm: string
}>();

const showPagination: ComputedRef<boolean> = computed(() => {
  return !!props.pagination.afterQuery || !!props.pagination.beforeQuery;
});

const h2Margin = `margin-bottom: ${showPagination ? '25px' : '10px'}`;

</script>

<template>
<section>
    <h2 id="scrollRef">Profile</h2>

    <div class="profile">
      <div>
        <h3><hearts/>{{ userProfileData.name }}</h3>
        <div class="flex">
          <p>Joined: {{ userProfileData.createdAt }}</p>
          <p>Karma: {{ userProfileData.karma }}</p>
          <p v-if="userProfileData.subscribers">Subscribers: {{ userProfileData.subscribers }}</p>
          <p v-if="userProfileData.isVerified"><font-awesome-icon icon="fa-solid fa-circle-check" style="color: #59d936; margin-right: 5;"/>Verified</p>
          <p v-if="userProfileData.isPremium"><font-awesome-icon icon="fa-solid fa-money-bills" style="color: #ead75d; margin-right: 5;"/>Premium member</p>
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
              <p class="op"><font-awesome-icon class="comment-icon" icon="fa-solid fa-comment-dots" />Replied to &quot;<router-link :to="formatRouteDescriptor('thread', comment.link)" class="title">{{ comment.originalPost }}</router-link>&quot;</p>
              <router-link :to="formatRouteDescriptor('subreddit', comment.link)" class="subreddit-link">{{ comment.subreddit }}</router-link>
            </div>
            <p class="time">{{ comment.createdAt }} ago</p>
            <p>{{ comment.author }} wrote:</p>
            <blockquote class="italic" v-html="formatHTML(comment.body)"></blockquote>
          </template>

          <template v-else>
            <div class="post-header">
              <p class="op-no-border"><font-awesome-icon class="thread-icon" icon="fa-solid fa-file-circle-plus" />{{ comment.author }} posted a new thread in {{ comment.subreddit }}</p>
              <router-link :to="formatRouteDescriptor('subreddit', comment.link)" class="subreddit-link">{{ comment.subreddit }}</router-link>
            </div>
            <p class="time">{{ comment.createdAt }} ago</p>
            <p class="new-thread"><router-link :to="formatRouteDescriptor('thread', comment.link)" class="title white">{{ removeEntities(comment.newThread as string) }}</router-link></p>
        </template>
      </li>
    </ul>
    </template>
    <p v-else-if="noResults" class="no-results">{{ `hmmm...${userProfileData.name} hasn\'t posted anything.` }}</p>
  </section>
</template>

<style scoped lang="css" src="../assets/css/user-view.css"></style>