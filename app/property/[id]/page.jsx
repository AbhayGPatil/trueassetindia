'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice, formatArea, generatePropertyHeader } from '@/lib/priceFormatter';
import { getAmenityIcon } from '@/components/AmenityIcons';
import styles from './property-detail.module.css';

// SVG Icons
function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="12" r="5"></circle>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  const { user, loading } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading_page, setLoadingPage] = useState(true);
  const [error, setError] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [interested, setInterested] = useState(false);
  const [marking, setMarking] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showContactCard, setShowContactCard] = useState(false);

  useEffect(() => {
    loadProperty();
    if (user) {
      checkIfInterested();
    }
  }, [propertyId, user]);

  const loadProperty = async () => {
    try {
      const docRef = doc(db, 'properties', propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProperty({
          id: docSnap.id,
          ...docSnap.data(),
        });
        setError('');
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Error loading property: ' + err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  const checkIfInterested = async () => {
    try {
      const q = query(
        collection(db, 'interestedVisitors'),
        where('propertyId', '==', propertyId),
        where('visitorId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      setInterested(querySnapshot.size > 0);
    } catch (err) {
      console.error('Error checking interest:', err);
    }
  };

  const handleMarkInterested = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (interested) {
      setError('You already marked this property as interested');
      return;
    }

    setMarking(true);

    try {
      await addDoc(collection(db, 'interestedVisitors'), {
        propertyId: propertyId,
        propertyTitle: property.title,
        visitorId: user.uid,
        visitorEmail: user.email,
        ownerId: property.uploadedBy,
        markedAt: serverTimestamp(),
      });

      setInterested(true);
      setSuccessMsg('Property marked as interested! Owner will see your interest.');

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Error marking interested:', err);
      setError('Error marking interested: ' + err.message);
    } finally {
      setMarking(false);
    }
  };

  // Combine images and videos into single media array
  const allMedia = [
    ...(property?.images || []).map(url => ({ type: 'image', url })),
    ...(property?.videos || []).map(url => ({ type: 'video', url }))
  ];

  const currentMedia = allMedia[currentMediaIndex];

  const nextMedia = () => {
    if (allMedia.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
      setShowVideoPlayer(false);
    }
  };

  const prevMedia = () => {
    if (allMedia.length > 0) {
      setCurrentMediaIndex((prev) =>
        prev === 0 ? allMedia.length - 1 : prev - 1
      );
      setShowVideoPlayer(false);
    }
  };

  // Helper function to normalize text (remove underscores, convert to title case)
  function normalizeText(text) {
    return text
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  if (loading_page) {
    return <div className={styles.container}>Loading property details...</div>;
  }

  if (error && !property) {
    return <div className={styles.container}><div className={styles.errorMessage}>{error}</div></div>;
  }

  if (!property) {
    return <div className={styles.container}><div className={styles.errorMessage}>Property not found</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailWrapper}>
        {/* MAIN CONTENT - LEFT COLUMN (70%) */}
        <div className={styles.mainContent}>
          {/* Media Gallery Section */}
          {allMedia.length > 0 && (
            <div className={styles.mediaSection}>
              <div className={styles.galleryContainer}>
                <div className={styles.mainImage}>
                  {currentMedia?.type === 'video' && showVideoPlayer ? (
                    <video src={currentMedia.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <img src={currentMedia?.url} alt="Property" />
                      {currentMedia?.type === 'video' && !showVideoPlayer && (
                        <div className={styles.videoOverlay} onClick={() => setShowVideoPlayer(true)}>
                          <div className={styles.playButton}>
                            <PlayIcon />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {allMedia.length > 1 && (
                    <>
                      <button className={`${styles.mediaNav} ${styles.prev}`} onClick={prevMedia}>
                        <ChevronLeft />
                      </button>
                      <button className={`${styles.mediaNav} ${styles.next}`} onClick={nextMedia}>
                        <ChevronRight />
                      </button>
                      <div className={styles.mediaCounter}>
                        {currentMediaIndex + 1} / {allMedia.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {allMedia.length > 1 && (
                  <div className={styles.thumbnailStrip}>
                    {allMedia.map((media, idx) => (
                      <div
                        key={idx}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => {
                          setCurrentMediaIndex(idx);
                          setShowVideoPlayer(media.type === 'video');
                        }}
                      >
                        {media.type === 'video' ? (
                          <video
                            src={media.url}
                            className={`${styles.thumbnail} ${idx === currentMediaIndex ? styles.active : ''}`}
                            onLoadedMetadata={(e) => (e.target.poster = e.target.currentTime)}
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={`Media ${idx + 1}`}
                            className={`${styles.thumbnail} ${idx === currentMediaIndex ? styles.active : ''}`}
                          />
                        )}
                        {idx === allMedia.length - 1 && allMedia.length > 4 && (
                          <div className={styles.viewAllOverlay}>View All {allMedia.length}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Header */}
          <div className={styles.headerSection}>
            <h1 className={styles.headerTitle}>{generatePropertyHeader(property)}</h1>
            <p className={styles.headerSubtitle}>{property.description}</p>
          </div>

          {/* Property Specifications Grid */}
          <div className={styles.specsGrid}>
            {property.area && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Super Area</span>
                <span className={styles.specValue}>{formatArea(property.area)}</span>
              </div>
            )}
            {property.floorNo && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Floor</span>
                <span className={styles.specValue}>{property.floorNo}</span>
              </div>
            )}
            {property.facing && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Facing</span>
                <span className={styles.specValue}>{property.facing}</span>
              </div>
            )}
            {property.transactionType && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Transaction Type</span>
                <span className={styles.specValue}>{property.transactionType}</span>
              </div>
            )}
            {property.status && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Status</span>
                <span className={styles.specValue}>{property.status}</span>
              </div>
            )}
            {property.furnishingStatus && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Furnishing</span>
                <span className={styles.specValue}>{property.furnishingStatus}</span>
              </div>
            )}
          </div>

          {/* Key Highlights */}
          {property.keyHighlights && property.keyHighlights.length > 0 && (
            <div className={styles.highlightsSection}>
              <div className={styles.highlightsHeader}>
                <div className={styles.highlightsIcon}>
                  <TargetIcon />
                </div>
                <div className={styles.highlightsTitle}>
                  <p className={styles.highlightsMain}>Key Highlights</p>
                  <p className={styles.highlightsSubtitle}>Why you should choose this property</p>
                </div>
              </div>
              <div className={styles.highlightsList}>
                {property.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className={styles.highlightItem}>
                    <div className={styles.highlightDot}></div>
                    <span>{normalizeText(highlight)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className={styles.amenitiesSection}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <div className={styles.amenitiesGrid}>
                {property.amenities.map((amenity, idx) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={idx} className={styles.amenityCard}>
                      <div className={styles.amenityIcon}>
                        {IconComponent ? <IconComponent /> : '•'}
                      </div>
                      <span className={styles.amenityName}>{amenity}</span>
                    </div>
                  );
                })}
              </div>
              <button className={styles.viewAllAmenities}>
                View all {property.amenities.length} amenities
              </button>
            </div>
          )}

          {/* Description (if not already shown in header) */}
          {property.fullDescription && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.sectionTitle}>About this property</h2>
              <p className={styles.descriptionText}>{property.fullDescription}</p>
            </div>
          )}
        </div>

        {/* SIDEBAR - RIGHT COLUMN (30%) */}
        <div className={styles.sidebar}>
          <div className={styles.contactCard}>
            <h3 className={styles.ownerName}>{property.ownerName}</h3>

            {/* Get Phone CTA - Opens Contact Modal */}
            <button 
              onClick={() => setShowContactCard(true)}
              className={`${styles.ctaButton} ${styles.secondaryCta}`}
            >
              Get Phone Number
            </button>

            {/* Download Brochure */}
            <button className={`${styles.ctaButton} ${styles.secondaryCta}`}>
              Download Brochure
            </button>

            {/* Mark Interested or Your Property Badge */}
            {user && user.uid !== property.uploadedBy ? (
              <button
                onClick={handleMarkInterested}
                disabled={marking || interested}
                className={`${styles.ctaButton} ${styles.interestedBtn} ${interested ? styles.active : ''}`}
              >
                {marking ? 'Marking...' : interested ? '✓ Already Interested' : 'Mark as Interested'}
              </button>
            ) : user && user.uid === property.uploadedBy ? (
              <div className={styles.ownerBadge}>✓ Your Property</div>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className={`${styles.ctaButton} ${styles.secondaryCta}`}
              >
                Log In to Mark as Interested
              </button>
            )}

            {/* Back Button */}
            <button onClick={() => window.history.back()} className={styles.backButton}>
              <ChevronLeft /> Back
            </button>
          </div>
        </div>
      </div>

      {/* Contact Card Modal */}
      {showContactCard && (
        <div className={styles.modalOverlay} onClick={() => setShowContactCard(false)}>
          <div className={styles.contactModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowContactCard(false)}
            >
              <CloseIcon />
            </button>
            
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Contact Information</h2>
              
              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name</span>
                  <span className={styles.infoValue}>{property.ownerName}</span>
                </div>
                
                {property.ownerPhone && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone</span>
                    <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {property.ownerPhone}
                      <button 
                        className={styles.copyButton}
                        onClick={() => {
                          navigator.clipboard.writeText(property.ownerPhone);
                          alert('Phone number copied!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                {property.ownerEmail && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email</span>
                    <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {property.ownerEmail}
                      <button 
                        className={styles.copyButton}
                        onClick={() => {
                          navigator.clipboard.writeText(property.ownerEmail);
                          alert('Email copied!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                <p>Contact the owner to schedule a property viewing or for more information.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMsg && <div className={styles.successMessage}>{successMsg}</div>}
    </div>
  );
}
