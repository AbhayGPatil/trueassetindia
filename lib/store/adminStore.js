import { create } from 'zustand';

// Super Admin credentials
const ADMIN_EMAIL = 'info.trueasset@gmail.com';
const ADMIN_PASSWORD = 'admin12345';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminEmail: null,
  
  login: (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      set({ isAuthenticated: true, adminEmail: email });
      // Save to localStorage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminAuth', JSON.stringify({ 
          isAuthenticated: true, 
          adminEmail: email,
          timestamp: Date.now()
        }));
      }
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false, adminEmail: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth');
    }
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminAuth');
      if (stored) {
        try {
          const auth = JSON.parse(stored);
          // Check if session is valid (less than 24 hours old)
          if (auth.isAuthenticated && Date.now() - auth.timestamp < 24 * 60 * 60 * 1000) {
            set({ isAuthenticated: true, adminEmail: auth.adminEmail });
            return true;
          }
        } catch (e) {
          console.error('Failed to parse admin auth:', e);
        }
      }
    }
    return false;
  },

  getAuthStatus: () => get().isAuthenticated,
  getAdminEmail: () => get().adminEmail,
}));
