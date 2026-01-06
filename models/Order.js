import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      defualt: "",
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: String,
      default: "",
    },
    products: {
      type: Object,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      default: "unshifted",
    },
    phone: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      default: "",
    },
    deliveryCharge: {
      type: String,
      default: "",
    },
    discountValue: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    deliveryVoucher: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "MANUAL",
    },
    notificationStatus: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    notificationReadAt: {
      type: Date,
      default: null,
    },

    /**
     * M&P COURIER TRACKING FIELDS
     * For order tracking and delivery management
     */
    courierService: {
      type: String,
      default: "M&P", // "M&P", "TCS", "Leopards", etc.
    },
    trackingNumber: {
      type: String,
      default: "",
      trim: true,
    },
    trackingUrl: {
      type: String,
      default: "",
      trim: true,
    },
    courierBookingId: {
      type: String,
      default: "",
      trim: true, // M&P booking reference
    },
    shippedAt: {
      type: Date,
      default: null, // When order was shipped
    },
    estimatedDelivery: {
      type: Date,
      default: null, // Expected delivery date
    },
    deliveryNotes: {
      type: String,
      default: "", // Courier notes or special instructions
    },
  },
  { timestamps: true }
);
// delete mongoose.models.Order; // force delete old model

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
