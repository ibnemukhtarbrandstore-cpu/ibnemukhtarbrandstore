export default function ProductBenefits({ benefits }) {
    if (!benefits || benefits.length === 0) return null;

    return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.slice(0, 3).map((benefit, index) => (
                <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 hover:shadow-md transition-shadow"
                >
                    <div className="text-4xl mb-2">{benefit.emoji}</div>
                    <p className="text-sm font-medium text-gray-800">{benefit.text}</p>
                </div>
            ))}
        </div>
    );
}
