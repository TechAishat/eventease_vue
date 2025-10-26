import { defineStore } from 'pinia';

const USERS_KEY = 'ticketapp_users';
const SESSION_KEY = 'ticketapp_session';

const generateToken = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse users storage', error);
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const findUserByEmail = (users, email) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    sessionToken: null,
    isHydrated: false
  }),
  actions: {
    hydrate() {
      if (this.isHydrated) return;
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (!rawSession) {
        this.isHydrated = true;
        return;
      }

      try {
        const session = JSON.parse(rawSession);
        const users = readUsers();
        const user = users.find((candidate) => candidate.id === session.userId);

        if (session?.token && user) {
          this.user = {
            id: user.id,
            name: user.name,
            email: user.email
          };
          this.sessionToken = session.token;
          this.isHydrated = true;
          return;
        }

        localStorage.removeItem(SESSION_KEY);
        this.isHydrated = true;
      } catch (error) {
        console.error('Failed to hydrate session', error);
        localStorage.removeItem(SESSION_KEY);
        this.isHydrated = true;
      }
    },
    register(payload) {
      const users = readUsers();
      const existing = findUserByEmail(users, payload.email);

      if (existing) {
        const error = new Error('An account with that email already exists.');
        error.code = 'EMAIL_IN_USE';
        throw error;
      }

      const id = crypto.randomUUID();
      const nextUsers = [
        ...users,
        {
          id,
          name: payload.name,
          email: payload.email,
          password: payload.password
        }
      ];

      writeUsers(nextUsers);

      const token = generateToken();
      const session = {
        token,
        userId: id,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      this.user = { id, name: payload.name, email: payload.email };
      this.sessionToken = token;

      return { token };
    },
    login(payload) {
      const users = readUsers();
      const user = findUserByEmail(users, payload.email);

      if (!user || user.password !== payload.password) {
        const error = new Error('Invalid credentials. Please try again.');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
      }

      const token = generateToken();
      const session = {
        token,
        userId: user.id,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      this.user = { id: user.id, name: user.name, email: user.email };
      this.sessionToken = token;

      return { token };
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
      this.user = null;
      this.sessionToken = null;
    }
  }
});
