import { NextResponse } from 'next/server';
import { searchCJProducts } from '@/utils/cjApi';

/**
 * POST /api/cj/search
 * Search CJ Dropshipping product catalog
 */
export async function POST(request) {
    try {
        const { query, page = 1, pageSize = 20, filters = {} } = await request.json();

        if (!query || query.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Search query is required' },
                { status: 400 }
            );
        }

        // Call CJ API
        const result = await searchCJProducts(query, page, pageSize, filters);

        if (result.success) {
            return NextResponse.json({
                success: true,
                products: result.products,
                total: result.total,
                page: result.page,
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to search products' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('❌ CJ Search API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
