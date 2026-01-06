"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ReturnsTab = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Get user email from token
            const userRes = await fetch(`/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            if (!userRes.ok) return;

            const userData = await userRes.json();
            const userEmail = userData.user.email;

            // Fetch returns for this user
            const response = await fetch(`/api/returns/all?email=${userEmail}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setReturns(data.returns || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const getStatusText = (status) => {
        return status.replace(/_/g, " ").toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Returns</h2>
            </div>

            {returns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">No return requests found</p>
                    <p className="text-sm text-gray-500">
                        Return requests will appear here once you submit them
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((returnItem) => (
                        <div
                            key={returnItem._id}
                            className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg">{returnItem.returnId}</h3>
                                    <p className="text-sm text-gray-600">
                                        Order: {returnItem.orderId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Requested: {new Date(returnItem.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full border-2 font-semibold text-sm ${getStatusColor(
                                        returnItem.status
                                    )}`}
                                >
                                    {getStatusText(returnItem.status)}
                                </span>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-sm mb-2">
                                    <span className="font-medium">Reason:</span>{" "}
                                    {returnItem.returnReason.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm mb-2">
                                    <span className="font-medium">Refund Amount:</span> Rs.{" "}
                                    {returnItem.refundAmount}/-
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Items:</span> {returnItem.items.length}
                                </p>

                                {returnItem.status === 'rejected' && returnItem.rejectionReason && (
                                    <div className="mt-3 bg-red-50 p-3 rounded border border-red-200">
                                        <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                                        <p className="text-sm text-red-700">{returnItem.rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReturnsTab;
