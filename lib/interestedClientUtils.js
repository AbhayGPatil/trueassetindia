'use client';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Mark property as interested by visitor
 * @param {string} propertyId - Property ID
 * @param {string} visitorId - Visitor/User ID
 * @param {Object} visitorData - {name, phone, email}
 * @param {string} ownerId - Property owner's ID
 * @returns {Object} {success: boolean, interestedId: string}
 */
export async function markAsInterested(propertyId, visitorId, visitorData, ownerId) {
  try {
    // Check if already interested
    const existingQuery = query(
      collection(db, 'interestedVisitors'),
      where('propertyId', '==', propertyId),
      where('visitorId', '==', visitorId)
    );

    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      return {
        success: false,
        message: 'You have already marked this property as interested',
        alreadyInterested: true,
      };
    }

    // Add new interested record
    const interestedDoc = await addDoc(collection(db, 'interestedVisitors'), {
      propertyId,
      visitorId,
      visitorName: visitorData.name || 'Anonymous',
      visitorPhone: visitorData.phone || '',
      visitorEmail: visitorData.email || '',
      ownerId,
      interestedDate: serverTimestamp(),
      status: 'new', // new | contacted | closed
      notes: '',
    });

    // Increment interested count in property
    await updateDoc(doc(db, 'properties', propertyId), {
      interestedCount: increment(1),
    });

    return {
      success: true,
      interestedId: interestedDoc.id,
      message: 'Marked as interested successfully',
    };
  } catch (error) {
    console.error('Error marking as interested:', error);
    return {
      success: false,
      message: 'Error marking as interested',
      error,
    };
  }
}

/**
 * Get all interested visitors for a property
 * @param {string} propertyId - Property ID
 * @returns {Array}
 */
export async function getPropertyInterestedVisitors(propertyId) {
  try {
    const interestedQuery = query(
      collection(db, 'interestedVisitors'),
      where('propertyId', '==', propertyId)
    );

    const snapshot = await getDocs(interestedQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      interestedDate: doc.data().interestedDate?.toDate?.() || null,
    }));
  } catch (error) {
    console.error('Error fetching interested visitors:', error);
    return [];
  }
}

/**
 * Get all interested visitors for a broker's properties
 * @param {string} brokerId - Broker ID
 * @returns {Array}
 */
export async function getBrokerInterestedClients(brokerId) {
  try {
    const interestedQuery = query(
      collection(db, 'interestedVisitors'),
      where('ownerId', '==', brokerId)
    );

    const snapshot = await getDocs(interestedQuery);
    const clients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      interestedDate: doc.data().interestedDate?.toDate?.() || null,
    }));

    return clients;
  } catch (error) {
    console.error('Error fetching broker interested clients:', error);
    return [];
  }
}

/**
 * Get interested record by ID
 * @param {string} interestedId - Interested record ID
 * @returns {Object}
 */
export async function getInterestedRecord(interestedId) {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'interestedVisitors'),
        where('__name__', '==', interestedId)
      )
    );

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
      interestedDate: snapshot.docs[0].data().interestedDate?.toDate?.() || null,
    };
  } catch (error) {
    console.error('Error fetching interested record:', error);
    return null;
  }
}

/**
 * Update interested client status
 * @param {string} interestedId - Interested record ID
 * @param {string} status - new | contacted | closed
 * @param {string} notes - Optional notes
 */
export async function updateInterestedStatus(interestedId, status, notes = '') {
  try {
    await updateDoc(doc(db, 'interestedVisitors', interestedId), {
      status,
      notes,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating interested status:', error);
    return { success: false, error };
  }
}

/**
 * Remove interested mark
 * @param {string} interestedId - Interested record ID
 * @param {string} propertyId - Property ID
 */
export async function removeInterested(interestedId, propertyId) {
  try {
    await deleteDoc(doc(db, 'interestedVisitors', interestedId));

    // Decrement interested count
    await updateDoc(doc(db, 'properties', propertyId), {
      interestedCount: increment(-1),
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing interested mark:', error);
    return { success: false, error };
  }
}

/**
 * Check if logged-in user is interested in a property
 * @param {string} propertyId - Property ID
 * @param {string} visitorId - Visitor/User ID
 * @returns {boolean}
 */
export async function isUserInterested(propertyId, visitorId) {
  try {
    const interestedQuery = query(
      collection(db, 'interestedVisitors'),
      where('propertyId', '==', propertyId),
      where('visitorId', '==', visitorId)
    );

    const snapshot = await getDocs(interestedQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking interested status:', error);
    return false;
  }
}

/**
 * Export interested clients to Excel format
 * @param {Array} clients - Array of interested client objects
 * @param {string} filename - Output filename
 */
export function exportInterestedToExcel(clients, filename = 'interested_clients.xlsx') {
  try {
    // Create CSV content
    const headers = ['Name', 'Phone', 'Email', 'Property ID', 'Interested Date', 'Status', 'Notes'];
    const rows = clients.map((client) => [
      client.visitorName || '',
      client.visitorPhone || '',
      client.visitorEmail || '',
      client.propertyId || '',
      client.interestedDate ? new Date(client.interestedDate).toLocaleDateString() : '',
      client.status || 'new',
      client.notes || '',
    ]);

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, error };
  }
}

/**
 * Get interested count for a property
 * @param {string} propertyId - Property ID
 * @returns {number}
 */
export async function getInterestedCount(propertyId) {
  try {
    const interestedQuery = query(
      collection(db, 'interestedVisitors'),
      where('propertyId', '==', propertyId)
    );

    const snapshot = await getDocs(interestedQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting interested count:', error);
    return 0;
  }
}

/**
 * Get broker response rate
 * @param {string} brokerId - Broker ID
 * @returns {Object} {total, responded, responseRate}
 */
export async function getBrokerResponseRate(brokerId) {
  try {
    const interestedQuery = query(
      collection(db, 'interestedVisitors'),
      where('ownerId', '==', brokerId)
    );

    const snapshot = await getDocs(interestedQuery);
    const clients = snapshot.docs.map((doc) => doc.data());

    const total = clients.length;
    const responded = clients.filter((c) => c.status === 'contacted' || c.status === 'closed')
      .length;
    const responseRate = total > 0 ? ((responded / total) * 100).toFixed(2) : 0;

    return {
      total,
      responded,
      responseRate: `${responseRate}%`,
      notResponded: total - responded,
    };
  } catch (error) {
    console.error('Error calculating response rate:', error);
    return {
      total: 0,
      responded: 0,
      responseRate: '0%',
      notResponded: 0,
    };
  }
}
