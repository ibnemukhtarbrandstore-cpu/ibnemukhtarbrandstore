import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/utils/stripeHelpers';
import connectDB from '@/lib/connectDB';
import { Product } from '@/models/Product';

/**
 * POST /api/stripe/create-intent
 * Create Stripe payment intent for checkout
 */
export async function POST(request) {
    try {
        const { orderId, amount, currency = 'usd', items = [] } = await request.json();

        if (!orderId || !amount) {
            return NextResponse.json(
                { success: false, error: 'Order ID and amount are required' },
                { status: 400 }
            );
        }

        // Validate amount
        if (amount <= 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create payment intent
        const result = await createPaymentIntent(amount, currency, {
            orderId: orderId,
            itemCount: items.length,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                clientSecret: result.clientSecret,
                paymentIntentId: result.paymentIntentId,
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to create payment intent' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('❌ Create Payment Intent Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
