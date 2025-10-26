<template>
  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem">
    <header class="dashboard-header">
      <div class="dashboard-heading">
        <span class="tag tag-open" aria-label="Logged in user">Welcome back</span>
        <h1>Hi {{ firstName }}, here&apos;s your control center</h1>
        <span>Manage tickets, track progress, and collaborate with your team in real time.</span>
      </div>
      <div class="hero-actions" style="justify-content: flex-end">
        <RouterLink to="/tickets" class="btn">Manage tickets</RouterLink>
        <RouterLink to="/tickets" class="btn btn-secondary">View board</RouterLink>
      </div>
    </header>

    <section class="grid stats-grid" aria-label="Ticket statistics">
      <article class="card" role="status">
        <h2 style="margin-top: 0">Total tickets</h2>
        <strong style="font-size: 2.5rem">{{ stats.total }}</strong>
        <p style="color: #6c7391">All tickets across all status.</p>
      </article>
      <article class="card" role="status">
        <h2 style="margin-top: 0">Open tickets</h2>
        <strong style="font-size: 2.5rem; color: #2f8f46">{{ stats.open }}</strong>
        <p style="color: #6c7391">Items that require immediate attention.</p>
      </article>
      <article class="card" role="status">
        <h2 style="margin-top: 0">In progress</h2>
        <strong style="font-size: 2.5rem; color: #a86a08">{{ stats.inProgress }}</strong>
        <p style="color: #6c7391">Currently being worked on.</p>
      </article>
      <article class="card" role="status">
        <h2 style="margin-top: 0">Resolved</h2>
        <strong style="font-size: 2.5rem; color: #495057">{{ stats.closed }}</strong>
        <p style="color: #6c7391">Completed tickets.</p>
      </article>
    </section>

    <section class="tablet-two-column" style="margin-top: 3rem">
      <article class="card" style="display: grid; gap: 1.5rem">
        <header>
          <h2 style="margin: 0">Progress overview</h2>
          <p style="color: #6c7391; margin-bottom: 0">
            Track your team's progress and stay on top of your tickets.
          </p>
        </header>
        <div
          role="img"
          :aria-label="`Completion rate ${stats.completionRate}%`"
          style="
            background: rgba(79, 93, 255, 0.08);
            border-radius: 24px;
            padding: 2rem;
            display: grid;
            place-items: center;
          "
        >
          <div
            style="
              width: 160px;
              height: 160px;
              border-radius: 50%;
              display: grid;
              place-items: center;
              color: #4f5dff;
              font-weight: 700;
              font-size: 1.75rem;
            "
            :style="{
              background: `conic-gradient(#4f5dff ${stats.completionRate}%, rgba(79, 93, 255, 0.2) ${stats.completionRate}% 100%)`
            }"
          >
            {{ stats.completionRate }}%
          </div>
        </div>
        <ul style="margin: 0; padding-left: 1.25rem; color: #4a5272">
          <li>Ensure open tickets are triaged daily.</li>
          <li>Celebrate resolved tickets with the team.</li>
          <li>Keep statuses up-to-date for accuracy.</li>
        </ul>
      </article>

      <article class="card" style="display: grid; gap: 1.25rem">
        <header>
          <h2 style="margin: 0">Recent tickets</h2>
          <p style="color: #6c7391; margin-bottom: 0">
            A quick view of what was recently created.
          </p>
        </header>
        <div v-if="stats.recent.length === 0" class="empty-state" style="padding: 2rem 1rem">
          <strong>No tickets yet</strong>
          <p>Once you start creating tickets, they&apos;ll appear here.</p>
        </div>
        <ul v-else style="list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem">
          <li
            v-for="ticket in stats.recent"
            :key="ticket.id"
            class="card-soft"
            style="display: grid; gap: 0.5rem"
          >
            <div class="ticket-meta">
              <strong>{{ ticket.title }}</strong>
              <span :class="['tag', `tag-${ticket.status}`]">{{ readableStatus(ticket.status) }}</span>
            </div>
            <span style="color: #6c7391; font-size: 0.9rem">
              Created on {{ formatDate(ticket.createdAt) }}
            </span>
            <p v-if="ticket.description" style="margin: 0">{{ ticket.description }}</p>
          </li>
        </ul>
        <RouterLink to="/tickets" class="btn btn-secondary" style="justify-self: flex-start">
          Go to tickets
        </RouterLink>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useTicketStore } from '@/stores/tickets.js';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const stats = computed(() => {
  const tickets = ticketStore.tickets;
  const total = tickets.length;
  const open = tickets.filter((ticket) => ticket.status === 'open').length;
  const inProgress = tickets.filter((ticket) => ticket.status === 'in_progress').length;
  const closed = tickets.filter((ticket) => ticket.status === 'closed').length;

  const completionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  const recent = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return {
    total,
    open,
    inProgress,
    closed,
    completionRate,
    recent
  };
});

const firstName = computed(() => authStore.user?.name?.split(' ')[0] ?? 'there');

const readableStatus = (status) => status.replace('_', ' ');

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script>
