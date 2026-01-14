import { NextResponse } from 'next/server';
import { mapCJProductToStore } from '@/utils/cjApi';
import { Product } from '@/models/Product';
import { connectDb } from '@/middleware/mongodb';

/**
 * POST /api/cj/import
 * Import CJ product to store
 */
export async function POST(request) {
    try {
        const { cjProductId, productData, overrides } = await request.json();

        if (!cjProductId || !productData) {
            return NextResponse.json(
                { success: false, error: 'Product ID and data are required' },
                { status: 400 }
            );
        }

        await connectDb();

        // Check if already imported
        const existingProduct = await Product.findOne({ cjProductId });

        if (existingProduct) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'This product is already in your store',
                    existingProductId: existingProduct._id
                },
                { status: 409 }
            );
        }

        // Map CJ product to store format
        const mappedProduct = mapCJProductToStore(productData);

        // Apply Overrides if present (All Fields)
        if (overrides) {
            if (overrides.title) mappedProduct.title = overrides.title;
            if (overrides.description) mappedProduct.description = overrides.description;
            if (overrides.price) mappedProduct.price = parseFloat(overrides.price);
            if (overrides.category) mappedProduct.category = overrides.category;

            // New Detail Fields
            if (overrides.brand) mappedProduct.brand = overrides.brand;
            if (overrides.material) mappedProduct.material = overrides.material;
            if (overrides.careInstructions) mappedProduct.careInstructions = overrides.careInstructions;
            if (overrides.warranty) mappedProduct.warranty = overrides.warranty;
            if (overrides.videoUrl) mappedProduct.videoUrl = overrides.videoUrl;
            if (overrides.tags) mappedProduct.tags = overrides.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            // AIDA Fields
            if (overrides.howItWorks) mappedProduct.howItWorks = overrides.howItWorks;
            if (overrides.mainBenefitHeadline) mappedProduct.mainBenefitHeadline = overrides.mainBenefitHeadline;
            if (overrides.mainBenefitText) mappedProduct.mainBenefitText = overrides.mainBenefitText;
            if (overrides.howToUseHeadline) mappedProduct.howToUseHeadline = overrides.howToUseHeadline;
            if (overrides.howToUseText) mappedProduct.howToUseText = overrides.howToUseText;
            if (overrides.resultsHeadline) mappedProduct.resultsHeadline = overrides.resultsHeadline;
            if (overrides.resultsText) mappedProduct.resultsText = overrides.resultsText;
        }

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
            // Generate unique SKU to avoid duplicate null error
            sku: `CJ-${cjProductId}-${Date.now()}`,
        });

        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: 'Product added to store successfully',
            productId: newProduct._id,
            product: {
                id: newProduct._id,
                title: newProduct.title,
                slug: newProduct.slug,
                price: newProduct.price,
                currency: newProduct.currency,
                image: newProduct.images[0],
            },
        });
    } catch (error) {
        console.error('❌ CJ Product Import Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to import product' },
            { status: 500 }
        );
    }
}
