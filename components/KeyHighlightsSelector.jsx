'use client';

import { useState } from 'react';
import styles from './KeyHighlightsSelector.module.css';

export default function KeyHighlightsSelector({ value, onChange }) {
  const [activeCategory, setActiveCategory] = useState('location');

  const highlightsData = {
    location: {
      label: 'Location',
      highlights: [
        { id: 'close_to_market', name: 'Close to Market' },
        { id: 'close_to_school', name: 'Close to School' },
        { id: 'close_to_metro', name: 'Close to Metro Station' },
        { id: 'close_to_hospital', name: 'Close to Hospital' },
        { id: 'close_to_mall', name: 'Close to Shopping Mall' },
        { id: 'close_to_park', name: 'Close to Park' },
      ]
    },
    construction: {
      label: 'Construction',
      highlights: [
        { id: 'newly_constructed', name: 'Newly Constructed' },
        { id: 'recently_renovated', name: 'Recently Renovated' },
        { id: 'under_construction', name: 'Under Construction' },
        { id: 'ready_to_move', name: 'Ready to Move' },
      ]
    },
    furnishing: {
      label: 'Furnishing',
      highlights: [
        { id: 'marble_flooring', name: 'Marble Flooring' },
        { id: 'semi_furnished', name: 'Semi Furnished' },
        { id: 'fully_furnished', name: 'Fully Furnished' },
        { id: 'luxury_interior', name: 'Luxury Interior' },
      ]
    },
    features: {
      label: 'Features',
      highlights: [
        { id: 'amenities_included', name: 'Amenities Included' },
        { id: 'premium_location', name: 'Premium Location' },
        { id: 'view_facing', name: 'View Facing' },
        { id: 'corner_property', name: 'Corner Property' },
        { id: 'high_speed_internet', name: 'High Speed Internet' },
      ]
    },
  };

  // Parse selected highlights from string format
  const selectedHighlights = value ? value.split(',').map(a => a.trim()) : [];

  const handleToggleHighlight = (highlightId) => {
    const isSelected = selectedHighlights.includes(highlightId);
    let newSelected;

    if (isSelected) {
      newSelected = selectedHighlights.filter(id => id !== highlightId);
    } else {
      newSelected = [...selectedHighlights, highlightId];
    }

    onChange(newSelected.join(', '));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Key Highlights - Why Choose This Property?</h3>
      <p className={styles.subtitle}>Select reasons that make this property special</p>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {Object.entries(highlightsData).map(([key, category]) => (
          <button
            key={key}
            className={`${styles.categoryTab} ${activeCategory === key ? styles.active : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Highlights Grid */}
      <div className={styles.highlightsGrid}>
        {highlightsData[activeCategory]?.highlights.map(highlight => (
          <button
            key={highlight.id}
            className={`${styles.highlightButton} ${selectedHighlights.includes(highlight.id) ? styles.selected : ''}`}
            onClick={() => handleToggleHighlight(highlight.id)}
          >
            <span className={styles.checkmark}>
              {selectedHighlights.includes(highlight.id) ? '✓' : ''}
            </span>
            <span className={styles.highlightName}>{highlight.name}</span>
          </button>
        ))}
      </div>

      {/* Selected Count */}
      <div className={styles.selectedCount}>
        {selectedHighlights.length > 0 && (
          <p>✓ {selectedHighlights.length} highlight{selectedHighlights.length !== 1 ? 's' : ''} selected</p>
        )}
      </div>
    </div>
  );
}
