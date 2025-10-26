<template>
  <div class="form-shell">
    <div class="form-card" role="form" aria-labelledby="login-title">
      <div style="display: grid; gap: 0.5rem">
        <span class="tag tag-open" style="justify-self: flex-start">Access Portal</span>
        <h1 id="login-title">Login to EventEase</h1>
        <p style="color: #4a5272">Manage every ticket with confidence.</p>
      </div>
      <form class="form-grid" novalidate @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="login-email">Email *</label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            :class="{ 'input-error': errors.email }"
            autocomplete="email"
            required
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-field">
          <label for="login-password">Password *</label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            :class="{ 'input-error': errors.password }"
            autocomplete="current-password"
            required
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="auth-switch">
        New to EventEase?
        <RouterLink to="/auth/signup">Create an account</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useToastStore } from '@/stores/toast.js';

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({});
const isSubmitting = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const validate = () => {
  const nextErrors = {};
  if (!form.email.trim()) {
    nextErrors.email = 'Email is required.';
  }
  if (!form.password.trim()) {
    nextErrors.password = 'Password is required.';
  }
  Object.keys(errors).forEach((key) => delete errors[key]);
  Object.entries(nextErrors).forEach(([key, value]) => {
    errors[key] = value;
  });
  return nextErrors;
};

const redirectTo = () => route.query.redirect || '/dashboard';

watch(
  () => authStore.sessionToken,
  (token) => {
    if (token) {
      router.replace('/dashboard');
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) return;

  try {
    isSubmitting.value = true;
    await authStore.login({
      email: form.email.trim(),
      password: form.password
    });
    toastStore.showSuccess('Welcome back 👋', 'You are now signed in.');
    router.replace(redirectTo());
  } catch (error) {
    toastStore.showError('Login failed', error.message ?? 'Invalid credentials.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
