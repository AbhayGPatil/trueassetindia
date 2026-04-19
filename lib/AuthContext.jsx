'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, userData) => {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Determine max free uploads based on role
      const role = userData.role || 'buyer';
      const maxFreeUploads = role === 'broker' ? 3 : (role === 'owner' ? 2 : 0);
      
      // Create user profile in Firestore with subscription fields
      await setDoc(doc(db, 'users', authUser.uid), {
        uid: authUser.uid,
        email,
        ...userData,
        createdAt: new Date().toISOString(),
        
        // Subscription tracking
        subscription: {
          plan: 'free',
          startDate: null,
          endDate: null,
          status: 'free',
          propertiesUploaded: 0,
          maxAllowed: maxFreeUploads,
        },
        
        // Rent subscription (only for owners)
        rentSubscription: role === 'owner' ? {
          plan: 'none',
          startDate: null,
          endDate: null,
          status: 'none',
          rentPropertiesUploaded: 0,
          maxAllowed: 0,
        } : undefined,
        
        // Free uploads tracking
        freeUploadsUsed: 0,
        maxFreeUploads: maxFreeUploads,
      });

      return authUser;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password);
      return authUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh user profile from Firestore (used after subscription updates)
   */
  const refreshUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
        return userDocSnap.data();
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
