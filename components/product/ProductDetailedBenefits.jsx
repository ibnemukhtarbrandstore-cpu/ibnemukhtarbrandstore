export default function ProductDetailedBenefits({ benefits }) {
    // Default benefits if product doesn't have custom data
    const defaultBenefits = [
        {
            title: "High Quality Materials",
            description: "Made with premium materials that last. Built to withstand daily use while maintaining its quality and appearance."
        },
        {
            title: "Satisfaction Guaranteed",
            description: "100% customer satisfaction guaranteed. If you're not completely happy, we'll make it right with our easy return policy."
        },
        {
            title: "Fast & Reliable",
            description: "Quick delivery across Pakistan. Secure packaging ensures your product arrives in perfect condition."
        }
    ];

    const displayBenefits = (benefits && benefits.length > 0) ? benefits : defaultBenefits;

    return (
        <div className="my-8">
            <div className="space-y-4">
                {displayBenefits.slice(0, 3).map((benefit, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
