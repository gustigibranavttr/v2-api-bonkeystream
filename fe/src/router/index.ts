import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    theme?: 'light' | 'dark'
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.name === from.name && (to.name === 'browse' || to.name === 'search')) return false
    if (to.fullPath !== from.fullPath) return { top: 0 }
    return undefined
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('@/views/BrowseView.vue'),
      meta: { title: 'Browse' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Search' },
    },
    {
      path: '/anime/:slug',
      name: 'anime-detail',
      component: () => import('@/views/AnimeDetailView.vue'),
      meta: { title: 'Anime details' },
    },
    {
      path: '/watch/:slug',
      name: 'watch',
      component: () => import('@/views/WatchView.vue'),
      meta: { title: 'Watch', theme: 'dark' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
      meta: { title: 'History' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

export function applyRouteTheme(theme?: 'light' | 'dark') {
  const darkTheme = theme === 'dark'
  document.documentElement.dataset.theme = darkTheme ? 'dark' : 'light'
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', darkTheme ? '#171717' : '#f1f1ef')
}

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : 'Bonkey StreamV2'
  document.title = `${pageTitle} | Bonkey StreamV2`
  applyRouteTheme(to.meta.theme)
})
