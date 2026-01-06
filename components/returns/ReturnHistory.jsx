"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

/**
 * ReturnHistory Component  
 * Shows customer's return request history
 * Displays status and tracking information
 */

export default function ReturnHistory({ userEmail }) {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch customer's returns on mount
    useEffect(() => {
        if (userEmail) {
            fetchReturns();
        }
    }, [userEmail]);

    const fetchReturns = async () => {
        try {
            const response = await fetch(`/api/returns/customer/${userEmail}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setReturns(data.returns);
            } else {
                toast.error("Failed to load return history");
            }
        } catch (error) {
            console.error("Fetch returns error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Status color mapping
    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-blue-100 text-blue-800",
            rejected: "bg-red-100 text-red-800",
            items_received: "bg-purple-100 text-purple-800",
            refunded: "bg-green-100 text-green-800",
            completed: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    // Format status text
    const formatStatus = (status) => {
        return status.replace(/_/g, " ").toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (returns.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No return requests found</p>
                <Link
                    href="/orders"
                    className="text-blue-600 hover:underline"
                >
                    View Your Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Return History</h2>

            {returns.map((returnItem) => (
                <div
                    key={returnItem._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                    {/* Return Header */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-semibold text-lg">{returnItem.returnId}</h3>
                            <p className="text-sm text-gray-600">
                                Order: {returnItem.orderId}
                            </p>
                            <p className="text-xs text-gray-500">
                                Requested: {new Date(returnItem.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                returnItem.status
                            )}`}
                        >
                            {formatStatus(returnItem.status)}
                        </span>
                    </div>

                    {/* Return Items */}
                    <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Items:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            {returnItem.items.map((item, index) => (
                                <li key={index}>
                                    • {item.productTitle} ({item.size}/{item.color}) - Qty:{" "}
                                    {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reason */}
                    <p className="text-sm mb-2">
                        <span className="font-medium">Reason:</span>{" "}
                        {formatStatus(returnItem.returnReason)}
                    </p>

                    {/* Refund Amount */}
                    <p className="text-sm mb-3">
                        <span className="font-medium">Refund Amount:</span> Rs.{" "}
                        {returnItem.refundAmount}/-
                    </p>

                    {/* Rejection Reason (if rejected) */}
                    {returnItem.status === "rejected" && returnItem.rejectionReason && (
                        <div className="bg-red-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {returnItem.rejectionReason}
                            </p>
                        </div>
                    )}

                    {/* Refund Status (if refunded) */}
                    {returnItem.status === "refunded" && (
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-green-800">
                                <strong>Refund Processed:</strong>{" "}
                                {new Date(returnItem.refundedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                Allow 3-5 business days for amount to reflect
                            </p>
                        </div>
                    )}

                    {/* View Details Link */}
                    <Link
                        href={`/myaccount/returns/${returnItem.returnId}`}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        View Details →
                    </Link>
                </div>
            ))}
        </div>
    );
}
