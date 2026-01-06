import Link from "next/link";
import { Order } from "@/models/Order";
import connectDb from "@/middleware/mongoose";

/**
 * All Active Orders Tracking Page
 * Shows all orders that are NOT delivered yet
 * 
 * Route: /order/track
 * Smart feature: Customer can see all their pending orders in one place!
 */

async function getAllActiveOrders() {
    try {
        await connectDb();

        // Get all orders that are NOT delivered
        const orders = await Order.find({
            deliveryStatus: { $ne: "delivered" } // ne = not equal
        })
            .sort({ createdAt: -1 }) // Newest first
            .limit(50) // Limit to 50 orders
            .lean();

        if (!orders || orders.length === 0) return [];

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error("Error fetching active orders:", error);
        return [];
    }
}

export const metadata = {
    title: "Track Your Orders | Ibnemukhtar Brand Store",
    description: "Track all your active orders and delivery status",
};

export default async function TrackAllOrdersPage() {
    const orders = await getAllActiveOrders();

    // Status badge colors
    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            paid: "bg-green-100 text-green-800 border-green-300",
            shipped: "bg-blue-100 text-blue-800 border-blue-300",
            delivering: "bg-purple-100 text-purple-800 border-purple-300",
            unshifted: "bg-gray-100 text-gray-800 border-gray-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 md:pt-6 pb-20">
                <div className="text-center max-w-md">
                    <div className="text-4xl md:text-6xl mb-4">📦</div>
                    <h1 className="text-xl md:text-2xl font-bold mb-3">No Active Orders</h1>
                    <p className="text-sm md:text-base text-gray-600 mb-6">
                        You don't have any orders in transit right now.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/orders"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                        >
                            View All Orders
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm md:text-base"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-20 max-w-5xl pb-20 md:pb-12">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Track Your Orders</h1>
                <p className="text-sm md:text-base text-gray-600">
                    {orders.length} active order{orders.length > 1 ? 's' : ''} in transit
                </p>
            </div>

            {/* Orders Grid */}
            <div className="space-y-3 md:space-y-4">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                    >
                        <div className="p-4 md:p-6">
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold">{order.orderId}</h3>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Placed: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span
                                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                    <span
                                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(
                                            order.deliveryStatus
                                        )}`}
                                    >
                                        {order.deliveryStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Order Info Grid - Mobile Optimized */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-600">Customer</p>
                                    <p className="font-medium text-sm md:text-base truncate">{order.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Amount</p>
                                    <p className="font-medium text-sm md:text-base text-green-700">Rs. {order.amount}/-</p>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-xs text-gray-600">Location</p>
                                    <p className="font-medium text-sm md:text-base">{order.city}</p>
                                </div>
                            </div>

                            {/* Tracking Number (if available) */}
                            {order.trackingNumber && (
                                <div className="bg-blue-50 p-3 rounded-lg mb-3 md:mb-4">
                                    <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                                    <p className="font-mono font-bold text-sm md:text-base text-blue-700 break-all">
                                        {order.trackingNumber}
                                    </p>
                                    {order.courierService && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Courier: {order.courierService}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Estimated Delivery */}
                            {order.estimatedDelivery && (
                                <div className="bg-green-50 p-3 rounded-lg mb-3 md:mb-4">
                                    <p className="text-xs text-gray-600">Estimated Delivery</p>
                                    <p className="font-medium text-sm md:text-base text-green-700">
                                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons - Mobile Stack */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                <Link
                                    href={`/order/track/${order._id}`}
                                    className="flex-1 px-4 py-2.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-sm md:text-base font-medium"
                                >
                                    📍 View Timeline
                                </Link>
                                <Link
                                    href={`/order/${order._id}`}
                                    className="flex-1 px-4 py-2.5 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center text-sm md:text-base font-medium"
                                >
                                    📄 Order Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info - Mobile Optimized */}
            <div className="mt-6 md:mt-8 bg-blue-50 rounded-lg p-4 md:p-6">
                <h3 className="font-bold mb-2 text-sm md:text-base">Need Help?</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3">
                    If you have questions about your order or delivery, contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <Link
                        href="/contact-us"
                        className="text-blue-600 hover:underline text-xs md:text-sm"
                    >
                        📧 Contact Support
                    </Link>
                    <Link
                        href="/shiping-policy"
                        className="text-blue-600 hover:underline text-xs md:text-sm"
                    >
                        🚚 Shipping Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
