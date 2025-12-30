import connectDb from '@/middleware/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDb();

        // Get trending products based on views and popularity
        const products = await Product.find({
            availability: { $gt: 0 },
            $or: [
                { views: { $gt: 20 } }, // Products with good view count
                { popular: true },
                { featured: true }
            ]
        })
            .sort({
                views: -1,  // Most viewed first
                popular: -1,
                rating: -1
            })
            .limit(12)
            .lean();

        // Group by title
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
        console.error('Error in trending API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trending products' },
            { status: 500 }
        );
    }
}
