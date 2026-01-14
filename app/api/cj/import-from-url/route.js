import { NextResponse } from 'next/server';
import { extractCJProductId, getCJProductDetails, mapCJProductToStore } from '@/utils/cjApi';
import { Product } from '@/models/Product';
import { connectDb } from '@/middleware/mongodb';

/**
 * POST /api/cj/import-from-url
 * Import product directly from CJ URL
 */
export async function POST(request) {
    try {
        const { productUrl } = await request.json();

        if (!productUrl) {
            return NextResponse.json(
                { success: false, error: 'Product URL is required' },
                { status: 400 }
            );
        }

        // Extract product ID from URL
        const productId = extractCJProductId(productUrl);

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Invalid CJ product URL. Could not extract product ID.' },
                { status: 400 }
            );
        }

        // Fetch product details from CJ
        const result = await getCJProductDetails(productId);

        if (!result.success || !result.product) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to fetch product from CJ' },
                { status: 500 }
            );
        }

        const cjProduct = result.product;

        // Check if already imported (optional check but good for UX)
        await connectDb();
        const existingProduct = await Product.findOne({ cjProductId: productId });

        return NextResponse.json({
            success: true,
            message: 'Product details fetched successfully',
            cjProduct: cjProduct,
            alreadyImported: !!existingProduct,
            existingProductId: existingProduct?._id
        });
    } catch (error) {
        console.error('❌ Fetch from URL Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch product from URL' },
            { status: 500 }
        );
    }
}
