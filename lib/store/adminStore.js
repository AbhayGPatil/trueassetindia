import { create } from 'zustand';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Super Admin credentials
const ADMIN_EMAIL = 'info.trueasset@gmail.com';
const ADMIN_PASSWORD = 'admin12345';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminEmail: null,

  login: async (email, password) => {
    // Verify credentials match hardcoded admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return false;
    }

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      set({ isAuthenticated: true, adminEmail: email });

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminAuth', JSON.stringify({
          isAuthenticated: true,
          adminEmail: email,
          timestamp: Date.now(),
          uid: userCredential.user.uid
        }));
      }
      return true;
    } catch (error) {
      console.error('Firebase authentication failed:', error.code, error.message);
      return false;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }

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
          const authData = JSON.parse(stored);
          // Check if session is valid (less than 24 hours old)
          if (authData.isAuthenticated && Date.now() - authData.timestamp < 24 * 60 * 60 * 1000) {
            set({ isAuthenticated: true, adminEmail: authData.adminEmail });
            return true;
          }
        } catch (error) {
          console.error('Failed to parse admin auth:', error);
        }
      }
    }
    return false;
  },

  getAuthStatus: () => get().isAuthenticated,
  getAdminEmail: () => get().adminEmail,
}));
