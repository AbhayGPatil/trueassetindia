'use client';

import { useState } from 'react';
import BlurText from './BlurText';
import BorderGlow from './BorderGlow';
import styles from './SearchFilterSection.module.css';

export default function SearchFilterSection() {
  const [selectedType, setSelectedType] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'lease', label: 'Home Loan' },
    { id: 'auction', label: 'Bank Auction' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'plot', label: 'Plot' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'Type:', selectedType);
    }
  };

  return (
    <section className={styles.searchFilterSection}>
      <BorderGlow
        edgeSensitivity={30}
        glowColor="52 152 219"
        backgroundColor="#ffffff"
        borderRadius={24}
        glowRadius={150}
        glowIntensity={2.8}
        coneSpread={70}
        colors={['#0088ff', '#0066ff', '#0044ff']}
        fillOpacity={1.0}
      >
        <div className={styles.gradientWrapper}>
          <div className={styles.container}>
          {/* Title */}
          <h2 className={styles.title}>Find a place to call home</h2>

          {/* Blur Text Animation */}
          <BlurText
            text="Discover luxury properties tailored for your lifestyle"
            delay={100}
            animateBy="words"
            direction="top"
            className={styles.blurTextAnimation}
          />

          {/* Category Tabs */}
          <div className={styles.categoriesWrapper}>
            <div className={styles.categories}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryTab} ${selectedType === category.id ? styles.active : ''}`}
                  onClick={() => setSelectedType(category.id)}
                >
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Search Locality, Area Neighborhood, Address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </div>
          </form>
          </div>
        </div>
      </BorderGlow>
    </section>
  );
}
