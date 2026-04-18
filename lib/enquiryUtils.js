import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Submit enquiry
export async function submitEnquiry(enquiryData) {
  try {
    const docRef = await addDoc(collection(db, 'enquiries'), {
      ...enquiryData,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, contacted, closed
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
}

// Get enquiries for a property
export async function getPropertyEnquiries(propertyId) {
  try {
    const q = query(
      collection(db, 'enquiries'),
      where('propertyId', '==', propertyId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting enquiries:', error);
    throw error;
  }
}

// Get enquiries by user
export async function getUserEnquiries(userId) {
  try {
    const q = query(
      collection(db, 'enquiries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user enquiries:', error);
    throw error;
  }
}

// Get all enquiries (admin)
export async function getAllEnquiries() {
  try {
    const q = query(
      collection(db, 'enquiries'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting all enquiries:', error);
    throw error;
  }
}
