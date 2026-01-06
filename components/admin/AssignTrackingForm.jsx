"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

/**
 * Admin: Assign Tracking Details to Order
 * Assign M&P tracking number and update delivery status
 * 
 * Component used in admin order management
 */

export default function AssignTrackingForm({ order, onUpdate }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState({
        courierService: order.courierService || "M&P",
        trackingNumber: order.trackingNumber || "",
        courierBookingId: order.courierBookingId || "",
        deliveryNotes: order.deliveryNotes || "",
        estimatedDelivery: order.estimatedDelivery
            ? new Date(order.estimatedDelivery).toISOString().split('T')[0]
            : "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trackingData.trackingNumber) {
            toast.error("Tracking number is required");
            return;
        }

        setLoading(true);

        try {
            // Generate M&P tracking URL (customize based on M&P's actual tracking URL format)
            const trackingUrl = `https://www.mandpcourier.com/tracking?cn=${trackingData.trackingNumber}`;

            const response = await fetch(`/api/orders/${order._id}/tracking`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...trackingData,
                    trackingUrl,
                    shippedAt: new Date(), // Mark as shipped now
                    deliveryStatus: "shipped", // Update delivery status
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Tracking details assigned successfully!");

                // Refresh or callback
                if (onUpdate) onUpdate();
                else router.refresh();
            } else {
                toast.error(data.error || "Failed to assign tracking");
            }
        } catch (error) {
            console.error("Tracking assignment error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Assign Tracking Details</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Courier Service */}
                <div>
                    <label className="block font-medium mb-2">Courier Service</label>
                    <select
                        value={trackingData.courierService}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, courierService: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="M&P">M&P Courier</option>
                        <option value="TCS">TCS</option>
                        <option value="Leopards">Leopards</option>
                        <option value="Pakistan Post">Pakistan Post</option>
                    </select>
                </div>

                {/* Tracking Number */}
                <div>
                    <label className="block font-medium mb-2">
                        Tracking Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={trackingData.trackingNumber}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, trackingNumber: e.target.value })
                        }
                        placeholder="Enter tracking/consignment number"
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>

                {/* Booking ID (optional) */}
                <div>
                    <label className="block font-medium mb-2">
                        Booking ID (Optional)
                    </label>
                    <input
                        type="text"
                        value={trackingData.courierBookingId}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, courierBookingId: e.target.value })
                        }
                        placeholder="M&P booking reference"
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                {/* Estimated Delivery */}
                <div>
                    <label className="block font-medium mb-2">
                        Estimated Delivery Date
                    </label>
                    <input
                        type="date"
                        value={trackingData.estimatedDelivery}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, estimatedDelivery: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* Delivery Notes */}
                <div>
                    <label className="block font-medium mb-2">
                        Delivery Notes (Optional)
                    </label>
                    <textarea
                        value={trackingData.deliveryNotes}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, deliveryNotes: e.target.value })
                        }
                        placeholder="Special delivery instructions..."
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Assigning..." : "Assign Tracking & Mark Shipped"}
                    </button>
                </div>
            </form>

            {/* Preview */}
            {trackingData.trackingNumber && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Tracking URL Preview:</p>
                    <a
                        href={`https://www.mandpcourier.com/tracking?cn=${trackingData.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                    >
                        https://www.mandpcourier.com/tracking?cn={trackingData.trackingNumber}
                    </a>
                </div>
            )}
        </div>
    );
}
