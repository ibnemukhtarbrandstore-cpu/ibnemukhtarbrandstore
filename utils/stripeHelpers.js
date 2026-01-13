/**
 * Stripe Helper Functions
 * Utility functions for Stripe payment integration
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * Create payment intent for checkout
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (lowercase)
 * @param {object} metadata - Additional data
 * @returns {Promise<object>} - Payment intent
 */
export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: metadata,
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    } catch (error) {
        console.error('❌ Stripe Payment Intent Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Retrieve payment intent details
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<object>} - Payment intent details
 */
export async function retrievePaymentIntent(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            success: true,
            paymentIntent,
        };
    } catch (error) {
        console.error('❌ Stripe Retrieve Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Confirm payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<object>} - Confirmation result
 */
export async function confirmPaymentIntent(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
        return {
            success: true,
            status: paymentIntent.status,
            paymentIntent,
        };
    } catch (error) {
        console.error('❌ Stripe Confirm Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Verify webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {object|null} - Event object or null
 */
export function verifyWebhookSignature(payload, signature) {
    try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('❌ Stripe webhook secret not configured');
            return null;
        }

        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        return event;
    } catch (error) {
        console.error('❌ Webhook Verification Error:', error.message);
        return null;
    }
}

/**
 * Get supported currencies for Stripe
 * @returns {array} - List of supported currencies
 */
export function getSupportedStripeCurrencies() {
    return [
        'usd', 'pkr', 'aed', 'gbp', 'eur', 'cad', 'aud',
        'inr', 'sar', 'qar', 'kwd', 'omr', 'bhd'
    ];
}

/**
 * Format amount for Stripe (convert to cents)
 * @param {number} amount - Amount in dollars
 * @param {string} currency - Currency code
 * @returns {number} - Amount in cents
 */
export function formatAmountForStripe(amount, currency = 'usd') {
    // Some currencies don't use decimal units
    const zeroDecimalCurrencies = ['jpy', 'krw', 'bif', 'clp', 'djf', 'gnf', 'idr', 'jpy', 'kmf', 'krw'];

    if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
        return Math.round(amount);
    }

    return Math.round(amount * 100);
}

/**
 * Calculate Stripe fee
 * @param {number} amount - Amount
 * @param {string} currency - Currency
 * @returns {number} - Estimated fee
 */
export function calculateStripeFee(amount, currency = 'usd') {
    // Stripe fee: 2.9% + $0.30 (varies by country)
    const percentageFee = amount * 0.029;
    const fixedFee = 0.30;
    return percentageFee + fixedFee;
}

export default {
    createPaymentIntent,
    retrievePaymentIntent,
    confirmPaymentIntent,
    verifyWebhookSignature,
    getSupportedStripeCurrencies,
    formatAmountForStripe,
    calculateStripeFee,
};
