'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getOptimizedCloudinaryUrl } from '@/services/api';

export default function BestSellers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const response = await fetch('/api/products/best-sellers');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (slug) => {
        router.push(`/product/${slug}`);
    };

    const handleViewAll = () => {
        router.push('/collections/best-sellers');
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8 md:py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
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
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                        🏆 Best Sellers
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-2">
                        Customer favorites & top-rated products
                    </p>
                </div>
                <button
                    onClick={handleViewAll}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
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
                        rank={index + 1}
                        onClick={() => handleProductClick(product.slug)}
                        mobile
                    />
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-5 gap-6">
                {products.slice(0, 10).map((product, index) => (
                    <ProductCard
                        key={product._id || index}
                        product={product}
                        rank={index + 1}
                        onClick={() => handleProductClick(product.slug)}
                    />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ product, rank, onClick, mobile = false }) {
    const [imageError, setImageError] = useState(false);

    const cardClasses = mobile ? "flex-shrink-0 w-56 sm:w-64 snap-center" : "";
    const price = product.flashPrice || product.price;
    const hasDiscount = product.flashPrice && product.price > product.flashPrice;
    const salesCount = product.salesCount || 0;

    return (
        <div
            className={`group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-400 overflow-hidden ${cardClasses}`}
            onClick={onClick}
        >
            {/* Best Seller Badge */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-green-400 to-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                🏆 #{rank}
            </div>

            {/* Sales Count Badge */}
            {salesCount > 100 && (
                <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-1 rounded-full shadow-lg">
                    {salesCount >= 1000 ? `${Math.floor(salesCount / 1000)}K+` : `${salesCount}+`} sold
                </div>
            )}

            {/* Stock Indicator */}
            {product.availability > 1 && (
                <div className="absolute top-11 right-2 z-10 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-full shadow">
                    ✓ In Stock
                </div>
            )}

            {/* Product Image */}
            <div className={`relative ${mobile ? 'h-56 sm:h-64' : 'h-64'} bg-gray-100 overflow-hidden`}>
                {product.images && product.images.length > 0 && !imageError ? (
                    <Image
                        src={getOptimizedCloudinaryUrl(product.images[0])}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes={mobile ? "240px" : "(max-width: 768px) 50vw, 20vw"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors min-h-[2.5rem]">
                    {product.title}
                </h3>

                {/* Rating */}
                {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-xs sm:text-sm font-semibold">{product.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-green-600">
                        Rs. {price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                            Rs. {product.price?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="mt-2 sm:mt-3 w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
