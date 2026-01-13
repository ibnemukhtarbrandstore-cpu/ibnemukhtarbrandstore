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

        // Check if already imported
        await connectDb();
        const existingProduct = await Product.findOne({ cjProductId: productId });

        if (existingProduct) {
            return NextResponse.json(
                { success: false, error: 'This product is already imported to your store' },
                { status: 409 }
            );
        }

        // Map to store format
        const mappedProduct = mapCJProductToStore(cjProduct);

        // Generate unique slug
        const baseSlug = mappedProduct.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let slug = baseSlug;
        let counter = 1;
        while (await Product.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Create product
        const newProduct = new Product({
            ...mappedProduct,
            slug,
            disc: mappedProduct.description || 'Imported from CJ Dropshipping',
            availability: mappedProduct.availableQty || 0,
            cjProductUrl: productUrl,
            // Generate unique SKU to avoid duplicate null error
            sku: `CJ-${productId}-${Date.now()}`,
        });

        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: 'Product imported successfully',
            productId: newProduct._id,
            product: {
                title: newProduct.title,
                slug: newProduct.slug,
                price: newProduct.price,
                image: newProduct.images[0],
            },
        });
    } catch (error) {
        console.error('❌ Import from URL Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
