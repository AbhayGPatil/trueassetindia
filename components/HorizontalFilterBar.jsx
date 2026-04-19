'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/filterStore';
import styles from './HorizontalFilterBar.module.css';
import { MapPin, IndianRupee, Bed, ChevronDown, Sliders } from 'lucide-react';

export default function HorizontalFilterBar({ onAllFiltersClick, citiesList = [] }) {
  const { filters, setLocationFilter, setPriceFilter, setBhkRange } = useFilterStore();
  const [openDropdown, setOpenDropdown] = useState(null);

  // Price quick-select options
  const priceQuickSelects = [
    { label: 'Under 50L', min: 0, max: 5000000 },
    { label: '50L - 1Cr', min: 5000000, max: 10000000 },
    { label: '1Cr - 2Cr', min: 10000000, max: 20000000 },
    { label: '2Cr - 5Cr', min: 20000000, max: 50000000 },
    { label: '5Cr+', min: 50000000, max: 100000000 },
  ];

  const handleLocationSelect = (city) => {
    setLocationFilter({ city });
    setOpenDropdown(null);
  };

  const handlePriceSelect = (min, max) => {
    setPriceFilter(min, max);
    setOpenDropdown(null);
  };

  const handleBhkSelect = (bhk) => {
    setBhkRange(bhk, bhk);
    setOpenDropdown(null);
  };

  const isLocationActive = filters.location.city;
  const isPriceActive = filters.price.min > 0 || filters.price.max < 100000000;
  const isBhkActive = filters.bhkRange.min === filters.bhkRange.max && filters.bhkRange.min > 0;

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    return `₹${price}`;
  };

  return (
    <div className={styles.horizontalBar}>
      <div className={styles.barContent}>
        {/* Location Filter */}
        <div className={styles.filterItem}>
          <button
            className={`${styles.filterButton} ${isLocationActive ? styles.active : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
          >
            <div className={styles.label}>
              <MapPin size={16} className={styles.icon} />
              Location
            </div>
            <span className={styles.value}>
              {filters.location.city || 'Select Location'}
            </span>
            <ChevronDown size={16} className={`${styles.chevron} ${openDropdown === 'location' ? styles.open : ''}`} />
          </button>

          {openDropdown === 'location' && (
            <div className={styles.dropdown}>
              <input
                type="text"
                placeholder="Search city..."
                className={styles.searchInput}
                onFocus={(e) => e.target.select()}
              />
              <div className={styles.dropdownContent}>
                {[
                  // Central South (Prestige Zone)
                  'Girgaon', 'Walkeshwar', 'Malabar Hill', 'Altamount Road', 'Breach Candy', 
                  'Kemps Corner', 'Cuffe Parade', 'Colaba', 'Nariman Point',
                  // South Central
                  'Worli Sea Face', 'Prabhadevi', 'Tardeo', 'Gamdevi', 'Peddar Road',
                  // South Central & Harbour Area
                  'Wadala East (Bhakti Park)', 'Five Gardens (Matunga)', 'Hindu Colony', 
                  'Parel Village', 'Mazgaon',
                  // Western Suburbs - High-Growth & Celebrity Belt
                  'Pali Hill', 'Carter Road', 'Juhu Scheme', 'JVPD Scheme', 'Lokhandwala Complex',
                  'Versova', 'Seven Bungalows', 'Four Bungalows', 'Yari Road', 'Kandarpada',
                  'Gorai', 'Shanti Ashram', 'IC Colony', 'Shimpoli', 'Charkop', 'Poisar',
                  'Thakur Village', 'Thakur Complex', 'Mindspace', 'Oshiwara', 'Royal Palms',
                  'Gokuldham', 'Sher-e-Punjab',
                  // Central Suburbs & North
                  'Powai', 'Chandivali', 'Panchshrishti', 'Hiranandani Gardens', 'Everest Nagar',
                  'Nehru Nagar', 'Kannamwar Nagar', 'Garodia Nagar', 'Pant Nagar', 'Jolly Board',
                  // Navi Mumbai & Eastern Fringe
                  'Palm Beach Road', 'Seawoods', 'Koparkhairane', 'Kharghar Hills', 'Ulwe',
                  'Dronagiri', 'Taloja', 'Kamothe',
                  // Western Line Stations
                  'Borivali', 'Kandivali', 'Malad', 'Jogeshwari', 'Andheri', 'Vile Parle', 
                  'Bombay Central', 'Marine Lines',
                  // Central Line Stations
                  'Kasara', 'Asangaon', 'Titwala', 'Dombivli', 'Thane', 'Mumbra', 'Kalyan',
                  // Harbour Line Stations
                  'Panvel', 'Khopoli', 'Byculla', 'Fort'
                ].map((location) => (
                  <button
                    key={location}
                    className={`${styles.dropdownItem} ${filters.location.city === location ? styles.selected : ''}`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className={styles.filterItem}>
          <button
            className={`${styles.filterButton} ${isPriceActive ? styles.active : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
          >
            <div className={styles.label}>
              <IndianRupee size={16} className={styles.icon} />
              Budget
            </div>
            <span className={styles.value}>
              {isPriceActive
                ? `${formatPrice(filters.price.min)} - ${formatPrice(filters.price.max)}`
                : 'Select Range'}
            </span>
            <ChevronDown size={16} className={`${styles.chevron} ${openDropdown === 'price' ? styles.open : ''}`} />
          </button>

          {openDropdown === 'price' && (
            <div className={styles.dropdown}>
              <div className={styles.priceQuickSelects}>
                {priceQuickSelects.map((preset) => (
                  <button
                    key={preset.label}
                    className={`${styles.priceChip} ${
                      filters.price.min === preset.min && filters.price.max === preset.max ? styles.active : ''
                    }`}
                    onClick={() => handlePriceSelect(preset.min, preset.max)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className={styles.divider} />

              <div className={styles.priceInputs}>
                <div className={styles.priceInput}>
                  <label className={styles.priceLabel}>Min</label>
                  <input
                    type="number"
                    value={filters.price.min}
                    onChange={(e) => setPriceFilter(parseInt(e.target.value) || 0, filters.price.max)}
                    className={styles.numberInput}
                    placeholder="0"
                  />
                </div>
                <div className={styles.priceInput}>
                  <label className={styles.priceLabel}>Max</label>
                  <input
                    type="number"
                    value={filters.price.max}
                    onChange={(e) => setPriceFilter(filters.price.min, parseInt(e.target.value) || 100000000)}
                    className={styles.numberInput}
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BHK Filter */}
        <div className={styles.filterItem}>
          <button
            className={`${styles.filterButton} ${isBhkActive ? styles.active : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'bhk' ? null : 'bhk')}
          >
            <div className={styles.label}>
              <Bed size={16} className={styles.icon} />
              Bedrooms
            </div>
            <span className={styles.value}>
              {isBhkActive ? `${filters.bhkRange.min} BHK` : 'Any'}
            </span>
            <ChevronDown size={16} className={`${styles.chevron} ${openDropdown === 'bhk' ? styles.open : ''}`} />
          </button>

          {openDropdown === 'bhk' && (
            <div className={styles.dropdown}>
              <div className={styles.bhkOptions}>
                {[1, 2, 3, 4, 5, 6].map((bhk) => (
                  <button
                    key={bhk}
                    className={`${styles.bhkOption} ${
                      filters.bhkRange.min === bhk && filters.bhkRange.max === bhk ? styles.active : ''
                    }`}
                    onClick={() => handleBhkSelect(bhk)}
                  >
                    {bhk} BHK
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className={styles.spacer} />

        {/* All Filters / Settings Button */}
        <button className={styles.allFiltersBtn} onClick={onAllFiltersClick} title="Advanced Filters">
          <Sliders size={18} />
        </button>
      </div>
    </div>
  );
}
