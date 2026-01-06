export const metadata = {
  title: "Return Policy - Ibnemukhtar Brand Store | Easy Returns Process",
  description: "Learn about Ibnemukhtar Brand Store's hassle-free return policy. Returns accepted within 1-4 working days of delivery for damaged, defective, or incorrect items.",
  keywords: "return policy, exchange policy, ibnemukhtar returns, product returns pakistan",
};

export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 my-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Return & Exchange Policy</h1>

      <div className="space-y-6 text-gray-700">
        <p className="text-lg text-gray-600">
          At <strong>Ibnemukhtar Brand Store</strong>, your satisfaction is our priority. We offer a transparent and fair return policy to ensure a worry-free shopping experience.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Return Window</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900">
              Returns accepted within <span className="text-xl">1-4 working days</span> after delivery
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Please inspect your items upon delivery and contact us immediately if there's an issue.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Eligible Returns</h2>
          <p className="mb-2">We accept returns only for the following reasons:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Damaged Items:</strong> Product arrived damaged during shipping</li>
            <li><strong>Defective Items:</strong> Manufacturing defects or quality issues</li>
            <li><strong>Wrong Item:</strong> You received a different product than ordered</li>
            <li><strong>Size/Color Mismatch:</strong> Item doesn't match the ordered specifications</li>
          </ul>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-3">
            <p className="text-red-800 font-semibold">
              ❌ Change of mind returns are NOT accepted
            </p>
            <p className="text-red-700 text-sm">
              Please ensure you're ordering the correct item, size, and color before placing your order.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Return Conditions</h2>
          <p className="mb-2">To qualify for a return, items must meet these conditions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>✅ Unused and unworn</li>
            <li>✅ In original packaging with all tags attached</li>
            <li>✅ No signs of damage, stains, or alterations</li>
            <li>✅ All accessories and free gifts (if any) included</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">How to Return an Item</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-semibold">Contact Us</p>
                  <p className="text-sm">Reach out to our customer support via WhatsApp (+92 3164288921) or email within the return window</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-semibold">Provide Details</p>
                  <p className="text-sm">Share your order number, reason for return, and clear photos of the item/issue</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-semibold">Get Approval</p>
                  <p className="text-sm">Our team will review and approve your return request</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="font-semibold">Ship the Item</p>
                  <p className="text-sm">Pack the item securely and ship it back to our address (we'll provide details)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <p className="font-semibold">Receive Refund/Exchange</p>
                  <p className="text-sm">Once we receive and inspect the item, you'll get a refund or exchange</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Return Shipping Costs</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Our Mistake:</strong> If the item is damaged, defective, or incorrect, we'll cover all return shipping costs</li>
            <li><strong>Customer Request:</strong> For size/color changes or other reasons, return shipping is paid by the customer</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            We ensure return shipping costs are reasonable and never exceed the product value.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Customized or personalized products</li>
            <li>Underwear or intimate apparel (for hygiene reasons)</li>
            <li>Items on final sale or clearance (marked as non-returnable)</li>
            <li>Gift cards or vouchers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Exchanges</h2>
          <p className="mb-2">
            We happily accept exchanges for size or color variations, subject to availability. The exchange process follows the same steps as returns. There's no additional charge for exchanges if initiated within the return window.
          </p>
        </section>

        <section className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Need Help?</h2>
          <p className="mb-2">Contact our customer support team:</p>
          <ul className="space-y-1">
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/923467383686" className="text-blue-600 hover:underline">+92 3164288921</a></li>
            <li><strong>Phone:</strong> +92 3164288921</li>
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
