<template>
  <div class="form-shell">
    <div class="form-card" role="form" aria-labelledby="signup-title">
      <div style="display: grid; gap: 0.5rem">
        <span class="tag tag-in_progress" style="justify-self: flex-start">Start your journey</span>
        <h1 id="signup-title">Create an EventEase account</h1>
        <p style="color: #4a5272">Organize tickets with clarity and speed.</p>
      </div>
      <form class="form-grid" novalidate @submit.prevent="handleSubmit">
        <!-- Form-level error message -->
        <div v-if="errors.form" class="form-error" style="grid-column: 1 / -1; color: #ef4444; margin-bottom: 1rem;">
          {{ errors.form }}
        </div>
        <div class="form-field">
          <label for="signup-name">Full name *</label>
          <input
            id="signup-name"
            v-model="form.name"
            type="text"
            :class="{ 'input-error': errors.name }"
            autocomplete="name"
            required
            @input="clearError('name')"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-field">
          <label for="signup-email">Email *</label>
          <input
            id="signup-email"
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
          <label for="signup-password">Password *</label>
          <input
            id="signup-password"
            v-model="form.password"
            type="password"
            :class="{ 'input-error': errors.password }"
            autocomplete="new-password"
            required
            @input="clearError('password')"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-field">
          <label for="signup-confirm">Confirm password *</label>
          <input
            id="signup-confirm"
            v-model="form.confirmPassword"
            type="password"
            :class="{ 'input-error': errors.confirmPassword }"
            required
            @input="clearError('confirmPassword')"
          />
          <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account…' : 'Create account' }}
        </button>
      </form>
      <p class="auth-switch">
        Already have an account?
        <RouterLink to="/app/login">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useToastStore } from '@/stores/toast.js';

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({});
const isSubmitting = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();


const validate = () => {
  const nextErrors = {};
  if (!form.name.trim()) {
    nextErrors.name = 'Name is required.';
  }
  if (!form.email.trim()) {
    nextErrors.email = 'Email is required.';
  }
  if (!form.password) {
    nextErrors.password = 'Password is required.';
  } else if (form.password.length < 6) {
    nextErrors.password = 'Password must be at least 6 characters.';
  }
  if (!form.confirmPassword) {
    nextErrors.confirmPassword = 'Confirm your password.';
  } else if (form.confirmPassword !== form.password) {
    nextErrors.confirmPassword = 'Passwords do not match.';
  }
  Object.keys(errors).forEach((key) => delete errors[key]);
  Object.entries(nextErrors).forEach(([key, value]) => {
    errors[key] = value;
  });
  return nextErrors;
};

// Clear error when user starts typing in any field
const clearError = (field) => {
  if (errors[field]) {
    delete errors[field];
  }
  if (errors.form) {
    delete errors.form;
  }
};

const handleSubmit = async () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) return;

  try {
    isSubmitting.value = true;
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    });
    
    // Show success message and redirect
    toastStore.showSuccess('Success', 'Account created successfully! Welcome aboard!');
    router.push('/app/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error.message || 'Unable to create account. Please try again.';
    toastStore.showError('Signup Failed', errorMessage);
    
    // Set form error for display
    errors.form = errorMessage;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
