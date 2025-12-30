import connectDb from "@/middleware/mongoose";
import { Order } from "@/models/Order";

export async function POST(req) {
    try {
        await connectDb();
        const { token } = await req.json();

        // Basic token verification
        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mark all unshifted orders as read
        const result = await Order.updateMany(
            {
                deliveryStatus: "unshifted",
                notificationStatus: "unread"
            },
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
        console.error("Mark all read error:", error);
        return Response.json(
            { error: "Failed to mark all notifications as read" },
            { status: 500 }
        );
    }
}
