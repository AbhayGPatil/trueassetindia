import { NextResponse } from 'next/server';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  console.log('🔷 [CREATE-ORDER] Request received');
  
  try {
    // Step 1: Parse request body
    let body;
    try {
      body = await request.json();
      console.log('✅ [CREATE-ORDER] Body parsed:', body);
    } catch (err) {
      console.error('❌ [CREATE-ORDER] Failed to parse body:', err.message);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { amount, planId, userId } = body;

    // Step 2: Validate required fields
    if (!amount) {
      console.error('❌ [CREATE-ORDER] Missing amount');
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }
    if (!planId) {
      console.error('❌ [CREATE-ORDER] Missing planId');
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }
    if (!userId) {
      console.error('❌ [CREATE-ORDER] Missing userId');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('✅ [CREATE-ORDER] All required fields present');

    // Step 3: Check Razorpay credentials
    if (!RAZORPAY_KEY_ID) {
      console.error('❌ [CREATE-ORDER] Missing NEXT_PUBLIC_RAZORPAY_KEY_ID');
      return NextResponse.json(
        { error: 'Razorpay Key ID not configured' },
        { status: 500 }
      );
    }

    if (!RAZORPAY_KEY_SECRET) {
      console.error('❌ [CREATE-ORDER] Missing RAZORPAY_KEY_SECRET');
      return NextResponse.json(
        { error: 'Razorpay Secret not configured' },
        { status: 500 }
      );
    }

    console.log('✅ [CREATE-ORDER] Razorpay credentials found');
    console.log('📋 [CREATE-ORDER] Key ID (masked):', RAZORPAY_KEY_ID.substring(0, 10) + '...');

    // Step 4: Prepare request to Razorpay
    const amountInPaise = Math.round(amount * 100);
    const authString = `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`;
    const authBase64 = Buffer.from(authString).toString('base64');

    // Generate short receipt (max 40 chars - Razorpay requirement)
    // Format: order_XXXXXX_XXXXXXXX (max 40 chars)
    const shortUserId = userId.substring(0, 8);
    const shortTimestamp = Date.now().toString().slice(-8);
    const receipt = `order_${shortUserId}_${shortTimestamp}`;

    console.log('📤 [CREATE-ORDER] Creating Razorpay order:', {
      amountRupees: amount,
      amountPaise: amountInPaise,
      planId,
      userId,
      receipt,
    });

    // Step 5: Call Razorpay API
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authBase64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt,
        notes: {
          planId,
          userId,
        },
      }),
    });

    console.log('📥 [CREATE-ORDER] Razorpay response status:', razorpayResponse.status);

    const orderData = await razorpayResponse.json();
    console.log('📥 [CREATE-ORDER] Razorpay response body:', orderData);

    // Step 6: Check if request was successful
    if (!razorpayResponse.ok) {
      console.error('❌ [CREATE-ORDER] Razorpay API failed:', {
        status: razorpayResponse.status,
        statusText: razorpayResponse.statusText,
        error: orderData,
      });

      const errorMessage = orderData?.error?.description || orderData?.message || 'Failed to create order';
      return NextResponse.json(
        { error: errorMessage },
        { status: razorpayResponse.status }
      );
    }

    // Step 7: Success - return order details
    console.log('✅ [CREATE-ORDER] Order created successfully:', {
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });

    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });

  } catch (error) {
    console.error('❌ [CREATE-ORDER] Catch block error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { 
        error: error.message || 'Failed to create order',
        details: error.cause
      },
      { status: 500 }
    );
  }
}
