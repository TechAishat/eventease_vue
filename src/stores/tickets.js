import { defineStore } from 'pinia';

const TICKETS_KEY = 'ticketapp_tickets_v1';

const readTickets = () => {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse tickets storage', error);
    return [];
  }
};

const writeTickets = (tickets) => {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
};

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    isHydrated: false
  }),
  actions: {
    hydrate() {
      if (this.isHydrated) return;
      this.tickets = readTickets();
      this.isHydrated = true;
    },
    addTicket(payload) {
      const ticket = {
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      this.tickets = [ticket, ...this.tickets];
      writeTickets(this.tickets);
      return ticket;
    },
    updateTicket(id, updates) {
      this.tickets = this.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
      );
      writeTickets(this.tickets);
      return this.tickets.find((ticket) => ticket.id === id);
    },
    deleteTicket(id) {
      this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
      writeTickets(this.tickets);
    },
    getTicketById(id) {
      return this.tickets.find((ticket) => ticket.id === id) ?? null;
    }
  }
});
