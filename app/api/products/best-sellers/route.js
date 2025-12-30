import connectDb from '@/middleware/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDb();

        // For now, we'll use view count and featured status as proxy for "best sellers"
        // Later can be updated to use actual sales count from Order model
        const products = await Product.find({
            availability: { $gt: 0 }, // Only available products
            $or: [
                { popular: true },
                { featured: true },
                { views: { $gt: 10 } }
            ]
        })
            .sort({
                popular: -1,
                featured: -1,
                views: -1,
                rating: -1
            })
            .limit(15)
            .lean();

        // Group by title to show unique products
        const uniqueProducts = {};
        for (const product of products) {
            if (!uniqueProducts[product.title]) {
                uniqueProducts[product.title] = {
                    ...product,
                    _id: product._id.toString(),
                    // Estimate sales count based on views (can be updated with actual Order data later)
                    salesCount: Math.floor((product.views || 0) * 0.1) + (product.popular ? 100 : 0)
                };
            }
        }

        return NextResponse.json({
            success: true,
            products: Object.values(uniqueProducts),
            count: Object.keys(uniqueProducts).length
        });

    } catch (error) {
        console.error('Error in best-sellers API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch best sellers' },
            { status: 500 }
        );
    }
}
