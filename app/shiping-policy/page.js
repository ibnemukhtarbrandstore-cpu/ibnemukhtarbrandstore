export const metadata = {
  title: "Shipping Policy - Ibnemukhtar Brand Store | Delivery Information",
  description: "Learn about Ibnemukhtar Brand Store's shipping policy, delivery timelines, and charges across Pakistan. Free delivery available nationwide.",
  keywords: "shipping policy, delivery information, ibnemukhtar shipping, pakistan delivery",
};

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 my-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Shipping Policy</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Delivery Coverage</h2>
          <p className="mb-2">
            Ibnemukhtar Brand Store proudly delivers <strong>across all of Pakistan</strong>. We partner with reliable courier services to ensure your orders reach you safely and on time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Delivery Timeline</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Delivery:</strong> 3-5 working days for most cities in Pakistan</li>
            <li><strong>Major Cities:</strong> Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad - 2-4 working days</li>
            <li><strong>Remote Areas:</strong> 5-7 working days depending on courier service availability</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <em>Note: Delivery times may vary during peak seasons (Eid, holidays) or due to unforeseen circumstances.</em>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Shipping Charges</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-800 text-lg">✅ FREE Delivery Across Pakistan!</p>
            <p className="text-green-700 mt-1">We offer free shipping on all orders to any location in Pakistan, no minimum purchase required.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Order Processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders placed before <strong>3:00 PM (Monday-Saturday)</strong> are processed the same day</li>
            <li>Orders after 3:00 PM are processed the next working day</li>
            <li>Saturday orders after 3:00 PM are processed on Monday (we're closed on Sundays)</li>
            <li>You'll receive a tracking number via SMS/Email once your order is shipped</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Tracking Your Order</h2>
          <p className="mb-2">
            Once your order is dispatched, you'll receive:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Confirmation email/SMS with tracking number</li>
            <li>Updates on delivery status</li>
            <li>Contact number of the courier company</li>
          </ul>
          <p className="mt-3">
            You can also check your order status by logging into <strong>My Account</strong> section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Important Notes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Please ensure someone is available to receive the delivery at the provided address</li>
            <li>Courier partners may contact you before delivery</li>
            <li>Inspect your package before accepting delivery. Report any visible damage immediately</li>
            <li>We are not responsible for delays caused by incorrect addresses or unavailability at delivery time</li>
          </ul>
        </section>

        <section className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Need Help?</h2>
          <p>
            For shipping inquiries, contact us:
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/923467383686" className="text-blue-600 hover:underline">+92 346 7383686</a></li>
            <li><strong>Email:</strong> <a href="mailto:support@ibnemukhtarbrandstore.com" className="text-blue-600 hover:underline">support@ibnemukhtarbrandstore.com</a></li>
          </ul>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last Updated: January 2026
        </p>
      </div>
    </div>
  );
}
