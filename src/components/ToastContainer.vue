<template>
  <div
    v-if="toast"
    :class="['toast', toast.variant === 'success' ? 'toast-success' : 'toast-error']"
    role="status"
    aria-live="polite"
  >
    <div>
      <strong>{{ toast.title }}</strong>
      <p>{{ toast.message }}</p>
    </div>
    <button type="button" aria-label="Close notification" @click="hide">
      ×
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast.js';

const toastStore = useToastStore();
const { toast } = storeToRefs(toastStore);

const hide = () => {
  toastStore.clear();
};
</script>
