<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue';
import { searchUser } from '@/utils/apiRequests';
import { formatHTML } from '@/utils/formatHTML';
import { formatPermalink } from '@/utils/formatURL';
import ErrorModal from '@/components/ErrorModal.vue';
import { useRoute } from 'vue-router';
import Spinner from '@/components/Spinner.vue';
import anonymousAvatar from '@/assets/images/anonymous.webp';

const route = useRoute();
const searchTerm = ref('');
const userPosts: Ref<any[]> = ref([]);
const userProfileData: Ref<any | null> = ref(null);
const noResults = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');
const imgSrc = ref('');

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
    const { posts, profileData } = await searchUser(username);
    if (!posts.length) {
        noResults.value = true;
        isLoading.value = false;
        return;
    }
    userPosts.value = posts;
    userProfileData.value = profileData;
    imgSrc.value = profileData.icon;
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
    <input v-model="searchTerm" type="text" placeholder="Username">
    <input type="submit">
    <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" inverse transform="left-32 down-2" beat />
    <input type="reset" value="Clear" @click="handleReset">
  </form>
  <p v-if="noResults">{{ `hmmm...u/${searchTerm} hasn\'t posted anything.` }}</p>

  <Spinner v-if="isLoading"/>
  <section v-else-if="userProfileData && userPosts">
    <h2>Profile</h2>

    <div>
      <p v-if="userProfileData.banned">User is banned.</p>
      <p>Karma: {{ userProfileData.karma }}</p>
      <h3>{{ userProfileData.name }}</h3>
      <img :src="userProfileData.icon" @error="(e: Event) => (e.target as HTMLImageElement).src = anonymousAvatar" :alt="userProfileData.name">
    </div>
    
    <h2>Posts</h2>
    <ul v-if="userPosts.length">
      <li class="thread-preview" v-for="comment in userPosts" :key="comment.id">
        
        <template v-if="comment.body">
          <router-link :to="formatPermalink(comment.link)" target="_blank">
            <p class="op">Replied to <span class="title">&quot;{{ comment.originalPost }}&quot;</span>&nbsp; in <router-link :to="comment.subreddit" class="subreddit-link">{{ comment.subreddit }}</router-link></p>
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

form {
    margin-top: 30px;
    text-align: center;
    background-color: #15171c;
    border-radius: 120px;
    width: 80%;
    margin: 40px auto;
    padding: 40px 10px
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

img {
    display: block;
    margin: auto;
    height: 200px
}

li {
   width: 100%;
   margin: 15px auto
}

.subreddit-link {
    margin: 0 3px;
}

.subreddit-link:hover {
    margin: 0
}

.italic {
    font-style: italic;
    padding-left: 20px
}

.title {
    color: orange
}

.title:hover {
    text-decoration: underline;
    cursor: pointer
}

.op {
    line-height: 1.6;
    border-bottom: 1px solid gray;
    padding-bottom: 9px;
    margin-top: 4px
}

.op-no-border {
    border: none
}

</style>