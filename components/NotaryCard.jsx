'use client';

import { useState } from 'react';
import styles from './NotaryCard.module.css';
import NotaryContactModal from './NotaryContactModal';

export default function NotaryCard({ notary, onContact }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${notary.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${notary.email}`;
  };

  const handleContact = () => {
    setModalOpen(true);
  };

  const getBadgeLevel = () => {
    const registrations = parseInt(notary.registrationsDone) || 0;
    if (registrations >= 500) return 'platinum';
    if (registrations >= 300) return 'gold';
    if (registrations >= 100) return 'silver';
    return 'standard';
  };

  const badgeLevel = getBadgeLevel();

  return (
    <div className={styles.card}>
      {/* Content Section */}
      <div className={styles.contentSection}>
        <p className={styles.expertise}>{notary.expertise || 'Notary Professional'}</p>

        {notary.bio && (
          <p className={styles.bio}>{notary.bio}</p>
        )}

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{notary.experience}</span>
            <span className={styles.statName}>Experience</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{notary.registrationsDone || 0}</span>
            <span className={styles.statName}>Registrations</span>
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className={styles.infoSection}>
        <div className={styles.profileWrapper}>
          <div className={styles.profilePicture}>
            {notary.profilePictureUrl ? (
              <img src={notary.profilePictureUrl} alt={notary.firstName} />
            ) : (
              <div className={styles.placeholderPic}>
                {notary.firstName?.charAt(0) ?? 'N'}{notary.lastName?.charAt(0) ?? 'P'}
              </div>
            )}
          </div>

          <div className={styles.userInfo}>
            <h3 className={styles.name}>
              {notary.firstName || 'Notary'} {notary.lastName || 'Professional'}
            </h3>
            <p className={styles.role}>Notary Professional</p>
            <p className={styles.city}>{notary.city || 'City'}</p>
          </div>

          <div className={`${styles.badge} ${styles[badgeLevel]}`}>
            {badgeLevel === 'platinum' && 'Platinum'}
            {badgeLevel === 'gold' && 'Gold'}
            {badgeLevel === 'silver' && 'Silver'}
            {badgeLevel === 'standard' && 'Verified'}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className={styles.contactSection}>
          <button
            onClick={handleCall}
            className={styles.contactBtn}
            title="Call"
          >
            Call: {notary.phone}
          </button>
          <button
            onClick={handleEmail}
            className={styles.contactBtn}
            title="Email"
          >
            Send Email
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContact}
          className={styles.ctaBtn}
        >
          Get Services
        </button>
      </div>

      {/* Contact Modal */}
      <NotaryContactModal
        notary={notary}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
