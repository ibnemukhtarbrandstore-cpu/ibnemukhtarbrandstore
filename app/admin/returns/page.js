"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

/**
 * Admin Returns Management Dashboard
 * View and manage all return requests
 * Approve/reject returns and process refunds
 * 
 * Route: /admin/returns
 */

export default function AdminReturnsPage() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [processingId, setProcessingId] = useState(null);

    // Status filter options
    const statusFilters = [
        { value: "all", label: "All Returns" },
        { value: "pending", label: "Pending Review" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "items_received", label: "Items Received" },
        { value: "refunded", label: "Refunded" },
        { value: "completed", label: "Completed" },
    ];

    useEffect(() => {
        fetchReturns();
    }, [selectedStatus]);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/returns/all?status=${selectedStatus}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setReturns(data.returns);
            } else {
                toast.error("Failed to load returns");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle status update with action
    const handleStatusAction = async (returnId, action, additionalData = {}) => {
        const confirmMessage =
            action === "approve"
                ? "Approve this return request?"
                : action === "reject"
                    ? "Reject this return request?"
                    : action === "refund"
                        ? "Mark refund as processed?"
                        : "Update status?";

        if (!confirm(confirmMessage)) return;

        setProcessingId(returnId);

        try {
            // URL encode the returnId since it contains # symbol
            const encodedReturnId = encodeURIComponent(returnId);
            const response = await fetch(`/api/returns/${encodedReturnId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    adminEmail: "admin@ibnemukhtarbrandstore.com", // TODO: Get from session
                    ...additionalData,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message);
                fetchReturns(); // Refresh list
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred");
        } finally {
            setProcessingId(null);
        }
    };

    // Handle rejection with reason
    const handleReject = (returnId) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        handleStatusAction(returnId, "reject", { rejectionReason: reason });
    };

    // Status badge color
    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            approved: "bg-blue-100 text-blue-800 border-blue-300",
            rejected: "bg-red-100 text-red-800 border-red-300",
            items_received: "bg-purple-100 text-purple-800 border-purple-300",
            refunded: "bg-green-100 text-green-800 border-green-300",
            completed: "bg-gray-100 text-gray-800 border-gray-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Returns Management</h1>

            {/* Status Filter */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setSelectedStatus(filter.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === filter.value
                                ? "bg-black text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Returns List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            ) : returns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No returns found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((returnItem) => (
                        <div
                            key={returnItem._id}
                            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                        >
                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{returnItem.returnId}</h3>
                                    <p className="text-sm text-gray-600">
                                        Order: {returnItem.orderId}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Customer: {returnItem.customerName} ({returnItem.customerEmail})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Phone: {returnItem.customerPhone}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Requested: {new Date(returnItem.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(
                                        returnItem.status
                                    )}`}
                                >
                                    {returnItem.status.replace(/_/g, " ").toUpperCase()}
                                </span>
                            </div>

                            {/* Return Details */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-medium mb-2">Items:</h4>
                                    <ul className="text-sm space-y-1">
                                        {returnItem.items.map((item, index) => (
                                            <li key={index} className="text-gray-700">
                                                • {item.productTitle} ({item.size}/{item.color}) - Qty:{" "}
                                                {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-sm mb-1">
                                        <span className="font-medium">Reason:</span>{" "}
                                        {returnItem.returnReason.replace(/_/g, " ").toUpperCase()}
                                    </p>
                                    <p className="text-sm mb-1">
                                        <span className="font-medium">Refund Amount:</span> Rs.{" "}
                                        {returnItem.refundAmount}/-
                                    </p>
                                    {returnItem.customerComments && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-medium">Comments:</span>{" "}
                                            {returnItem.customerComments}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Return Images */}
                            {returnItem.returnImages && returnItem.returnImages.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Photos:</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {returnItem.returnImages.map((img, index) => (
                                            <a
                                                key={index}
                                                href={img}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`Return ${index + 1}`}
                                                    width={120}
                                                    height={120}
                                                    className="rounded border hover:opacity-80 transition-opacity cursor-pointer"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bank Details (if provided) */}
                            {returnItem.bankDetails && returnItem.bankDetails.accountNumber && (
                                <div className="bg-gray-50 p-3 rounded mb-4">
                                    <h4 className="font-medium mb-1 text-sm">Bank Details:</h4>
                                    <p className="text-xs">
                                        {returnItem.bankDetails.accountTitle} -{" "}
                                        {returnItem.bankDetails.accountNumber} (
                                        {returnItem.bankDetails.bankName})
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap pt-4 border-t">
                                {returnItem.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleStatusAction(returnItem.returnId, "approve")
                                            }
                                            disabled={processingId === returnItem.returnId}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(returnItem.returnId)}
                                            disabled={processingId === returnItem.returnId}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            ✗ Reject
                                        </button>
                                    </>
                                )}

                                {returnItem.status === "approved" && (
                                    <button
                                        onClick={() =>
                                            handleStatusAction(returnItem.returnId, "items_received")
                                        }
                                        disabled={processingId === returnItem.returnId}
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300"
                                    >
                                        Mark Items Received
                                    </button>
                                )}

                                {returnItem.status === "items_received" && (
                                    <button
                                        onClick={() =>
                                            handleStatusAction(returnItem.returnId, "refund")
                                        }
                                        disabled={processingId === returnItem.returnId}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
                                    >
                                        💰 Process Refund
                                    </button>
                                )}

                                {returnItem.status === "refunded" && (
                                    <button
                                        onClick={() =>
                                            handleStatusAction(returnItem.returnId, "completed")
                                        }
                                        disabled={processingId === returnItem.returnId}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
                                    >
                                        Mark Completed
                                    </button>
                                )}

                                <Link
                                    href={`/admin/returns/${returnItem.returnId}`}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
