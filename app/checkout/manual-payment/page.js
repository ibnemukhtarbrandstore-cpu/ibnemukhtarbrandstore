"use client";
import BaseCard from "@/app/admin/(DashboardLayout)/components/shared/BaseCard";
import BorderSection from "@/components/atom/BorderSection";
import PaymentMethods from "@/components/atom/paymentMethods/PaymentMethods";
import { useCart } from "@/context/CartProvider";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { cancelPendingRequests } from "@/services/api";
import { Box, Divider, Input, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";

export default function ManualPaymentConfirmation() {
  const { clearCart } = useCart();
  const router = useRouter();
  const { trackCheckout } = useFacebookPixel();
  const [image, setImage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [id, setId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🆕 COD Toggle State
  const COD_CHARGES = 100;
  const [isCOD, setIsCOD] = useState(false); // Toggle for COD
  const [baseAmount, setBaseAmount] = useState(0); // Original amount without COD
  const [finalAmount, setFinalAmount] = useState(0); // Final amount with/without COD

  useEffect(() => {
    toast.info("Upload Payment Screen Shot");

    const pendingOrderDataString = localStorage.getItem("pendingOrderData");
    console.log("after saving locally order data", pendingOrderDataString);

    if (!pendingOrderDataString) {
      toast.error("No order data found. Please go back to checkout.");
      router.push("/checkout");
      return;
    }

    // ✅ Parse String → Object
    const pendingOrderData = JSON.parse(pendingOrderDataString);

    console.log("after added trackchekout data : ", pendingOrderData.cart);
    console.log("after added trackchekout data amount: ", pendingOrderData.amount);

    // ✅ Track checkout with correct values
    trackCheckout(pendingOrderData.cart, pendingOrderData.amount);

    setBaseAmount(pendingOrderData.amount); // Store original amount
    setFinalAmount(pendingOrderData.amount); // Initially same
    setOrderId(pendingOrderData.orderId);

    return () => {
      cancelPendingRequests();
    };
  }, []);

  // 🆕 COD Toggle Handler - Add/Remove 100 rupees
  const handleCODToggle = () => {
    const newCODState = !isCOD;
    setIsCOD(newCODState);

    if (newCODState) {
      // Add COD charges
      setFinalAmount(baseAmount + COD_CHARGES);
      toast.info(`COD charges Rs. ${COD_CHARGES} added!`, {
        autoClose: 1500,
      });
    } else {
      // Remove COD charges
      setFinalAmount(baseAmount);
      toast.info("COD charges removed", {
        autoClose: 1500,
      });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Get order data from localStorage
      const pendingOrderData = localStorage.getItem("pendingOrderData");
      if (!pendingOrderData) {
        toast.error("No order data found. Please go back to checkout.");
        router.push("/checkout");
        return;
      }

      const orderData = JSON.parse(pendingOrderData);

      // 🆕 Update with COD details if toggle is ON
      if (isCOD) {
        orderData.paymentMethod = "COD";
        orderData.codCharges = COD_CHARGES;
        orderData.amount = finalAmount; // Updated amount with COD
      } else {
        // Ensure MANUAL is set if not COD
        if (!orderData.paymentMethod || orderData.paymentMethod === "easypaisa") {
          orderData.paymentMethod = "MANUAL";
        }
        orderData.codCharges = 0;
      }

      // Step 1: Create order first from backend
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/manual-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const orderResult = await orderRes.json();
      console.log("order rquest result: ", orderResult)
      // Check if order creation failed (temp/error)
      if (!orderRes.ok || orderResult.error) {
        setLoading(false);

        // Remove cart and order data from localStorage
        clearCart();
        localStorage.removeItem("pendingOrderData");
        localStorage.removeItem("userOriginPage");

        // Show error message
        toast.error("Order temp hai! Please try again.", {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Redirect to origin page
        const originPage = localStorage.getItem("userOriginPage") || "/";
        router.push(originPage);
        return;
      }

      // Step 2: Create proof (skip for COD)
      if (orderData.paymentMethod === "MANUAL") {
        const formData = new FormData();
        formData.append("orderId", orderResult.odr.orderId);
        formData.append("image", image);

        const proofRes = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/menual-payment-proof`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!proofRes.ok) {
          const errorText = await proofRes.text();
          console.error("Plese again submit Screenshort:", errorText);
          setLoading(false);
          return;
        }

        const proofResult = await proofRes.json();
        if (proofResult.error) {
          setSubmitted(false);
          setLoading(false);
          return;
        }

        if (proofRes.ok) {
          setSubmitted(true);
          setId(orderResult.odr._id);
          localStorage.setItem("orderID", orderResult.odr.orderId);

          // Clear localStorage data
          localStorage.removeItem("pendingOrderData");
          localStorage.removeItem("userOriginPage");

          toast.success("Congrates! Proof sent successfully", {
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } else {
        // COD: No proof needed, just mark as submitted
        setSubmitted(true);
        setId(orderResult.odr._id);
        localStorage.setItem("orderID", orderResult.odr.orderId);
        localStorage.removeItem("pendingOrderData");
        localStorage.removeItem("userOriginPage");

        toast.success("COD Order placed successfully!", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
      setLoading(false);
    } catch (error) {
      toast.error("Please try again", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
    }
  };

  const toggleClose = () => {
    clearCart();
    if (id) {
      localStorage.removeItem("order");
      router.push(`/order/${id}`);
    }
  };

  const toggleCloseU = () => {
    clearCart();
    localStorage.removeItem("order");
  };

  if (submitted) {
    return (
      <BaseCard>
        <Head>
          <title> Pyment Proff - CHAMPION-CHOICE</title>
          <meta
            name="description"
            content="You can upload here payment uprove if is valid  then CHAMPION-CHOICE TEAM placed your order if not then tell you please again pay your proof is not valid!"
          />
        </Head>
        <div className="flex flex-col items-center justify-between bg-white mx-auto text-center mt-[50px] py-20 px-auto mx-8 shadow-lg rounded-xl relative">
          <button onClick={toggleClose}>
            <RxCross1 className="absolute top-2 right-4 text-black text-xl" />
          </button>
          <h2 className="text-xl text-gray-700 font-semibold mb-2 ">
            ORDER PLACED
          </h2>
          <div className=" w-80 text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-white text-[#DD8560] border border-2 border-[#DD8560] rounded-full flex items-center justify-center mx-auto"
            >
              <FaCheck className="text-[#DD8560] text-xl" />
            </motion.div>
          </div>
          <p className="py-4 px-4">
            Your order was successfully sent to IBNEMUKHTAR Brand Store Team Your order
            confirem in 3 working days your Order ID: {orderId}
          </p>
          <div className="w-[40%]">
            <BorderSection />
          </div>
          <div className="flex space-x-3 mt-10">
            <Link href={"/products"}>
              <button
                onClick={toggleCloseU}
                className="bg-black hover:bg-[#DD8560] text-white py-3 px-5 text-sm "
              >
                CUNTINUE SHOPING
              </button>
            </Link>
            <button
              onClick={toggleClose}
              className="border border-2 border-black px-4 text-sm hover:text-[#DD8560] hover:border-[#DD8560]"
            >
              VIEW ORDER
            </button>
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <Box
      maxWidth={500}
      mx="auto"
      mt={10}
      mb={8}
      p={4}
      component={Paper}
      elevation={3}
      borderRadius={3}
    >
      <Head>
        <title>Upload Proof</title>
        <meta
          name="description"
          content="you can also upload here proof of you payment if any issue then contect you by CHAMPION CHOICE team  "
        />
      </Head>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />{" "}
      <Typography variant="h4" align="center" gutterBottom>
        Confirm Manual Payment
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" mb={3}>
        Please follow the steps below to confirm your manual Easypaisa payment.
      </Typography>

      {/* 🆕 COD Toggle Checkbox */}
      <Box mb={3} p={3} bgcolor={isCOD ? "#EEF2FF" : "#F9FAFB"} borderRadius={2} border={isCOD ? "2px solid #4F46E5" : "1px solid #E5E7EB"}>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isCOD}
              onChange={handleCODToggle}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="ml-3">
              <Typography variant="subtitle1" fontWeight="bold" color={isCOD ? "#4F46E5" : "text.primary"}>
                💵 Cash on Delivery (COD)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pay when you receive your order
              </Typography>
            </div>
          </div>
          <Typography variant="h6" fontWeight="bold" color={isCOD ? "#4F46E5" : "text.secondary"}>
            + Rs. {COD_CHARGES}
          </Typography>
        </label>
      </Box>

      <Typography
        className="flex items-center justify-start space-x-2"
        variant="subtitle1"
        fontWeight="bold"
      >
        Your Amount: Rs.
        {finalAmount ? finalAmount : <LuLoader className="animate-spin" />}/_
      </Typography>

      {/* 🆕 Hide Step 1 when COD selected */}
      {!isCOD && (
        <Box mb={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Step 1: Send Payment
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Send the required amount to the following Easypaisa number:
          </Typography>
          <PaymentMethods />
        </Box>
      )}

      {/* 🆕 Hide Step 2 when COD selected */}
      {!isCOD && (
        <Box mb={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Step 2: Upload Screenshot
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            After making the payment, take a clear screenshot and upload it using
            the form below.
          </Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        {/* 🆕 Hide image upload when COD */}
        {!isCOD && (
          <>
            <Typography fontWeight="500" mb={1}>
              Upload Payment Screenshot:
            </Typography>
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              fullWidth
              onChange={(e) => setImage(e.target.files?.[0])}
              required
            />

            <Typography variant="caption" color="text.secondary" mt={1}>
              Only JPG or PNG. Max size: 5MB
            </Typography>
          </>
        )}

        <button
          disabled={loading}
          type="submit"
          className="disabled:cursor-not-allowed bg-black text-white font-[100] w-full py-3"
        >
          {loading ? "Processing..." : (isCOD ? "Confirm COD Order" : "Upload & Submit")}
        </button>
      </form>
      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        Need help?{" "}
        <a
          href="tel:03164288921"
          style={{ color: "#1976d2", textDecoration: "underline" }}
        >
          Call 03164288921
        </a>
      </Typography>
    </Box>
  );
}
