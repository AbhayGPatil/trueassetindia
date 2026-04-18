'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { query, where, collection, getDocs, doc, getDoc, deleteDoc, limit, orderBy } from 'firebase/firestore';
import SearchFilterSection from '@/components/SearchFilterSection';
import styles from './dashboard.module.css';

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, userProfile: profile, loading } = useContext(AuthContext);
  const [interestedProperties, setInterestedProperties] = useState([]);
  const [properties, setProperties] = useState({});
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  
  // New states for featured property sections
  const [freshProjects, setFreshProjects] = useState([]);
  const [resaleProperties, setResaleProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);
  const [stats, setStats] = useState({
    wishlistCount: 0,
    activeProperties: 0,
    newListings: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup');
      return;
    }

    if (profile?.role !== 'buyer') {
      router.push('/auth/signup');
      return;
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch all properties marked as interested by this buyer
        const interestedQuery = query(
          collection(db, 'interestedVisitors'),
          where('visitorId', '==', user.uid)
        );
        const interestedSnapshot = await getDocs(interestedQuery);
        const interested = interestedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setInterestedProperties(interested);

        // Fetch the actual property details
        const propertiesMap = {};
        for (const interest of interested) {
          try {
            const propRef = doc(db, 'properties', interest.propertyId);
            const propSnap = await getDoc(propRef);
            if (propSnap.exists()) {
              propertiesMap[interest.propertyId] = {
                id: propSnap.id,
                ...propSnap.data()
              };
            }
          } catch (err) {
            console.error('Error fetching property:', err);
          }
        }
        setProperties(propertiesMap);

        // Fetch Fresh Projects (New Launches)
        try {
          const freshQ = query(
            collection(db, 'properties'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            limit(8)
          );
          const freshSnap = await getDocs(freshQ);
          setFreshProjects(freshSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error('Error fetching fresh projects:', err);
          setFreshProjects([]);
        }

        // Fetch Resale Properties
        try {
          const resaleQ = query(
            collection(db, 'properties'),
            where('status', '==', 'active'),
            where('type', '==', 'sell'),
            orderBy('createdAt', 'desc'),
            limit(8)
          );
          const resaleSnap = await getDocs(resaleQ);
          setResaleProperties(resaleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error('Error fetching resale properties:', err);
          setResaleProperties([]);
        }

        // Fetch Rent Properties
        try {
          const rentQ = query(
            collection(db, 'properties'),
            where('status', '==', 'active'),
            where('type', '==', 'rent'),
            orderBy('createdAt', 'desc'),
            limit(8)
          );
          const rentSnap = await getDocs(rentQ);
          setRentProperties(rentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error('Error fetching rent properties:', err);
          setRentProperties([]);
        }

        // Get total properties count
        try {
          const allPropsQ = query(
            collection(db, 'properties'),
            where('status', '==', 'active')
          );
          const allPropsSnap = await getDocs(allPropsQ);

          setStats({
            wishlistCount: interested.length,
            activeProperties: allPropsSnap.docs.length,
            newListings: freshProjects.length
          });
        } catch (err) {
          console.error('Error fetching stats:', err);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRemoveInterest = async (interestedId) => {
    setRemoving(interestedId);
    try {
      await deleteDoc(doc(db, 'interestedVisitors', interestedId));
      setInterestedProperties(prev => prev.filter(item => item.id !== interestedId));
    } catch (err) {
      console.error('Error removing interest:', err);
    } finally {
      setRemoving(null);
    }
  };

  if (loading || dashboardLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (!user || profile?.role !== 'buyer') {
    return <div className={styles.loading}>Redirecting...</div>;
  }

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

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Welcome back, {profile?.name}</h1>
          <p>Discover premium properties curated just for you</p>
        </div>
      </section>

      {/* QUICK GLANCE STATS */}
      <section className={styles.quickGlance}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.wishlistCount}</div>
          <div className={styles.statLabel}>Wishlist Items</div>
          <p className={styles.statSubtext}>Properties you saved</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.activeProperties}</div>
          <div className={styles.statLabel}>Total Properties</div>
          <p className={styles.statSubtext}>Available to explore</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.newListings}</div>
          <div className={styles.statLabel}>New Listings</div>
          <p className={styles.statSubtext}>Fresh projects added</p>
        </div>

        <button onClick={() => router.push('/listings')} className={styles.exploreCta}>
          Explore All Properties
        </button>
      </section>

      {/* SEARCH FILTER SECTION WITH ANIMATIONS */}
      <SearchFilterSection />

      {/* EXCLUSIVE SHOWCASE */}
      {interestedProperties.length > 0 && (
        <section className={styles.exclusiveShowcase}>
          <div className={styles.showcaseHeader}>
            <h2>An Exclusive Showcase - True Asset India</h2>
            <p>Your curated collection of premium properties</p>
          </div>
          
          <div className={styles.showcaseGrid}>
            {interestedProperties.slice(0, 4).map(interest => {
              const property = properties[interest.propertyId];
              if (!property) return null;

              return (
                <div key={interest.id} className={styles.showcaseCard}>
                  {property.images && property.images.length > 0 && (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className={styles.showcaseImage}
                    />
                  )}
                  
                  <div className={styles.showcaseContent}>
                    <h3>{property.title}</h3>
                    <p className={styles.showcasePrice}>₹{property.price?.toLocaleString('en-IN')}</p>
                    <p className={styles.showcaseLocation}>{property.location}</p>
                    
                    <div className={styles.showcaseActions}>
                      <button 
                        className={styles.viewBtn}
                        onClick={() => router.push(`/property/${property.id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => handleRemoveInterest(interest.id)}
                        disabled={removing === interest.id}
                      >
                        {removing === interest.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {interestedProperties.length > 4 && (
            <div className={styles.showcaseFooter}>
              <button className={styles.viewAllShowcase} onClick={() => router.push('/listings')}>
                View All Saved Properties
              </button>
            </div>
          )}
        </section>
      )}

      {/* FRESH PROJECTS CAROUSEL */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2>Fresh Projects - New Launches</h2>
          <a href="/listings" className={styles.viewAllLink}>
            View All
          </a>
        </div>
        
        {freshProjects && freshProjects.length > 0 ? (
          <div className={styles.carouselGrid}>
            {freshProjects.slice(0, 4).map(prop => (
              <div key={prop.id} className={styles.propertyCard}>
                {prop.images && prop.images.length > 0 && (
                  <img 
                    src={prop.images[0]} 
                    alt={prop.title}
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.cardBadge}>New</div>
                
                <div className={styles.cardContent}>
                  <h4>{prop.title}</h4>
                  <p className={styles.cardPrice}>₹{prop.price?.toLocaleString('en-IN')}</p>
                  <p className={styles.cardLocation}>{prop.location}</p>
                  
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => router.push(`/property/${prop.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCarousel}>
            <p>No active fresh projects at the moment</p>
          </div>
        )}
      </section>

      {/* RESALE PROPERTIES CAROUSEL */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2>Resale Properties - Best Value</h2>
          <a href="/listings" className={styles.viewAllLink}>
            View All
          </a>
        </div>
        
        {resaleProperties && resaleProperties.length > 0 ? (
          <div className={styles.carouselGrid}>
            {resaleProperties.slice(0, 4).map(prop => (
              <div key={prop.id} className={styles.propertyCard}>
                {prop.images && prop.images.length > 0 && (
                  <img 
                    src={prop.images[0]} 
                    alt={prop.title}
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.cardBadge}>Resale</div>
                
                <div className={styles.cardContent}>
                  <h4>{prop.title}</h4>
                  <p className={styles.cardPrice}>₹{prop.price?.toLocaleString('en-IN')}</p>
                  <p className={styles.cardLocation}>{prop.location}</p>
                  
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => router.push(`/property/${prop.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCarousel}>
            <p>No resale properties available</p>
          </div>
        )}
      </section>

      {/* RENT PROPERTIES CAROUSEL */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2>Rental Properties - Short & Long Term</h2>
          <a href="/listings" className={styles.viewAllLink}>
            View All
          </a>
        </div>
        
        {rentProperties && rentProperties.length > 0 ? (
          <div className={styles.carouselGrid}>
            {rentProperties.slice(0, 4).map(prop => (
              <div key={prop.id} className={styles.propertyCard}>
                {prop.images && prop.images.length > 0 && (
                  <img 
                    src={prop.images[0]} 
                    alt={prop.title}
                    className={styles.cardImage}
                  />
                )}
                <div className={styles.cardBadge}>Rent</div>
                
                <div className={styles.cardContent}>
                  <h4>{prop.title}</h4>
                  <p className={styles.cardPrice}>₹{prop.price?.toLocaleString('en-IN')} / month</p>
                  <p className={styles.cardLocation}>{prop.location}</p>
                  
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => router.push(`/property/${prop.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCarousel}>
            <p>No rental properties available</p>
          </div>
        )}
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className={styles.ctaSection}>
        <h2>Ready to find your perfect home?</h2>
        <p>Browse thousands of verified properties with advanced filters</p>
        <button onClick={() => router.push('/listings')} className={styles.ctaButton}>
          Start Exploring Now
        </button>
      </section>

    </div>
  );
}
