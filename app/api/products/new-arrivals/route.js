import connectDb from '@/middleware/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDb();

        // Get products created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const products = await Product.find({
            createdAt: { $gte: thirtyDaysAgo },
            availability: { $gt: 0 } // Only show available products
        })
            .sort({ createdAt: -1 }) // Newest first
            .limit(12) // Limit to 12 products
            .lean();

        // Group by title to show unique products
        const uniqueProducts = {};
        for (const product of products) {
            if (!uniqueProducts[product.title]) {
                uniqueProducts[product.title] = {
                    ...product,
                    _id: product._id.toString(),
                };
            }
        }

        return NextResponse.json({
            success: true,
            products: Object.values(uniqueProducts),
            count: Object.keys(uniqueProducts).length
        });

    } catch (error) {
        console.error('Error in new-arrivals API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch new arrivals' },
            { status: 500 }
        );
    }
}
