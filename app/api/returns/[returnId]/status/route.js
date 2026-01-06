import { Return } from "@/models/Return";
import connectDb from "@/middleware/mongoose";

/**
 * PUT /api/returns/[returnId]/status
 * Update return request status (Admin only)
 * 
 * Actions:
 * - approve: Approve the return
 * - reject: Reject the return
 * - items_received: Mark items as received
 * - refund: Process refund and mark as refunded
 */

export async function PUT(req, { params }) {
    try {
        await connectDb();

        const { returnId } = await params;
        const body = await req.json();

        const {
            action,           // "approve", "reject", "items_received", "refund"
            adminEmail,       // Who is performing this action
            adminNotes,       // Optional notes
            rejectionReason,  // If rejecting
        } = body;

        // Find return request
        const returnRequest = await Return.findOne({ returnId });

        if (!returnRequest) {
            return new Response(
                JSON.stringify({ error: "Return request not found" }),
                { status: 404 }
            );
        }

        let responseMessage = "";

        // Handle different actions
        switch (action) {
            case "approve":
                if (returnRequest.status !== "pending") {
                    return new Response(
                        JSON.stringify({ error: "Can only approve pending returns" }),
                        { status: 400 }
                    );
                }

                returnRequest.status = "approved";
                returnRequest.approvedBy = adminEmail;
                returnRequest.approvedAt = new Date();
                returnRequest.addStatusHistory("approved", adminEmail, adminNotes || "Return approved by admin");
                responseMessage = "Return approved successfully";
                break;

            case "reject":
                if (returnRequest.status !== "pending") {
                    return new Response(
                        JSON.stringify({ error: "Can only reject pending returns" }),
                        { status: 400 }
                    );
                }

                returnRequest.status = "rejected";
                returnRequest.rejectionReason = rejectionReason || "Not eligible for return";
                returnRequest.addStatusHistory("rejected", adminEmail, rejectionReason);
                responseMessage = "Return rejected";
                break;

            case "items_received":
                if (returnRequest.status !== "approved") {
                    return new Response(
                        JSON.stringify({ error: "Return must be approved first" }),
                        { status: 400 }
                    );
                }

                returnRequest.status = "items_received";
                returnRequest.addStatusHistory("items_received", adminEmail, "Items received and verified");
                responseMessage = "Marked as items received";
                break;

            case "refund":
                if (returnRequest.status !== "items_received") {
                    return new Response(
                        JSON.stringify({ error: "Items must be received before refund" }),
                        { status: 400 }
                    );
                }

                returnRequest.status = "refunded";
                returnRequest.refundedAt = new Date();
                returnRequest.addStatusHistory("refunded", adminEmail, `Refund of Rs. ${returnRequest.refundAmount} processed`);
                responseMessage = "Refund processed successfully";
                break;

            case "completed":
                if (returnRequest.status !== "refunded") {
                    return new Response(
                        JSON.stringify({ error: "Refund must be processed first" }),
                        { status: 400 }
                    );
                }

                returnRequest.status = "completed";
                returnRequest.addStatusHistory("completed", adminEmail, "Return process completed");
                responseMessage = "Return marked as completed";
                break;

            default:
                return new Response(
                    JSON.stringify({ error: "Invalid action" }),
                    { status: 400 }
                );
        }

        // Update admin notes if provided
        if (adminNotes) {
            returnRequest.adminNotes = (returnRequest.adminNotes || "") + "\n" + adminNotes;
        }

        await returnRequest.save();

        // Send email notification to customer (background)
        (async () => {
            try {
                const { EmailService } = await import("@/services/emailService");

                let emailSubject = "";
                let emailBody = "";

                if (action === "approve") {
                    emailSubject = "Return Approved - " + returnId;
                    emailBody = `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #4CAF50; text-align: center;">✅ Return Request Approved</h2>
              <p>Hi <strong>${returnRequest.customerName}</strong>,</p>
              <p>Good news! Your return request <strong>${returnId}</strong> has been approved.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Pack the items securely in original packaging</li>
                  <li>Ship the items back to us</li>
                  <li>Refund will be processed after we receive the items</li>
                </ol>
              </div>

              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                Ibnemukhtar Brand Store - Support Team
              </p>
            </div>
          `;
                } else if (action === "reject") {
                    emailSubject = "Return Request Update - " + returnId;
                    emailBody = `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #f44336; text-align: center;">Return Request Status</h2>
              <p>Hi <strong>${returnRequest.customerName}</strong>,</p>
              <p>After reviewing your return request <strong>${returnId}</strong>, we are unable to process it.</p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
                <p><strong>Reason:</strong> ${rejectionReason || "Not eligible for return as per our policy"}</p>
              </div>

              <p>If you have any questions, please contact our support team.</p>

              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                Ibnemukhtar Brand Store - Support Team
              </p>
            </div>
          `;
                } else if (action === "refund") {
                    emailSubject = "Refund Processed - " + returnId;
                    emailBody = `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #4CAF50; text-align: center;">💰 Refund Processed</h2>
              <p>Hi <strong>${returnRequest.customerName}</strong>,</p>
              <p>Your refund for return request <strong>${returnId}</strong> has been processed.</p>
              
              <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="margin: 0; color: #2e7d32;">Rs. ${returnRequest.refundAmount}/-</h3>
                <p style="margin: 5px 0 0 0; color: #666;">Refund Amount</p>
              </div>

              <p><strong>Refund Method:</strong> ${returnRequest.refundMethod}</p>
              <p>Please allow 3-5 business days for the amount to reflect in your account.</p>

              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
                Thank you for shopping with us!<br/>
                Ibnemukhtar Brand Store
              </p>
            </div>
          `;
                }

                if (emailSubject) {
                    await EmailService.sendEmail(
                        returnRequest.customerEmail,
                        emailSubject,
                        emailBody,
                        `Return ${returnId} status updated to ${action}`
                    );
                }
            } catch (emailError) {
                console.error("Email notification failed:", emailError);
            }
        })();

        return new Response(
            JSON.stringify({
                success: true,
                message: responseMessage,
                return: returnRequest,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Update return status error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update return status" }),
            { status: 500 }
        );
    }
}
