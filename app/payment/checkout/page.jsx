'use client';

import { Suspense, useContext, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import styles from './checkout.module.css';

const PLANS_MAP = {
  prolister: { name: 'ProLister', amount: 1500, duration: 90 },
  rentmaster: { name: 'RentMaster', amount: 500, duration: 30 },
  dealmaker: { name: 'DealMaker', amount: 1510, duration: 90 },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userProfile: profile, refreshUserProfile } = useContext(AuthContext);
  const rawPlanId = searchParams.get('plan');
  const planId = rawPlanId?.toLowerCase(); // Ensure lowercase
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = PLANS_MAP[planId];

  // Log for debugging
  useEffect(() => {
    console.log('🔵 [CHECKOUT-CONTENT] Component mounted', {
      rawPlanId,
      planId,
      plan,
      availablePlans: Object.keys(PLANS_MAP),
      user: user?.uid,
      profile: profile?.name,
    });
  }, [rawPlanId, planId, plan, user, profile]);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    console.log('🔵 [CHECKOUT] Payment initiated', { planId, plan });

    // Validate plan exists
    if (!plan) {
      const errorMsg = `Plan not found: ${planId}`;
      console.error('❌ [CHECKOUT] ' + errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    if (!user?.uid) {
      const errorMsg = 'User not authenticated';
      console.error('❌ [CHECKOUT] ' + errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      // Validate all required data
      const paymentData = {
        amount: plan.amount,
        planId: planId,
        userId: user.uid,
      };

      console.log('📝 [CHECKOUT] Sending payment data:', paymentData);

      if (!paymentData.amount || !paymentData.planId || !paymentData.userId) {
        throw new Error('Missing required payment data: ' + JSON.stringify(paymentData));
      }

      // Create order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      console.log('📥 [CHECKOUT] API response status:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('❌ [CHECKOUT] API error response:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId, currency } = await orderResponse.json();
      console.log('✅ [CHECKOUT] Order created:', { orderId, currency });

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderId,
          currency: currency,
          amount: plan.amount * 100,
          name: 'TrueAssets',
          description: `${plan.name} Plan`,
          prefill: {
            name: profile?.name,
            email: profile?.email,
            contact: profile?.phone,
          },
          handler: async (response) => {
            try {
              console.log('✅ [CHECKOUT] Payment successful, verifying...');
              
              const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: user.uid,
                  planId: planId,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              const verifyData = await verifyResponse.json();
              if (verifyData.success) {
                console.log('✅ [CHECKOUT] Payment verified, activating subscription...');
                
                // Call utility function to activate subscription
                const { activateSubscription } = await import('@/lib/uploadLimitUtils');
                await activateSubscription(
                  user.uid,
                  planId,
                  plan.duration,
                  response.razorpay_order_id,
                  response.razorpay_payment_id
                );
                
                console.log('✅ [CHECKOUT] Subscription activated, refreshing profile...');
                
                // Refresh user profile to show updated subscription
                await refreshUserProfile(user.uid);
                
                // Redirect to appropriate dashboard based on user role
                const userRole = profile?.role || 'owner';
                const dashboardPath = userRole === 'broker' ? '/dashboard/broker' : '/dashboard/owner';
                
                console.log('✅ [CHECKOUT] Payment complete, redirecting to', dashboardPath);
                router.push(`${dashboardPath}?status=success`);
              }
            } catch (err) {
              console.error('❌ [CHECKOUT] Payment handler error:', err);
              setError('Payment verification failed: ' + err.message);
              setLoading(false);
            }
          },
          theme: {
            color: '#0066FF',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (err) {
      console.error('❌ [CHECKOUT] Error in handlePayment:', {
        message: err.message,
        error: err,
      });
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Invalid plan selected</p>
          <button onClick={() => router.push('/subscription')} className={styles.button}>
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Order Summary</h1>

        <div className={styles.summary}>
          <div className={styles.row}>
            <span>Plan Name</span>
            <span className={styles.bold}>{plan.name}</span>
          </div>
          <div className={styles.row}>
            <span>Duration</span>
            <span className={styles.bold}>{plan.duration} days</span>
          </div>
          <div className={styles.row}>
            <span>Amount</span>
            <span className={styles.bold}>₹{plan.amount}</span>
          </div>
          <div className={styles.row}>
            <span>Tax</span>
            <span className={styles.bold}>Included</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.row} style={{ fontSize: '18px', fontWeight: '600' }}>
            <span>Total</span>
            <span style={{ color: '#0066FF' }}>₹{plan.amount}</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Processing...' : `Pay ₹${plan.amount} with Razorpay`}
        </button>

        <p className={styles.note}>
          💡 Test Card: 4111111111111111 | Expiry: 12/25 | CVV: 123
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
