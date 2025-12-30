'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ShopByCollection() {
    const router = useRouter();

    const collections = [
        {
            id: 1,
            name: 'Unique Finds',
            icon: '✨',
            imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop&q=80',
            gradient: 'from-amber-400 via-orange-500 to-red-600',
            badge: 'One-of-a-kind',
            link: '/collections/unique-finds',
            description: 'Limited items'
        },
        {
            id: 2,
            name: 'Clothing & Apparel',
            icon: '👕',
            imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=200&fit=crop&q=80',
            gradient: 'from-purple-500 to-blue-600',
            link: '/collections/clothing',
            description: 'Fashion for all'
        },
        {
            id: 3,
            name: 'Shoes & Footwear',
            icon: '👟',
            imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop&q=80',
            gradient: 'from-orange-500 to-red-600',
            link: '/collections/shoes',
            description: 'Step in style'
        },
        {
            id: 4,
            name: 'Beauty & Care',
            icon: '💄',
            imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&q=80',
            gradient: 'from-pink-400 to-rose-600',
            link: '/collections/beauty',
            description: 'Look gorgeous'
        },
        {
            id: 5,
            name: 'Health & Wellness',
            icon: '🏥',
            imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=200&fit=crop&q=80',
            gradient: 'from-green-400 to-emerald-600',
            link: '/collections/health',
            description: 'Stay healthy'
        },
        {
            id: 6,
            name: 'Sports & Active',
            icon: '⚡',
            imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop&q=80',
            gradient: 'from-blue-500 to-cyan-600',
            link: '/collections/sports',
            description: 'Get active'
        },
        {
            id: 7,
            name: 'Accessories',
            icon: '👜',
            imageUrl: 'https://images.unsplash.com/photo-1532545261798-1ea38921e7c3?w=200&h=200&fit=crop&q=80',
            gradient: 'from-yellow-400 to-amber-600',
            link: '/collections/accessories',
            description: 'Complete look'
        },
        {
            id: 8,
            name: 'Electronics',
            icon: '📱',
            imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&q=80',
            gradient: 'from-gray-600 to-slate-800',
            link: '/collections/electronics',
            description: 'Tech essentials'
        },
        {
            id: 9,
            name: 'Pre-Loved',
            icon: '♻️',
            imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&q=80',
            gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
            badge: 'Sustainable',
            link: '/collections/pre-loved',
            description: 'Eco-friendly'
        }
    ];

    const handleCollectionClick = (link) => {
        router.push(link);
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">
                    Shop by Collection
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                    Browse our curated collections crafted just for you
                </p>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        onClick={() => handleCollectionClick(collection.link)}
                        className={`group relative bg-gradient-to-br ${collection.gradient} rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center p-4 md:p-6 hover:scale-105`}
                    >
                        {/* Badge */}
                        {collection.badge && (
                            <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs font-bold px-2 py-1 rounded-full shadow text-gray-800">
                                {collection.badge}
                            </div>
                        )}

                        {/* 🎨 IMAGE PLACEHOLDER - Replace imageUrl in collections array above */}
                        {collection.imageUrl ? (
                            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 rounded-full overflow-hidden">
                                <Image
                                    src={collection.imageUrl}
                                    alt={collection.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </div>
                        ) : (
                            /* Fallback to icon if no image */
                            <div className="text-5xl md:text-6xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                                {collection.icon}
                            </div>
                        )}

                        {/* Name */}
                        <h3 className="text-base md:text-lg font-bold text-white text-center mb-1 md:mb-2">
                            {collection.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs md:text-sm text-white text-opacity-90 text-center">
                            {collection.description}
                        </p>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Explore →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
