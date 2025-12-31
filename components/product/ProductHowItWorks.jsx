export default function ProductHowItWorks({ howItWorks }) {
    // Default content if product doesn't have custom data
    const defaultText = "Easy to use! Simply follow the product instructions. Safe for daily use. For best results, use as recommended on the packaging.";
    const content = howItWorks || defaultText;

    return (
        <div className="my-6">
            <details className="border border-gray-200 rounded-lg p-4 bg-white group">
                <summary className="font-bold text-lg cursor-pointer flex items-center justify-between text-gray-800">
                    <span>💡 How It Works</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {content}
                </p>
            </details>
        </div>
    );
}
