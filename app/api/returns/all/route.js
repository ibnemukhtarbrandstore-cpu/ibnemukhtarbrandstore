import { Return } from "@/models/Return";
import connectDb from "@/middleware/mongoose";

/**
 * GET /api/returns/all
 * Fetch all return requests (Admin only)
 * 
 * Query params:
 * - status: Filter by status (pending, approved, rejected, etc.)
 * - limit: Number of results
 * - skip: For pagination
 */

export async function GET(req) {
    try {
        await connectDb();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const email = searchParams.get("email");
        const limit = parseInt(searchParams.get("limit")) || 50;
        const skip = parseInt(searchParams.get("skip")) || 0;

        // Build query
        const query = {};
        if (status && status !== "all") {
            query.status = status;
        }
        if (email) {
            query.customerEmail = email;
        }

        // Fetch returns sorted by creation date (newest first)
        const returns = await Return.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean(); // Convert to plain JavaScript objects

        // Get total count for pagination
        const totalCount = await Return.countDocuments(query);

        return new Response(
            JSON.stringify({
                success: true,
                returns,
                totalCount,
                hasMore: skip + limit < totalCount,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetch returns error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch returns" }),
            { status: 500 }
        );
    }
}
