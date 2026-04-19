'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from './owner-signup.module.css';

export default function OwnerSignupPage() {
  const router = useRouter();
  const [role, setRole] = useState('owner'); // 'owner', 'broker', 'developer', or 'notary'
  const [propertyType, setPropertyType] = useState('sell');
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

      // Use the selected role directly
      const userRole = role; // 'owner', 'broker', 'developer', or 'notary'

      // Determine free upload limits based on role
      let freeUploadLimit = 0;
      switch(userRole) {
        case 'owner':
          freeUploadLimit = 2;
          break;
        case 'broker':
          freeUploadLimit = 3;
          break;
        case 'developer':
          freeUploadLimit = 5;
          break;
        case 'notary':
          freeUploadLimit = 2;
          break;
        default:
          freeUploadLimit = 0;
      }

      // Create user profile in Firestore with role-specific data
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        role: userRole,
        // Only set propertyType for owners
        propertyType: userRole === 'owner' ? propertyType : null,
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'free',
          plan: null,
          expiryDate: null,
        },
        // Role-based free upload limits
        freeUploads: {
          used: 0,
          limit: freeUploadLimit,
        },
        // Additional broker-specific data
        ...(userRole === 'broker' && {
          brokerLicense: null,
          agencyName: null,
          active: true,
        }),
      });

      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        owner: '/dashboard/owner',
        broker: '/dashboard/broker',
        developer: '/dashboard/developer',
        notary: '/dashboard/notary',
      };

      router.push(dashboardRoutes[userRole] || '/dashboard/owner');
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
        <a href="#post-property">Post Property Ads</a>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '40px' }}>
            <img
              src="/assets/signupimg.png"
              alt="Post Property"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h2 className={styles.mainHeading}>
            Post your property Ad to sell or rent online for <span className={styles.highlight}>Free!</span>
          </h2>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Get Access to 1 Lakh+ Buyers</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Sell Faster with Premium Service</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✓</div>
              <div className={styles.benefitText}>Get Expert Advice on Market Trends and Insights</div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - FORM */}
        <div className={styles.rightSection}>
          <div className={styles.formWrapper}>
            <h1 className={styles.formHeading}>Let's get you started</h1>

            <form onSubmit={handleSignup}>
              {error && <div className={styles.error}>{error}</div>}

              {/* YOU ARE TOGGLE - Owner, Broker, Developer, or Notary */}
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>You are:</label>
                <div className={styles.toggleButtons}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${role === 'owner' ? styles.active : ''}`}
                    onClick={() => router.push('/auth/signup/owner')}
                  >
                    Owner
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${role === 'broker' ? styles.active : ''}`}
                    onClick={() => router.push('/auth/signup/broker')}
                  >
                    Broker
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${role === 'developer' ? styles.active : ''}`}
                    onClick={() => router.push('/auth/signup/developer')}
                  >
                    Developer
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${role === 'notary' ? styles.active : ''}`}
                    onClick={() => router.push('/auth/signup/notary')}
                  >
                    Notary/Advocate
                  </button>
                </div>
              </div>

              {/* YOU ARE HERE TO TOGGLE - Only for Owner */}
              {role === 'owner' && (
                <div className={styles.toggleGroup}>
                  <label className={styles.toggleLabel}>You are here to:</label>
                  <div className={styles.toggleButtons}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${propertyType === 'sell' ? styles.active : ''}`}
                      onClick={() => setPropertyType('sell')}
                    >
                      Sell
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${propertyType === 'rent' ? styles.active : ''}`}
                      onClick={() => setPropertyType('rent')}
                    >
                      Rent/lease
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${propertyType === 'pg' ? styles.active : ''}`}
                      onClick={() => setPropertyType('pg')}
                    >
                      List as PG
                    </button>
                  </div>
                </div>
              )}

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
                  Enter your <strong>WhatsApp No.</strong> to get enquiries from Buyer/Tenant
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

      {/* HOW IT WORKS SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionMaxWidth}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Post your Property Ad</h3>
              <p className={styles.stepDescription}>
                Enter all details like locality name, amenities etc. along with uploading Photos
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Check Responses on Dashboard</h3>
              <p className={styles.stepDescription}>
                Get access to Buyer/Tenant contact details & connect easily
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Sell/Rent faster with instant Connect</h3>
              <p className={styles.stepDescription}>
                Negotiate with your prospective Buyer/Tenant & mutually close the deal (site-visit)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TIPS ON SELLING SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionMaxWidth}>
          <h2 className={styles.sectionTitle}>Tips on Selling a Property Online</h2>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Post your Property Ad</h3>
              <p className={styles.tipDescription}>
                Enter all details like locality name, amenities etc. along with uploading Photos
              </p>
            </div>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Add Quality Photos</h3>
              <p className={styles.tipDescription}>
                Do not forget to add high-quality photos as it's key for any property to stand out. You can always request a photoshoot of your property.
              </p>
            </div>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Choose Correct Locality/Address</h3>
              <p className={styles.tipDescription}>
                Make sure to accurately map your locality while filling in the details of your property. Adding a correct locality is essential for genuine queries.
              </p>
            </div>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Write a Great Description</h3>
              <p className={styles.tipDescription}>
                Provide a short description highlighting the key USPs and all the relevant details to help buyers make a decision.
              </p>
            </div>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Add additional details</h3>
              <p className={styles.tipDescription}>
                You need to add all the relevant details about your property like the type of furnishing, flooring, water supply, etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionMaxWidth}>
          <h2 className={styles.sectionTitle}>Benefits of Selling Your Property Online</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '15px' }}>
            With a plethora of real estate websites to choose from, posting property online is now easy, convenient and hassle-free. Here are some benefits of buying and selling your property online:
          </p>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h3 className={styles.benefitCardTitle}> Time-Efficient</h3>
              <p className={styles.benefitCardDescription}>
                Selling your property online can help you save time, manage your bookings at your convenience and receive quality leads quickly.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h3 className={styles.benefitCardTitle}> Get Better Exposure</h3>
              <p className={styles.benefitCardDescription}>
                A large number of prospective buyers search online. This helps your property get wider exposure to lakhs of buyers present online.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h3 className={styles.benefitCardTitle}> Cost-Effective</h3>
              <p className={styles.benefitCardDescription}>
                By opting to sell online, you can expect a significant reduction in agent fees and overall cost associated with selling a home.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h3 className={styles.benefitCardTitle}>More Services</h3>
              <p className={styles.benefitCardDescription}>
                TRUE ASSET offers a multitude of property services such as rent agreements, home cleaning, renovation, tenant verification, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
