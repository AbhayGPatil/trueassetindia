import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Add a new property
export async function addProperty(propertyData) {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...propertyData,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending approval
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

// Get property by ID
export async function getProperty(propertyId) {
  try {
    const docRef = doc(db, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
}

// Get all approved properties with pagination
export async function getApprovedProperties(pageSize = 20, lastDoc = null) {
  try {
    let q;
    if (lastDoc) {
      q = query(
        collection(db, 'properties'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, 'properties'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { properties, lastVisible };
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
}

// Get properties by owner
export async function getPropertiesByOwner(ownerId) {
  try {
    const q = query(
      collection(db, 'properties'),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting owner properties:', error);
    throw error;
  }
}

// Search properties with filters
export async function searchProperties(filters = {}, pageSize = 20, lastDoc = null) {
  try {
    let constraints = [where('status', '==', 'approved')];

    if (filters.city) {
      constraints.push(where('city', '==', filters.city));
    }
    if (filters.propertyType) {
      constraints.push(where('propertyType', '==', filters.propertyType));
    }
    if (filters.assetType) {
      constraints.push(where('assetType', '==', filters.assetType));
    }
    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        constraints.push(where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice) {
        constraints.push(where('price', '<=', filters.maxPrice));
      }
    }

    let q;
    if (lastDoc) {
      q = query(
        collection(db, 'properties'),
        ...constraints,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, 'properties'),
        ...constraints,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { properties, lastVisible };
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

// Update property
export async function updateProperty(propertyId, updates) {
  try {
    const docRef = doc(db, 'properties', propertyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

// Delete property
export async function deleteProperty(propertyId) {
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

// Approve property (admin only)
export async function approveProperty(propertyId) {
  try {
    await updateProperty(propertyId, { status: 'approved' });
  } catch (error) {
    console.error('Error approving property:', error);
    throw error;
  }
}

// Reject property (admin only)
export async function rejectProperty(propertyId, reason = '') {
  try {
    await updateProperty(propertyId, { status: 'rejected', rejectionReason: reason });
  } catch (error) {
    console.error('Error rejecting property:', error);
    throw error;
  }
}
