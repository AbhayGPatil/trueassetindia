'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './notary-dashboard.module.css';
import Link from 'next/link';

export default function NotaryDashboard() {
  const router = useRouter();
  const { user, userProfile: profile, loading } = useContext(AuthContext);
  const [notaryProfile, setNotaryProfile] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup');
      return;
    }

    if (profile?.role !== 'notary') {
      router.push('/auth/signup');
      return;
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const notaryRef = doc(db, 'notaries', user.uid);
        const notarySnap = await getDoc(notaryRef);
        if (notarySnap.exists()) {
          setNotaryProfile(notarySnap.data());
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || dashboardLoading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  const profileComplete = notaryProfile?.profileComplete;
  const profilePublished = notaryProfile?.profilePublished;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Notary Profile</h1>
          <p className={styles.subtitle}>Manage your professional profile and get work opportunities</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className={styles.statusCards}>
        <div className={`${styles.statusCard} ${profileComplete ? styles.complete : styles.incomplete}`}>
          <div className={styles.statusIcon}>{profileComplete ? '✓' : '◯'}</div>
          <div>
            <h3>Profile Completion</h3>
            <p>{profileComplete ? 'Complete' : 'Incomplete'}</p>
          </div>
        </div>

        <div className={`${styles.statusCard} ${profilePublished ? styles.published : styles.unpublished}`}>
          <div className={styles.statusIcon}>{profilePublished ? '✓' : '⏳'}</div>
          <div>
            <h3>Publication Status</h3>
            <p>{profilePublished ? 'Published' : 'Not Published'}</p>
          </div>
        </div>

        <div className={`${styles.statusCard} ${notaryProfile?.subscriptionStatus === 'active' ? styles.active : styles.inactive}`}>
          <div className={styles.statusIcon}>{notaryProfile?.subscriptionStatus === 'active' ? '✓' : '❌'}</div>
          <div>
            <h3>Subscription</h3>
            <p>{notaryProfile?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      {profileComplete && (
        <div className={styles.profilePreview}>
          <h2>Profile Preview</h2>
          <div className={styles.previewContent}>
            <div className={styles.previewPicture}>
              {notaryProfile?.profilePictureUrl ? (
                <img src={notaryProfile.profilePictureUrl} alt="Profile" />
              ) : (
                <div className={styles.placeholderPic}>
                  {notaryProfile?.firstName?.charAt(0)}{notaryProfile?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.previewInfo}>
              <h3>{notaryProfile?.firstName} {notaryProfile?.lastName}</h3>
              <p className={styles.city}>📍 {notaryProfile?.city}</p>
              <p className={styles.registration}>Reg #: {notaryProfile?.registrationNumber}</p>
              <p className={styles.experience}>Experience: {notaryProfile?.experience}</p>
              {notaryProfile?.expertise && (
                <p className={styles.expertise}>Expertise: {notaryProfile.expertise}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Link href="/dashboard/notary/edit-profile" className={styles.primaryBtn}>
          {profileComplete ? '✏️ Edit Profile' : '🚀 Complete Profile'}
        </Link>
        {profileComplete && !profilePublished && (
          <a href="#publish" onClick={() => document.getElementById('publish-section')?.scrollIntoView({ behavior: 'smooth' })} className={styles.secondaryBtn}>
            📤 Publish Profile
          </a>
        )}
      </div>

      {/* Publish Section */}
      {profileComplete && !profilePublished && (
        <div id="publish-section" className={styles.publishSection}>
          <h2>Get Visible to Buyers</h2>
          <p>Publish your profile to start appearing in our notary directory and get work opportunities.</p>
          <div className={styles.publishDetails}>
            <div className={styles.detail}>
              <span className={styles.detailIcon}>💰</span>
              <div>
                <h4>One-time Payment</h4>
                <p>Just ₹100 for unlimited visibility</p>
              </div>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailIcon}>📊</span>
              <div>
                <h4>Get Inquiries</h4>
                <p>Buyers can find and contact you directly</p>
              </div>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailIcon}>⭐</span>
              <div>
                <h4>Build Reputation</h4>
                <p>Get verified badge and trust from clients</p>
              </div>
            </div>
          </div>
          <Link href="/dashboard/notary/edit-profile" className={styles.publishBtn}>
            💳 Proceed to Payment (₹100)
          </Link>
        </div>
      )}

      {/* Published Section */}
      {profilePublished && (
        <div className={styles.publishedSection}>
          <h2>✓ Profile Published</h2>
          <p>Your profile is now visible to buyers searching for notary services.</p>
          <Link href="/notaries" className={styles.viewBtn}>
            👁️ View in Directory
          </Link>
        </div>
      )}

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqItems}>
          <details className={styles.faqItem}>
            <summary>What information is required to complete my profile?</summary>
            <p>You need to provide your name, phone number, registration details, years of experience, areas of expertise, and a professional profile picture.</p>
          </details>

          <details className={styles.faqItem}>
            <summary>How long does it take to get published?</summary>
            <p>Payment processing is instant. Once completed, your profile will be visible immediately in our notary directory.</p>
          </details>

          <details className={styles.faqItem}>
            <summary>Can I edit my profile after publishing?</summary>
            <p>Yes, you can edit your profile anytime. Changes will be reflected immediately on your published profile.</p>
          </details>

          <details className={styles.faqItem}>
            <summary>What is the payment for?</summary>
            <p>The ₹100 payment is a one-time fee for profile publication. It helps us maintain the quality of our platform and ensures you get quality inquiries.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
