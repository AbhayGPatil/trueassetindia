import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: 999,
    listings: 5,
    validDays: 30,
  },
  pro: {
    name: 'Pro',
    price: 2999,
    listings: 50,
    validDays: 90,
  },
  premium: {
    name: 'Premium',
    price: 9999,
    listings: 'unlimited',
    validDays: 365,
  },
};

// Create subscription in Firestore
export async function createSubscription(userId, plan, razorpayOrderId) {
  try {
    const planDetails = SUBSCRIPTION_PLANS[plan];
    if (!planDetails) {
      throw new Error('Invalid plan');
    }

    const now = new Date();
    const validUntil = new Date(now.getTime() + planDetails.validDays * 24 * 60 * 60 * 1000);

    const docRef = await addDoc(collection(db, 'subscriptions'), {
      userId,
      plan,
      amount: planDetails.price,
      listings: planDetails.listings,
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      razorpayOrderId,
      status: 'pending',
      createdAt: now.toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Get active subscription for user
export async function getActiveSubscription(userId) {
  try {
    const now = new Date().toISOString();
    const q = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      where('validUntil', '>=', now)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

// Activate subscription after payment
export async function activateSubscription(subscriptionId, razorpayPaymentId) {
  try {
    const docRef = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(docRef, {
      status: 'active',
      razorpayPaymentId,
      activatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    throw error;
  }
}

// Get user's subscription history
export async function getUserSubscriptions(userId) {
  try {
    const q = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user subscriptions:', error);
    throw error;
  }
}

// Check if user can add more listings
export async function canAddMoreListings(userId, currentListings) {
  try {
    const subscription = await getActiveSubscription(userId);
    
    if (!subscription) {
      return false;
    }

    if (subscription.listings === 'unlimited') {
      return true;
    }

    return currentListings < subscription.listings;
  } catch (error) {
    console.error('Error checking listing limit:', error);
    return false;
  }
}

// Get subscription plans info
export function getSubscriptionPlans() {
  return Object.entries(SUBSCRIPTION_PLANS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

// Initialize Razorpay payment
export function initializeRazorpayPayment(amount, userId, planId) {
  return {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    description: `TrueAssets ${SUBSCRIPTION_PLANS[planId].name} Plan`,
    prefill: {
      email: '', // Will be filled from user profile
      contact: '', // Will be filled from user profile
    },
    notes: {
      userId,
      planId,
    },
  };
}

// Handle Razorpay success callback
export async function handleRazorpaySuccess(response, subscriptionId) {
  try {
    // Verify payment with backend (recommended)
    // For now, activate subscription
    await activateSubscription(subscriptionId, response.razorpay_payment_id);
    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

export { SUBSCRIPTION_PLANS };
