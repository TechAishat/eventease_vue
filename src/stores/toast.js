import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toast: null,
    timeoutId: null
  }),
  actions: {
    show(variant, title, message) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.toast = { variant, title, message };
      this.timeoutId = window.setTimeout(() => {
        this.clear();
      }, 4000);
    },
    showSuccess(title, message) {
      this.show('success', title, message);
    },
    showError(title, message) {
      this.show('error', title, message);
    },
    clear() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.toast = null;
    }
  }
});
