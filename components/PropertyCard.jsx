import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './PropertyCard.module.css';
import { formatIndianCurrency } from '@/lib/utils/formatCurrency';
import { SaleIcon, RentIcon, AuctionIcon, LocationIcon } from './Icons/RealEstateIcons';

export default function PropertyCard({ property, showViewMore = false, onViewMoreClick }) {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    // Map property data
    const id = property.id;
    const image = property.images?.[0] || property.image || '/placeholder.jpg';
    const title = property.title || 'Property';
    const location = property.location || 'Location not specified';
    const price = property.price || 0;
    const beds = property.bedrooms || property.beds || 0;
    const baths = property.bathrooms || property.baths || 0;
    const sqft = property.area || property.superArea || 0;
    const type = property.type === 'rent' ? 'For Rent' : 'For Sale';
    const isBankAuction = property.bankAuction || false;
    const amenities = property.amenities || [];

    const handleViewClick = (e) => {
        e.stopPropagation();
        router.push(`/property/${id}`);
    };

    return (
        <motion.div
            className={styles.gridCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            {/* IMAGE SECTION */}
            <div className={styles.cardImageWrapper}>
                {!imageError ? (
                    <img
                        src={image}
                        alt={title}
                        className={styles.cardImage}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={styles.cardImageFallback}>
                        <span>—</span>
                    </div>
                )}
                
                {/* BADGES */}
                <div className={styles.cardBadges}>
                    <span className={styles.typeBadge}>
                        {type === 'For Rent' ? (
                            <><RentIcon size={12} /> For Rent</>
                        ) : (
                            <><SaleIcon size={12} /> For Sale</>
                        )}
                    </span>
                    {isBankAuction && (
                        <span className={styles.auctionBadge}>
                            <AuctionIcon size={12} /> Auction
                        </span>
                    )}
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className={styles.cardContent}>
                {/* PRICE */}
                <div className={styles.cardPrice}>
                    {formatIndianCurrency(price)}
                </div>

                {/* TITLE */}
                <h3 className={styles.cardTitle}>{title}</h3>

                {/* LOCATION */}
                <div className={styles.cardLocation}>
                    <LocationIcon size={14} />
                    <span>{location}</span>
                </div>

                {/* SPECS BAR */}
                <div className={styles.specsBar}>
                    {beds > 0 && <span>{beds} BHK</span>}
                    {baths > 0 && <span className={styles.specDivider}>|</span>}
                    {baths > 0 && <span>{baths} Bath</span>}
                    {sqft > 0 && <span className={styles.specDivider}>|</span>}
                    {sqft > 0 && <span>{sqft.toLocaleString()} sqft</span>}
                </div>

                {/* AMENITIES PILLS */}
                {amenities.length > 0 && (
                    <div className={styles.amenitiesPills}>
                        {amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className={styles.pill}>
                                {amenity}
                            </span>
                        ))}
                        {amenities.length > 3 && (
                            <span className={styles.pillMore}>
                                +{amenities.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* VIEW MORE LINK (10th card only) */}
                {showViewMore && (
                    <a 
                        href="/login" 
                        className={styles.viewMoreLink}
                    >
                        View more...
                    </a>
                )}
            </div>

            {/* VIEW DETAILS BUTTON */}
            <motion.button
                className={styles.cardButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewClick}
            >
                View Details
            </motion.button>
        </motion.div>
    );
}
