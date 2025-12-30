import connectDb from '@/middleware/mongoose';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDb();

        // Find unique/limited quantity products
        const products = await Product.find({
            $or: [
                { availability: 1 }, // Only 1 left
                { condition: 'Pre-loved' },
                { condition: 'Refurbished' }
            ]
        })
            .sort({ createdAt: -1 }) // Newest first
            .limit(12)
            .lean();

        // Transform products
        const transformedProducts = products.map(product => ({
            ...product,
            _id: product._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            products: transformedProducts,
            count: transformedProducts.length
        });

    } catch (error) {
        console.error('Error in unique-finds API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch unique finds' },
            { status: 500 }
        );
    }
}
