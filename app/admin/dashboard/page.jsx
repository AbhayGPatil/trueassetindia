'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store/adminStore';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { checkAuth, logout, adminEmail } = useAdminStore();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!checkAuth()) {
      router.push('/admin/login');
    }
  }, []);

  // Load all properties
  useEffect(() => {
    loadAllProperties();
  }, []);

  const loadAllProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const props = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(props.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      setDeleting(propertyId);
      await deleteDoc(doc(db, 'properties', propertyId));
      setProperties(properties.filter(p => p.id !== propertyId));
      setShowConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.id.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || prop.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    try {
      const date = new Date(timestamp.toDate ? timestamp.toDate() : timestamp);
      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return '—';
    }
  };

  const formatPrice = (price) => {
    if (!price) return '₹—';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <h1 className={styles.title}>Super Admin Dashboard</h1>
            <p className={styles.subtitle}>TRUEASSETS Property Management</p>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.adminEmail}>👤 {adminEmail}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        {/* CONTROLS */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by title, location, or property ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterBox}>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Properties</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              Total: <strong>{properties.length}</strong>
            </span>
            <span className={styles.stat}>
              Shown: <strong>{filteredProperties.length}</strong>
            </span>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
            <button 
              className={styles.errorClose}
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading all properties...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProperties.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No properties found</h3>
            <p>{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'No properties have been listed yet.'}</p>
          </div>
        )}

        {/* PROPERTIES TABLE */}
        {!loading && filteredProperties.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Listed By</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className={styles.row}>
                    <td className={styles.idCell}>
                      <code className={styles.code}>{property.id.substring(0, 8)}...</code>
                    </td>
                    <td className={styles.titleCell}>{property.title || '—'}</td>
                    <td className={styles.locationCell}>{property.location || '—'}</td>
                    <td className={styles.priceCell}>{formatPrice(property.price)}</td>
                    <td className={styles.typeCell}>
                      <span className={styles.typeBadge}>
                        {property.type === 'rent' ? '🔑 Rent' : '🏠 Sale'}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${styles[property.status]}`}>
                        {property.status || 'pending'}
                      </span>
                    </td>
                    <td className={styles.userCell}>
                      {property.uploadedBy?.email ? (
                        <span className={styles.email}>{property.uploadedBy.email}</span>
                      ) : (
                        <span className={styles.unknown}>Unknown</span>
                      )}
                    </td>
                    <td className={styles.dateCell}>
                      {formatDate(property.createdAt)}
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setShowConfirmDelete(property.id)}
                        disabled={deleting === property.id}
                        title="Delete this property"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirmDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Delete Property?</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowConfirmDelete(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to permanently delete this property? This action cannot be undone.
              </p>
              <div className={styles.propertyPreview}>
                {(() => {
                  const prop = properties.find(p => p.id === showConfirmDelete);
                  return prop ? (
                    <>
                      <strong>{prop.title || 'Untitled Property'}</strong>
                      <span>{prop.location}</span>
                      <span className={styles.preview}>{formatPrice(prop.price)} • {prop.type}</span>
                    </>
                  ) : null;
                })()}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowConfirmDelete(null)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmDeleteBtn}
                onClick={() => handleDeleteProperty(showConfirmDelete)}
                disabled={deleting === showConfirmDelete}
              >
                {deleting === showConfirmDelete ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
