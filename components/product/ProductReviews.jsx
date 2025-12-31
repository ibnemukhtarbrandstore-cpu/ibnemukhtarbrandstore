export default function ProductReviews({ reviews }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="my-8">
            <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.slice(0, 3).map((review, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-2">
                            <div className="text-yellow-400 text-sm">
                                {'⭐'.repeat(review.rating || 5)}
                            </div>
                            {review.verified && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                    ✓ Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2 italic">"{review.text}"</p>
                        <p className="text-xs text-gray-500">
                            - {review.name}, {review.location}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
