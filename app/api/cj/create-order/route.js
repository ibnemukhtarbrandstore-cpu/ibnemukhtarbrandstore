import { NextResponse } from 'next/server';
import { createCJOrder } from '@/utils/cjApi';
import { connectDb } from '@/middleware/mongodb';
import Order from '@/models/Order';

/**
 * POST /api/cj/create-order
 * Place order with CJ Dropshipping for fulfillment
 */
export async function POST(request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Get order details
        const order = await Order.findById(orderId).populate('products.productId');

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if order is eligible for CJ fulfillment
        if (order.paymentInfo?.status !== 'paid' && order.paymentMethod !== 'COD_CONFIRMED') {
            return NextResponse.json(
                { success: false, error: 'Order payment not confirmed' },
                { status: 400 }
            );
        }

        // Check if already fulfilled
        if (order.cjOrderId) {
            return NextResponse.json(
                { success: false, error: 'Order already fulfilled', cjOrderId: order.cjOrderId },
                { status: 409 }
            );
        }

        // Filter CJ products only
        const cjProducts = order.products.filter(item => {
            return item.productId?.isCJProduct === true;
        });

        if (cjProducts.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No CJ products in this order' },
                { status: 400 }
            );
        }

        // Prepare order data for CJ
        const orderData = {
            products: cjProducts.map(item => ({
                cjProductId: item.productId.cjProductId,
                cjVariantId: item.productId.cjVariantId || item.productId.cjProductId,
                quantity: item.quantity,
            })),
            shippingAddress: {
                firstName: order.address?.name?.split(' ')[0] || order.name,
                lastName: order.address?.name?.split(' ').slice(1).join(' ') || '',
                phone: order.address?.phoneNo || order.phone,
                email: order.email,
                country: order.address?.country || 'PK',
                state: order.address?.state || '',
                city: order.address?.city || '',
                address: order.address?.address || order.address,
                address2: order.address?.address2 || '',
                zipCode: order.address?.zipCode || order.address?.postalCode || '',
            },
            country: order.address?.country || 'PK',
            orderNumber: order._id.toString(),
        };

        // Create CJ order
        const result = await createCJOrder(orderData);

        if (result.success) {
            // Update order with CJ details
            order.cjOrderId = result.cjOrderId;
            order.trackingNumber = result.trackingNumber;
            order.orderStatus = 'processing';
            order.fulfillmentStatus = 'cj_order_placed';
            order.estimatedDelivery = result.estimatedDelivery;

            await order.save();

            return NextResponse.json({
                success: true,
                message: 'Order placed with CJ Dropshipping successfully',
                cjOrderId: result.cjOrderId,
                trackingNumber: result.trackingNumber,
            });
        } else {
            // Log error but don't fail completely
            console.error('CJ Order Creation Failed:', result.error);

            order.fulfillmentStatus = 'cj_order_failed';
            order.fulfillmentError = result.error;
            await order.save();

            return NextResponse.json(
                { success: false, error: result.error || 'Failed to create CJ order' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('❌ CJ Order API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
