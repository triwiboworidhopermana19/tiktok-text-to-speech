import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LicenseView from '../views/LicenseView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView, meta: { requiresLicense: true } },
  { path: '/license', component: LicenseView },
  { path: '/about', component: AboutView, meta: { title: 'About Tiktok Text to Speech' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  // Modify title if present
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresLicense)
  if (to.meta.requiresLicense) {
    // this route requires license, check if license exists
    // if not, redirect to license page.
    const isValidLicense = await window.ipcRenderer.invoke('check:license')

    if (isValidLicense) {
      return true
    }

    return {
      path: '/license',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})

export default router;