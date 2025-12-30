// Simple email notification for new orders
// Uses fetch to external email API or SMTP service

export async function POST(req) {
    try {
        const { orderId, paymentMethod, amount, customerName, email } = await req.json();

        // Email configuration from environment variables
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ibnemukhtarbrandstore.com";
        const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

        // Email content
        const emailSubject = `🔔 New ${paymentMethod} Order: ${orderId}`;
        const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Order Notification</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === "COD" ? "💵 Cash on Delivery" : "🏦 Manual Payment"}</p>
          <p><strong>Amount:</strong> Rs. ${amount}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        
        <p style="color: #666;">
          Please check the admin panel to process this order.
        </p>
        
        <a href="${process.env.NEXT_PUBLIC_HOST}/admin/unshifted-Orders" 
           style="display: inline-block; background: #000; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; margin-top: 10px;">
          View Unshifted Orders
        </a>
      </div>
    `;

        // Simple approach: Log to console for now
        // In production, integrate with SendGrid, Mailgun, or Nodemailer
        console.log("📧 EMAIL NOTIFICATION:");
        console.log("To:", ADMIN_EMAIL);
        console.log("Subject:", emailSubject);
        console.log("Order ID:", orderId);
        console.log("Payment Method:", paymentMethod);

        // TODO: Integrate with actual email service
        // Example with SendGrid:
        /*
        if (EMAIL_API_KEY) {
          const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${EMAIL_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: ADMIN_EMAIL }]
              }],
              from: { email: "notifications@ibnemukhtarbrandstore.com" },
              subject: emailSubject,
              content: [{
                type: "text/html",
                value: emailBody
              }]
            })
          });
        }
        */

        return Response.json({
            success: true,
            message: "Email notification logged (configure EMAIL_API_KEY for sending)"
        });

    } catch (error) {
        console.error("Email notification error:", error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
