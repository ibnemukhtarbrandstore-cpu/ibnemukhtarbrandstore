'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getOptimizedCloudinaryUrl } from '@/services/api';

export default function FreshStock() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchFreshStock();
    }, []);

    const fetchFreshStock = async () => {
        try {
            const response = await fetch('/api/products/fresh-stock');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching fresh stock:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (slug) => {
        router.push(`/product/${slug}`);
    };

    const handleViewAll = () => {
        router.push('/collections/fresh-stock');
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
        <section className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                        ✨ Fresh Stock
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 mt-2 font-medium">
                        Brand new products - Ready to ship now!
                    </p>
                </div>
                <button
                    onClick={handleViewAll}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
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

    const cardClasses = mobile ? "flex-shrink-0 w-40 sm:w-48 snap-center" : "";
    const price = product.flashPrice || product.price;
    const stockCount = product.availability || 0;

    return (
        <div
            className={`group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-cyan-200 hover:border-blue-400 overflow-hidden ${cardClasses}`}
            onClick={onClick}
        >
            {/* Fresh Stock Badge */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ✨ Fresh
            </div>

            {/* Stock Count Badge */}
            {stockCount > 5 && (
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    {stockCount >= 50 ? '50+' : `${stockCount}`} in stock
                </div>
            )}

            {/* New Condition Badge */}
            <div className="absolute top-11 left-2 z-10 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-lg border border-blue-300">
                Brand New
            </div>

            {/* Product Image */}
            <div className={`relative ${mobile ? 'h-48' : 'h-64'} bg-gray-100 overflow-hidden`}>
                {product.images && product.images.length > 0 && !imageError ? (
                    <Image
                        src={getOptimizedCloudinaryUrl(product.images[0])}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImageError(false)}
                        sizes={mobile ? "160px" : "(max-width: 768px) 50vw, 25vw"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg md:text-xl font-bold text-blue-600">
                        Rs. {price?.toLocaleString()}
                    </span>
                </div>

                {/* Ready to Ship Badge */}
                <div className="text-xs font-semibold text-green-600 mb-3 flex items-center gap-1">
                    ✓ Ready to Ship
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
