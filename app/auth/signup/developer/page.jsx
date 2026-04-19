'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from './developer-signup.module.css';

export default function DeveloperSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    reraId: '',
    gstNumber: '',
    operatingCities: '',
    totalExperience: '',
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

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Create developer profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'developer',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'free',
          plan: null,
          expiryDate: null,
        },
        freeUploads: {
          used: 0,
          limit: 5, // 5 free uploads for developers
        },
        // Developer-specific fields (optional)
        developerProfile: {
          companyName: formData.companyName || null,
          reraId: formData.reraId || null,
          gstNumber: formData.gstNumber || null,
          operatingCities: formData.operatingCities || null,
          totalExperience: formData.totalExperience || null,
        },
      });

      // Redirect to developer dashboard
      router.push('/dashboard/developer');
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
        <a href="#developer-signup">Developer Sign Up</a>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '40px' }}>
            <img
              src="/assets/signupimg.png"
              alt="Developer Sign Up"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h2 className={styles.mainHeading}>
            Build Real Estate Projects with <span className={styles.highlight}>TrueAssets</span>
          </h2>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Manage Projects & Properties in One Place</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>5 FREE Project Listings</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Reach Investors & Buyers Across India</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Upgrade Anytime for Premium Features</div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - FORM */}
        <div className={styles.rightSection}>
          <div className={styles.formWrapper}>
            <h1 className={styles.formHeading}>Developer Account</h1>
            <p className={styles.formSubtitle}>Create your developer profile with TrueAssets</p>

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
                    className={`${styles.toggleBtn}`}
                    onClick={() => router.push('/auth/signup/broker')}
                  >
                    Broker
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${styles.active}`}
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

              {/* BASIC INFO SECTION */}
              <div className={styles.sectionTitle}>Basic Information</div>

              {/* NAME FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name *</label>
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

              {/* PHONE FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className={styles.formInput}
                  required
                />
              </div>

              {/* COMPANY SECTION */}
              <div className={styles.sectionTitle}>Company Details (Optional)</div>

              {/* COMPANY NAME FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className={styles.formInput}
                />
              </div>

              {/* RERA ID FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>RERA ID (if applicable)</label>
                <input
                  type="text"
                  name="reraId"
                  value={formData.reraId}
                  onChange={handleChange}
                  placeholder="e.g., MH-ABC-12345"
                  className={styles.formInput}
                />
                <small className={styles.fieldHint}>Registration Regulatory Authority ID for legal credibility</small>
              </div>

              {/* GST NUMBER FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="15-digit GST number"
                  className={styles.formInput}
                />
                <small className={styles.fieldHint}>For B2B invoicing of subscriptions</small>
              </div>

              {/* OPERATING CITIES FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Operating Cities</label>
                <input
                  type="text"
                  name="operatingCities"
                  value={formData.operatingCities}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai, Bangalore, Delhi"
                  className={styles.formInput}
                />
                <small className={styles.fieldHint}>Comma-separated cities where you typically build</small>
              </div>

              {/* TOTAL EXPERIENCE FIELD */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Total Experience</label>
                <input
                  type="text"
                  name="totalExperience"
                  value={formData.totalExperience}
                  onChange={handleChange}
                  placeholder="e.g., Building since 1995"
                  className={styles.formInput}
                />
                <small className={styles.fieldHint}>Years or timeline to show scale and expertise</small>
              </div>

              {/* PASSWORD SECTION */}
              <div className={styles.sectionTitle}>Security</div>

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
                {loading ? 'Creating Account...' : 'Create Developer Account'}
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
