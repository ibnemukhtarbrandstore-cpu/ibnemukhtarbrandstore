import { GENERIC_FAQS } from '@/lib/genericProductData';

export default function ProductFAQ() {
    // Always show generic FAQs - they apply to all products
    return (
        <div className="my-8">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
                {GENERIC_FAQS.map((faq, index) => (
                    <details
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow group"
                    >
                        <summary className="font-semibold text-gray-800 cursor-pointer flex items-center justify-between">
                            <span>{faq.question}</span>
                            <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
}
