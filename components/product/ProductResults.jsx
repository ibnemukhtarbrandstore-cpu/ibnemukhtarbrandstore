export default function ProductResults({ headline, text, statistics }) {
    // Default content
    const defaultHeadline = "Proven Customer Satisfaction";
    const defaultText = "Based on customer reviews and feedback";
    const defaultStats = [
        { percentage: 94, text: "said 'Great quality for the price'" },
        { percentage: 97, text: "said 'Would recommend to others'" },
        { percentage: 96, text: "said 'Satisfied with purchase'" }
    ];

    const displayHeadline = headline || defaultHeadline;
    const displayText = text || defaultText;
    const displayStats = (statistics && statistics.length > 0) ? statistics : defaultStats;

    return (
        <div className="my-8 p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {displayHeadline}
            </h2>
            <p className="text-center text-gray-700 mb-6">
                {displayText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayStats.slice(0, 3).map((stat, index) => (
                    <div
                        key={index}
                        className="text-center p-4 bg-white rounded-lg border border-green-300 shadow-sm"
                    >
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {stat.percentage}%
                        </div>
                        <p className="text-sm text-gray-700">
                            {stat.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
