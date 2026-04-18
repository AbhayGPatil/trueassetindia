'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import styles from './dashboard.module.css';

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, userProfile: profile, loading } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [interestedClients, setInterestedClients] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup');
      return;
    }

    if (profile?.role !== 'owner') {
      router.push('/auth/signup');
      return;
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch properties
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('uploadedBy', '==', user.uid)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        setProperties(propertiesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

        // Fetch interested clients
        const interestedQuery = query(
          collection(db, 'interestedVisitors'),
          where('ownerId', '==', user.uid)
        );
        const interestedSnapshot = await getDocs(interestedQuery);
        setInterestedClients(interestedSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || dashboardLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (!user || profile?.role !== 'owner') {
    return <div className={styles.loading}>Redirecting...</div>;
  }

  const uploadsRemaining = profile?.freeUploads?.limit - (profile?.freeUploads?.used || 0);
  const isSubscribed = profile?.subscription?.status === 'active';

  return (
    <div className={styles.container}>
      {/* BACK BUTTON */}
      <button 
        onClick={() => router.push('/')}
        className={styles.backButton}
        title="Back to Home"
      >
        ← Back to Home
      </button>
      <header className={styles.header}>
        <div>
          <h1>Welcome, {profile?.name}!</h1>
          <p>Your property management dashboard</p>
        </div>
        <button onClick={() => router.push('/subscription')} className={styles.headerBtn}>
          {isSubscribed ? '✓ Subscribed' : '+ Upgrade Plan'}
        </button>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>◆</div>
          <div>
            <p className={styles.statLabel}>Properties Listed</p>
            <p className={styles.statValue}>{properties.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>὆5</div>
          <div>
            <p className={styles.statLabel}>Interested Visitors</p>
            <p className={styles.statValue}>{interestedClients.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>↑</div>
          <div>
            <p className={styles.statLabel}>Free Uploads Left</p>
            <p className={styles.statValue}>{isSubscribed ? '∞' : uploadsRemaining}/2</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>★</div>
          <div>
            <p className={styles.statLabel}>Subscription Status</p>
            <p className={styles.statValue} style={{ color: isSubscribed ? '#0066FF' : '#ff6b35' }}>
              {isSubscribed ? 'Active' : 'Free'}
            </p>
          </div>
        </div>
      </div>

      {profile?.subscription?.expiryDate && (
        <div className={styles.subscriptionBanner}>
          <p>
            <strong>Active Plan:</strong> {profile?.subscription?.plan} 
            {' • '}
            <strong>Expires:</strong> {new Date(profile?.subscription?.expiryDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>My Properties</h2>
          <button onClick={() => router.push('/dashboard/owner/add-property')} className={styles.addBtn}>
            + Add New Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No properties listed yet</p>
            <button onClick={() => router.push('/dashboard/owner/add-property')} className={styles.addBtn}>
              + List Your First Property
            </button>
          </div>
        ) : (
          <div className={styles.propertiesGrid}>
            {properties.map(prop => (
              <div key={prop.id} className={styles.propertyCard}>
                {prop.images && prop.images.length > 0 && (
                  <img 
                    src={prop.images[0]} 
                    alt={prop.title}
                    className={styles.propertyImage}
                  />
                )}
                <div className={styles.propertyInfo}>
                  <h3>{prop.title}</h3>
                  <p className={styles.price}>₹{prop.price?.toLocaleString('en-IN')}</p>
                  <p className={styles.location}>{prop.location}</p>
                  <p className={styles.type}>{prop.type === 'sell' ? 'For Sale' : 'For Rent'}</p>
                  <button 
                    onClick={() => router.push(`/property/${prop.id}`)}
                    className={styles.viewBtn}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>📋 Interested Visitors</h2>
        {interestedClients.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No interested visitors yet</p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Email</span>
              <span>Property</span>
              <span>Marked At</span>
            </div>
            {interestedClients.map(client => (
              <div key={client.id} className={styles.tableRow}>
                <span>{client.visitorEmail}</span>
                <span>{client.propertyTitle}</span>
                <span>{client.markedAt ? new Date(client.markedAt.toDate()).toLocaleDateString() : '-'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
