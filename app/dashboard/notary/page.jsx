'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import styles from '../owner/dashboard.module.css';

export default function NotaryDashboard() {
  const router = useRouter();
  const { user, userProfile: profile, loading } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
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
    const fetchData = async () => {
      if (!user) return;

      try {
        const documentsQuery = query(
          collection(db, 'documents'),
          where('uploadedBy', '==', user.uid)
        );
        const documentsSnapshot = await getDocs(documentsQuery);
        setDocuments(documentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || dashboardLoading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Notary/Advocate Dashboard</h1>
        <p>Welcome, {profile?.name}!</p>
      </div>

      <div className={styles.grid}>
        {/* Statistics */}
        <div className={styles.card}>
          <h3>Documents Listed</h3>
          <p className={styles.stat}>{documents.length}</p>
        </div>

        <div className={styles.card}>
          <h3>FREE Uploads Remaining</h3>
          <p className={styles.stat}>{Math.max(0, (profile?.freeUploads?.limit || 2) - (profile?.freeUploads?.used || 0))}</p>
        </div>

        <div className={styles.card}>
          <h3>Account Status</h3>
          <p className={styles.stat}>{profile?.subscription?.status === 'active' ? 'Premium' : 'Free'}</p>
        </div>
      </div>

      {/* Documents List */}
      <div className={styles.section}>
        <h2>Your Services</h2>
        {documents.length === 0 ? (
          <p className={styles.empty}>No services listed yet. Start by uploading your services!</p>
        ) : (
          <div className={styles.propertiesList}>
            {documents.map(doc => (
              <div key={doc.id} className={styles.propertyItem}>
                <h3>{doc.title}</h3>
                <p>{doc.description}</p>
                <p>{doc.serviceType}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        className={styles.uploadButton}
        onClick={() => router.push('/upload/notary')}
      >
        Add New Service
      </button>
    </div>
  );
}
