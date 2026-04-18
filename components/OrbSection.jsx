'use client';

import Orb from './Orb';
import styles from './OrbSection.module.css';

export default function OrbSection() {
  return (
    <div className={styles.orbSectionContainer}>
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
        
        {/* Text Overlay - Inside the Orb */}
        <div className={styles.textOverlay}>
          <h1 className={styles.mainTitle}>TRUE ASSET INDIA</h1>
          <p className={styles.tagline}>
            True Asset. तुमची खरी ओळख.
          </p>
        </div>
      </div>
    </div>
  );
}
