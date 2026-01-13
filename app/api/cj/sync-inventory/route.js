import { NextResponse } from 'next/server';
import { syncCJInventory } from '@/utils/cjApi';
import { Product } from '@/models/Product';
import { connectDb } from '@/middleware/mongodb';

/**
 * POST /api/cj/sync-inventory
 * Sync inventory/stock from CJ Dropshipping
 */
export async function POST(request) {
    try {
        const { productIds = [] } = await request.json();

        await connectDb();

        // Get all CJ products or specific ones
        let query = { isCJProduct: true };

        if (productIds.length > 0) {
            query.cjProductId = { $in: productIds };
        }

        const products = await Product.find(query);

        if (products.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No CJ products found to sync' },
                { status: 404 }
            );
        }

        // Get CJ product IDs
        const cjProductIds = products.map(p => p.cjProductId);

        // Fetch inventory from CJ
        const result = await syncCJInventory(cjProductIds);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to sync inventory' },
                { status: 500 }
            );
        }

        // Update product stocks
        const updates = [];
        const syncReport = {
            totalProducts: products.length,
            updated: 0,
            failed: 0,
            outOfStock: 0,
        };

        for (const product of products) {
            try {
                // Find matching inventory data
                const inventoryData = result.inventory.find(
                    inv => inv.pid === product.cjProductId || inv.productId === product.cjProductId
                );

                if (inventoryData) {
                    const newStock = inventoryData.stock || inventoryData.inventory || 0;

                    // Update availability
                    product.availability = newStock;
                    product.lastSyncedAt = new Date();

                    // Track out of stock
                    if (newStock === 0) {
                        syncReport.outOfStock++;
                    }

                    await product.save();
                    syncReport.updated++;

                    updates.push({
                        productId: product._id,
                        title: product.title,
                        oldStock: product.availability,
                        newStock: newStock,
                    });
                } else {
                    syncReport.failed++;
                }
            } catch (error) {
                console.error(`Failed to update product ${product._id}:`, error);
                syncReport.failed++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${syncReport.updated} products successfully`,
            syncReport,
            updates: updates.slice(0, 50), // Return first 50 updates
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Inventory Sync Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
