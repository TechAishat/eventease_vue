<template>
  <div class="app-shell">
    <Header />
    <main>
      <div v-if="!isReady" class="app-loading" aria-live="polite">
        <div class="spinner" aria-label="Loading" />
        <p>Loading EventEase...</p>
      </div>
      <RouterView v-else />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useTicketStore } from '@/stores/tickets.js';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

onMounted(() => {
  authStore.hydrate();
  ticketStore.hydrate();
});

const isReady = computed(() => authStore.isHydrated && ticketStore.isHydrated);
</script>
