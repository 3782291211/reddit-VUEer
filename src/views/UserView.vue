<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { searchUser } from '@/utils/apiRequests';
import ErrorModal from '@/components/ErrorModal.vue';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '@/components/Spinner.vue';
import { paginate } from '@/utils/paginator';
import UserProfileAndPosts from '../components/UserProfileAndPosts.vue';
import BackToTopButton from '../components/BackToTopButton.vue';

const route = useRoute();
const router = useRouter();
const searchTerm: Ref<string> = ref('');
const userPosts: Ref<Post[] | []> = ref([]);
const userProfileData: Ref<ProfileData | null> = ref(null);
const noResults: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(false);
const errorMsg: Ref<string> = ref('');
const imgSrc: Ref<string> = ref('');
const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
});

const handlePagination = async (e: MouseEvent): Promise<void> => {
  if (userPosts.value.length < 25) return;
  try {
    isLoading.value = true;
    const response = await paginate(pagination.value, e, null, null, route.query.username as string) as SearchUserResponse;
    if (response) {
      userPosts.value = response.posts;
      pagination.value = response.pagination;
    }
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Unable to process your request.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (route.query?.username) {
    fetchUserData(route.query.username as string);
  }
})

watch(() => route.query?.username, async toQuery => {
  if (!toQuery) return;
  fetchUserData(toQuery as string);
});

const fetchUserData = async (username: string): Promise<void> => {
  try {
    isLoading.value = true;
    const { posts, profileData, pagination: latestPagination } = await searchUser(username);
    if (profileData) {
        router.push({ path: '/search', query: { username }});
        userProfileData.value = profileData;
        imgSrc.value = profileData.icon;
    }
    if (!posts.length) {
        noResults.value = true;
        isLoading.value = false;
        userPosts.value = [];
        return;
    }
    userPosts.value = posts;
    pagination.value = latestPagination;
    } catch (err: unknown) {
      errorMsg.value = (err as Error).message || 'Unable to process your request.';
    } finally {
      isLoading.value = false;
    }
}

const handleSubmit = async () => {
    if (!searchTerm.value.trim()) return;
    fetchUserData(searchTerm.value);
}

const handleReset = () => {
  noResults.value = false;
  searchTerm.value = '';
  userProfileData.value = null;
  userPosts.value = [];
}

</script>

<template>
<main>
  <h1>Search users</h1>
  <form @submit.prevent="handleSubmit">
    <input v-model="searchTerm" type="text" placeholder="Search by username">
    <input type="submit">
    <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" inverse transform="left-32 down-2" beat />
    <input type="reset" value="Clear" @click="handleReset">
  </form>
 
  <Spinner v-if="isLoading"/>

  <UserProfileAndPosts v-else-if="userProfileData && userPosts"
  @handle-pagination="handlePagination"
  :userProfileData="userProfileData"
  :userPosts="userPosts"
  :noResults="noResults"
  :searchTerm="searchTerm"
  :pagination="pagination"/>

  <BackToTopButton v-if="userPosts.length"/>
  <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
</main>
</template>

<style scoped lang="css" src="../assets/css/user-view.css"></style>
