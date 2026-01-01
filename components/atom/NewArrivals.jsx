'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/common/OptimizedImage';
import { getOptimizedCloudinaryUrl } from '@/services/api';

export default function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchNewArrivals();
    }, []);

    const fetchNewArrivals = async () => {
        try {
            const response = await fetch('/api/products/new-arrivals');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (slug) => {
        router.push(`/product/${slug}`);
    };

    const handleViewAll = () => {
        router.push('/collections/new-arrivals');
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8 md:py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
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
        <section className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        🆕 New Arrivals
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-2">
                        Fresh products added this week
                    </p>
                </div>
                <button
                    onClick={handleViewAll}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
                >
                    View All
                </button>
            </div>

            {/* Products Grid - Mobile: Horizontal Scroll, Desktop: Grid */}
            <div className="md:hidden flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                {products.map((product, index) => (
                    <ProductCard
                        key={product._id || index}
                        product={product}
                        onClick={() => handleProductClick(product.slug)}
                        mobile
                    />
                ))}
            </div>

            {/* Desktop Grid */}
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
    const cardClasses = mobile
        ? "flex-shrink-0 w-64 snap-center"
        : "w-full";

    const price = product.flashPrice || product.price;
    const hasDiscount = product.flashPrice && product.price > product.flashPrice;

    return (
        <div
            className={`group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-400 overflow-hidden ${cardClasses}`}
            onClick={onClick}
        >
            {/* New Badge */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-lg">
                🆕 NEW
            </div>

            {/* Discount Badge */}
            {hasDiscount && product.discountPercent > 0 && (
                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    -{product.discountPercent}%
                </div>
            )}

            {/* Product Image */}
            <div className={`relative ${mobile ? 'h-56' : 'h-64'} bg-gray-100 overflow-hidden`}>
                {product.images && product.images.length > 0 ? (
                    <OptimizedImage
                        src={getOptimizedCloudinaryUrl(product.images[0])}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes={mobile ? "256px" : "(max-width: 768px) 50vw, 25vw"}
                        fallbackIcon="📦"
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-10 md:h-12">
                    {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-base md:text-xl font-bold text-blue-600">
                        Rs. {price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-[10px] md:text-sm text-gray-400 line-through">
                            Rs. {product.price?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock Indicator */}
                <div className="h-4">
                    {product.availability <= 3 && product.availability > 0 && (
                        <div className="text-[10px] md:text-xs text-orange-600 font-semibold">
                            ⚠️ Only {product.availability} left!
                        </div>
                    )}
                    {product.availability > 50 && (
                        <div className="text-[10px] md:text-xs text-green-600 font-semibold">
                            ✓ {product.availability}+ in stock
                        </div>
                    )}
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic here
                    }}
                    className={`mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 ${mobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    Quick Add
                </button>
            </div>
        </div>
    );
}
