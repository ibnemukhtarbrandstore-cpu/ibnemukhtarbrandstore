'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getOptimizedCloudinaryUrl } from '@/services/api';

export default function UniqueFinds() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUniqueFinds();
    }, []);

    const fetchUniqueFinds = async () => {
        try {
            const response = await fetch('/api/products/unique-finds');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching unique finds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (slug) => {
        router.push(`/product/${slug}`);
    };

    const handleViewAll = () => {
        router.push('/collections/unique-finds');
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8 md:py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                        ✨ Unique Finds
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 mt-2 font-medium">
                        One-of-a-kind items - Grab them before they're gone!
                    </p>
                </div>
                <button
                    onClick={handleViewAll}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
                >
                    View All
                </button>
            </div>

            {/* Products Grid */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                {products.map((product, index) => (
                    <ProductCard
                        key={product._id || index}
                        product={product}
                        onClick={() => handleProductClick(product.slug)}
                        mobile
                    />
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product, index) => (
                    <ProductCard
                        key={product._id || index}
                        product={product}
                        onClick={() => handleProductClick(product.slug)}
                    />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ product, onClick, mobile = false }) {
    const [imageError, setImageError] = useState(false);

    const cardClasses = mobile ? "flex-shrink-0 w-44 sm:w-52 snap-center" : "";
    const price = product.flashPrice || product.price;
    const hasDiscount = product.flashPrice && product.price > product.flashPrice;
    const isPreLoved = product.condition === 'Pre-loved' || product.condition === 'Refurbished';

    return (
        <div
            className={`group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-amber-200 hover:border-orange-400 overflow-hidden ${cardClasses}`}
            onClick={onClick}
        >
            {/* Unique Badge */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-400 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                {isPreLoved ? '♻️ Pre-loved' : '✨ Only 1!'}
            </div>

            {/* Urgency Badge */}
            <div className="absolute top-12 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow animate-pulse">
                ⚠️ Last One!
            </div>

            {/* Condition Badge */}
            {product.condition && (
                <div className="absolute top-2 right-2 z-10 bg-gray-800 bg-opacity-90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {product.condition}
                </div>
            )}

            {/* Product Image */}
            <div className={`relative ${mobile ? 'h-52' : 'h-72'} bg-gray-100 overflow-hidden`}>
                {/* Vintage Border Effect */}
                <div className="absolute inset-0 border-4 border-amber-100 opacity-50 z-5 pointer-events-none"></div>

                {product.images && product.images.length > 0 && !imageError ? (
                    <Image
                        src={getOptimizedCloudinaryUrl(product.images[0])}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes={mobile ? "176px" : "(max-width: 768px) 50vw, 25vw"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">✨</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50">
                <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg md:text-xl font-bold text-orange-600">
                        Rs. {price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs md:text-sm text-gray-400 line-through">
                            Rs. {product.price?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Urgency Message */}
                <div className="text-xs font-bold text-red-600 mb-3 flex items-center gap-1">
                    🔥 Grab it before it's gone!
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Save for later logic
                        }}
                        className="px-3 bg-white border-2 border-orange-300 text-orange-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-50 transition-all"
                        title="Save for Later"
                    >
                        ❤️
                    </button>
                </div>
            </div>
        </div>
    );
}
