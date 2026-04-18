'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from '../signup.module.css';

export default function BuyerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'buyer',
    password: '',
    confirmPassword: '',
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Create user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'buyer',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'free',
          plan: null,
          expiryDate: null,
        },
        freeUploads: {
          used: 0,
          limit: 0,
        },
      });

      // Redirect to buyer dashboard
      router.push('/dashboard/buyer');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Property Buyer Signup</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Join thousands of property buyers finding their dream homes
        </p>
        
        <form onSubmit={handleSignup} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email *</label>
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
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
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
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#0066FF', fontWeight: '600' }}>Login here</a>
        </p>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#666' }}>
          Want to post properties? <a href="/auth/signup/owner" style={{ color: '#0066FF', fontWeight: '600' }}>Sign up as Owner/Broker</a>
        </p>
      </div>
    </div>
  );
}
