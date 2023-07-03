<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue';
import { searchUser } from '@/utils/apiRequests';
import { formatHTML } from '@/utils/formatHTML';
import { formatPermalink } from '@/utils/formatURL';
import ErrorModal from '@/components/ErrorModal.vue';
import { useRoute } from 'vue-router';
import Spinner from '@/components/Spinner.vue';
import anonymousAvatar from '@/assets/images/anonymous.webp';
import hearts from '@/assets/icons/hearts.vue';
import { paginate } from '@/utils/paginator';
import Pagination from '@/components/Pagination.vue';

const route = useRoute();
const searchTerm = ref('');
const userPosts: Ref<any[]> = ref([]);
const userProfileData: Ref<any | null> = ref(null);
const noResults = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');
const imgSrc = ref('');

const pagination: Ref<Pagination> = ref({
  afterQuery: null,
  beforeQuery: null,
  countOffset: 0
});

const handlePagination = async (e: MouseEvent): Promise<void> => {
  if (userPosts.value.length < 25) return;
  isLoading.value = true;
  const response = await paginate(pagination.value, e, null, null, route.params.username as string) as SearchUserResponse;
  if (response) {
    userPosts.value = response.posts;
    pagination.value = response.pagination;
  }
  isLoading.value = false;
}

onMounted(() => {
  if (route.params.username) {
    fetchUserData(route.params.username as string);
  }
})

watch(() => route.params.username, async toParam => {
    fetchUserData(toParam as string);
});

const fetchUserData = async (username: string) => {
  try {
    isLoading.value = true;
    const { posts, profileData, pagination: latestPagination } = await searchUser([null, null, 0, username]);
    if (profileData) {
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
  <section v-else-if="userProfileData && userPosts">
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
      <h2 class="posts-heading">Posts</h2>
      <Pagination v-if="userPosts.length > 25" :pagination="pagination" @handle-pagination="handlePagination"/>
      <ul>
        <li class="thread-preview" v-for="comment in userPosts" :key="comment.id">

          <template v-if="comment.body">
            {{ console.log(formatPermalink(comment.link)) }}
            <router-link :to="'/' + formatPermalink(comment.link)" target="_blank">
                <div class="post-header">
                  <p class="op">Replied to <span class="title">&quot;{{ comment.originalPost }}&quot;</span></p>
                  <router-link :to="comment.subreddit" class="subreddit-link" target="_blank">{{ comment.subreddit }}</router-link>
                </div>
              <p>{{ comment.author }} wrote:</p>
              <blockquote class="italic" v-if="comment.body" v-html="formatHTML(comment.body)"></blockquote>
              <p v-else class="italic">(Go to thread)</p>
            </router-link>
          </template>

          <template v-else>
            <router-link :to="formatPermalink(comment.link)" target="_blank">
            <p class="op-no-border">{{ comment.author }} posted a new thread in <span class="subreddit-link">{{ comment.subreddit }}</span></p>
            <p class="title">{{ comment.newThread }}</p>
          </router-link>
        </template>

      </li>
    </ul>
    </template>
    <p v-else-if="noResults">{{ `hmmm...u/${searchTerm} hasn\'t posted anything.` }}</p>
  </section>
  <ErrorModal v-if="errorMsg" :error-msg="errorMsg" @close="() => errorMsg = ''"/>
</main>
</template>

<style scoped>
main {
  position: relative;
  top: 120px;
  margin-left: 260px;
  margin-right: 50px;
}

section {
    width: 80%;
    margin: auto
}

ul {
    list-style: none;
    padding: 0
}

h1 {
  position: relative;
  left: 100px;
  top: 5px;
  width: fit-content;
  font-weight: 900;
  font-size: 1.5em
}

h2 {
    border-bottom: 1px solid rgba(128, 128, 128, 0.453)
}

.posts-heading {
    margin-bottom: 20px
}

h3 {
    font-weight: 600;
    font-size: 25px
}

form, .profile {
    margin-top: 30px;
    text-align: center;
    background-color: #15171c;
    border-radius: 120px;
    width: 80%;
    margin: 40px auto;
    padding: 45px 10px 40px
}

input[type="text"] {
  display: block;
  width: 80%;
  height: 25px;
  font-size: 15px;
  padding: 13px;
  border-radius: 16px;
  margin: auto auto 25px;
  border: 1px solid #ef53507d
}

input[type="submit"], input[type="reset"] {
    border-radius: 18px;
    border: 1px solid rgb(86, 82, 87);
    padding: 8px 8px 8px 15px;
    width: 100px;
    background: linear-gradient(90deg,#db6937 0,#dc3545 100%);
    color: white;
    font-weight: 700;
    text-align: left;
}

input[type="submit"]:active, input[type="reset"]:active {
    scale: 0.9
}

input[type="reset"] {
    text-align: center;
    padding: 8px;
}

.profile {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    font-size: 20px;
    border-radius: 180px;
}

img {
    height: 200px;
    border-radius: 50%;
}

li {
   width: 100%;
   overflow: auto;
}

.flex {
    flex-direction: column;
}

.italic {
    font-style: italic;
    padding-left: 20px
}

.title {
    color: orange;
    transition: background-color 0.3s linear, color 0.3s linear;
}
.title:hover {
    background-color: rgb(251, 200, 92);
    padding: 4px;
    border-radius: 4px;
    color: black
  }

.op {
    line-height: 1.6;
    padding-bottom: 9px;
    margin-top: 4px;
    margin-right: 20px;
}

.subreddit-link {
    margin: auto 0;
    height: fit-content
}

.post-header, .op-no-border {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid gray;
}

.op-no-border {
    border: none
}

@media (max-width: 1000px) {
main {
  margin: auto;
  top: 110px
}

h1 {
    left: 0;
    margin-left: 30px
}

section {
    width: 90%;
    margin: auto
}

form {
    width: 90%
}

.profile, h3 {
    justify-content: space-around;
    font-size: 16px;
}

.profile p {
    font-size: 13px
}

form, .profile {
    border-radius: 10px;
}

img {
    max-width: 100px;
    height: auto;
}
}

@media (max-width: 500px) {
    .post-header {
        flex-direction: column;
    }

    .subreddit-link {
        text-align: center;
        margin: 0 5px 13px
    }
}

</style>