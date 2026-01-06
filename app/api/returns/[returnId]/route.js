import { Return } from "@/models/Return";
import connectDb from "@/middleware/mongoose";

/**
 * GET /api/returns/[returnId]
 * Fetch single return request details
 */

export async function GET(req, { params }) {
    try {
        await connectDb();

        const { returnId } = await params;

        // Find return by returnId
        const returnRequest = await Return.findOne({ returnId });

        if (!returnRequest) {
            return new Response(
                JSON.stringify({ error: "Return request not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                return: returnRequest,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetch return error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch return details" }),
            { status: 500 }
        );
    }
}
