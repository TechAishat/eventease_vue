<template>
  <header class="header" role="banner">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="EventEase home">
        <span class="brand-icon" aria-hidden="true">EE</span>
        EventEase Tickets
      </RouterLink>
      <nav class="nav-links" aria-label="Primary navigation">
        <RouterLink to="/" :class="linkClasses('/')">Home</RouterLink>
        <RouterLink to="/app/dashboard" :class="linkClasses('/app/dashboard')">Dashboard</RouterLink>
        <RouterLink to="/app/tickets" :class="linkClasses('/app/tickets')">Tickets</RouterLink>
        <button v-if="isAuthenticated" type="button" class="btn btn-secondary" @click="handleLogout">
          Logout
        </button>
        <RouterLink v-else to="/app/login" class="btn btn-secondary">Login</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isAuthenticated = computed(() => Boolean(authStore.sessionToken));

const handleLogout = () => {
  authStore.logout();
  router.replace('/');
};

const linkClasses = (path) => ({
  'router-link-exact-active': route.path === path
});
</script>
