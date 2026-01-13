'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, Eye } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('orderId');
    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        // Clear cart on success
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
            // Trigger cart update event
            window.dispatchEvent(new Event('cartCleared'));
        }

        // Fetch order details
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/get-order?orderId=${orderId}`);
            const data = await response.json();

            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Icon & Message */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-xl text-gray-600">
                        Thank you for your order. We're processing it now!
                    </p>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Order Confirmation
                            </h2>
                            <p className="text-gray-600">
                                Order ID: <span className="font-mono font-semibold text-gray-900">#{order._id?.slice(-8)}</span>
                            </p>
                            {paymentIntentId && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Transaction ID: {paymentIntentId}
                                </p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Items Ordered ({order.products?.length || 0})
                            </h3>
                            <div className="space-y-3">
                                {order.products?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {order.currency || '$'}{item.price}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="mt-4 pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Paid:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {order.paymentInfo?.currency || '$'}{order.totalPrice || order.paymentInfo?.amount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                                Delivery Information
                            </h3>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">Name:</span> {order.address?.name || order.name}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">Phone:</span> {order.address?.phoneNo || order.phone}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Address:</span> {order.address?.address || order.address}, {order.address?.city}
                            </p>
                            <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200">
                                <p className="text-sm text-blue-900 font-medium">
                                    ⏱️ Estimated Delivery: 5-10 business days
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    You'll receive tracking information via email once your order ships
                                </p>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Order confirmation email sent to your inbox
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Your order is being prepared for shipment
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">→</span>
                                    You'll receive tracking details within 24-48 hours
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">→</span>
                                    Track your order anytime in "My Orders"
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={order ? `/order/${order._id}` : '/orders'}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        <Eye className="w-5 h-5" />
                        View Order Details
                    </Link>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Support */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        Need help? <Link href="/contact-us" className="text-blue-600 hover:underline font-medium">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
