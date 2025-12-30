import connectDb from "@/middleware/mongoose";
import { Order } from "@/models/Order";

export async function POST(req) {
    try {
        await connectDb();
        const { token, orderIds } = await req.json();

        // Basic token verification
        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!orderIds || !Array.isArray(orderIds)) {
            return Response.json({ error: "Invalid orderIds" }, { status: 400 });
        }

        // Update notification status for specified orders
        const result = await Order.updateMany(
            { orderId: { $in: orderIds } },
            {
                $set: {
                    notificationStatus: "read",
                    notificationReadAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            markedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Mark read error:", error);
        return Response.json(
            { error: "Failed to mark notifications as read" },
            { status: 500 }
        );
    }
}
