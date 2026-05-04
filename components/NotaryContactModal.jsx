'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './NotaryContactModal.module.css';

export default function NotaryContactModal({ notary, isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!message.trim()) {
        throw new Error('Please enter a message');
      }

      // Save inquiry to Firestore
      await addDoc(collection(db, 'notaryInquiries'), {
        notaryId: notary.uid,
        notaryName: `${notary.firstName} ${notary.lastName}`,
        notaryEmail: notary.email,
        notaryPhone: notary.phone,
        message: message.trim(),
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      setSuccess('Message sent! The notary will contact you soon.');
      setMessage('');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const content = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.container}>
          {/* Left Side - Notary Card */}
          <div className={styles.cardSection}>
            <div className={styles.card}>
              <div className={styles.profileSection}>
                <div className={styles.profilePicture}>
                  {notary.profilePictureUrl ? (
                    <img src={notary.profilePictureUrl} alt={notary.firstName} />
                  ) : (
                    <div className={styles.placeholderPic}>
                      {notary.firstName?.charAt(0) ?? 'N'}{notary.lastName?.charAt(0) ?? 'P'}
                    </div>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.name}>
                    {notary.firstName} {notary.lastName}
                  </h2>
                  <p className={styles.role}>Notary Professional</p>
                  <p className={styles.city}>{notary.city}</p>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Experience</span>
                  <span className={styles.value}>{notary.experience}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Registrations</span>
                  <span className={styles.value}>{notary.registrationsDone || 0}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Registration #</span>
                  <span className={styles.value}>{notary.registrationNumber}</span>
                </div>
              </div>

              {notary.expertise && (
                <div className={styles.expertise}>
                  <p className={styles.label}>Expertise</p>
                  <p className={styles.value}>{notary.expertise}</p>
                </div>
              )}

              {notary.bio && (
                <div className={styles.bio}>
                  <p className={styles.bioText}>{notary.bio}</p>
                </div>
              )}

              <div className={styles.contactInfo}>
                <a href={`tel:${notary.phone}`} className={styles.contactLink}>
                  Call: {notary.phone}
                </a>
                <a href={`mailto:${notary.email}`} className={styles.contactLink}>
                  Email: {notary.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Send a Message</h3>
            <p className={styles.formSubtitle}>
              Tell {notary.firstName} about your requirements
            </p>

            <form onSubmit={handleSendMessage} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what you need notarization for..."
                  className={styles.textarea}
                  rows={8}
                  required
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              <p className={styles.disclaimer}>
                The notary will contact you shortly via phone or email.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
