import { createRouter, createWebHistory } from 'vue-router';
import Landing from '@/pages/Landing.vue';
import Login from '@/pages/Login.vue';
import Signup from '@/pages/Signup.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Tickets from '@/pages/Tickets.vue';
import AppLayout from '@/components/AppLayout.vue';
import { useAuthStore } from '@/stores/auth.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'landing',
          component: Landing
        },
        {
          path: 'auth/login',
          name: 'login',
          component: Login
        },
        {
          path: 'auth/signup',
          name: 'signup',
          component: Signup
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'tickets',
          name: 'tickets',
          component: Tickets,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (!authStore.isHydrated) {
    authStore.hydrate();
  }

  if (to.meta.requiresAuth && !authStore.sessionToken) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    };
  }

  if ((to.name === 'login' || to.name === 'signup') && authStore.sessionToken) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
