'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from './broker-signup.module.css';

export default function BrokerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
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

      // Create broker profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        role: 'broker',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'free',
          plan: null,
          expiryDate: null,
        },
        freeUploads: {
          used: 0,
          limit: 3,
        },
        brokerLicense: null,
        agencyName: null,
        active: true,
      });

      // Redirect to broker dashboard
      router.push('/dashboard/broker');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <a href="/">Home</a>
        <span>{' > '}</span>
        <a href="#broker-signup">Broker Sign Up</a>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '40px' }}>
            <img
              src="/assets/signupimg.png"
              alt="Broker Sign Up"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h2 className={styles.mainHeading}>
            Grow Your Real Estate Business with <span className={styles.highlight}>TrueAssets</span>
          </h2>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Access to 1 Lakh+ Buyers & Sellers</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>3 FREE Property Listings</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Get Expert Marketing Tools</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Expand Your Agent Network</div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - FORM */}
        <div className={styles.rightSection}>
          <div className={styles.formWrapper}>
            <h1 className={styles.formHeading}>Join as a Broker</h1>

            <form onSubmit={handleSignup}>
              {error && <div className={styles.error}>{error}</div>}

              {/* ROLE BUTTONS - For Navigation */}
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>You are:</label>
                <div className={styles.toggleButtons}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn}`}
                    onClick={() => router.push('/auth/signup/owner')}
                  >
                    Owner
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${styles.active}`}
                  >
                    Broker
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn}`}
                    onClick={() => router.push('/auth/signup/developer')}
                  >
                    Developer
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn}`}
                    onClick={() => router.push('/auth/signup/notary')}
                  >
                    Notary/Advocate
                  </button>
                </div>
              </div>

              {/* NAME FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* EMAIL FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* WHATSAPP FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your contact number</label>
                <div className={styles.whatsappGroup}>
                  <select className={styles.countryCode}>
                    <option>IND +91</option>
                  </select>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp Number"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.whatsappHint}>
                  Enter your <strong>WhatsApp No.</strong> to get enquiries from Buyer/Seller
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* CONFIRM PASSWORD FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Start Now'}
              </button>
            </form>

            <div className={styles.loginLink}>
              Already have an account? <a href="/auth/login">Login here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
