'use client';

import { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './CinematicHero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !containerRef.current) return;

    // Delay animation setup to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Subtle fade-in animation for hero content
        gsap.from(`.${styles.heroContent}`, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
        });
      });

      return () => ctx.revert();
    }, 300);

    return () => clearTimeout(timer);
  }, [mounted]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePostProperty = () => {
    router.push('/auth/signup/owner');
  };

  const handleExplore = () => {
    router.push('/listings');
  };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={styles.cinemaHeroContainer}>
      <section className={styles.heroStage}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Supporting Local Mumbai Professionals</p>
          <h1 className={styles.title}>TRUE ASSET INDIA</h1>
          <p className={styles.subtitle}>
            Discover premium properties, investment opportunities & professional networks
          </p>
          
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchBar}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="Search properties, locations, or investors..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchButton}>Search</button>
            </form>
          </div>

          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={handlePostProperty}>
              Post Property Free
            </button>
            <button className={styles.secondaryCta} onClick={handleExplore}>
              Explore Opportunities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}