import { Return } from "@/models/Return";
import connectDb from "@/middleware/mongoose";

/**
 * GET /api/returns/customer/[email]
 * Fetch all returns for a specific customer
 * Customer can view their own return history
 */

export async function GET(req, { params }) {
    try {
        await connectDb();

        const { email } = await params;

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                { status: 400 }
            );
        }

        // Fetch all returns for this customer email
        const returns = await Return.find({ customerEmail: email })
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        return new Response(
            JSON.stringify({
                success: true,
                returns,
                count: returns.length,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetch customer returns error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch return history" }),
            { status: 500 }
        );
    }
}
