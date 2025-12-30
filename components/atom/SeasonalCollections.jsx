'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SeasonalCollections() {
    const router = useRouter();
    const [currentSeason, setCurrentSeason] = useState('');

    useEffect(() => {
        // Determine current season based on month
        const month = new Date().getMonth() + 1; // 1-12
        if (month >= 11 || month <= 2) {
            setCurrentSeason('winter');
        } else if (month >= 3 && month <= 5) {
            setCurrentSeason('spring');
        } else if (month >= 6 && month <= 8) {
            setCurrentSeason('summer');
        } else {
            setCurrentSeason('winter'); // Default to winter for Pakistan
        }
    }, []);

    const collections = [
        {
            id: 1,
            name: 'Winter Collection',
            icon: '❄️',
            description: 'Stay warm this winter',
            gradient: 'from-blue-400 via-cyan-500 to-blue-600',
            link: '/collections/winter',
            season: 'winter',
            badge: 'Popular Now'
        },
        {
            id: 2,
            name: 'Summer Collection',
            icon: '☀️',
            description: 'Beat the heat in style',
            gradient: 'from-yellow-400 via-orange-500 to-red-500',
            link: '/collections/summer',
            season: 'summer'
        },
        {
            id: 3,
            name: 'Eid Special',
            icon: '🌙',
            description: 'Celebrate in style',
            gradient: 'from-green-500 via-emerald-600 to-teal-600',
            link: '/collections/eid',
            season: 'eid',
            badge: 'Special'
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
                    Seasonal Collections
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                    Shop the perfect styles for every season
                </p>
            </div>

            {/* Collections Grid */}
            {/* Mobile: Vertical */}
            <div className="md:hidden space-y-4">
                {collections.map((collection) => (
                    <BannerCard
                        key={collection.id}
                        collection={collection}
                        isCurrent={collection.season === currentSeason}
                        onClick={() => handleCollectionClick(collection.link)}
                        mobile
                    />
                ))}
            </div>

            {/* Desktop: Horizontal */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <BannerCard
                        key={collection.id}
                        collection={collection}
                        isCurrent={collection.season === currentSeason}
                        onClick={() => handleCollectionClick(collection.link)}
                    />
                ))}
            </div>
        </section>
    );
}

function BannerCard({ collection, isCurrent, onClick, mobile = false }) {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-gradient-to-br ${collection.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden ${mobile ? 'h-40' : 'h-64'
                } ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-2' : ''} hover:scale-105`}
        >
            {/* Current Season Indicator */}
            {isCurrent && (
                <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    ⭐ Current Season
                </div>
            )}

            {/* Badge */}
            {collection.badge && !isCurrent && (
                <div className="absolute top-3 right-3 z-10 bg-white bg-opacity-90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow">
                    {collection.badge}
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>

            {/* Icon Background */}
            <div className={`absolute ${mobile ? 'top-1/4 right-4 text-7xl' : 'top-1/3 right-8 text-9xl'} opacity-20 group-hover:scale-110 transition-transform duration-500`}>
                {collection.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`${mobile ? 'text-4xl' : 'text-5xl'}`}>
                        {collection.icon}
                    </span>
                    <h3 className={`${mobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-white`}>
                        {collection.name}
                    </h3>
                </div>

                <p className="text-sm md:text-base text-white text-opacity-95 mb-4">
                    {collection.description}
                </p>

                <button className="self-start px-6 py-2 md:px-8 md:py-3 bg-white text-gray-800 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300 text-sm md:text-base">
                    Shop Collection →
                </button>
            </div>
        </div>
    );
}
