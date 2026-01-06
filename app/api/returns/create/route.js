import { Return } from "@/models/Return";
import { Order } from "@/models/Order";
import connectDb from "@/middleware/mongoose";
import cloudinary from "@/utils/cloudinory";

/**
 * POST /api/returns/create
 * Customer submits a return request
 * 
 * Process:
 * 1. Validate order exists and belongs to customer
 * 2. Upload return images to Cloudinary
 * 3. Create return record in database
 * 4. Send email notifications
 */

export async function POST(req) {
    console.log('=== Return Creation API Called ===');
    try {
        console.log('Connecting to database...');
        await connectDb();
        console.log('Database connected successfully');

        console.log('Parsing form data...');
        const formData = await req.formData();
        console.log('Form data received');

        // Extract form data
        console.log('Extracting form fields...');
        const orderId = formData.get("orderId");
        const customerEmail = formData.get("customerEmail");
        const customerName = formData.get("customerName");
        const customerPhone = formData.get("customerPhone");
        const returnReason = formData.get("returnReason");
        const customerComments = formData.get("customerComments") || "";
        const itemsJson = formData.get("items"); // JSON string of items array
        const refundAmount = parseFloat(formData.get("refundAmount"));

        console.log('Received Data:', {
            orderId,
            customerEmail,
            customerName,
            customerPhone,
            returnReason,
            customerComments,
            refundAmount,
            itemsJson: itemsJson ? 'present' : 'missing'
        });

        // Bank details (optional, for bank transfer refunds)
        const accountTitle = formData.get("accountTitle") || "";
        const accountNumber = formData.get("accountNumber") || "";
        const bankName = formData.get("bankName") || "";
        console.log('Bank Details:', { accountTitle, accountNumber, bankName });

        // Validate required fields
        console.log('Validating required fields...');
        if (!orderId || !customerEmail || !returnReason || !itemsJson) {
            console.error('Validation failed - Missing required fields:', {
                orderId: !!orderId,
                customerEmail: !!customerEmail,
                returnReason: !!returnReason,
                itemsJson: !!itemsJson
            });
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }
        console.log('All required fields present');

        // Parse items
        console.log('Parsing items JSON...');
        const items = JSON.parse(itemsJson);
        console.log('Parsed items:', items);

        // Step 1: Verify order exists and belongs to customer
        console.log('Step 1: Verifying order...');
        console.log('Looking for order with ID:', orderId);
        const order = await Order.findOne({ orderId });

        if (!order) {
            console.error('Order not found:', orderId);
            return new Response(
                JSON.stringify({ error: "Order not found" }),
                { status: 404 }
            );
        }
        console.log('Order found:', { orderId: order.orderId, email: order.email });

        console.log('Verifying order ownership...');
        if (order.email !== customerEmail) {
            console.error('Email mismatch - Order email:', order.email, 'Customer email:', customerEmail);
            return new Response(
                JSON.stringify({ error: "Order does not belong to this email" }),
                { status: 403 }
            );
        }
        console.log('Order ownership verified successfully');

        // Step 2: Upload return images to Cloudinary
        console.log('Step 2: Processing return images...');
        const returnImages = [];
        let imageIndex = 0;

        while (true) {
            const imageFile = formData.get(`image_${imageIndex}`);
            console.log(`Checking for image_${imageIndex}:`, imageFile ? 'found' : 'not found');
            if (!imageFile || imageFile.size === 0) break;

            try {
                console.log(`Processing image_${imageIndex}...`);
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                console.log(`Image buffer created, size: ${buffer.length} bytes`);

                // Upload to Cloudinary
                console.log(`Uploading image_${imageIndex} to Cloudinary...`);
                const imageUrl = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                folder: "return_images",
                                resource_type: "image"
                            },
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result.secure_url);
                            }
                        )
                        .end(buffer);
                });

                console.log(`Image_${imageIndex} uploaded successfully:`, imageUrl);
                returnImages.push(imageUrl);
            } catch (uploadError) {
                console.error(`Image_${imageIndex} upload failed:`, uploadError);
                // Continue even if image upload fails
            }

            imageIndex++;
        }
        console.log(`Total images uploaded: ${returnImages.length}`);
        console.log('All image URLs:', returnImages);

        // Step 3: Create return record
        console.log('Step 3: Creating return record...');

        // Generate unique return ID manually
        const returnId = "#RET" + Math.floor(1000000 + Math.random() * 9000000).toString();
        console.log('Generated returnId:', returnId);

        const returnRequest = new Return({
            returnId, // Add returnId manually
            orderId,
            customerEmail,
            customerName,
            customerPhone,
            items,
            returnReason,
            customerComments,
            returnImages,
            refundAmount,
            bankDetails: {
                accountTitle,
                accountNumber,
                bankName,
            },
            status: "pending",
        });
        console.log('Return object created with data:', {
            orderId,
            customerEmail,
            customerName,
            returnReason,
            itemCount: items.length,
            imageCount: returnImages.length,
            refundAmount
        });

        // Add initial status history
        console.log('Adding initial status history...');
        returnRequest.addStatusHistory(
            "pending",
            customerEmail,
            "Return request submitted by customer"
        );

        console.log('Saving return request to database...');
        await returnRequest.save();
        console.log('Return request saved successfully with ID:', returnRequest.returnId);

        // Step 4: Send email notifications (run in background)
        console.log('Step 4: Initiating email notifications (background)...');
        (async () => {
            try {
                console.log('Loading email service...');
                // Import email service dynamically to avoid blocking
                const { EmailService } = await import("@/services/emailService");

                // Email to customer
                console.log('Sending email to customer:', customerEmail);
                await EmailService.sendEmail(
                    customerEmail,
                    "Return Request Received - " + returnRequest.returnId,
                    `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #DD8560; text-align: center;">Return Request Received</h2>
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>We have received your return request for order <strong>${orderId}</strong>.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Return ID:</strong> ${returnRequest.returnId}</p>
                <p><strong>Status:</strong> Pending Review</p>
                <p><strong>Refund Amount:</strong> Rs. ${refundAmount}/-</p>
              </div>

              <p>Our team will review your request within 24-48 hours. You will receive an update via email.</p>
              
              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                Ibnemukhtar Brand Store<br/>
                📧 Support Team
              </p>
            </div>
          `,
                    `Return request ${returnRequest.returnId} received`
                );
                console.log('Customer email sent successfully');

                // Email to admin
                console.log('Sending email to admin:', process.env.ADMIN_EMAIL || "admin@ibnemukhtarbrandstore.com");
                await EmailService.sendEmail(
                    process.env.ADMIN_EMAIL || "admin@ibnemukhtarbrandstore.com",
                    "🔔 New Return Request - " + returnRequest.returnId,
                    `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #DD8560;">New Return Request</h2>
              
              <p><strong>Return ID:</strong> ${returnRequest.returnId}</p>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Reason:</strong> ${returnReason}</p>
              <p><strong>Refund Amount:</strong> Rs. ${refundAmount}/-</p>
              
              <p><strong>Items:</strong></p>
              <ul>
                ${items.map(item => `<li>${item.productTitle} (${item.size}/${item.color}) - Qty: ${item.quantity}</li>`).join('')}
              </ul>

              <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_HOST}/admin/returns" 
                   style="background: #DD8560; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Review Return Request
                </a>
              </p>
            </div>
          `,
                    "New return request needs review"
                );
                console.log('Admin email sent successfully');
                console.log('All email notifications sent successfully');
            } catch (emailError) {
                console.error("Email notification failed:", emailError);
                console.error('Email error stack:', emailError.stack);
            }
        })();

        console.log('=== Return Creation Successful ===');
        console.log('Response:', {
            success: true,
            returnId: returnRequest.returnId
        });
        return new Response(
            JSON.stringify({
                success: true,
                message: "Return request submitted successfully",
                returnId: returnRequest.returnId,
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("=== Return Creation Failed ===");
        console.error("Return creation error:", error);
        console.error("Error stack:", error.stack);
        console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return new Response(
            JSON.stringify({
                error: "Failed to create return request",
                details: error.message
            }),
            { status: 500 }
        );
    }
}
