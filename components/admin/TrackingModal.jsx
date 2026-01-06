"use client";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

/**
 * Optional Tracking Details Modal
 * Opens when admin clicks "Assign Tracking" button
 * All fields are OPTIONAL except tracking number if provided
 */

export default function TrackingModal({
    open,
    onClose,
    order,
    image,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState({
        courierService: "M&P",
        trackingNumber: "",
        courierBookingId: "",
        estimatedDelivery: "",
        deliveryNotes: "",
    });

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                return reject(new Error("Provided value is not a file or blob"));
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async () => {
        if (!order || !image) {
            toast.error("Please select delivery voucher image");
            return;
        }

        try {
            setLoading(true);

            // 1. Update delivery status with image (REQUIRED)
            const base64Image = await toBase64(image);
            const formData = {
                deliveryStatus: "delivering",
                orderId: order.orderId,
                image: base64Image,
            };

            const statusRes = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/api/update-status?deliveryStatus=delivering`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ formData }),
                }
            );

            if (!statusRes.ok) {
                throw new Error("Failed to update delivery status");
            }

            // 2. Assign tracking details (OPTIONAL - only if tracking number provided)
            if (trackingData.trackingNumber.trim()) {
                const trackingUrl = trackingData.courierService === "M&P"
                    ? `https://www.mandpcourier.com/tracking?cn=${trackingData.trackingNumber}`
                    : `https://tracking.example.com/${trackingData.trackingNumber}`;

                const trackingRes = await fetch(`/api/orders/${order._id}/tracking`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...trackingData,
                        trackingUrl,
                        shippedAt: new Date(),
                        deliveryStatus: "shipped", // Mark as shipped if tracking provided
                    }),
                });

                if (!trackingRes.ok) {
                    console.warn("Tracking assignment failed but status updated");
                    toast.warning("Status updated but tracking assignment partial failure");
                } else {
                    toast.success("Order status updated with tracking details!");
                }
            } else {
                toast.success("Order status updated successfully!");
            }

            // Success callback
            if (onSuccess) onSuccess();
            onClose();

            // Reset form
            setTrackingData({
                courierService: "M&P",
                trackingNumber: "",
                courierBookingId: "",
                estimatedDelivery: "",
                deliveryNotes: "",
            });

        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to update order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Tracking Details (Optional)</DialogTitle>

            <DialogContent dividers>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Tracking details are <strong>optional</strong>. You can skip them and just update delivery status,
                        or provide tracking info for customer visibility.
                    </p>

                    {/* Courier Service */}
                    <TextField
                        select
                        fullWidth
                        label="Courier Service"
                        value={trackingData.courierService}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, courierService: e.target.value })
                        }
                    >
                        <MenuItem value="M&P">M&P Courier</MenuItem>
                        <MenuItem value="TCS">TCS</MenuItem>
                        <MenuItem value="Leopards">Leopards</MenuItem>
                        <MenuItem value="Pakistan Post">Pakistan Post</MenuItem>
                    </TextField>

                    {/* Tracking Number */}
                    <TextField
                        fullWidth
                        label="Tracking Number (Optional)"
                        value={trackingData.trackingNumber}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, trackingNumber: e.target.value })
                        }
                        placeholder="Enter tracking/consignment number"
                        helperText="Leave empty to skip tracking assignment"
                    />

                    {/* Booking ID */}
                    <TextField
                        fullWidth
                        label="Booking ID (Optional)"
                        value={trackingData.courierBookingId}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, courierBookingId: e.target.value })
                        }
                        placeholder="Courier booking reference"
                    />

                    {/* Estimated Delivery */}
                    <TextField
                        fullWidth
                        type="date"
                        label="Estimated Delivery Date"
                        value={trackingData.estimatedDelivery}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, estimatedDelivery: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }}
                    />

                    {/* Delivery Notes */}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Delivery Notes (Optional)"
                        value={trackingData.deliveryNotes}
                        onChange={(e) =>
                            setTrackingData({ ...trackingData, deliveryNotes: e.target.value })
                        }
                        placeholder="Special delivery instructions..."
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Status"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
