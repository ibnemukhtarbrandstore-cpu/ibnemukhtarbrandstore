"use client";
import { LuLoader } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import Link from "next/link"; // Added for Track Order and Return buttons
import CalculatePrice from "@/utils/priceCalculator";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export default function OrderPage({ params, order }) {
  const { trackPurchase } = useFacebookPixel();
  trackPurchase(order);
  console.log("==========================================")
  console.log(`order in order page:/order/track/${order._id}`)
  console.log("==========================================")
  const orderRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!order) {
    return <div>Order not found</div>;
  }

  const downloadPDF = async () => {
    if (!orderRef.current) return;

    setIsGenerating(true);
    try {
      const element = orderRef.current;
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = element.offsetWidth + "px";
      document.body.appendChild(clone);

      // Convert element to canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const margin = 10; // padding from all sides
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      // Add more pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(`order_${order.name}_${order.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
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
      />
      <div className="container px-5 py-24 mx-auto">
        <div ref={orderRef} className="relative">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="">
              <h1 className="text-gray-900 text-2xl title-font font-[500] mb-2">
                Order Detail
              </h1>
              {/* PDF Download Button - placed outside the captured area */}
              <div className="text-center absolute top-15 right-1">
                <button
                  onClick={downloadPDF}
                  disabled={isGenerating}
                  className={`text-white bg-black flex gap-1 items-center font-[200] border-0 py-2 px-6 focus:outline-none hover:bg-green-700 hover:cursor-pointer rounded ${isGenerating ? "bg-green opacity-90 cursor-not-allowed" : ""}`}
                >
                  {isGenerating ? (
                    <LuLoader className="animate-spin" />
                  ) : (
                    <FiDownload />
                  )}
                  {isGenerating ? "Generating PDF..." : "Download PDF"}
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-[10px] title-font text-gray-500 tracking-widest">
                IBNEMUKHTAR
              </h2>
              <h3 className="text-gray-900 text-xl title-font font-medium mb-2">
                Order Id: {order.orderId}
              </h3>
              <p className="leading-relaxed mb-4 text-[14px]">
                Your order placed on:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex mb-4 font-semibold border-b pb-2">
                <span className="flex-grow text-center">Item Description</span>
                <span className="flex-grow text-center">Quantity</span>
                <span className="flex-grow text-center">Item Total</span>
              </div>

              {Object.entries(order.products).map(([key, product]) => (
                <div
                  key={key}
                  className="flex border-t border-gray-200 py-2 items-center"
                >
                  <span className="w-1/3 text-gray-900 text-sm">
                    ({product.uniformNumberFormat || "*"}):
                    {product.title || product.company} ({product.size || "Mis"}/
                    {product.color || product?.category?.toUpperCase() || "Mis"}
                    )
                  </span>
                  <span className="w-1/3 text-center text-gray-700">
                    {product.qty || 1}
                  </span>
                  <span className="w-1/3 text-center text-gray-700">
                    Rs.
                    {product.qty
                      ? product.qty * product.price
                      : CalculatePrice(product)}
                    /-
                  </span>
                </div>
              ))}

              <div className="flex flex-col mt-6 space-y-4">
                <span className="title-font font-medium text-2xl text-gray-900">
                  Total: Rs.{order.amount}/-
                </span>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <p className="text-sm text-gray-600">
                  Delivery Status: {order.deliveryStatus}
                </p>

                {/* Track Order Button */}
                <Link href={`/order/track/${order._id}`}>
                  <button className="w-full text-white bg-blue-600 border-0 py-3 px-6 focus:outline-none hover:bg-blue-700 rounded flex items-center justify-center gap-2">
                    📍 Track Order
                  </button>
                </Link>

                {/* Request Return Button - Only show if:
                    1. Order is delivered
                    2. Within 14 days of delivery date
                    3. Payment status is paid
                */}
                {(() => {
                  // Check if delivered
                  if (order.deliveryStatus !== "delivered") return null;

                  // Check if paid
                  if (order.status !== "paid") return null;

                  // Calculate days since delivery
                  const deliveryDate = order.deliveredAt
                    ? new Date(order.deliveredAt)
                    : order.updatedAt
                      ? new Date(order.updatedAt)
                      : new Date(order.createdAt);

                  const today = new Date();
                  const daysSinceDelivery = Math.floor(
                    (today - deliveryDate) / (1000 * 60 * 60 * 24)
                  );

                  // Only show if within 14 days
                  if (daysSinceDelivery > 14) return null;

                  const daysRemaining = 14 - daysSinceDelivery;

                  return (
                    <div className="space-y-2">
                      <Link href={`/myaccount/returns/request?orderId=${order.orderId}`}>
                        <button className="w-full text-white bg-orange-600 border-0 py-3 px-6 focus:outline-none hover:bg-orange-700 rounded flex items-center justify-center gap-2">
                          🔄 Request Return
                        </button>
                      </Link>
                      <p className="text-xs text-center text-gray-500">
                        Return window: {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                      </p>
                    </div>
                  );
                })()}

                {/* Thank You Message */}
                {order.status === "paid" && (
                  <p className="text-center text-green-600 font-medium">
                    ✓ Thank you for your order!
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center lg:w-1/2 w-full lg:pl-10">
              <Image
                src={order.deliveryVoucher || "/images/ibnemukhtarbrandstore-logo.png"}
                alt={order.name}
                width={300}
                height={300}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
