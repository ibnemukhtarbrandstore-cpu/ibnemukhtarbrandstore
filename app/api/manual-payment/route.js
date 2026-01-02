import connectDb from "@/middleware/mongoose";
import { Coupon } from "@/models/Coupon";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";


export const POST = async (req) => {
  try {
    console.log("#######################################################");
    console.log("enter in try block");
    console.log("#######################################################");

    await connectDb();
    const body = await req.json();
    console.log("#######################################################");
    console.log("after body parsing: ", body);
    console.log("#######################################################");
    const products = {}; // âœ… Use object instead of array
    let serverTotal = 0;
    let discountAmount = 0;

    for (let slug in body.cart) {
      const item = body.cart[slug];
      console.log("#######################################################");
      console.log("in for loop: ", item);
      console.log("#######################################################");
      let product = await Product.findOne({ slug });
      console.log("#######################################################");
      console.log("product menual payment line 22: ", product);
      console.log("#######################################################");

      if (!product) {
        return new Response(
          JSON.stringify({
            error: `Item "${slug}" not found in Product.`,
          }),
          { status: 404 }
        );
      }

      if (product.availability < item.qty) {
        console.log("#######################################################");
        console.log("enter in availity error");
        console.log("#######################################################");
        return new Response(
          JSON.stringify({
            message: `This Product: ${product.title} is out of stock, sorry!`,
            code: "OUT_OF_STOCK",
          }),
          { status: 409 }
        );
      }
      console.log("#######################################################");
      console.log("out availbilty error");
      console.log("#######################################################");

      // âœ… Comprehensive Price Validation for All Product Types
      const now = new Date();
      let finalPrice = product.price; // Start with original price
      let priceType = "regular";

      // Check for Flash Sale
      if (
        product.flashEnd &&
        product.flashPrice &&
        product.flashPrice !== null &&
        product.flashPrice < product.price
      ) {
        console.log("#######################################################");
        console.log("enter in flash sale cheker");
        console.log("#######################################################");
        const flashEndDate = new Date(product.flashEnd);
        console.log("#######################################################");
        console.log("after flashdate calculator", flashEndDate);
        console.log("#######################################################");
        if (now <= flashEndDate) {
          console.log(
            "#######################################################"
          );
          console.log("enter if flash date end valid");
          console.log(
            "#######################################################"
          );
          // Flash sale is active
          finalPrice = product.flashPrice;
          priceType = "flash_sale";
        } else {
          // âœ… Flash sale expired â†’ backend real price accept karega
          finalPrice = product.price;
          priceType = "regular";
        }
      }
      console.log("#######################################################");
      console.log("out flash sale cheker");
      console.log("#######################################################");

      // Apply discount percentage if available (on top of flash price or regular price)
      if (product.discountPercent && product.discountPercent > 0) {
        console.log("#######################################################");
        console.log("enter in discounted cheker");
        console.log("#######################################################");
        finalPrice = finalPrice - (finalPrice * product.discountPercent) / 100;
        priceType =
          priceType === "flash_sale" ? "flash_sale_discounted" : "discounted";
      }

      // Validate the price user is trying to pay
      if (Math.abs(item.price - finalPrice) > 0.01) {
        // Allow small floating point differences
        return new Response(
          JSON.stringify({
            error: `Price mismatch for ${product.title}. Expected: ${finalPrice.toFixed(2)}, got: ${item.price}. Price type: ${priceType}`,
            expectedPrice: finalPrice,
            receivedPrice: item.price,
            priceType: priceType,
          }),
          { status: 400 }
        );
      }

      // Add to server total
      serverTotal += finalPrice * item.qty;
      console.log("#######################################################");
      console.log("after add server total");
      console.log("#######################################################");
      products[slug] = {
        name: product.title,
        size: product.size,
        color: product.color,
        qty: parseInt(item.qty),
        price: finalPrice,
        originalPrice: product.price,
        flashPrice: product.flashPrice || null,
        discountPercent: product.discountPercent || 0,
        priceType: priceType,
      };
    }
    const coupon = await Coupon.findOne({ code: body.code });
    if (body.code && !coupon) {
      return new Response(
        JSON.stringify({
          error: `Invalid coupon code: ${body.code}`,
        }),
        { status: 400 }
      );
    }
    if (coupon) {
      if (coupon.discountType === "percentage") {
        discountAmount = (serverTotal * coupon.discountValue) / 100;
      } else if (coupon.discountType === "flat") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "bogo") {
        // BOGO logic here
      } else if (coupon.discountType === "free-delivery") {
        // Free delivery logic here
      }
    }

    // 🆕 COD Verification - Server-side constant
    const COD_CHARGES = 100; // MUST match frontend
    let codCharge = 0;

    // Check if payment method is COD
    if (body.paymentMethod === "COD") {
      // Verify COD charges from client
      if (!body.codCharges || body.codCharges !== COD_CHARGES) {
        console.log("COD CHARGES MISMATCH:", {
          received: body.codCharges,
          expected: COD_CHARGES
        });
        return new Response(
          JSON.stringify({
            error: `COD charges mismatch! Expected: Rs. ${COD_CHARGES}, received: Rs. ${body.codCharges || 0}`,
          }),
          { status: 400 }
        );
      }
      codCharge = COD_CHARGES;
    }

    // Calculate expected amount: products + delivery + COD - discount
    const expectedAmount = serverTotal + body.deliveryCharge + codCharge - discountAmount;

    console.log("=== AMOUNT VERIFICATION ===");
    console.log("SERVER TOTAL (products): ", serverTotal);
    console.log("DELIVERY CHARGES: ", body.deliveryCharge);
    console.log("COD CHARGES: ", codCharge);
    console.log("DISCOUNT AMOUNT: ", discountAmount);
    console.log("EXPECTED TOTAL: ", expectedAmount);
    console.log("RECEIVED TOTAL: ", body.amount);
    console.log("===========================");

    // Verify total amount matches (allow small floating point differences)
    if (Math.abs(expectedAmount - body.amount) > 0.01) {
      return new Response(
        JSON.stringify({
          error: `Amount mismatch! Expected: Rs. ${expectedAmount}, received: Rs. ${body.amount}`,
          breakdown: {
            products: serverTotal,
            delivery: body.deliveryCharge,
            cod: codCharge,
            discount: discountAmount,
            expectedTotal: expectedAmount,
            receivedTotal: body.amount
          }
        }),
        { status: 400 }
      );
    }

    if (!/^\d{11}$/.test(body.phone)) {
      console.log("#######################################################");
      console.log("enter in phoone cheker");
      console.log("#######################################################");
      return new Response(
        JSON.stringify({
          message: "Please! Enter a valid 11-digit phone number.",
        }),
        { status: 409 }
      );
    }
    console.log("#######################################################");
    console.log("out phone cheker logic ");
    console.log("#######################################################");
    const odr = new Order({
      name: body.name,
      email: body.email,
      phone: body.phone,
      orderId: body.orderId,
      paymentInfo: `delivery charges is ${body.deliveryCharge}`,
      address: body.address,
      amount: expectedAmount,
      products, // âœ… clean object with slugs as keys
      city: body.city,
      state: body.state,
      status: body.paymentMethod === "COD" ? "paid" : "pending", // ✅ Auto-approve COD orders
      deliveryStatus: "unshifted",
      deliveryCharge: body.deliveryCharge,
      deliveryMethod: body.deliveryMethod,
      discountValue: discountAmount || "0",
      couponCode: body.code || " ",
      paymentMethod: body.paymentMethod || "MANUAL", // 🆕 COD or MANUAL
    });

    await odr.save();
    console.log("#######################################################");
    console.log("after saving order ");
    console.log("#######################################################");

    // 🆕 Send email notification to admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/notifications/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: odr.orderId,
          paymentMethod: body.paymentMethod || "MANUAL",
          amount: body.amount,
          customerName: body.name,
          email: body.email
        })
      });
    } catch (emailError) {
      console.log("Email notification failed (non-critical):", emailError.message);
    }

    return new Response(
      JSON.stringify({ orderId: odr.orderId, success: true }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("#######################################################");
    console.log("enter in catch block");
    console.log("#######################################################");
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
};
