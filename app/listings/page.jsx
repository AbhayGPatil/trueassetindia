'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFilterStore } from '@/lib/filterStore';
import AdvancedFilters from '@/components/AdvancedFilters';
import PropertyCard from '@/components/PropertyCard';
import styles from './listings.module.css';
import { motion } from 'framer-motion';

export default function ListingsPage() {
  const router = useRouter();
  const { filters } = useFilterStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sorting, setSorting] = useState('relevance');
  const [showFilters, setShowFilters] = useState(true);

  // Load properties whenever filters change
  useEffect(() => {
    loadProperties();
  }, [filters]);

  const buildQuery = () => {
    let constraints = [where('status', '==', 'active')];

    // Location filter
    if (filters.location.city) {
      constraints.push(where('city', '==', filters.location.city));
    }

    // Property type filter
    if (filters.propertyType.length > 0) {
      constraints.push(where('type', 'in', filters.propertyType));
    }

    // Bank auction filter
    if (filters.bankAuction) {
      constraints.push(where('bankAuction', '==', true));
    }

    // Build and execute query
    const baseQuery = query(collection(db, 'properties'), ...constraints);
    return baseQuery;
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const q = buildQuery();
      const querySnapshot = await getDocs(q);
      let props = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Client-side filtering for more complex filters
      props = props.filter(prop => {
        // Price filter
        if (prop.price < filters.price.min || prop.price > filters.price.max) {
          return false;
        }

        // BHK filter
        if (prop.bedrooms < filters.bhkRange.min || prop.bedrooms > filters.bhkRange.max) {
          return false;
        }

        // Amenities filter (property must have all selected amenities)
        if (filters.amenities.length > 0) {
          const propAmenities = prop.amenities || [];
          const hasAllAmenities = filters.amenities.every(amenity =>
            propAmenities.includes(amenity)
          );
          if (!hasAllAmenities) return false;
        }

        // Furnishing filter
        if (filters.furnishing.length > 0 && !filters.furnishing.includes(prop.furnishing)) {
          return false;
        }

        return true;
      });

      // Apply sorting
      if (sorting === 'price-low') {
        props.sort((a, b) => a.price - b.price);
      } else if (sorting === 'price-high') {
        props.sort((a, b) => b.price - a.price);
      } else if (sorting === 'newest') {
        props.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }

      setProperties(props);
      setError('');
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Error loading properties: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* HERO HEADER */}
      <header className={styles.heroHeader}>
        <button 
          onClick={() => router.back()}
          className={styles.backButton}
          title="Go Back"
          aria-label="Back"
        >
          <span>←</span> Back
        </button>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find Your Dream Property</h1>
          <p className={styles.heroSubtitle}>
            {loading ? 'Loading properties...' : `${properties.length ?? 0} verified listings available`}
          </p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{properties.length ?? 0}</span>
            <span className={styles.statLabel}>Properties</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>✓</span>
            <span className={styles.statLabel}>Verified</span>
          </div>
        </div>
      </header>

      {/* FILTER AND SORT BAR */}
      <div className={styles.controlBar}>
        <div className={styles.controlBarContent}>
          <button 
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <span>⚙️</span> Filters
          </button>

          <div className={styles.sortContainer}>
            <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
            <select
              id="sort"
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className={styles.viewCount}>
            Showing {properties.length} results
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContainer}>
        {/* LEFT SIDEBAR - FILTERS (COLLAPSIBLE ON MOBILE) */}
        <aside className={`${styles.filterSidebar} ${showFilters ? styles.filterSidebarOpen : ''}`}>
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className={styles.closeFilters}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <AdvancedFilters />
        </aside>

        {/* RIGHT CONTENT - RESULTS */}
        <section className={styles.resultsSection}>
          {error && (
            <div className={styles.errorBanner}>
              <span>⚠️ {error}</span>
              <button onClick={loadProperties} className={styles.retryButton}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className={styles.loadingState}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={styles.spinner}
              >
                ⚙️
              </motion.div>
              <p>Finding your perfect property...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button onClick={() => setShowFilters(true)} className={styles.retryBtn}>
                Modify Filters
              </button>
            </div>
          ) : (
            <motion.div
              className={styles.propertiesGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={styles.propertyCardWrapper}
                >
                  <PropertyCard
                    property={property}
                    onClick={() => router.push(`/property/${property.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
