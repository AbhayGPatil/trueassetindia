'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const redirectByRole = (role) => {
    if (role === 'owner') router.push('/dashboard/owner');
    else if (role === 'broker') router.push('/dashboard/broker');
    else if (role === 'developer') router.push('/dashboard/developer');
    else if (role === 'notary') router.push('/dashboard/notary');
    else if (role === 'buyer') router.push('/dashboard/buyer');
    else router.push('/');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userRef);

      if (userDocSnap.exists()) {
        redirectByRole(userDocSnap.data().role);
      } else {
        // New Google user — create a default buyer profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          role: 'buyer',
          createdAt: new Date().toISOString(),
          subscription: {
            plan: 'free',
            startDate: null,
            endDate: null,
            status: 'free',
            propertiesUploaded: 0,
            maxAllowed: 0,
          },
          freeUploadsUsed: 0,
          maxFreeUploads: 0,
        });
        router.push('/dashboard/buyer');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(
          err.code === 'auth/account-exists-with-different-credential'
            ? 'An account with this email already exists. Please sign in with email & password.'
            : 'Google sign-in failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Fetch user profile from Firestore to get role
      const userRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userRef);

      if (!userDocSnap.exists()) {
        throw new Error('User profile not found');
      }

      const userProfile = userDocSnap.data();
      redirectByRole(userProfile.role);
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'Email not found. Please sign up first.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address.'
        : err.message || 'Login failed';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Welcome Back to TrueAssets</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.2-2.7-.5-4z" fill="#FFC107"/>
            <path d="M6.3 14.7l7 5.1C15.1 16.2 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.4-17.7 11.7z" fill="#FF3D00"/>
            <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.6 35.7 26.9 37 24 37c-5.7 0-10.6-3.9-12.3-9.2l-6.9 5.3C8 40.4 15.4 45 24 45z" fill="#4CAF50"/>
            <path d="M44.5 20H24v8.5h11.8c-1 2.9-2.9 5.3-5.3 7l6.6 5.6C41.2 37.4 45 31.2 45 24c0-1.4-.2-2.7-.5-4z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        <p className={styles.footer}>
          Don't have an account? <a href="/auth/signup" className={styles.link}>Sign up here</a>
        </p>
      </div>
    </div>
  );
}
