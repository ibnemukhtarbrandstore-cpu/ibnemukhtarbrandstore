'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GenderCollectionGrid() {
    const router = useRouter();

    const genderCollections = [
        {
            id: 1,
            title: "Men's Collection",
            subtitle: "Clothing, Shoes, Accessories & More",
            icon: '👔',
            gradient: 'from-blue-600 to-indigo-800',
            link: '/collections/mens',
            imageUrl: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=800&fit=crop&q=80'
        },
        {
            id: 2,
            title: "Women's Collection",
            subtitle: "Fashion, Beauty & Lifestyle",
            icon: '👗',
            gradient: 'from-pink-500 to-purple-600',
            link: '/collections/womens',
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop&q=80'
        },
        {
            id: 3,
            title: "Kids Collection",
            subtitle: "Comfortable & Stylish for Children",
            icon: '🎈',
            gradient: 'from-cyan-400 via-purple-400 to-pink-500',
            link: '/collections/kids',
            imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop&q=80'
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
                    Shop by Gender
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                    Curated collections for everyone
                </p>
            </div>

            {/* Gender Collections Grid */}
            {/* Mobile: Stacked */}
            <div className="md:hidden space-y-4">
                {genderCollections.map((collection) => (
                    <MobileCard
                        key={collection.id}
                        collection={collection}
                        onClick={() => handleCollectionClick(collection.link)}
                    />
                ))}
            </div>

            {/* Desktop: 3 Columns */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
                {genderCollections.map((collection) => (
                    <DesktopCard
                        key={collection.id}
                        collection={collection}
                        onClick={() => handleCollectionClick(collection.link)}
                    />
                ))}
            </div>
        </section>
    );
}

function MobileCard({ collection, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-gradient-to-br ${collection.gradient} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-48`}
        >
            {/* Background Image */}
            {collection.imageUrl && (
                <Image
                    src={collection.imageUrl}
                    alt={collection.title}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>

            {/* Icon */}
            <div className="absolute top-4 left-4 text-6xl opacity-20">
                {collection.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                    {collection.title}
                </h3>
                <p className="text-sm text-white text-opacity-90 mb-4">
                    {collection.subtitle}
                </p>
                <button className="self-start px-6 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
                    Shop Now →
                </button>
            </div>
        </div>
    );
}

function DesktopCard({ collection, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-gradient-to-br ${collection.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden h-96 hover:scale-105`}
        >
            {/* Background Image */}
            {collection.imageUrl && (
                <Image
                    src={collection.imageUrl}
                    alt={collection.title}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            )}

            {/* Gradient Overlay with Parallax Effect */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-500"></div>

            {/* Large Icon in Background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700">
                {collection.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-300">
                    <h3 className="text-3xl font-bold text-white mb-3">
                        {collection.title}
                    </h3>
                    <p className="text-base text-white text-opacity-95 mb-6">
                        {collection.subtitle}
                    </p>
                    <button className="px-8 py-3 bg-white text-gray-800 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg">
                        Explore Collection →
                    </button>
                </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-tr-full"></div>
        </div>
    );
}
