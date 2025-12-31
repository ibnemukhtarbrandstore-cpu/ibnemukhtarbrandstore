export default function ProductMainBenefit({ headline, text }) {
    // Default content
    const defaultHeadline = "Premium Quality You Can Trust";
    const defaultText = "Experience the difference with our carefully crafted product. Designed with attention to detail and made to exceed your expectations. Join thousands of satisfied customers.";

    const displayHeadline = headline || defaultHeadline;
    const displayText = text || defaultText;

    return (
        <div className="my-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {displayHeadline}
            </h2>
            <p className="text-gray-700 leading-relaxed">
                {displayText}
            </p>
        </div>
    );
}
