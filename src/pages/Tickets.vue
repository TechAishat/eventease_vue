<template>
  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem">
    <header class="dashboard-header" style="align-items: flex-start">
      <div class="dashboard-heading">
        <span class="tag tag-open" aria-label="Ticket workspace">Ticket workspace</span>
        <h1>Stay on top of every ticket</h1>
        <span>Track, collaborate, and resolve tickets without switching tabs.</span>
      </div>
      <div class="ticket-filters" role="radiogroup" aria-label="Filter tickets by status">
        <button
          v-for="option in statusFilters"
          :key="option.value"
          type="button"
          role="radio"
          :aria-checked="filter === option.value"
          :class="['btn', 'btn-secondary', { active: filter === option.value }]"
          @click="filter = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </header>

    <section class="tablet-two-column" style="margin-top: 2rem">
      <article class="card" style="display: grid; gap: 1.5rem">
        <header>
          <h2 style="margin: 0">Create a new ticket</h2>
          <p style="color: #6c7391; margin-bottom: 0">
            Provide a clear title and status. You can always edit details later.
          </p>
        </header>
        <TicketForm submit-label="Create ticket" :on-submit="handleCreate" />
      </article>

      <article class="card" style="display: grid; gap: 1.5rem">
        <header>
          <h2 style="margin: 0">Editing</h2>
          <p style="color: #6c7391; margin-bottom: 0">
            Select a ticket to edit its details. Changes are saved instantly.
          </p>
        </header>
        <TicketForm
          v-if="editingTicket"
          :key="editingTicket.id"
          :initial-values="editingTicket"
          submit-label="Save changes"
          :on-submit="handleUpdate"
          :on-cancel="() => (editingTicketId = null)"
        />
        <div v-else class="empty-state" style="padding: 2rem 1rem">
          <strong>No ticket selected</strong>
          <p>Choose a ticket from the list to start editing.</p>
        </div>
      </article>
    </section>

    <section style="margin-top: 3rem" aria-live="polite">
      <header class="dashboard-heading" style="margin-bottom: 1.5rem">
        <h2 style="margin: 0">Tickets ({{ filteredTickets.length }})</h2>
        <span>Card-based view with quick actions and status tags.</span>
      </header>
      <div v-if="filteredTickets.length === 0" class="empty-state">
        <strong>No tickets found</strong>
        <p>Try creating a new ticket or adjust the filters above.</p>
      </div>
      <div v-else class="grid ticket-grid">
        <article
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="card ticket-card"
          :aria-describedby="`ticket-${ticket.id}`"
        >
          <div class="ticket-meta" :id="`ticket-${ticket.id}`">
            <strong>{{ ticket.title }}</strong>
            <span :class="['tag', `tag-${ticket.status}`]">{{ readableStatus(ticket.status) }}</span>
          </div>
          <span v-if="ticket.priority" style="font-weight: 600; color: #4f5dff">
            Priority: {{ ticket.priority }}
          </span>
          <p v-if="ticket.description" style="margin: 0">{{ ticket.description }}</p>
          <div style="font-size: 0.85rem; color: #6c7391">
            <span>Created: {{ formatDateTime(ticket.createdAt) }}</span>
            <template v-if="ticket.updatedAt">
              <br />Updated: {{ formatDateTime(ticket.updatedAt) }}
            </template>
          </div>
          <div class="ticket-actions">
            <button type="button" class="btn" @click="editingTicketId = ticket.id">Edit</button>
            <button type="button" class="btn btn-secondary" @click="handleDelete(ticket.id)">
              Delete
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import TicketForm from '@/components/TicketForm.vue';
import { useTicketStore } from '@/stores/tickets.js';
import { useToastStore } from '@/stores/toast.js';

const statusFilters = [
  { value: 'all', label: 'All tickets' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];

const filter = ref('all');
const editingTicketId = ref(null);

const ticketStore = useTicketStore();
const toastStore = useToastStore();

const editingTicket = computed(() => ticketStore.tickets.find((ticket) => ticket.id === editingTicketId.value) || null);

const filteredTickets = computed(() => {
  const tickets = ticketStore.tickets;
  const sorted = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (filter.value === 'all') {
    return sorted;
  }
  return sorted.filter((ticket) => ticket.status === filter.value);
});

const readableStatus = (status) => status.replace('_', ' ');

const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

const handleCreate = (values, helpers) => {
  try {
    const ticket = ticketStore.addTicket(values);
    toastStore.showSuccess('Ticket created', `“${ticket.title}” is now ${readableStatus(ticket.status)}.`);
    helpers?.reset?.();
  } catch (error) {
    toastStore.showError('Failed to create ticket', error.message ?? 'Please retry.');
  }
};

const handleUpdate = (values) => {
  if (!editingTicket.value) return;
  try {
    const updated = ticketStore.updateTicket(editingTicket.value.id, values);
    toastStore.showSuccess('Ticket updated', `“${updated.title}” changes saved successfully.`);
    editingTicketId.value = null;
  } catch (error) {
    toastStore.showError('Failed to update ticket', error.message ?? 'Please retry.');
  }
};

const handleDelete = (ticketId) => {
  const ticket = ticketStore.tickets.find((item) => item.id === ticketId);
  if (!ticket) return;

  const confirmed = window.confirm(`Delete “${ticket.title}”? This cannot be undone.`);
  if (!confirmed) return;

  try {
    ticketStore.deleteTicket(ticketId);
    if (editingTicketId.value === ticketId) {
      editingTicketId.value = null;
    }
    toastStore.showSuccess('Ticket deleted', 'The ticket has been removed.');
  } catch (error) {
    toastStore.showError('Failed to delete ticket', error.message ?? 'Please retry.');
  }
};
</script>
