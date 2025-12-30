import connectDb from "@/middleware/mongoose";
import { Order } from "@/models/Order";

export async function POST(req) {
    try {
        await connectDb();
        const { token } = await req.json();

        // Basic token verification (implement proper auth)
        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Count unread orders with unshifted delivery status
        const count = await Order.countDocuments({
            deliveryStatus: "unshifted",
            notificationStatus: "unread"
        });

        // Optional: Get breakdown by payment method
        const codCount = await Order.countDocuments({
            deliveryStatus: "unshifted",
            notificationStatus: "unread",
            paymentMethod: "COD"
        });

        const manualCount = count - codCount;

        return Response.json({
            success: true,
            count,
            breakdown: {
                cod: codCount,
                manual: manualCount
            }
        });
    } catch (error) {
        console.error("Notification count error:", error);
        return Response.json(
            { error: "Failed to fetch notification count" },
            { status: 500 }
        );
    }
}
