/**
 * Fix SKU Duplicate Key Error
 * 
 * Run this script once to fix the sku index issue
 * 
 * Problem: Old unique index on sku doesn't allow multiple null values
 * Solution: Drop old index and create sparse unique index
 */

import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

async function fixSKUIndex() {
    try {
        // Connect to database
        const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';
        await mongoose.connect(MONGODB_URI);

        console.log('✅ Connected to MongoDB');

        // Get the Product collection
        const collection = mongoose.connection.collection('products');

        // Drop the old sku index
        try {
            await collection.dropIndex('sku_1');
            console.log('✅ Dropped old sku_1 index');
        } catch (error) {
            console.log('ℹ️ Index sku_1 not found (might be already dropped)');
        }

        // Create new sparse unique index
        await collection.createIndex(
            { sku: 1 },
            {
                unique: true,
                sparse: true,
                name: 'sku_1_sparse'
            }
        );
        console.log('✅ Created new sparse unique index on sku');

        // Also fix sizeVariants.sku index
        try {
            await collection.dropIndex('sizeVariants.sku_1');
            console.log('✅ Dropped old sizeVariants.sku_1 index');
        } catch (error) {
            console.log('ℹ️ Index sizeVariants.sku_1 not found');
        }

        await collection.createIndex(
            { 'sizeVariants.sku': 1 },
            {
                unique: true,
                sparse: true,
                name: 'sizeVariants_sku_1_sparse'
            }
        );
        console.log('✅ Created new sparse unique index on sizeVariants.sku');

        console.log('\n✅ All done! SKU index fixed.');
        console.log('You can now import products without duplicate key errors.');

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixSKUIndex();
