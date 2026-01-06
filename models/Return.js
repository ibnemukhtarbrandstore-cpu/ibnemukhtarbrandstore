import mongoose from "mongoose";

/**
 * Return Model
 * Tracks customer return requests for orders
 * 
 * Flow: Customer requests return → Admin reviews → Approve/Reject → Process refund
 */

const returnSchema = new mongoose.Schema(
    {
        // Auto-generated unique return ID (e.g., #RET1234567)
        returnId: {
            type: String,
            required: true,
            unique: true,
        },

        // Reference to original order
        orderId: {
            type: String,
            required: true,
            index: true, // Fast lookup by order ID
        },

        // Customer Information
        customerEmail: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },

        // Items being returned (can be partial order)
        items: [
            {
                productSlug: String,
                productTitle: String,
                size: String,
                color: String,
                quantity: Number,
                price: Number,
                reason: String, // Why this specific item is being returned
            },
        ],

        // Main return reason
        returnReason: {
            type: String,
            required: true,
            enum: [
                "damaged",
                "wrong_item",
                "wrong_size",
                "not_as_described",
                "quality_issue",
                "changed_mind",
                "other",
            ],
        },

        // Detailed description from customer
        customerComments: {
            type: String,
            default: "",
        },

        // Return item photos (Cloudinary URLs)
        returnImages: {
            type: [String],
            default: [],
        },

        // Return Status Flow: pending → approved/rejected → refunded/completed
        status: {
            type: String,
            enum: [
                "pending",      // Customer submitted, waiting for admin review
                "approved",     // Admin approved, waiting for item return
                "rejected",     // Admin rejected the request
                "items_received", // Items received back
                "refunded",     // Money refunded
                "completed",    // Process complete
            ],
            default: "pending",
        },

        // Refund Details
        refundAmount: {
            type: Number,
            required: true,
        },

        refundMethod: {
            type: String,
            enum: ["bank_transfer", "store_credit", "original_method"],
            default: "original_method",
        },

        // Bank details for refund (if applicable)
        bankDetails: {
            accountTitle: { type: String, default: "" },
            accountNumber: { type: String, default: "" },
            bankName: { type: String, default: "" },
        },

        // Admin section
        adminNotes: {
            type: String,
            default: "",
        },

        approvedBy: {
            type: String, // Admin email/name
            default: null,
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        rejectionReason: {
            type: String,
            default: "",
        },

        refundedAt: {
            type: Date,
            default: null,
        },

        // Return tracking
        returnTrackingNumber: {
            type: String,
            default: "",
        },

        // Automatic status updates
        statusHistory: [
            {
                status: String,
                updatedAt: { type: Date, default: Date.now },
                updatedBy: String,
                note: String,
            },
        ],
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

// Indexes for faster queries
returnSchema.index({ customerEmail: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ createdAt: -1 });

// Auto-increment return ID before saving
returnSchema.pre("save", async function (next) {
    if (!this.returnId) {
        // Generate unique return ID: #RET + random 7 digits
        this.returnId = "#RET" + Math.floor(1000000 + Math.random() * 9000000).toString();
    }
    next();
});

// Method to add status history entry
returnSchema.methods.addStatusHistory = function (status, updatedBy, note = "") {
    this.statusHistory.push({
        status,
        updatedAt: new Date(),
        updatedBy,
        note,
    });
};

export const Return =
    mongoose.models.Return || mongoose.model("Return", returnSchema);
