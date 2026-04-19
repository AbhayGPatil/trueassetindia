'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/filterStore';
import styles from './AdvancedFilters.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sofa, Sparkles, Building2, ChevronDown, X } from 'lucide-react';

export default function AdvancedFilters() {
  const { filters, setPropertyType, setAmenities, setFurnishing, setBankAuction, clearFilters } = useFilterStore();
  const [expanded, setExpanded] = useState({
    propertyType: true,
    amenities: false,
    furnishing: false,
    auction: false,
  });
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const propertyTypeOptions = ['Apartment', 'Villa', 'Plot', 'Penthouse', 'Bungalow', 'Townhouse', 'Commercial', 'Office'];
  const amenitiesOptions = ['Swimming Pool', 'Gym', 'Parking', 'Lift', 'Security', 'Garden', 'Balcony', 'Terrace', 'Servant Room', 'Study', 'Home Theater', 'Power Backup', 'Water Storage', 'Solar', 'Clubhouse', 'Kids Play Area', 'Yoga Studio', 'Library', 'Function Room', 'Pet Friendly'];
  const furnishingOptions = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' },
  ];

  const displayedAmenities = showMoreAmenities ? amenitiesOptions : amenitiesOptions.slice(0, 5);

  const toggleExpand = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
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

  const hasAdvancedFilters = () => {
    return (
      filters.propertyType.length > 0 ||
      filters.furnishing.length > 0 ||
      filters.amenities.length > 0 ||
      filters.bankAuction
    );
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>Advanced Filters</h2>
        {hasAdvancedFilters() && (
          <button className={styles.clearAllBtn} onClick={clearFilters}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('propertyType')}
        >
          <div className={styles.sectionTitle}>
            <Home size={18} className={styles.icon} />
            <span>Property Type</span>
          </div>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${expanded.propertyType ? styles.expanded : ''}`}
          />
        </button>
        <AnimatePresence>
          {expanded.propertyType && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.pillGrid}>
                {propertyTypeOptions.map((type) => (
                  <button
                    key={type}
                    className={`${styles.pill} ${
                      filters.propertyType.includes(type) ? styles.active : ''
                    }`}
                    onClick={() => handlePropertyTypeChange(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('furnishing')}
        >
          <div className={styles.sectionTitle}>
            <Sofa size={18} className={styles.icon} />
            <span>Furnishing</span>
          </div>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${expanded.furnishing ? styles.expanded : ''}`}
          />
        </button>
        <AnimatePresence>
          {expanded.furnishing && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.checkboxGroup}>
                {furnishingOptions.map((opt) => (
                  <label key={opt.value} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.furnishing.includes(opt.value)}
                      onChange={() => handleFurnishingChange(opt.value)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('amenities')}
        >
          <div className={styles.sectionTitle}>
            <Sparkles size={18} className={styles.icon} />
            <span>Amenities</span>
            {filters.amenities.length > 0 && (
              <span className={styles.badge}>{filters.amenities.length}</span>
            )}
          </div>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${expanded.amenities ? styles.expanded : ''}`}
          />
        </button>
        <AnimatePresence>
          {expanded.amenities && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.checkboxGroup}>
                {displayedAmenities.map((amenity) => (
                  <label key={amenity} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>{amenity}</span>
                  </label>
                ))}
              </div>
              {amenitiesOptions.length > 5 && (
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => setShowMoreAmenities(!showMoreAmenities)}
                >
                  {showMoreAmenities
                    ? 'View Less'
                    : `View More (+${amenitiesOptions.length - 5})`}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.filterSection}>
        <button
          className={styles.sectionHeader}
          onClick={() => toggleExpand('auction')}
        >
          <div className={styles.sectionTitle}>
            <Building2 size={18} className={styles.icon} />
            <span>Bank Auction</span>
          </div>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${expanded.auction ? styles.expanded : ''}`}
          />
        </button>
        <AnimatePresence>
          {expanded.auction && (
            <motion.div
              className={styles.sectionContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={filters.bankAuction}
                  onChange={(e) => setBankAuction(e.target.checked)}
                  className={styles.switchInput}
                />
                <span className={styles.switchSlider}></span>
                <span className={styles.switchLabel}>
                  Show only bank auction properties
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
