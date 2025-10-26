<template>
  <div class="form-shell">
    <div class="form-card" role="form" aria-labelledby="login-title">
      <div style="display: grid; gap: 0.5rem">
        <span class="tag tag-open" style="justify-self: flex-start">Access Portal</span>
        <h1 id="login-title">Login to EventEase</h1>
        <p style="color: #4a5272">Manage every ticket with confidence.</p>
      </div>
      <form class="form-grid" novalidate @submit.prevent="handleSubmit">
        <!-- Display form-level error if any -->
        <div v-if="errors.form" class="form-error" style="grid-column: 1 / -1; color: #ef4444; margin-bottom: 1rem;">
          {{ errors.form }}
        </div>
        
        <div class="form-field">
          <label for="login-email">Email *</label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            :class="{ 'input-error': errors.email }"
            autocomplete="email"
            required
            @input="clearError('email')"
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
            @input="clearError('password')"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="auth-switch">
        New to EventEase?
        <RouterLink to="/app/signup">Create an account</RouterLink>
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

// Clear a specific error when user starts typing
const clearError = (field) => {
  if (errors[field]) {
    delete errors[field];
  }
  if (errors.form) {
    delete errors.form;
  }
};

const validate = () => {
  const nextErrors = {};
  if (!form.email.trim()) {
    nextErrors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    nextErrors.email = 'Please enter a valid email address.';
  }
  if (!form.password.trim()) {
    nextErrors.password = 'Password is required.';
  }
  
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);
  
  // Set new errors
  Object.assign(errors, nextErrors);
  
  return nextErrors;
};

const handleSubmit = async () => {
  // Clear previous errors
  if (errors.form) delete errors.form;
  
  const nextErrors = validate();
  if (Object.keys(nextErrors).length > 0) return;

  try {
    isSubmitting.value = true;
    
    // Call the auth store's login action
    await authStore.login({
      email: form.email.trim(),
      password: form.password
    });
    
    // Show success message
    toastStore.showSuccess('Success', 'Successfully logged in!');
    
    // Redirect to dashboard
    router.push('/app/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'INVALID_CREDENTIALS') {
      errors.form = 'Invalid email or password. Please try again.';
    } else {
      errors.form = error.message || 'An error occurred while logging in. Please try again.';
      toastStore.showError('Error', 'Login failed. Please check your credentials and try again.');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
