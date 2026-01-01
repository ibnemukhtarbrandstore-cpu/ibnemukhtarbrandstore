import CircularProgress from '@/components/common/CircularProgress';

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

    // Different colors for variety
    const colors = ['#10b981', '#3b82f6', '#8b5cf6'];

    return (
        <div className="my-8 p-6 md:p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
                {displayHeadline}
            </h2>
            <p className="text-center text-gray-700 mb-8 md:mb-10">
                {displayText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {displayStats.slice(0, 3).map((stat, index) => (
                    <div
                        key={index}
                        className="flex gap-2 justify-center items-center p-6 bg-white rounded-xl border border-green-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        {/* Circular Progress */}
                        <div className="mb-4">
                            <CircularProgress
                                percentage={stat.percentage}
                                size={100}
                                strokeWidth={9}
                                color={colors[index % colors.length]}
                                animationDuration={1500}
                            />
                        </div>

                        {/* Description Text */}
                        <p className="text-xs md:text-sm text-gray-700 text-center font-medium">
                            {stat.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
