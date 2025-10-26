<template>
  <div class="app-shell">
    <Header v-if="!hideChrome" />
    <main>
      <div v-if="!isReady" class="app-loading" aria-live="polite">
        <div class="spinner" aria-label="Loading" />
        <p>Loading EventEase...</p>
      </div>
      <RouterView v-else />
    </main>
    <Footer v-if="!hideChrome" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useTicketStore } from '@/stores/tickets.js';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

onMounted(() => {
  authStore.hydrate();
  ticketStore.hydrate();
});

const hideChrome = computed(() => route.path.startsWith('/auth'));
const isReady = computed(() => authStore.isHydrated && ticketStore.isHydrated);
</script>
