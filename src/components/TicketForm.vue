<template>
  <form class="form-grid" novalidate @submit.prevent="handleSubmit">
    <div class="form-field">
      <label :for="titleId">Title *</label>
      <input
        :id="titleId"
        v-model="form.title"
        type="text"
        :class="{ 'input-error': errors.title }"
        required
        maxlength="120"
      />
      <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
    </div>

    <div class="form-field">
      <label :for="statusId">Status *</label>
      <select
        :id="statusId"
        v-model="form.status"
        :class="{ 'input-error': errors.status }"
        required
      >
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
    </div>

    <div class="form-field">
      <label :for="priorityId">Priority (optional)</label>
      <input
        :id="priorityId"
        v-model="form.priority"
        type="text"
        :class="{ 'input-error': errors.priority }"
        maxlength="40"
        placeholder="e.g. High, Medium"
      />
      <span v-if="errors.priority" class="error-text">{{ errors.priority }}</span>
    </div>

    <div class="form-field">
      <label :for="descriptionId">Description (optional)</label>
      <textarea
        :id="descriptionId"
        v-model="form.description"
        :class="{ 'input-error': errors.description }"
        :rows="isEditing ? 5 : 4"
        maxlength="500"
      />
      <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
    </div>

    <div class="hero-actions" style="justify-content: flex-start">
      <button type="submit" class="btn">
        {{ submitLabel }}
      </button>
      <button v-if="onCancel" type="button" class="btn btn-secondary" @click="onCancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      title: '',
      status: 'open',
      description: '',
      priority: 'normal'
    })
  },
  submitLabel: {
    type: String,
    default: 'Save ticket'
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    default: null
  }
});

const emit = defineEmits(['submit']);

const form = reactive({
  title: props.initialValues.title ?? '',
  status: props.initialValues.status ?? 'open',
  description: props.initialValues.description ?? '',
  priority: props.initialValues.priority ?? 'normal'
});

const errors = reactive({});
const statusOptions = STATUS_OPTIONS;
const isEditing = computed(() => Boolean(props.initialValues?.id));

const titleId = computed(() => `ticket-title-${isEditing.value ? props.initialValues.id : 'new'}`);
const statusId = computed(() => `ticket-status-${isEditing.value ? props.initialValues.id : 'new'}`);
const priorityId = computed(() => `ticket-priority-${isEditing.value ? props.initialValues.id : 'new'}`);
const descriptionId = computed(
  () => `ticket-description-${isEditing.value ? props.initialValues.id : 'new'}`
);

watch(
  () => props.initialValues,
  (next) => {
    form.title = next.title ?? '';
    form.status = next.status ?? 'open';
    form.description = next.description ?? '';
    form.priority = next.priority ?? 'normal';
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });
  },
  { deep: true }
);

const validate = () => {
  const nextErrors = {};

  if (!form.title.trim()) {
    nextErrors.title = 'Title is required.';
  } else if (form.title.trim().length > 120) {
    nextErrors.title = 'Title must be 120 characters or less.';
  }

  if (!STATUS_OPTIONS.some((option) => option.value === form.status)) {
    nextErrors.status = 'Status must be open, in progress, or closed.';
  }

  if (form.description && form.description.length > 500) {
    nextErrors.description = 'Description must not exceed 500 characters.';
  }

  if (form.priority && form.priority.length > 40) {
    nextErrors.priority = 'Priority label must not exceed 40 characters.';
  }

  Object.keys(errors).forEach((key) => {
    delete errors[key];
  });
  Object.entries(nextErrors).forEach(([key, value]) => {
    errors[key] = value;
  });
  return nextErrors;
};

const handleSubmit = () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) return;
  const payload = {
    title: form.title.trim(),
    status: form.status,
    description: form.description.trim(),
    priority: form.priority.trim()
  };

  const reset = () => {
    form.title = '';
    form.status = 'open';
    form.description = '';
    form.priority = 'normal';
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });
  };

  const result = props.onSubmit?.(payload, { reset });

  const shouldReset = (value) => value !== false && !isEditing.value;

  if (result && typeof result.then === 'function') {
    result
      .then((value) => {
        if (shouldReset(value)) {
          reset();
        }
      })
      .catch(() => {});
  } else if (shouldReset(result)) {
    reset();
  }

  emit('submit', payload);
};
</script>
