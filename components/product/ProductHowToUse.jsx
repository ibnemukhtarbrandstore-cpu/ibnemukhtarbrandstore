export default function ProductHowToUse({ headline, text }) {
    // Default content
    const defaultHeadline = "Easy to Use";
    const defaultText = "Simple and straightforward application. Follow the included instructions for best results. Suitable for daily use.";

    const displayHeadline = headline || defaultHeadline;
    const displayText = text || defaultText;

    return (
        <div className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
                {displayHeadline}
            </h2>
            <p className="text-gray-700 leading-relaxed">
                {displayText}
            </p>
        </div>
    );
}
