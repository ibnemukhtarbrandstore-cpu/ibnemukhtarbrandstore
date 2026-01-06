"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ReturnStatusTimeline from "@/components/returns/ReturnStatusTimeline";

/**
 * Single Return Details Page
 * Shows complete information about a specific return request
 * 
 * Route: /myaccount/returns/[returnId]
 */

export default function ReturnDetailsPage({ params }) {
    const [returnData, setReturnData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturnDetails();
    }, []);

    const fetchReturnDetails = async () => {
        try {
            const response = await fetch(`/api/returns/${params.returnId}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setReturnData(data.return);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!returnData) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-gray-600 mb-4">Return request not found</p>
                <Link href="/myaccount/returns" className="text-blue-600 hover:underline">
                    Back to Returns
                </Link>
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-4">
                <Link href="/myaccount/returns" className="text-blue-600 hover:underline">
                    ← Back to Returns
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <h1 className="text-2xl font-bold mb-2">{returnData.returnId}</h1>
                <p className="text-gray-600 mb-6">
                    Order: {returnData.orderId} | Requested on:{" "}
                    {new Date(returnData.createdAt).toLocaleDateString()}
                </p>

                {/* Status Timeline */}
                <div className="border-t pt-6">
                    <ReturnStatusTimeline
                        statusHistory={returnData.statusHistory}
                        currentStatus={returnData.status}
                    />
                </div>

                {/* Return Details */}
                <div className="border-t pt-6 mt-6">
                    <h2 className="font-semibold text-lg mb-4">Return Details</h2>

                    {/* Items */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Items:</h3>
                        <ul className="space-y-2">
                            {returnData.items.map((item, index) => (
                                <li key={index} className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium">{item.productTitle}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.size && `Size: ${item.size}`}
                                        {item.size && item.color && " | "}
                                        {item.color && `Color: ${item.color}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity} × Rs. {item.price}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-1">Reason:</h3>
                        <p className="text-gray-700">
                            {returnData.returnReason.replace(/_/g, " ").toUpperCase()}
                        </p>
                    </div>

                    {/* Comments */}
                    {returnData.customerComments && (
                        <div className="mb-4">
                            <h3 className="font-medium mb-1">Comments:</h3>
                            <p className="text-gray-700">{returnData.customerComments}</p>
                        </div>
                    )}

                    {/* Return Images */}
                    {returnData.returnImages && returnData.returnImages.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Photos:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {returnData.returnImages.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={img}
                                        alt={`Return photo ${index + 1}`}
                                        width={200}
                                        height={200}
                                        className="rounded border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Refund Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Refund Information</h3>
                        <p className="text-lg font-bold text-blue-700">
                            Rs. {returnData.refundAmount}/-
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Method: {returnData.refundMethod.replace(/_/g, " ").toUpperCase()}
                        </p>
                        {returnData.refundedAt && (
                            <p className="text-sm text-green-700 mt-2">
                                Refund processed on:{" "}
                                {new Date(returnData.refundedAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Bank Details (if provided) */}
                    {returnData.bankDetails && returnData.bankDetails.accountNumber && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Bank Details:</h3>
                            <p className="text-sm">
                                <span className="font-medium">Account Title:</span>{" "}
                                {returnData.bankDetails.accountTitle}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Account Number:</span>{" "}
                                {returnData.bankDetails.accountNumber}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Bank:</span>{" "}
                                {returnData.bankDetails.bankName}
                            </p>
                        </div>
                    )}

                    {/* Rejection Reason (if rejected) */}
                    {returnData.status === "rejected" && returnData.rejectionReason && (
                        <div className="mt-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                            <h3 className="font-semibold text-red-800 mb-1">Rejected</h3>
                            <p className="text-sm text-red-700">{returnData.rejectionReason}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
