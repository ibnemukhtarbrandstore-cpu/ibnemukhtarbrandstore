import { Suspense } from "react";
import ReturnRequestForm from "@/components/returns/ReturnRequestForm";
import { Order } from "@/models/Order";
import { Return } from "@/models/Return";
import connectDb from "@/middleware/mongoose";
import Link from "next/link";

/**
 * Return Request Page
 * Customer creates return request for a specific order
 * 
 * Route: /myaccount/returns/request?orderId=[orderId]
 */

async function getOrderAndReturn(orderId) {
    try {
        await connectDb();
        const order = await Order.findOne({ _id: orderId }).lean();

        if (!order) return { order: null, existingReturn: null };

        // Check if return already exists for this order
        const existingReturn = await Return.findOne({ orderId: order.orderId }).lean();

        // Convert MongoDB _id to string
        return {
            order: JSON.parse(JSON.stringify(order)),
            existingReturn: existingReturn ? JSON.parse(JSON.stringify(existingReturn)) : null
        };
    } catch (error) {
        console.error("Error fetching order:", error);
        return { order: null, existingReturn: null };
    }
}

export default async function ReturnRequestPage({ searchParams }) {
    const { orderId } = await searchParams;

    if (!orderId) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Order ID Required</h2>
                <p className="text-gray-600 mb-6">
                    Please provide an order ID to request a return.
                </p>
                <Link href="/orders" className="text-blue-600 hover:underline">
                    View My Orders →
                </Link>
            </div>
        );
    }

    const { order, existingReturn } = await getOrderAndReturn(orderId);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6">
                    We couldn't find an order with ID: {orderId}
                </p>
                <Link href="/orders" className="text-blue-600 hover:underline">
                    View My Orders →
                </Link>
            </div>
        );
    }

    // Check if return already exists
    if (existingReturn) {
        const getStatusColor = (status) => {
            const colors = {
                pending: "border-yellow-500 bg-yellow-50",
                approved: "border-blue-500 bg-blue-50",
                rejected: "border-red-500 bg-red-50",
                items_received: "border-purple-500 bg-purple-50",
                refunded: "border-green-500 bg-green-50",
                completed: "border-gray-500 bg-gray-50",
            };
            return colors[status] || "border-gray-500 bg-gray-50";
        };

        const getStatusText = (status) => {
            return status.replace(/_/g, " ").toUpperCase();
        };

        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className={`border-l-4 p-6 rounded-lg ${getStatusColor(existingReturn.status)}`}>
                    <h2 className="text-2xl font-bold mb-4">Return Request Already Submitted</h2>

                    <div className="space-y-3 mb-6">
                        <p className="text-gray-700">
                            You have already submitted a return request for this order.
                        </p>

                        <div className="bg-white p-4 rounded border">
                            <p className="text-sm text-gray-600 mb-1">Return ID</p>
                            <p className="text-lg font-bold">{existingReturn.returnId}</p>
                        </div>

                        <div className="bg-white p-4 rounded border">
                            <p className="text-sm text-gray-600 mb-1">Current Status</p>
                            <p className="text-lg font-semibold">{getStatusText(existingReturn.status)}</p>
                        </div>

                        <div className="bg-white p-4 rounded border">
                            <p className="text-sm text-gray-600 mb-1">Requested On</p>
                            <p className="text-base">{new Date(existingReturn.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>

                        {existingReturn.status === 'rejected' && existingReturn.rejectionReason && (
                            <div className="bg-red-50 p-4 rounded border border-red-200">
                                <p className="text-sm text-red-800 font-medium mb-1">Rejection Reason</p>
                                <p className="text-red-700">{existingReturn.rejectionReason}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Link
                            href={`/order/${order._id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View Order Details
                        </Link>
                        <Link
                            href="/orders"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Check if order is eligible for return
    const isEligible = order.status === "paid" &&
        (order.deliveryStatus === "delivered" || order.deliveryStatus === "delivering");

    if (!isEligible) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 text-yellow-800">
                        Return Not Available
                    </h2>
                    <p className="text-yellow-700 mb-4">
                        This order is not eligible for return yet.
                    </p>
                    <div className="space-y-2 text-sm text-yellow-700">
                        <p><strong>Order Status:</strong> {order.status}</p>
                        <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                    </div>
                    <p className="mt-4 text-sm text-yellow-700">
                        You can request a return once your order is delivered.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link
                            href={`/order/${order._id}`}
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            View Order Details
                        </Link>
                        <Link
                            href="/orders"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // TODO: Get actual user email from session
    const userEmail = order.email;

    return (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
            <ReturnRequestForm
                order={order}
                userEmail={userEmail}
            />
        </Suspense>
    );
}
