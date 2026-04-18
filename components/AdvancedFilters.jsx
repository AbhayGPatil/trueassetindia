'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/filterStore';
import styles from './AdvancedFilters.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedFilters() {
  const {
    filters,
    setLocationFilter,
    setPriceFilter,
    setPropertyType,
    setBhkRange,
    setAmenities,
    setFurnishing,
    setBankAuction,
    clearFilters,
  } = useFilterStore();

  const [expanded, setExpanded] = useState({
    location: true,
    price: true,
    propertyType: false,
    bhk: false,
    amenities: false,
    furnishing: false,
    auction: false,
  });

  const propertyTypeOptions = [
    'Apartment',
    'Villa',
    'Plot',
    'Penthouse',
    'Bungalow',
    'Townhouse',
    'Commercial',
    'Office',
  ];

  const amenitiesOptions = [
    'Swimming Pool',
    'Gym',
    'Parking',
    'Lift',
    'Security',
    'Garden',
    'Balcony',
    'Terrace',
    'Servant Room',
    'Study',
    'Home Theater',
    'Power Backup',
    'Water Storage',
    'Solar',
    'Clubhouse',
    'Kids Play Area',
    'Yoga Studio',
    'Library',
    'Function Room',
    'Pet Friendly',
  ];

  const furnishingOptions = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' },
  ];

  const toggleExpand = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePropertyTypeChange = (type) => {
    const updated = filters.propertyType.includes(type)
      ? filters.propertyType.filter((t) => t !== type)
      : [...filters.propertyType, type];
    setPropertyType(updated);
  };

  const handleAmenityChange = (amenity) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setAmenities(updated);
  };

  const handleFurnishingChange = (value) => {
    const updated = filters.furnishing.includes(value)
      ? filters.furnishing.filter((f) => f !== value)
      : [...filters.furnishing, value];
    setFurnishing(updated);
  };

  const hasActiveFilters = () => {
    return (
      filters.location.city ||
      filters.propertyType.length > 0 ||
      filters.furnishing.length > 0 ||
      filters.amenities.length > 0 ||
      filters.bankAuction ||
      filters.price.min > 0 ||
      filters.price.max < 100000000
    );
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3>Filters</h3>
        {hasActiveFilters() && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* LOCATION FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('location')}
        >
          <span>📍 Location</span>
          <span className={styles.toggle}>{expanded.location ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {expanded.location && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <input
                type="text"
                placeholder="City"
                value={filters.location.city}
                onChange={(e) =>
                  setLocationFilter({ city: e.target.value })
                }
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Locality"
                value={filters.location.locality}
                onChange={(e) =>
                  setLocationFilter({ locality: e.target.value })
                }
                className={styles.input}
              />
              <div className={styles.rangeInput}>
                <label>Radius (km): {filters.location.radius}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.location.radius}
                  onChange={(e) =>
                    setLocationFilter({ radius: parseInt(e.target.value) })
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRICE FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('price')}
        >
          <span>💰 Price</span>
          <span className={styles.toggle}>{expanded.price ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {expanded.price && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={styles.priceInputs}>
                <div>
                  <label>Min Price (₹)</label>
                  <input
                    type="number"
                    value={filters.price.min}
                    onChange={(e) =>
                      setPriceFilter(
                        parseInt(e.target.value) || 0,
                        filters.price.max
                      )
                    }
                    placeholder="0"
                    className={styles.input}
                  />
                </div>
                <div>
                  <label>Max Price (₹)</label>
                  <input
                    type="number"
                    value={filters.price.max}
                    onChange={(e) =>
                      setPriceFilter(
                        filters.price.min,
                        parseInt(e.target.value) || 100000000
                      )
                    }
                    placeholder="10,00,00,000"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.pricePreset}>
                {[
                  { label: '₹0 - ₹50L', min: 0, max: 5000000 },
                  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
                  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
                  { label: '₹2Cr+', min: 20000000, max: 100000000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    className={styles.presetBtn}
                    onClick={() => setPriceFilter(preset.min, preset.max)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROPERTY TYPE FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('propertyType')}
        >
          <span>🏠 Property Type</span>
          <span className={styles.toggle}>
            {expanded.propertyType ? '▼' : '▶'}
          </span>
        </button>

        <AnimatePresence>
          {expanded.propertyType && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={styles.checkboxGroup}>
                {propertyTypeOptions.map((type) => (
                  <label key={type} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.propertyType.includes(type)}
                      onChange={() => handlePropertyTypeChange(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BHK FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('bhk')}
        >
          <span>🛏️ BHK</span>
          <span className={styles.toggle}>{expanded.bhk ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {expanded.bhk && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={styles.bhkButtons}>
                {[1, 2, 3, 4, 5, 6].map((bhk) => (
                  <button
                    key={bhk}
                    className={`${styles.bhkBtn} ${
                      filters.bhkRange.min === bhk &&
                      filters.bhkRange.max === bhk
                        ? styles.active
                        : ''
                    }`}
                    onClick={() => setBhkRange(bhk, bhk)}
                  >
                    {bhk} BHK
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FURNISHING FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('furnishing')}
        >
          <span>🛋️ Furnishing</span>
          <span className={styles.toggle}>
            {expanded.furnishing ? '▼' : '▶'}
          </span>
        </button>

        <AnimatePresence>
          {expanded.furnishing && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={styles.checkboxGroup}>
                {furnishingOptions.map((opt) => (
                  <label key={opt.value} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.furnishing.includes(opt.value)}
                      onChange={() => handleFurnishingChange(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AMENITIES FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('amenities')}
        >
          <span>✨ Amenities ({filters.amenities.length})</span>
          <span className={styles.toggle}>
            {expanded.amenities ? '▼' : '▶'}
          </span>
        </button>

        <AnimatePresence>
          {expanded.amenities && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={styles.amenitiesGrid}>
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className={styles.amenityCheck}>
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BANK AUCTION FILTER */}
      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('auction')}
        >
          <span>🏛️ Bank Auction</span>
          <span className={styles.toggle}>{expanded.auction ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {expanded.auction && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <label className={styles.toggle_switch}>
                <input
                  type="checkbox"
                  checked={filters.bankAuction}
                  onChange={(e) => setBankAuction(e.target.checked)}
                />
                <span>Show only bank auction properties</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTIVE FILTERS DISPLAY */}
      {hasActiveFilters() && (
        <div className={styles.activeFilters}>
          <div className={styles.filterChips}>
            {filters.location.city && (
              <span className={styles.chip}>📍 {filters.location.city}</span>
            )}
            {filters.propertyType.length > 0 && (
              <span className={styles.chip}>
                🏠 {filters.propertyType.join(', ')}
              </span>
            )}
            {filters.price.min > 0 || filters.price.max < 100000000 && (
              <span className={styles.chip}>
                💰 ₹{(filters.price.min / 100000).toFixed(0)}L - ₹{(filters.price.max / 10000000).toFixed(1)}Cr
              </span>
            )}
            {filters.furnishing.length > 0 && (
              <span className={styles.chip}>🛋️ {filters.furnishing.join(', ')}</span>
            )}
            {filters.amenities.length > 0 && (
              <span className={styles.chip}>✨ {filters.amenities.length} amenities</span>
            )}
            {filters.bankAuction && (
              <span className={styles.chip}>🏛️ Bank Auction</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
