import { Proof } from "@/models/Proof";
import { Order } from "@/models/Order";
import connectDb from "../../../middleware/mongoose";

/**
 * GET /api/get-confirm-order
 * Returns orders needing admin confirmation
 * 
 * UPDATED LOGIC:
 * - Manual Payment: Show all payment proofs (from Proof collection)
 * - COD Orders: Show all COD orders that are not paid yet
 * 
 * This allows admin to see and process both payment types
 */

export const GET = async () => {
  try {
    await connectDb();

    // 1. Get all manual payment proofs
    const proofs = await Proof.find();

    // Get complete order data for each proof
    const manualPaymentOrders = await Promise.all(
      proofs.map(async (proof) => {
        const order = await Order.findOne({ orderId: proof.orderId });
        return {
          ...proof.toObject(),
          products: order?.products || {},
          originalAmount: order?.amount || proof.amount,
          deliveryCharge: order?.deliveryCharge || 0,
          discountValue: order?.discountValue || 0,
          couponCode: order?.couponCode || "",
          deliveryMethod: order?.deliveryMethod || "",
          address: order?.address || "",
          city: order?.city || "",
          state: order?.state || "",
          phone: order?.phone || "",
          paymentMethod: order?.paymentMethod || "MANUAL",
        };
      })
    );

    // 2. Get all COD orders that are NOT paid yet
    // These won't have proofs but still need to be shown to admin
    const codOrders = await Order.find({
      paymentMethod: "COD",
      status: { $ne: "paid" } // not paid yet
    }).lean();

    // Format COD orders to match the proof format
    const codOrdersFormatted = codOrders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      name: order.name,
      email: order.email,
      amount: order.amount,
      createdAt: order.createdAt,
      proofimgurl: null, // COD doesn't have payment proof
      products: order.products || {},
      originalAmount: order.amount,
      deliveryCharge: order.deliveryCharge || 0,
      discountValue: order.discountValue || 0,
      couponCode: order.couponCode || "",
      deliveryMethod: order.deliveryMethod || "",
      address: order.address || "",
      city: order.city || "",
      state: order.state || "",
      phone: order.phone || "",
      paymentMethod: "COD",
    }));

    // 3. Combine both arrays and sort by creation date (newest first)
    const allOrders = [...manualPaymentOrders, ...codOrdersFormatted]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ proofs: allOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Error in GET /api/get-confirm-order:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};
