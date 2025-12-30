import connectDb from '@/middleware/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDb();

        // Get products with bulk stock (qty > 5) added in last 60 days
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const products = await Product.find({
            availability: { $gt: 5 }, // Bulk stock
            condition: 'New', // Brand new condition
            createdAt: { $gte: sixtyDaysAgo }
        })
            .sort({ createdAt: -1, availability: -1 }) // Newest and most stock first
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
        console.error('Error in fresh-stock API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch fresh stock' },
            { status: 500 }
        );
    }
}
