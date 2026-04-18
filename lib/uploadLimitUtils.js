'use client';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Check if user can upload more properties
 * @param {string} userId - User ID
 * @param {string} propertyType - Type of property ('rent' or other)
 * @returns {Object} {canUpload: boolean, reason: string, freeUploads: number, maxFreeUploads: number}
 */
export async function canUploadProperty(userId, propertyType = 'sale') {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { canUpload: false, reason: 'User not found' };
    }

    const user = userDoc.data();
    const role = user.role || 'buyer';

    // Buyers cannot upload
    if (role === 'buyer' || role === 'visitor') {
      return {
        canUpload: false,
        reason: 'Only owners and brokers can upload properties',
        freeUploads: 0,
      };
    }

    // Check if user has active paid subscription
    if (user.subscription?.status === 'active') {
      return {
        canUpload: true,
        reason: 'Active subscription',
        subscription: user.subscription,
      };
    }

    // Check free uploads for owners wanting to upload rent properties
    if (role === 'owner' && propertyType === 'rent') {
      if (user.rentSubscription?.status === 'active') {
        return {
          canUpload: true,
          reason: 'Active rent subscription',
          subscription: user.rentSubscription,
        };
      }

      // Check free rent uploads (none for free tier)
      return {
        canUpload: false,
        reason: 'Rent properties require RentMaster subscription',
        rentUploadsUsed: user.rentSubscription?.rentPropertiesUploaded || 0,
        maxRentUploads: user.rentSubscription?.maxAllowed || 0,
      };
    }

    // Check free uploads by role
    const freeUploadsUsed = user.freeUploadsUsed || 0;
    const maxFreeUploads = user.maxFreeUploads || (role === 'broker' ? 3 : 2);

    if (freeUploadsUsed < maxFreeUploads) {
      return {
        canUpload: true,
        reason: 'Free tier',
        freeUploads: freeUploadsUsed,
        maxFreeUploads: maxFreeUploads,
        remaining: maxFreeUploads - freeUploadsUsed,
      };
    }

    // Out of free uploads
    return {
      canUpload: false,
      reason: `Free uploads exhausted (${freeUploadsUsed}/${maxFreeUploads})`,
      freeUploads: freeUploadsUsed,
      maxFreeUploads: maxFreeUploads,
      subscription: user.subscription,
    };
  } catch (error) {
    console.error('Error checking upload limit:', error);
    return { canUpload: false, reason: 'Error checking limits', error };
  }
}

/**
 * Increment free uploads count
 * @param {string} userId - User ID
 */
export async function incrementFreeUploads(userId) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      freeUploadsUsed: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing upload count:', error);
    throw error;
  }
}

/**
 * Increment rent property upload count
 * @param {string} userId - User ID
 */
export async function incrementRentUploads(userId) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      'rentSubscription.rentPropertiesUploaded': increment(1),
    });
  } catch (error) {
    console.error('Error incrementing rent upload count:', error);
    throw error;
  }
}

/**
 * Activate subscription
 * @param {string} userId - User ID
 * @param {string} plan - Plan name (proLister, dealMaker, rentMaster, buyerPlus)
 * @param {number} durationDays - Subscription duration in days
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 */
export async function activateSubscription(
  userId,
  plan,
  durationDays = 90,
  razorpayOrderId,
  razorpayPaymentId
) {
  try {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const isRentPlan = plan === 'rentMaster';
    const subscriptionData = isRentPlan
      ? {
          'rentSubscription.plan': plan,
          'rentSubscription.startDate': startDate.toISOString(),
          'rentSubscription.endDate': endDate.toISOString(),
          'rentSubscription.status': 'active',
          'rentSubscription.maxAllowed': 5,
          'rentSubscription.razorpayOrderId': razorpayOrderId,
          'rentSubscription.razorpayPaymentId': razorpayPaymentId,
        }
      : {
          'subscription.plan': plan,
          'subscription.startDate': startDate.toISOString(),
          'subscription.endDate': endDate.toISOString(),
          'subscription.status': 'active',
          'subscription.maxAllowed':
            plan === 'dealMaker' ? 999 : plan === 'proLister' ? 999 : 1,
          'subscription.razorpayOrderId': razorpayOrderId,
          'subscription.razorpayPaymentId': razorpayPaymentId,
        };

    await updateDoc(doc(db, 'users', userId), subscriptionData);

    return { success: true, plan, endDate };
  } catch (error) {
    console.error('Error activating subscription:', error);
    throw error;
  }
}

/**
 * Check if subscription is expired
 * @param {string} userId - User ID
 * @returns {boolean}
 */
export async function isSubscriptionExpired(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;

    const user = userDoc.data();
    const subscription = user.subscription;

    if (subscription?.status !== 'active' || !subscription.endDate) {
      return false;
    }

    const endDate = new Date(subscription.endDate);
    return endDate < new Date();
  } catch (error) {
    console.error('Error checking subscription expiry:', error);
    return false;
  }
}

/**
 * Get subscription details
 * @param {string} userId - User ID
 * @returns {Object}
 */
export async function getSubscriptionDetails(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const user = userDoc.data();
    return {
      subscription: user.subscription,
      rentSubscription: user.rentSubscription,
      freeUploads: {
        used: user.freeUploadsUsed || 0,
        max: user.maxFreeUploads || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
}

/**
 * Get max upload limit for user
 * @param {string} userId - User ID
 * @returns {number}
 */
export async function getMaxUploadLimit(userId) {
  try {
    const details = await getSubscriptionDetails(userId);
    if (!details) return 0;

    if (details.subscription?.status === 'active') {
      return 999; // Unlimited for paid subscribers
    }

    return details.freeUploads.max;
  } catch (error) {
    console.error('Error getting max upload limit:', error);
    return 0;
  }
}
