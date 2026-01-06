import Link from "next/link";
import { Order } from "@/models/Order";
import connectDb from "@/middleware/mongoose";

/**
 * Order Tracking Page (Server Component)
 * Customer can track their order status and delivery
 * 
 * Route: /order/track/[orderId]
 * Next.js 15+ compatible with async params
 */

async function getOrder(orderId) {
    try {
        await connectDb();
        const order = await Order.findOne({ _id: orderId }).lean();

        if (!order) return null;

        // Convert to plain object
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export default async function OrderTrackingPage({ params }) {
    // Await params (Next.js 15+ requirement)
    const { orderId } = await params;

    const order = await getOrder(orderId);
    console.log("==========================================")
    console.log(`order ${order}`)
    console.log("==========================================")

    // Timeline steps based on order status
    const getTrackingSteps = () => {
        const steps = [
            { key: "placed", label: "Order Placed", icon: "📝" },
            { key: "paid", label: "Payment Confirmed", icon: "✅" },
            { key: "shipped", label: "Shipped", icon: "📦" },
            { key: "in-transit", label: "In Transit", icon: "🚚" },
            { key: "delivered", label: "Delivered", icon: "🏠" },
        ];

        const statusMap = {
            pending: 0,
            paid: 1,
            shipped: 2,
            delivering: 3,
            delivered: 4,
        };

        const currentStepIndex = order?.deliveryStatus
            ? statusMap[order.deliveryStatus] || 0
            : 0;

        return { steps, currentStepIndex };
    };

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
                    <Link href="/orders" className="text-blue-600 hover:underline">
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    const { steps, currentStepIndex } = getTrackingSteps();

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-6 md:mt-6">
                <Link href="/orders" className="text-blue-600 hover:underline">
                    ← Back to Orders
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
                <p className="text-gray-600">Order ID: {order.orderId}</p>
                <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Delivery Status</h2>

                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200">
                        <div
                            className="bg-green-500 transition-all duration-500"
                            style={{
                                height: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                            }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.key} className="relative flex items-center gap-4">
                                    {/* Icon Circle */}
                                    <div
                                        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl
                      ${isCompleted
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-400"
                                            }
                      ${isCurrent ? "ring-4 ring-green-200" : ""}
                    `}
                                    >
                                        {step.icon}
                                    </div>

                                    {/* Step Info */}
                                    <div className="flex-1">
                                        <h3 className={`font-bold ${isCompleted ? "text-black" : "text-gray-400"}`}>
                                            {step.label}
                                        </h3>
                                        {isCurrent && (
                                            <p className="text-sm text-green-600 font-medium">Current Status</p>
                                        )}
                                    </div>

                                    {/* Checkmark */}
                                    {isCompleted && !isCurrent && (
                                        <div className="text-green-500 text-2xl">✓</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
                <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4">Tracking Information</h2>

                    <div className="space-y-3">
                        <div>
                            <span className="font-medium">Courier:</span> {order.courierService}
                        </div>
                        <div>
                            <span className="font-medium">Tracking Number:</span>{" "}
                            <span className="font-mono text-lg">{order.trackingNumber}</span>
                        </div>
                        {order.estimatedDelivery && (
                            <div>
                                <span className="font-medium">Estimated Delivery:</span>{" "}
                                {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </div>
                        )}
                        {order.shippedAt && (
                            <div>
                                <span className="font-medium">Shipped On:</span>{" "}
                                {new Date(order.shippedAt).toLocaleDateString()}
                            </div>
                        )}
                        {order.deliveryNotes && (
                            <div className="bg-yellow-50 p-3 rounded mt-3">
                                <span className="font-medium">Note:</span> {order.deliveryNotes}
                            </div>
                        )}
                    </div>

                    {/* External Tracking Link */}
                    {order.trackingUrl && (
                        <div className="mt-4">
                            <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Track on {order.courierService} Website →
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Order Total:</span>
                        <span className="font-bold">Rs. {order.amount}/-</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <span className={`font-medium ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Address:</span>
                        <span className="text-right">{order.address}, {order.city}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <Link
                        href={`/order/${order._id}`}
                        className="text-blue-600 hover:underline"
                    >
                        View Full Order Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
