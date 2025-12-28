import { Product } from '@/models/Product';

import connectDb from '@/middleware/mongoose';
import sendStockAlertEmail from '@/utils/sendStockAlertEmail';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDb();

    // 1. Products: Find all with availability < 10
    const shortStockProducts = await Product.find({ availability: { $lt: 10 } })
      .select('title availability')
      .lean();

    // 3. Send email if any short stock found
    if (shortStockProducts.length > 0) {
      const emailProducts = shortStockProducts.map(p => `Product: ${p.title} = ${p.availability}`);
      const message = [
        ...(emailProducts.length ? ["Short Stock Products:", ...emailProducts] : []),
      ].join('\n');
      await sendStockAlertEmail([{ name: 'Short Stock Alert', stock: message }]);
    }

    return NextResponse.json({
      uniforms: [],
      products: shortStockProducts,
      totalShortStock: shortStockProducts.length,
    });
  } catch (error) {
    console.error('Short stock API error:', error);
    return NextResponse.json({ error: 'Failed to fetch short stock' }, { status: 500 });
  }
} 
