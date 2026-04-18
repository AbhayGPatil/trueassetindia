import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property, onClick }) {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    // Map property data to component props
    const id = property.id;
    const image = property.images?.[0] || property.image || '/placeholder.jpg';
    const title = property.title || 'Property';
    const location = property.location || 'Location not specified';
    const price = property.price || 0;
    const beds = property.bedrooms || property.beds || 0;
    const baths = property.bathrooms || property.baths || 0;
    const sqft = property.area || property.sqft || 0;
    const type = property.type === 'rent' ? 'For Rent' : 'For Sale';
    const isBankAuction = property.bankAuction || false;

    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    const handleViewClick = (e) => {
        e.stopPropagation();
        router.push(`/property/${id}`);
    };

    return (
        <motion.div
            className={styles.card}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
        >
            {/* IMAGE SECTION */}
            <div className={styles.imageWrapper}>
                {!imageError ? (
                    <img
                        src={image}
                        alt={title}
                        className={styles.image}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={styles.imageFallback}>📸</div>
                )}

                <div className={styles.badgeContainer}>
                    <span className={styles.badge}>
                        {type === 'For Rent' ? '🔑' : '🏠'} {type}
                    </span>
                    {isBankAuction && (
                        <span className={styles.auctionBadge}>🏛️ Auction</span>
                    )}
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className={styles.content}>
                <div className={styles.location}>
                    <span>📍</span>
                    <p>{location}</p>
                </div>

                <h3 className={styles.title}>{title}</h3>

                <div className={styles.specs}>
                    {beds > 0 && (
                        <div className={styles.spec}>
                            <span>🛏️</span>
                            <p>{beds} BHK</p>
                        </div>
                    )}
                    {baths > 0 && (
                        <div className={styles.spec}>
                            <span>🛁</span>
                            <p>{baths} Bath</p>
                        </div>
                    )}
                    {sqft > 0 && (
                        <div className={styles.spec}>
                            <span>📐</span>
                            <p>{sqft.toLocaleString()} sqft</p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className={styles.footer}>
                    <div className={styles.priceSection}>
                        <span className={styles.price}>
                            ₹{(price / 100000).toFixed(0)}L
                        </span>
                        {type === 'For Rent' && (
                            <span className={styles.period}>/month</span>
                        )}
                    </div>

                    <motion.button
                        className={styles.viewBtn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewClick}
                    >
                        View →
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
