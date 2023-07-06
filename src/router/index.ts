import { createRouter, createWebHistory, RouteLocationNormalized, Router } from 'vue-router';
import UserView from '@/views/UserView.vue';

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'popular', params: { sortBy: 'popular' } }
    },
    {
      path: '/:sortBy',
      name: 'popular',
      component: () => import('../views/PopularThreadsView.vue')
    },
    {
      path: '/search',
      name: 'user',
      component: UserView
    },
    {
      path: '/r/:subreddit',
      name: 'subreddit',
      component: () => import('../views/SubredditView.vue')
    },
    {
      path: '/r/:subreddit/comments/:threadId/:threadTitle',
      name: 'thread',
      component: () => import('../views/SingleThreadView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../components/NotFound.vue')
    }
  ]
})

router.beforeEach((to: RouteLocationNormalized) => {
  const allowedParams = ['', 'new', 'rising', 'best', 'top', 'popular', 'hot'];
  if (to.name === 'popular' && !allowedParams.includes(to.params.sortBy as string)) {
    return '/';
  }
});

export default router
