'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import styles from './subscription.module.css';

const PLANS = [
  {
    id: 'prolister',
    name: 'ProLister',
    duration: '3 months',
    price: 1500,
    features: [
      'Unlimited property uploads',
      'Featured listings',
      'Priority support',
      '90-day property auto-renewal',
      'Advanced analytics',
      'Contact buyer directly',
    ],
    popular: false,
  },
  {
    id: 'rentmaster',
    name: 'RentMaster',
    duration: '1 month',
    price: 500,
    features: [
      '5 property uploads',
      'Basic listings',
      'Email support',
      '90-day property auto-renewal',
      'Standard analytics',
      'Contact buyer email only',
    ],
    popular: false,
  },
  {
    id: 'dealmaker',
    name: 'DealMaker',
    duration: '3 months',
    price: 1510,
    features: [
      'Unlimited property uploads',
      '⭐ Featured listings',
      '⭐ Priority support',
      '⭐ 90-day auto-renewal',
      '⭐ Advanced analytics',
      '⭐ Direct buyer access',
    ],
    popular: true,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (!user) {
    return <div className={styles.loading}>Redirecting to signup...</div>;
  }

  const handleSubscribe = (planId) => {
    router.push(`/payment/checkout?plan=${planId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Choose Your Plan</h1>
        <p>Unlock unlimited uploads and premium features</p>
      </div>

      <div className={styles.plansGrid}>
        {PLANS.map(plan => (
          <div 
            key={plan.id} 
            className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
          >
            {plan.popular && <div className={styles.badge}>MOST POPULAR</div>}
            
            <h2 className={styles.planName}>{plan.name}</h2>
            <p className={styles.duration}>{plan.duration}</p>
            
            <div className={styles.pricing}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>{plan.price}</span>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className={styles.checkmark}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={styles.subscribeBtn}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      <div className={styles.faqSection}>
        <h2>Common Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>Can I cancel anytime?</h3>
            <p>Yes! We don't have auto-renewal. Subscribe when you need it.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What happens after expiry?</h3>
            <p>Your properties stay visible for 90 days, then expire. Renew anytime.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>How many properties can I list?</h3>
            <p>Free: 2 uploads. Paid plans: Unlimited uploads based on tier.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
