'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

      // Redirect based on role
      if (userProfile.role === 'owner') {
        router.push('/dashboard/owner');
      } else if (userProfile.role === 'broker') {
        router.push('/dashboard/broker');
      } else if (userProfile.role === 'developer') {
        router.push('/dashboard/developer');
      } else if (userProfile.role === 'notary') {
        router.push('/dashboard/notary');
      } else if (userProfile.role === 'buyer') {
        router.push('/dashboard/buyer');
      } else {
        router.push('/');
      }
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

        <p className={styles.footer}>
          Don't have an account? <a href="/auth/signup" className={styles.link}>Sign up here</a>
        </p>
      </div>
    </div>
  );
}
