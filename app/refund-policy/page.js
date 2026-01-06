export const metadata = {
  title: "Refund Policy - Ibnemukhtar Brand Store | Money-Back Guarantee",
  description: "Learn about Ibnemukhtar Brand Store's refund policy. Quick refunds processed within 5-7 working days after approved returns.",
  keywords: "refund policy, money back guarantee, ibnemukhtar refunds, return refund pakistan",
};

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 my-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Refund Policy</h1>

      <div className="space-y-6 text-gray-700">
        <p className="text-lg text-gray-600">
          At <strong>Ibnemukhtar Brand Store</strong>, we value your trust. Our refund policy is designed to be fair, transparent, and hassle-free.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Refund Eligibility</h2>
          <p className="mb-2">
            Refunds are processed only after your return is approved according to our <a href="/return-policy" className="text-blue-600 hover:underline font-semibold">Return Policy</a>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Item must be returned unused and in original condition</li>
            <li>Return must be initiated within 1-4 working days of delivery</li>
            <li>Valid reasons: damaged, defective, wrong item, or size/color mismatch</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Refund Processing Time</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 text-lg">
              ⏱️ Refunds processed within 5-7 working days
            </p>
            <p className="text-green-700 text-sm mt-1">
              After we receive and inspect your returned item, refunds are issued promptly to your original payment method.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Refund Process</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-semibold">Return Received</p>
                  <p className="text-sm">We receive your returned item at our warehouse</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-semibold">Quality Inspection</p>
                  <p className="text-sm">Our team inspects the item to verify it meets return conditions</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-semibold">Approval Notification</p>
                  <p className="text-sm">You'll receive email/SMS confirmation that your refund is approved</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="font-semibold">Refund Issued</p>
                  <p className="text-sm">Amount is refunded to your original payment method within 5-7 days</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Refund Methods</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Bank Transfer/Card Payments:</strong> Refunded to the same bank account or card used for payment</li>
            <li><strong>EasyPaisa/JazzCash:</strong> Refunded to the same mobile wallet account</li>
            <li><strong>Cash on Delivery (COD):</strong> Refunded via bank transfer or mobile wallet (account details required)</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <em>Bank processing times may vary. If you don't receive your refund within 7 days, please contact your bank first, then reach out to us.</em>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">What's Included in Refund</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">✅ Refundable</h3>
              <ul className="text-sm space-y-1">
                <li>• Product price</li>
                <li>• Shipping charges (if item was damaged/defective/wrong)</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">❌ Non-Refundable</h3>
              <ul className="text-sm space-y-1">
                <li>• Return shipping charges (customer-initiated returns)</li>
                <li>• COD charges (Rs. 100)</li>
                <li>• Original shipping (customer-initiated returns)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Partial Refunds</h2>
          <p className="mb-2">
            In some cases, only partial refunds may be granted:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Items not in original condition or showing signs of use</li>
            <li>Missing tags, accessories, or packaging</li>
            <li>Items returned after the 4-day return window (if approved)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Rejected Returns</h2>
          <p className="mb-2">
            If your return doesn't meet our criteria, it will be rejected and sent back to you at your expense. Common reasons:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Item shows signs of wear or damage caused by customer</li>
            <li>Missing original packaging or tags</li>
            <li>Item is ineligible for return (customized, final sale, etc.)</li>
            <li>Return window exceeded</li>
          </ul>
        </section>

        <section className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Questions About Your Refund?</h2>
          <p className="mb-2">Contact our customer support team:</p>
          <ul className="space-y-1">
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/923467383686" className="text-blue-600 hover:underline">+92 346 7383686</a></li>
            <li><strong>Phone:</strong> +92 312 0905007</li>
            <li><strong>Email:</strong> <a href="mailto:support@ibnemukhtarbrandstore.com" className="text-blue-600 hover:underline">support@ibnemukhtarbrandstore.com</a></li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            Our team is available Monday-Saturday, 9 AM - 6 PM (PKT)
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last Updated: January 2026
        </p>
      </div>
    </div>
  );
}
