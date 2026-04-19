'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFilterStore } from '@/lib/filterStore';
import HorizontalFilterBar from '@/components/HorizontalFilterBar';
import AdvancedFilters from '@/components/AdvancedFilters';
import PropertyCard from '@/components/PropertyCard';
import styles from './listings.module.css';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

function ListingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setPropertyCategory } = useFilterStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sorting, setSorting] = useState('relevance');
  const [showFilters, setShowFilters] = useState(true);

  // Check for type URL parameter and apply filter on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && !filters.propertyCategory) {
      setPropertyCategory(typeParam);
    }
  }, [searchParams]);

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

    // Property category filter
    if (filters.propertyCategory) {
      constraints.push(where('propertyCategory', '==', filters.propertyCategory));
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
      {/* CONDENSED HERO HEADER - Sleek Top Bar */}
      <header className={styles.heroHeaderCondensed}>
        <button 
          onClick={() => router.back()}
          className={styles.backButton}
          title="Go Back"
          aria-label="Back"
        >
          <span>←</span> Back
        </button>

        <div className={styles.heroContentCondensed}>
          <h1 className={styles.heroTitleSerif}>Find Your Dream Property</h1>
          <p className={styles.heroStatLine}>
            {loading ? 'Loading properties...' : `Showing ${properties.length ?? 0} Luxury Residencies${filters.location.city ? ` in ${filters.location.city}` : ''} | 100% Verified`}
          </p>
        </div>
      </header>

      {/* FLOATING FILTER CARD */}
      <div className={styles.floatingFilterContainer}>
        <HorizontalFilterBar onAllFiltersClick={() => setShowFilters(!showFilters)} />
      </div>

      {/* BREADCRUMBS & SORTING */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.breadcrumbTrail}>
          <span>Home</span>
          <span className={styles.separator}>/</span>
          <span>{filters.location.city || 'Properties'}</span>
          {filters.location.area && (
            <>
              <span className={styles.separator}>/</span>
              <span>{filters.location.area}</span>
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContainerRefactored}>
        {/* LEFT SIDEBAR - ADVANCED FILTERS (COLLAPSIBLE) */}
        <aside className={`${styles.filterSidebar} ${showFilters ? styles.filterSidebarOpen : ''}`}>
          <div className={styles.filterHeader}>
            <h3>Advanced Filters</h3>
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
          {/* RESULTS HEADER WITH SORTING */}
          <div className={styles.resultsHeaderProfessional}>
            <p className={styles.resultCountProfessional}>
              Showing <span className={styles.resultNumber}>{properties.length}</span> properties
              {filters.location.city && <span> in <strong>{filters.location.city}</strong></span>}
            </p>

            <div className={styles.sortContainerProfessional}>
              <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
              <select
                id="sort"
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className={styles.sortSelectProfessional}
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* ERROR BANNER */}
          {error && (
            <div className={styles.errorBanner}>
              <span>⚠️ {error}</span>
              <button onClick={loadProperties} className={styles.retryButton}>
                Retry
              </button>
            </div>
          )}

          {/* LOADING STATE */}
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

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className={styles.pageContainer}>Loading...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
