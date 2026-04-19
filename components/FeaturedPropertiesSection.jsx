'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from './PropertyCard';
import styles from './FeaturedPropertiesSection.module.css';

export default function FeaturedPropertiesSection() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(
          collection(db, 'properties'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(12)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProperties(data);
        setError('');
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewMore = () => {
    router.push('/auth/signup');
  };

  if (loading) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Featured Properties</h2>
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.loadingCard} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Properties</h2>
        <p className={styles.subtitle}>Discover handpicked luxury properties across India</p>

        {properties.length > 0 ? (
          <>
            <div className={styles.propertiesGrid}>
              {properties.slice(0, 10).map((property, index) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  showViewMore={index === 9}
                />
              ))}
            </div>

            {properties.length > 0 && (
              <div className={styles.viewMoreContainer}>
                <button onClick={handleViewMore} className={styles.viewMoreButton}>
                  View More Properties
                </button>
                <p className={styles.viewMoreText}>Sign in to see more properties and save your favorites</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noProperties}>
            <p>No properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
