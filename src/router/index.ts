import { createRouter, createWebHistory } from 'vue-router'
import SingleThreadView from '../views/SingleThreadView.vue'
import SubredditView from '../views/SubredditView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'popular',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PopularThreadsView.vue')
    },
    {
      path: '/r/:subreddit/comments/:threadId/:threadTitle',
      name: 'thread',
      component: SingleThreadView
    },
    {
      path: '/r/:subreddit',
      name: 'subreddit',
      component: SubredditView
    }
  ]
})

export default router
