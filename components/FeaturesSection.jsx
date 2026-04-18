'use client';

import StarBorder from './StarBorder';
import styles from './FeaturesSection.module.css';

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: '✓',
      title: '100% Verified Properties',
      description: 'All properties legally verified'
    },
    {
      id: 2,
      icon: '🛡️',
      title: 'Safe Transactions',
      description: 'Secure from start to finish'
    },
    {
      id: 3,
      icon: '👥',
      title: 'Expert Agents',
      description: 'Dedicated support 24/7'
    },
    {
      id: 4,
      icon: '⚡',
      title: 'Fast Process',
      description: 'Quick approvals and closures'
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why Choose TrueAssets</h2>
        <p className={styles.subtitle}>Experience luxury real estate with confidence and ease</p>
        
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <StarBorder
              key={feature.id}
              as="div"
              className={styles.starBorderWrapper}
              color="cyan"
              speed="5s"
            >
              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{feature.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </StarBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
