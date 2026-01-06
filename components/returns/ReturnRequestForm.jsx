"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * ReturnRequestForm Component
 * Allows customers to request returns for their orders
 * 
 * Features:
 * - Select items to return
 * - Choose return reason
 * - Upload photos of items
 * - Enter bank details for refund
 */

export default function ReturnRequestForm({ order, userEmail }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [selectedItems, setSelectedItems] = useState({});
    const [returnReason, setReturnReason] = useState("");
    const [customerComments, setCustomerComments] = useState("");
    const [returnImages, setReturnImages] = useState([]);
    const [bankDetails, setBankDetails] = useState({
        accountTitle: "",
        accountNumber: "",
        bankName: "",
    });

    // Return reason options
    const returnReasons = [
        { value: "damaged", label: "Damaged or Defective" },
        { value: "wrong_item", label: "Wrong Item Received" },
        { value: "wrong_size", label: "Wrong Size" },
        { value: "not_as_described", label: "Not As Described" },
        { value: "quality_issue", label: "Quality Issue" },
        { value: "changed_mind", label: "Changed Mind" },
        { value: "other", label: "Other" },
    ];

    // Toggle item selection for return
    const toggleItemSelection = (itemKey) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemKey]: !prev[itemKey],
        }));
    };

    // Handle image upload (preview only, actual upload happens on submit)
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);

        // Limit to 5 images
        if (files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        setReturnImages(files);
    };

    // Calculate total refund amount
    const calculateRefundAmount = () => {
        let total = 0;
        Object.keys(order.products).forEach((key) => {
            if (selectedItems[key]) {
                const product = order.products[key];
                total += (product.price || 0) * (product.qty || 1);
            }
        });
        return total;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: At least one item must be selected
        const hasSelectedItems = Object.values(selectedItems).some((v) => v);
        if (!hasSelectedItems) {
            toast.error("Please select at least one item to return");
            return;
        }

        // Validation: Return reason required
        if (!returnReason) {
            toast.error("Please select a return reason");
            return;
        }

        setLoading(true);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append("orderId", order.orderId);
            formData.append("customerEmail", userEmail || order.email);
            formData.append("customerName", order.name);
            formData.append("customerPhone", order.phone);
            formData.append("returnReason", returnReason);
            formData.append("customerComments", customerComments);
            formData.append("refundAmount", calculateRefundAmount());

            // Bank details
            formData.append("accountTitle", bankDetails.accountTitle);
            formData.append("accountNumber", bankDetails.accountNumber);
            formData.append("bankName", bankDetails.bankName);

            // Prepare selected items
            const items = [];
            Object.keys(order.products).forEach((key) => {
                if (selectedItems[key]) {
                    const product = order.products[key];
                    items.push({
                        productSlug: key,
                        productTitle: product.title || product.company,
                        size: product.size || "",
                        color: product.color || "",
                        quantity: product.qty || 1,
                        price: product.price,
                        reason: returnReason,
                    });
                }
            });
            formData.append("items", JSON.stringify(items));

            // Add images
            returnImages.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });

            // Submit to API
            const response = await fetch("/api/returns/create", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Return request submitted successfully!");
                setTimeout(() => {
                    router.push(`/myaccount/returns`);
                }, 1500);
            } else {
                toast.error(data.error || "Failed to submit return request");
            }
        } catch (error) {
            console.error("Return submission error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6">Request Return</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                    <p className="text-sm text-gray-600">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Select Items to Return */}
                <div>
                    <h3 className="font-semibold mb-3">Select Items to Return</h3>
                    <div className="space-y-2">
                        {Object.keys(order.products).map((key) => {
                            const product = order.products[key];
                            return (
                                <label
                                    key={key}
                                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedItems[key] || false}
                                        onChange={() => toggleItemSelection(key)}
                                        className="w-4 h-4"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {product.title || product.company}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {product.size && `Size: ${product.size}`}
                                            {product.size && product.color && " | "}
                                            {product.color && `Color: ${product.color}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {product.qty || 1} × Rs. {product.price}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        Rs. {(product.price || 0) * (product.qty || 1)}
                                    </p>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Return Reason */}
                <div>
                    <label className="block font-semibold mb-2">
                        Reason for Return <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a reason</option>
                        {returnReasons.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                                {reason.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Additional Comments */}
                <div>
                    <label className="block font-semibold mb-2">
                        Additional Comments (Optional)
                    </label>
                    <textarea
                        value={customerComments}
                        onChange={(e) => setCustomerComments(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Please provide more details about your return request..."
                    />
                </div>

                {/* Upload Photos */}
                <div>
                    <label className="block font-semibold mb-2">
                        Upload Photos (Optional, max 5)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="w-full p-2 border rounded-lg"
                    />
                    {returnImages.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            {returnImages.length} image(s) selected
                        </p>
                    )}
                </div>

                {/* Bank Details for Refund */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">
                        Bank Details for Refund (Optional)
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        If you prefer bank transfer, please provide your bank details
                    </p>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Account Title"
                            value={bankDetails.accountTitle}
                            onChange={(e) =>
                                setBankDetails({ ...bankDetails, accountTitle: e.target.value })
                            }
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Account Number"
                            value={bankDetails.accountNumber}
                            onChange={(e) =>
                                setBankDetails({
                                    ...bankDetails,
                                    accountNumber: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Bank Name"
                            value={bankDetails.bankName}
                            onChange={(e) =>
                                setBankDetails({ ...bankDetails, bankName: e.target.value })
                            }
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Refund Summary */}
                {calculateRefundAmount() > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Refund Summary</h3>
                        <p className="text-lg font-bold text-green-700">
                            Rs. {calculateRefundAmount()}/-
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Refund will be processed after admin approval and item verification
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || calculateRefundAmount() === 0}
                        className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Return Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}
