'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import NotaryCard from '@/components/NotaryCard';
import styles from './notaries.module.css';

export default function NotariesPage() {
  const [notaries, setNotaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterExperience, setFilterExperience] = useState('');

  const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Goa'];
  const experiences = ['0-2', '2-5', '5-10', '10-15', '15+'];

  useEffect(() => {
    const fetchNotaries = async () => {
      try {
        const notariesQuery = query(
          collection(db, 'notaries'),
          where('profilePublished', '==', true),
          where('subscriptionStatus', '==', 'active')
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

  const filteredNotaries = notaries.filter(notary => {
    const matchesSearch = 
      `${notary.firstName} ${notary.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notary.expertise && notary.expertise.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = !filterCity || notary.city === filterCity;
    const matchesExperience = !filterExperience || notary.experience === filterExperience;

    return matchesSearch && matchesCity && matchesExperience;
  });

  const handleContactNotary = (notary) => {
    // Could open a modal or redirect to detail page
    // For now, just copy phone to clipboard or open phone app
    window.location.href = `tel:${notary.phone}`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Find Trusted Notaries</h1>
        <p className={styles.subtitle}>
          Connect with verified notary professionals for your property needs
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filters}>
          {/* Search */}
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* City Filter */}
          <div className={styles.filterGroup}>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className={styles.filterGroup}>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Experience Levels</option>
              {experiences.map(exp => (
                <option key={exp} value={exp}>{exp} years</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || filterCity || filterExperience) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCity('');
                setFilterExperience('');
              }}
              className={styles.resetBtn}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className={styles.resultsInfo}>
          Found <strong>{filteredNotaries.length}</strong> notary professional{filteredNotaries.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading notaries...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorState}>
          <p>❌ {error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredNotaries.length === 0 && (
        <div className={styles.noResults}>
          <p>No notaries found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCity('');
              setFilterExperience('');
            }}
            className={styles.tryAgainBtn}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Notaries Grid */}
      {!loading && filteredNotaries.length > 0 && (
        <div className={styles.grid}>
          {filteredNotaries.map(notary => (
            <NotaryCard
              key={notary.id}
              notary={notary}
              onContact={() => handleContactNotary(notary)}
            />
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <h2>Are you a notary?</h2>
        <p>Join our network of trusted professionals and get work opportunities</p>
        <a href="/auth/signup/notary" className={styles.signupBtn}>
          Register as Notary
        </a>
      </div>
    </div>
  );
}
