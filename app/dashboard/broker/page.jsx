'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import styles from './dashboard.module.css';

export default function BrokerDashboard() {
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

    if (profile?.role !== 'broker') {
      router.push('/auth/signup');
      return;
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('uploadedBy', '==', user.uid)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        setProperties(propertiesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

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

  if (!user || profile?.role !== 'broker') {
    return <div className={styles.loading}>Redirecting...</div>;
  }

  const uploadsRemaining = profile?.freeUploads?.limit - (profile?.freeUploads?.used || 0);
  const isSubscribed = profile?.subscription?.status === 'active';

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => router.push('/')} className={styles.logoBtn}>
          ← TrueAssets
        </button>
        <div className={styles.userMenu}>
          <span className={styles.userRole}>Property Broker</span>
          <button onClick={() => router.push('/subscription')} className={styles.upgradeBtn}>
            {isSubscribed ? 'Premium Active' : 'Upgrade'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome, {profile?.name}</h1>
            <p className={styles.subtitle}>Manage your brokerage portfolio and track client interests</p>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Total Properties</span>
              <div className={styles.statIcon}>▪</div>
            </div>
            <div className={styles.statValue}>{properties.length}</div>
            <p className={styles.statDesc}>Listed in portfolio</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Interested Clients</span>
              <div className={styles.statIcon}>●</div>
            </div>
            <div className={styles.statValue}>{interestedClients.length}</div>
            <p className={styles.statDesc}>Active inquiries</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Uploads Left</span>
              <div className={styles.statIcon}>◆</div>
            </div>
            <div className={styles.statValue}>{isSubscribed ? '∞' : uploadsRemaining}</div>
            <p className={styles.statDesc}>{isSubscribed ? 'Unlimited uploads' : 'Free tier limit'}</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Account Status</span>
              <div className={styles.statIcon}>★</div>
            </div>
            <div className={styles.statValue} style={{ color: isSubscribed ? '#0084ff' : '#666' }}>
              {isSubscribed ? 'Premium' : 'Free'}
            </div>
            <p className={styles.statDesc}>{isSubscribed ? 'Full access' : 'Limited access'}</p>
          </div>
        </div>

        {profile?.subscription?.expiryDate && (
          <div className={styles.bannerBox}>
            <span className={styles.bannerLabel}>Plan Details:</span>
            <span>{profile?.subscription?.plan}</span>
            <span className={styles.bulletSeparator}>•</span>
            <span>Expires: {new Date(profile?.subscription?.expiryDate).toLocaleDateString()}</span>
          </div>
        )}

        {profile?.agencyName && (
          <div className={styles.agencyBanner}>
            <span className={styles.agencyLabel}>Agency Name:</span>
            <span>{profile?.agencyName}</span>
            {profile?.brokerLicense && (
              <>
                <span className={styles.bulletSeparator}>•</span>
                <span className={styles.licenseLabel}>License:</span>
                <span>{profile?.brokerLicense}</span>
              </>
            )}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTop}>
            <h2 className={styles.sectionTitle}>Your Properties</h2>
            <button 
              onClick={() => router.push('/dashboard/broker/add-property')} 
              className={styles.primaryBtn}
            >
              List New Property
            </button>
          </div>

          {properties.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p className={styles.emptyTitle}>No properties in portfolio</p>
              <p className={styles.emptyText}>Start listing properties to build your brokerage portfolio</p>
              <button 
                onClick={() => router.push('/dashboard/broker/add-property')}
                className={styles.primaryBtn}
              >
                List Your First Property
              </button>
            </div>
          ) : (
            <div className={styles.propertiesGrid}>
              {properties.map(prop => (
                <div key={prop.id} className={styles.propertyCard}>
                  <div className={styles.propImageContainer}>
                    {prop.images && prop.images.length > 0 ? (
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title}
                        className={styles.propImage}
                      />
                    ) : (
                      <div className={styles.propImagePlaceholder}>Image</div>
                    )}
                  </div>
                  <div className={styles.propContent}>
                    <h3 className={styles.propTitle}>{prop.title}</h3>
                    <p className={styles.propPrice}>₹{prop.price?.toLocaleString('en-IN')}</p>
                    <p className={styles.propLocation}>{prop.location}</p>
                    <div className={styles.propMeta}>
                      <span className={styles.propType}>
                        {prop.type === 'sell' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    <button 
                      onClick={() => router.push(`/property/${prop.id}`)}
                      className={styles.viewLink}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Client Interests</h2>
          
          {interestedClients.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <p className={styles.emptyTitle}>No client interests yet</p>
              <p className={styles.emptyText}>Clients who show interest will appear here</p>
            </div>
          ) : (
            <div className={styles.interestedTable}>
              <div className={styles.tableHead}>
                <div className={styles.tableCol1}>Client Email</div>
                <div className={styles.tableCol2}>Property</div>
                <div className={styles.tableCol3}>Date</div>
              </div>
              {interestedClients.map(client => (
                <div key={client.id} className={styles.tableRow}>
                  <div className={styles.tableCol1}>{client.visitorEmail}</div>
                  <div className={styles.tableCol2}>{client.propertyTitle}</div>
                  <div className={styles.tableCol3}>
                    {client.markedAt ? new Date(client.markedAt.toDate()).toLocaleDateString() : '-'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
