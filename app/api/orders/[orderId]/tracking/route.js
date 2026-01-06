import { Order } from "@/models/Order";
import connectDb from "@/middleware/mongoose";

/**
 * PUT /api/orders/[orderId]/tracking
 * Update order tracking information
 * Admin only - assigns tracking details to order
 */

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { orderId } = await params;
    const body = await req.json();

    const {
      courierService,
      trackingNumber,
      trackingUrl,
      courierBookingId,
      shippedAt,
      estimatedDelivery,
      deliveryNotes,
      deliveryStatus,
    } = body;

    // Find order by MongoDB _id
    const order = await Order.findById(orderId);

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    // Update tracking fields
    if (courierService) order.courierService = courierService;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (courierBookingId) order.courierBookingId = courierBookingId;
    if (shippedAt) order.shippedAt = shippedAt;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    if (deliveryNotes) order.deliveryNotes = deliveryNotes;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();

    // Send tracking email to customer (background)
    (async () => {
      try {
        const { default: EmailService } = await import("@/services/emailService");

        await EmailService.sendEmail(
          order.email,
          `Your Order ${order.orderId} Has Been Shipped! 📦`,
          `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #4CAF50; text-align: center;">🚚 Order Shipped!</h2>
              <p>Hi <strong>${order.name}</strong>,</p>
              <p>Great news! Your order has been shipped and is on its way to you.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Tracking Information</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Courier:</strong> ${order.courierService}</p>
                <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
                ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString()}</p>` : ''}
              </div>

              ${trackingUrl ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${trackingUrl}" 
                   style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Track Your Order
                </a>
              </div>
              ` : ''}

              <p style="margin-top: 20px;">You can also track your order directly on our website:</p>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_HOST}/order/track/${order.orderId}" 
                   style="color: #2196F3; text-decoration: underline;">
                  View Order Status
                </a>
              </p>

              ${deliveryNotes ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Delivery Note:</strong> ${deliveryNotes}</p>
              </div>
              ` : ''}

              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                Thank you for shopping with us!<br/>
                Ibnemukhtar Brand Store
              </p>
            </div>
          `,
          `Order shipped: ${order.orderId}`
        );
      } catch (emailError) {
        console.error("Tracking email failed:", emailError);
      }
    })();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tracking details updated successfully",
        order,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Update tracking error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update tracking information" }),
      { status: 500 }
    );
  }
}
