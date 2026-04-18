'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './property-detail.module.css';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  const { user, loading } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading_page, setLoadingPage] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [interested, setInterested] = useState(false);
  const [marking, setMarking] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
        setError('❌ Property not found');
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('❌ Error loading property: ' + err.message);
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
      setError('❌ You already marked this property as interested');
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
      setSuccessMsg('✅ Property marked as interested! Owner will see your interest.');

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Error marking interested:', err);
      setError('❌ Error marking interested: ' + err.message);
    } finally {
      setMarking(false);
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading_page) {
    return <div className={styles.container}>Loading property details...</div>;
  }

  if (error && !property) {
    return <div className={styles.container}><div className={styles.error}>{error}</div></div>;
  }

  if (!property) {
    return <div className={styles.container}><div className={styles.error}>Property not found</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.detail_wrapper}>
        {/* Gallery */}
        {property.images && property.images.length > 0 && (
          <div className={styles.gallery}>
            <div className={styles.main_image}>
              <img src={property.images[currentImageIndex]} alt="Property" />
              {property.images.length > 1 && (
                <>
                  <button className={styles.nav_btn} onClick={prevImage}>◀</button>
                  <button className={styles.nav_btn + ' ' + styles.next_btn} onClick={nextImage}>▶</button>
                  <div className={styles.image_counter}>
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>

            {property.images.length > 1 && (
              <div className={styles.thumbnails}>
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    className={idx === currentImageIndex ? styles.active_thumb : ''}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Info */}
        <div className={styles.info_section}>
          <div className={styles.header}>
            <div>
              <h1>{property.title}</h1>
              <p className={styles.location}>📍 {property.location}</p>
              <p className={styles.price}>
                ₹{property.price?.toLocaleString('en-IN')}
                {property.type === 'rent' && ' / month'}
              </p>
            </div>
            <div className={styles.type_badge}>
              {property.type === 'sell' ? '🏠 For Sale' : '🔑 For Rent'}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.stats_grid}>
            {property.bedrooms > 0 && (
              <div className={styles.stat_item}>
                <span className={styles.stat_label}>Bedrooms</span>
                <span className={styles.stat_value}>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className={styles.stat_item}>
                <span className={styles.stat_label}>Bathrooms</span>
                <span className={styles.stat_value}>{property.bathrooms}</span>
              </div>
            )}
            {property.area > 0 && (
              <div className={styles.stat_item}>
                <span className={styles.stat_label}>Area</span>
                <span className={styles.stat_value}>{property.area} sq ft</span>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className={styles.section}>
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className={styles.section}>
              <h2>Amenities</h2>
              <div className={styles.amenities_list}>
                {property.amenities.map((amenity, idx) => (
                  <span key={idx} className={styles.amenity_tag}>
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className={styles.section}>
            <h2>Owner Information</h2>
            <div className={styles.owner_info}>
              <p><strong>Name:</strong> {property.ownerName}</p>
              <p><strong>Email:</strong> {property.ownerEmail}</p>
            </div>
          </div>

          {/* Messages */}
          {error && <div className={styles.error}>{error}</div>}
          {successMsg && <div className={styles.success}>{successMsg}</div>}

          {/* Action Buttons */}
          <div className={styles.action_buttons}>
            {user && user.uid !== property.uploadedBy ? (
              <button
                onClick={handleMarkInterested}
                disabled={marking || interested}
                className={styles.interested_btn}
              >
                {marking ? '⏳ Marking...' : interested ? '❤️ Already Interested' : '🤍 Mark as Interested'}
              </button>
            ) : user && user.uid === property.uploadedBy ? (
              <div className={styles.owner_badge}>✓ Your Property</div>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className={styles.login_btn}
              >
                Log In to Mark as Interested
              </button>
            )}

            <button
              onClick={() => window.history.back()}
              className={styles.back_btn}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
