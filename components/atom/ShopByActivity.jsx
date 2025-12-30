'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ShopByActivity() {
    const router = useRouter();

    const activities = [
        {
            id: 1,
            name: 'Running',
            icon: '🏃',
            description: 'Gear up for your runs',
            gradient: 'from-blue-500 to-cyan-600',
            link: '/collections/running'
        },
        {
            id: 2,
            name: 'Gym & Training',
            icon: '💪',
            description: 'Power through your workouts',
            gradient: 'from-red-500 to-orange-600',
            link: '/collections/gym'
        },
        {
            id: 3,
            name: 'Outdoor & Adventure',
            icon: '🏔️',
            description: 'Explore the great outdoors',
            gradient: 'from-green-500 to-emerald-600',
            link: '/collections/outdoor'
        },
        {
            id: 4,
            name: 'Casual & Everyday',
            icon: '🎽',
            description: 'Comfort for daily wear',
            gradient: 'from-purple-500 to-pink-600',
            link: '/collections/casual'
        },
        {
            id: 5,
            name: 'Formal & Office',
            icon: '👔',
            description: 'Professional style',
            gradient: 'from-gray-700 to-slate-900',
            link: '/collections/formal'
        }
    ];

    const handleActivityClick = (link) => {
        router.push(link);
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">
                    Shop by Activity
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                    Find products perfect for your lifestyle
                </p>
            </div>

            {/* Activities Grid */}
            {/* Mobile: Vertical Stack */}
            <div className="md:hidden space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        onClick={() => handleActivityClick(activity.link)}
                        className={`group relative bg-gradient-to-r ${activity.gradient} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden p-6 flex items-center gap-4`}
                    >
                        <div className="text-5xl">{activity.icon}</div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">
                                {activity.name}
                            </h3>
                            <p className="text-sm text-white text-opacity-90">
                                {activity.description}
                            </p>
                        </div>
                        <div className="text-white text-2xl group-hover:translate-x-1 transition-transform">
                            →
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Hero Tiles Grid */}
            <div className="hidden md:grid md:grid-cols-5 gap-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        onClick={() => handleActivityClick(activity.link)}
                        className={`group relative bg-gradient-to-br ${activity.gradient} rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden p-6 min-h-[200px] flex flex-col justify-center items-center text-center hover:scale-105`}
                    >
                        {/* Icon */}
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {activity.icon}
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-bold text-white mb-2">
                            {activity.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-white text-opacity-90 mb-4">
                            {activity.description}
                        </p>

                        {/* CTA */}
                        <div className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Shop Now →
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
