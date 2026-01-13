import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/utils/stripeHelpers';
import connectDB from '@/lib/connectDB';
import Order from '@/models/Order';

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(request) {
    try {
        const body = await request.text();
        const headersList = headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature provided' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const event = verifyWebhookSignature(body, signature);

        if (!event) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        await connectDB();

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            case 'payment_intent.canceled':
                await handlePaymentCanceled(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent) {
    try {
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
            console.error('No order ID in payment intent metadata');
            return;
        }

        // Update order status
        const order = await Order.findById(orderId);

        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        order.paymentInfo = {
            status: 'paid',
            transactionId: paymentIntent.id,
            paidAt: new Date(),
            paymentMethod: 'stripe',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
        };

        order.orderStatus = 'paid';

        await order.save();

        console.log(`✅ Payment successful for order ${orderId}`);

        // TODO: Trigger auto-fulfillment to CJ Dropshipping
        // This will be implemented in Phase 5
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
    try {
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
            return;
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return;
        }

        order.paymentInfo = {
            status: 'failed',
            transactionId: paymentIntent.id,
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        };

        order.orderStatus = 'payment_failed';

        await order.save();

        console.log(`❌ Payment failed for order ${orderId}`);
    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent) {
    try {
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
            return;
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return;
        }

        order.paymentInfo = {
            status: 'canceled',
            transactionId: paymentIntent.id,
        };

        order.orderStatus = 'canceled';

        await order.save();

        console.log(`🚫 Payment canceled for order ${orderId}`);
    } catch (error) {
        console.error('Error handling payment cancelation:', error);
    }
}
