import { NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Signature is valid, payment is verified
    // Frontend will handle Firestore update using activateSubscription
    return NextResponse.json({
      success: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
