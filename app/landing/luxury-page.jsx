'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CinematicHero from '@/components/CinematicHero';
import SearchFilterSection from '@/components/SearchFilterSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import CircularGallery from '@/components/CircularGallery';
import FeaturesSection from '@/components/FeaturesSection';
import styles from './luxury-page.module.css';

export default function LuxuryPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);
  const [expandedCity, setExpandedCity] = useState('Mumbai');

  const popularNeighborhoods = [
    { name: 'Worli', image: '🏙️' },
    { name: 'Lower Parel', image: '🏢' },
    { name: 'Bandra', image: '🌊' },
    { name: 'Juhu', image: '🏖️' },
    { name: 'BKC', image: '💼' },
    { name: 'Seawoods', image: '🌴' },
    { name: 'Goregaon', image: '🏘️' },
    { name: 'Kharghar', image: '🌅' },
  ];

  const galleryItems = [
    { image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop', text: 'Worli' },
    { image: 'https://images.unsplash.com/photo-1577959375944-411d73fa8e0f?w=800&h=600&fit=crop', text: 'Lower Parel' },
    { image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop', text: 'Bandra' },
    { image: 'https://images.unsplash.com/photo-1512207736139-e3e08cc8cef3?w=800&h=600&fit=crop', text: 'Juhu' },
    { image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop', text: 'BKC' },
    { image: 'https://images.unsplash.com/photo-1523217311519-0e9e78a67720?w=800&h=600&fit=crop', text: 'Seawoods' },
    { image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', text: 'Goregaon' },
    { image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop', text: 'Kharghar' },
  ];

  const locationsByCity = {
    Mumbai: [
      'Andheri West', 'Andheri East', 'Marol', 'Powai', 'Mahim', 'Kurla', 'BKC', 'Ghatkopar East',
      'Mira Road', 'Bhayandar', 'Worli', 'Matunga East', 'Mulund', 'Bhandup', 'Ghatkopar West',
      'Sion', 'Vile Parle West', 'Juhu', 'Jogeshwari East', 'Jogeshwari West', 'Goregaon West',
      'Borivali East', 'Borivali West', 'Dahisar', 'Malabar Hill', 'Colaba', 'Haware City',
      'Tardeo', 'Byculla', 'Kanjurmarg', 'Mahalaxmi', 'Grant Road'
    ],
    Thane: [
      'Thane East', 'Beyond Thane', 'Korum Mall', 'Majiwada', 'Kolshet', 'Manpada', 'Hiranandani Estate',
      'Suraj Water Park', 'Waghbil', 'Anand Nagar', 'Ghodbunder Road', 'Thane West', 'Dombivali'
    ],
    'Navi Mumbai': [
      'Panvel', 'Airoli', 'Ghansoli', 'Navi Mumbai', 'Kharghar', 'Taloja', 'Koperkhairane', 'Rabale',
      'Turbhe', 'Vashi', 'Sanpada', 'Juinagar', 'Nerul', 'Seawood Darave', 'Belapur CBD', 'Mansaoravar',
      'Khandeshwar', 'Bamandongri', 'Kharkopar', 'Diva', 'Ulwe', 'Shilphata'
    ]
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setNavScrolled(window.scrollY > 50);
  };

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <nav className={`${styles.navbar} ${navScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <h1>TrueAssets</h1>
          </div>
          <div className={styles.navLinks}>
            <a href="#featured">Properties</a>
            <a href="#neighborhoods">Neighborhoods</a>
            <a href="#why-us">Why Us</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className={styles.navActions}>
            <button onClick={() => router.push('/auth/login')} className={styles.signInBtn}>
              Sign In
            </button>
            <button onClick={() => router.push('/auth/signup/buyer')} className={styles.signUpBtn}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* CINEMATIC HERO SECTION */}
      <CinematicHero />

      {/* SEARCH & FILTER SECTION */}
      <SearchFilterSection />

      {/* FEATURED PROPERTIES SECTION */}
      <FeaturedPropertiesSection />

      {/* FEATURES SECTION WITH ANIMATED CURSOR */}
      <FeaturesSection />

      {/* POPULAR NEIGHBORHOODS - CIRCULAR GALLERY */}
      <section id="neighborhoods" className={styles.neighborhoodsSection}>
        <div className={styles.sectionHeader}>
          <h2>Popular Neighborhoods</h2>
          <p>Find homes in Mumbai's most sought-after locations</p>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery 
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={1.9}
            scrollEase={0.05}
          />
        </div>
      </section>

      {/* PROPERTY OWNERS SECTION */}
      <section className={styles.ownersSection}>
        <div className={styles.ownersContent}>
          <motion.div
            className={styles.ownersText}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>For Property Owners & Brokers</h2>
            <h3>Sell or Rent your property quickly at TrueAssets</h3>
            <p>Easily sell or rent your property with TrueAssets. Our platform ensures fast, hassle-free transactions, connecting you with the right buyers or tenants in no time. Post unlimited properties for FREE and reach thousands of qualified buyers.</p>
            <button onClick={() => router.push('/auth/signup/owner')} className={styles.listPropertyBtn}>
              Post Property FREE →
            </button>
          </motion.div>
        </div>
      </section>

      {/* LOCATION-BASED LISTINGS */}
      <section className={styles.locationsSection}>
        <div className={styles.sectionHeader}>
          <h2>Flats for Sale by Location</h2>
          <p>Browse properties in your preferred neighborhood</p>
        </div>

        <div className={styles.citiesContainer}>
          {Object.keys(locationsByCity).map((city) => (
            <div key={city} className={styles.citySection}>
              <button
                className={styles.cityHeader}
                onClick={() => setExpandedCity(expandedCity === city ? '' : city)}
              >
                <span className={styles.cityTitle}>Flats for sale in {city}</span>
                <span className={styles.expandIcon}>{expandedCity === city ? '−' : '+'}</span>
              </button>

              {expandedCity === city && (
                <motion.div
                  className={styles.locationsList}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.locationsGrid}>
                    {locationsByCity[city].slice(0, 8).map((location) => (
                      <button
                        key={location}
                        className={styles.locationLink}
                        onClick={() => {
                          const query = new URLSearchParams({ location });
                          router.push(`/listings?${query}`);
                        }}
                      >
                        Flats for sale in {location} →
                      </button>
                    ))}
                  </div>

                  {locationsByCity[city].length > 8 && (
                    <button
                      className={styles.showMoreBtn}
                      onClick={() => {
                        const query = new URLSearchParams({ city });
                        router.push(`/listings?${query}`);
                      }}
                    >
                      Show More →
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Find Your Perfect Home?</h2>
          <p>Join thousands of happy customers who found their dream property with TrueAssets</p>
          <button onClick={() => router.push('/listings')} className={styles.ctaButtonLarge}>
            Start Exploring → 
          </button>
        </div>
      </section>



      {/* TESTIMONIALS */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2>What Our Clients Say</h2>
          <p>Join thousands of satisfied customers</p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>"TrueAssets made finding my dream home incredibly easy. The entire process was transparent and hassle-free!"</p>
            <div className={styles.testimonialAuthor}>
              <strong>Rajesh Kumar</strong>
              <span>Bought a 3 BHK in Mumbai</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>"Excellent service and professional team. They helped me find the perfect rental property within days."</p>
            <div className={styles.testimonialAuthor}>
              <strong>Priya Singh</strong>
              <span>Rented a 2 BHK in Bangalore</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p>"The best real estate platform I've used. Verified properties, transparent dealings, and great support!"</p>
            <div className={styles.testimonialAuthor}>
              <strong>Amit Patel</strong>
              <span>Investor, 5 properties</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Find Your Perfect Home?</h2>
          <p>Join thousands of happy customers who found their dream property with TrueAssets</p>
          <button onClick={() => router.push('/listings')} className={styles.ctaButtonLarge}>
            Start Exploring → 
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>TrueAssets</h4>
            <p>India's fastest growing verified real estate platform</p>
          </div>
          <div className={styles.footerSection}>
            <h5>Quick Links</h5>
            <a href="#featured">Properties</a>
            <a href="/listings">Browse All</a>
            <a href="#why-us">About Us</a>
          </div>
          <div className={styles.footerSection}>
            <h5>Support</h5>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Terms of Use</a>
          </div>
          <div className={styles.footerSection}>
            <h5>Contact</h5>
            <p>Email: contact@trueassets.com</p>
            <p>Phone: +91 XXXX XXXX XX</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 TrueAssets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
