'use client';

import styles from './NotaryCard.module.css';

export default function NotaryCard({ notary, onContact }) {
  const handleCall = () => {
    window.location.href = `tel:${notary.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${notary.email}`;
  };

  const handleContact = () => {
    if (onContact) {
      onContact(notary);
    }
  };

  // Calculate badge level based on registrations
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
      {/* Badge */}
      <div className={`${styles.badge} ${styles[badgeLevel]}`}>
        {badgeLevel === 'platinum' && '🏆 Platinum'}
        {badgeLevel === 'gold' && '⭐ Gold'}
        {badgeLevel === 'silver' && '✨ Silver'}
        {badgeLevel === 'standard' && 'Verified'}
      </div>

      {/* Header with Profile Picture and Name */}
      <div className={styles.header}>
        <div className={styles.profilePicture}>
          {notary.profilePictureUrl ? (
            <img src={notary.profilePictureUrl} alt={notary.firstName} />
          ) : (
            <div className={styles.placeholderPic}>
              {notary.firstName.charAt(0)}{notary.lastName.charAt(0)}
            </div>
          )}
        </div>
        
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>
            {notary.firstName} {notary.lastName}
          </h3>
          <p className={styles.city}>📍 {notary.city || 'City'}</p>
        </div>
      </div>

      {/* Professional Info */}
      <div className={styles.infoSection}>
        <div className={styles.company}>
          <p className={styles.label}>Registration #</p>
          <p className={styles.value}>{notary.registrationNumber}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{notary.experience}</span>
            <span className={styles.statLabel}>Experience</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{notary.registrationsDone || 0}</span>
            <span className={styles.statLabel}>Registrations</span>
          </div>
        </div>
      </div>

      {/* Expertise */}
      {notary.expertise && (
        <div className={styles.expertise}>
          <p className={styles.label}>Expertise</p>
          <p className={styles.value}>{notary.expertise}</p>
        </div>
      )}

      {/* Contact Section */}
      <div className={styles.contactSection}>
        <div className={styles.contactMethod}>
          <button
            onClick={handleCall}
            className={styles.contactBtn}
            title="Call"
          >
            <span className={styles.icon}>📞</span>
            <span className={styles.text}>{notary.phone}</span>
          </button>
        </div>
        <div className={styles.contactMethod}>
          <button
            onClick={handleEmail}
            className={styles.contactBtn}
            title="Email"
          >
            <span className={styles.icon}>✉️</span>
            <span className={styles.text}>Email</span>
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleContact}
        className={styles.ctaBtn}
      >
        Get Services
      </button>

      {/* Bio */}
      {notary.bio && (
        <div className={styles.bio}>
          <p>{notary.bio}</p>
        </div>
      )}
    </div>
  );
}
