'use client';

import { CheckCircle, Shield, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './FeaturesSection.module.css';

export default function FeaturesSection() {
  const router = useRouter();

  const features = [
    {
      id: 1,
      icon: CheckCircle,
      title: '100% VERIFIED PROPERTIES',
      description: 'Every property undergoes rigorous legal verification and authentication to ensure your complete peace of mind.'
    },
    {
      id: 2,
      icon: Shield,
      title: 'SECURE TRANSACTIONS',
      description: 'Industry-leading security protocols protect every step of your investment journey from inquiry to closure.'
    },
    {
      id: 3,
      icon: Users,
      title: 'EXPERT AGENTS',
      description: 'Our dedicated team of specialists provides personalized guidance and support twenty-four hours a day.'
    },
    {
      id: 4,
      icon: Zap,
      title: 'ACCELERATED PROCESS',
      description: 'Streamlined workflows and efficient approvals get you from selection to closure faster than traditional methods.'
    }
  ];

  const handleLearnMore = () => {
    router.push('/about');
  };

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.title}>Why Choose TrueAssets</h2>
          <p className={styles.subtitle}>Experience luxury real estate with confidence and ease</p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className={styles.featureItem}>
                <div className={styles.iconWrapper}>
                  <IconComponent className={styles.icon} strokeWidth={1} size={32} />
                </div>
                <div className={styles.contentWrapper}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.ctaWrapper}>
          <button onClick={handleLearnMore} className={styles.learnMoreLink}>
            Our Process <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
