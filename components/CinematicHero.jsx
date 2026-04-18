'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Hero } from './ui/animated-hero';
import OrbSection from './OrbSection';
import styles from './CinematicHero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const containerRef = useRef(null);
  const trImageRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !containerRef.current) return;

    // Delay animation setup to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // No scroll animations needed - video section removed
      });

      return () => ctx.revert();
    }, 300);

    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* ORB ANIMATION SECTION - Just below navbar */}
      <OrbSection />

      <div ref={containerRef} className={styles.cinemaHeroContainer}>
        {/* STAGE 1: ANIMATED HERO */}
        <div className={styles.heroStage} ref={trImageRef}>
          <Hero />
        </div>
      </div>
    </>
  );
}