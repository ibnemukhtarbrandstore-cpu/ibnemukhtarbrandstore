'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const error = searchParams.get('error');
    const orderId = searchParams.get('orderId');

    const errorMessages = {
        'card_declined': 'Your card was declined. Please try a different card.',
        'insufficient_funds': 'Insufficient funds. Please try a different payment method.',
        'expired_card': 'Your card has expired. Please use a different card.',
        'incorrect_cvc': 'Incorrect CVC code. Please check and try again.',
        'processing_error': 'Payment processing error. Please try again.',
        'default': 'Payment was unsuccessful. Please try again or use a different payment method.',
    };

    const displayError = errorMessages[error] || errorMessages.default;

    const handleRetry = () => {
        if (orderId) {
            router.push(`/checkout?retry=${orderId}`);
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Error Icon & Message */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-xl text-gray-600">
                        We couldn't process your payment
                    </p>
                </div>

                {/* Error Details Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    {/* Error Message */}
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">
                                    Transaction Error
                                </h3>
                                <p className="text-red-800 text-sm">
                                    {displayError}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    {orderId && (
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <p className="text-gray-600">
                                Order ID: <span className="font-mono font-semibold text-gray-900">#{orderId.slice(-8)}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Don't worry, your order is saved. You can try paying again.
                            </p>
                        </div>
                    )}

                    {/* What to try */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">What you can try:</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Check your card details and try again
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Try a different payment method or card
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Ensure you have sufficient funds
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Contact your bank if the problem persists
                            </li>
                        </ul>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-blue-800 mb-3">
                            If you continue to experience issues, our support team is here to help.
                        </p>
                        <Link
                            href="/contact-us"
                            className="text-sm text-blue-600 hover:underline font-medium"
                        >
                            Contact Support →
                        </Link>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleRetry}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        Your cart items are still saved. You can continue shopping or try payment again.
                    </p>
                </div>
            </div>
        </div>
    );
}
