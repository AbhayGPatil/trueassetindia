'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import styles from './developer.module.css';

export default function DeveloperDashboard() {
  const router = useRouter();
  const { user, userProfile: profile, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [interestedClients, setInterestedClients] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup');
      return;
    }

    if (profile?.role !== 'developer') {
      router.push('/auth/signup');
      return;
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const projectsQuery = query(
          collection(db, 'properties'),
          where('uploadedBy', '==', user.uid)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        setProjects(projectsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

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

  if (!user || profile?.role !== 'developer') {
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
          <span className={styles.userRole}>Real Estate Developer</span>
          <button onClick={() => router.push('/subscription')} className={styles.upgradeBtn}>
            {isSubscribed ? 'Premium Active' : 'Upgrade'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome, {profile?.name}</h1>
            <p className={styles.subtitle}>Build your real estate empire. Manage projects, track inquiries, and reach investors</p>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Total Projects</span>
              <div className={styles.statIcon}>▪</div>
            </div>
            <div className={styles.statValue}>{projects.length}</div>
            <p className={styles.statDesc}>Active listings</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Investor Interest</span>
              <div className={styles.statIcon}>●</div>
            </div>
            <div className={styles.statValue}>{interestedClients.length}</div>
            <p className={styles.statDesc}>Inquiries received</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Projects Left</span>
              <div className={styles.statIcon}>◆</div>
            </div>
            <div className={styles.statValue}>{isSubscribed ? '∞' : uploadsRemaining}</div>
            <p className={styles.statDesc}>{isSubscribed ? 'Unlimited listings' : 'Free tier limit'}</p>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statBoxTop}>
              <span className={styles.statLabel}>Subscription</span>
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

        {profile?.developerProfile?.companyName && (
          <div className={styles.companyBanner}>
            <span className={styles.companyLabel}>Company:</span>
            <span>{profile?.developerProfile?.companyName}</span>
            {profile?.developerProfile?.reraId && (
              <>
                <span className={styles.bulletSeparator}>•</span>
                <span className={styles.reraLabel}>RERA ID:</span>
                <span>{profile?.developerProfile?.reraId}</span>
              </>
            )}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTop}>
            <h2 className={styles.sectionTitle}>Your Projects</h2>
            <button 
              onClick={() => router.push('/dashboard/developer/launch-project')} 
              className={styles.primaryBtn}
            >
              Launch New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="48" height="40" stroke="#0084ff" strokeWidth="2" fill="none" rx="2"/>
                  <path d="M16 12v40M32 12v40M48 12v40" stroke="#0084ff" strokeWidth="1" opacity="0.3"/>
                  <circle cx="28" cy="28" r="3" fill="#0084ff"/>
                  <circle cx="40" cy="36" r="3" fill="#0084ff"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>No projects launched yet</p>
              <p className={styles.emptyText}>Create your first project to reach investors and buyers across India</p>
              <button 
                onClick={() => router.push('/dashboard/developer/launch-project')}
                className={styles.primaryBtn}
              >
                Launch Your First Project
              </button>
            </div>
          ) : (
            <div className={styles.propertiesGrid}>
              {projects.map(prop => (
                <div key={prop.id} className={styles.propertyCard}>
                  <div className={styles.propImageContainer}>
                    {prop.images && prop.images.length > 0 ? (
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title}
                        className={styles.propImage}
                      />
                    ) : (
                      <div className={styles.propImagePlaceholder}>Project Image</div>
                    )}
                  </div>
                  <div className={styles.propContent}>
                    <h3 className={styles.propTitle}>{prop.title}</h3>
                    <p className={styles.propPrice}>₹{prop.price?.toLocaleString('en-IN')}</p>
                    <p className={styles.propLocation}>{prop.location}</p>
                    <div className={styles.propMeta}>
                      <span className={styles.propType}>
                        {prop.type === 'sell' ? 'Sale' : 'Rental'}
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
          <h2 className={styles.sectionTitle}>Investor Inquiries</h2>
          
          {interestedClients.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="20" r="6" stroke="#0084ff" strokeWidth="2" fill="none"/>
                  <path d="M14 32c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#0084ff" strokeWidth="2" fill="none"/>
                  <circle cx="44" cy="20" r="6" stroke="#0084ff" strokeWidth="2" fill="none"/>
                  <path d="M34 32c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#0084ff" strokeWidth="2" fill="none"/>
                  <path d="M24 40h20M20 48h24" stroke="#0084ff" strokeWidth="1.5" fill="none" opacity="0.6"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>No investor inquiries yet</p>
              <p className={styles.emptyText}>Investors who show interest will appear here</p>
            </div>
          ) : (
            <div className={styles.interestedTable}>
              <div className={styles.tableHead}>
                <div className={styles.tableCol1}>Investor Email</div>
                <div className={styles.tableCol2}>Project</div>
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
