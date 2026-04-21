'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import NotaryCard from './NotaryCard';
import styles from './NotariesSection.module.css';
import Link from 'next/link';

export default function NotariesSection() {
  const [notaries, setNotaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotaries = async () => {
      try {
        const notariesQuery = query(
          collection(db, 'notaries'),
          where('profilePublished', '==', true),
          where('subscriptionStatus', '==', 'active'),
          limit(4)
        );

        const snapshot = await getDocs(notariesQuery);
        const notariesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotaries(notariesData);
      } catch (err) {
        console.error('Error fetching notaries:', err);
        setError('Failed to load notaries');
      } finally {
        setLoading(false);
      }
    };

    fetchNotaries();
  }, []);

  const handleContactNotary = (notary) => {
    // Open contact modal or redirect to notary details page
    window.location.href = `/notary/${notary.id}`;
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>Trusted Notaries & Advocates</h2>
          <p>Professional notarization services for your property needs</p>
        </div>
        <div className={styles.loadingMessage}>Loading notaries...</div>
      </section>
    );
  }

  if (notaries.length === 0) {
    return null; // Don't show section if no notaries
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Trusted Notaries & Advocates</h2>
          <p className={styles.subtitle}>Professional notarization services for your property needs</p>
        </div>
        <Link href="/notaries" className={styles.seeAllLink}>
          See all →
        </Link>
      </div>

      <div className={styles.grid}>
        {notaries.map(notary => (
          <NotaryCard
            key={notary.id}
            notary={notary}
            onContact={() => handleContactNotary(notary)}
          />
        ))}
      </div>

      {notaries.length > 0 && (
        <div className={styles.footer}>
          <p>Looking for a notary? Browse our complete directory of verified professionals.</p>
          <Link href="/notaries" className={styles.browseBtn}>
            Browse All Notaries
          </Link>
        </div>
      )}
    </section>
  );
}
