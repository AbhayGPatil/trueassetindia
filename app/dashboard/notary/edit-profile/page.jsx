'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './notary-profile.module.css';

export default function NotaryProfilePage() {
  const router = useRouter();
  const { user, userProfile: profile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    registrationNumber: '',
    experience: '',
    expertise: '',
    registrationsDone: '',
    bio: '',
    city: '',
    registrationDate: '',
    profilePictureUrl: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!user || profile?.role !== 'notary') {
      router.push('/auth/login');
      return;
    }

    // Load existing profile data
    const loadProfile = async () => {
      try {
        const notaryRef = doc(db, 'notaries', user.uid);
        const notarySnap = await getDoc(notaryRef);
        if (notarySnap.exists()) {
          setProfileData(prev => ({
            ...prev,
            ...notarySnap.data()
          }));
          if (notarySnap.data().profilePictureUrl) {
            setPreviewUrl(notarySnap.data().profilePictureUrl);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadProfile();
  }, [user, profile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!profileData.firstName || !profileData.lastName) {
        throw new Error('First and last name are required');
      }
      if (!profileData.phone) {
        throw new Error('Phone number is required');
      }
      if (!profileData.registrationNumber) {
        throw new Error('Registration number is required');
      }

      let profilePictureUrl = profileData.profilePictureUrl;

      // Upload profile picture if changed
      if (profileImage) {
        const imageRef = ref(storage, `notary-profiles/${user.uid}/profile-pic`);
        await uploadBytes(imageRef, profileImage);
        profilePictureUrl = await getDownloadURL(imageRef);
      }

      // Save to Firestore
      const notaryRef = doc(db, 'notaries', user.uid);
      await setDoc(notaryRef, {
        uid: user.uid,
        ...profileData,
        profilePictureUrl,
        profileComplete: true,
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      setSuccessMsg('Profile saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishProfile = async () => {
    if (!profileData.firstName || !profileData.lastName || !profileData.phone) {
      setError('Please complete your profile before publishing');
      return;
    }

    // Initiate Razorpay payment
    initiatePayment();
  };

  const initiatePayment = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100, // 100 Rs
          planId: 'notary-subscription',
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'TrueAssets',
        description: 'Notary Profile Publishing - ₹100',
        handler: handlePaymentSuccess,
        prefill: {
          name: `${profileData.firstName} ${profileData.lastName}`,
          email: user.email,
          contact: profileData.phone,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Failed to initiate payment: ' + err.message);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);
      
      // Verify payment on backend
      const verifyResponse = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          userId: user.uid,
          planId: 'notary-subscription',
        }),
      });

      const verification = await verifyResponse.json();

      if (verification.success) {
        // Update profile to published
        const notaryRef = doc(db, 'notaries', user.uid);
        await setDoc(notaryRef, {
          profilePublished: true,
          subscriptionStatus: 'active',
          subscriptionStartDate: serverTimestamp(),
          publishedAt: serverTimestamp(),
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        }, { merge: true });

        setSuccessMsg('Profile published successfully! You are now visible to buyers.');
        setTimeout(() => {
          router.push('/dashboard/notary');
        }, 2000);
      } else {
        throw new Error(verification.error || 'Payment verification failed');
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || profile?.role !== 'notary') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Notary Profile</h1>
        <p className={styles.subtitle}>Complete your profile to showcase your services</p>
      </div>

      <form onSubmit={handleSaveProfile} className={styles.form}>
        {error && <div className={styles.errorBanner}>{error}</div>}
        {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

        {/* Profile Picture Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Picture</h2>
          <div className={styles.profilePictureSection}>
            {previewUrl && (
              <div className={styles.previewWrapper}>
                <img src={previewUrl} alt="Profile preview" className={styles.previewImage} />
              </div>
            )}
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
                <span className={styles.uploadText}>
                  {profileImage ? '✓ Picture selected' : 'Upload Profile Picture'}
                </span>
              </label>
              <p className={styles.uploadHint}>JPG or PNG, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className={styles.disabledInput}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>City *</label>
              <select
                name="city"
                value={profileData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Goa">Goa</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                value={profileData.registrationDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Information</h2>

          <div className={styles.formGroup}>
            <label>Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              value={profileData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., BAR/REG/12345"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Years of Experience *</label>
              <select
                name="experience"
                value={profileData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience</option>
                <option value="0-2">0-2 years</option>
                <option value="2-5">2-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-15">10-15 years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Registrations Done</label>
              <input
                type="number"
                name="registrationsDone"
                value={profileData.registrationsDone}
                onChange={handleChange}
                placeholder="e.g., 250"
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Areas of Expertise</label>
            <input
              type="text"
              name="expertise"
              value={profileData.expertise}
              onChange={handleChange}
              placeholder="e.g., Property Registration, Stamp Duty, Document Notarization"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Bio / About</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Tell buyers about your services and experience..."
              rows="5"
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.saveBtn}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={handlePublishProfile}
            disabled={loading}
            className={styles.publishBtn}
          >
            {loading ? 'Processing...' : '₹100 - Publish & Go Live'}
          </button>
        </div>
      </form>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
