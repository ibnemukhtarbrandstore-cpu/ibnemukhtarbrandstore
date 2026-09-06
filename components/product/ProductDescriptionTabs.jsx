'use client';
import React, { useState } from 'react';
import SizeGuide from './SizeGuide';
import Image from 'next/image';

/**
 * ProductDescriptionTabs Component
 * Displays tabbed interface with Description and Size Chart / Guide
 * 
 * @param {Object} product - Product object with disc & sizeChartImage field
 * @param {boolean} isHtml - Whether description is HTML
 * @param {string} sizeCategory - Size category for size guide
 */
export default function ProductDescriptionTabs({ product, isHtml, sizeCategory }) {
    const [activeTab, setActiveTab] = useState('description');
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const hasCustomSizeChart = Boolean(product?.sizeChartImage && product.sizeChartImage.trim() !== '');

    return (
        <div className="mt-6">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all duration-200 ${activeTab === 'description'
                            ? 'text-[#DD8560] border-b-2 border-[#DD8560]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    📝 Description
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('sizeGuide')}
                    className={`px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all duration-200 ${activeTab === 'sizeGuide'
                            ? 'text-[#DD8560] border-b-2 border-[#DD8560]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    📏 Size Chart
                </button>
            </div>

            {/* Tab Content */}
            <div className="leading-relaxed">
                {activeTab === 'description' && (
                    <div className="fade-in">
                        {isHtml ? (
                            <div
                                className="prose lg:prose-lg sm:prose-sm max-w-none leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.disc }}
                            />
                        ) : (
                            <span>{product.disc}</span>
                        )}
                    </div>
                )}

                {activeTab === 'sizeGuide' && (
                    <div className="fade-in">
                        {hasCustomSizeChart ? (
                            <div className="p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        📏 Size Chart Poster
                                    </h3>
                                    <span className="text-xs bg-[#DD8560] text-white font-semibold px-2.5 py-1 rounded-full">
                                        Click image to zoom
                                    </span>
                                </div>

                                <div
                                    className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-shadow group"
                                    onClick={() => setIsZoomOpen(true)}
                                >
                                    <img
                                        src={product.sizeChartImage}
                                        alt={`${product.title || 'Product'} Size Chart`}
                                        className="w-full h-auto object-contain max-h-[500px]"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-black/75 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow">
                                            🔍 Click for Full View
                                        </span>
                                    </div>
                                </div>

                                {/* Fullscreen Zoom Lightbox Modal */}
                                {isZoomOpen && (
                                    <div
                                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                                        onClick={() => setIsZoomOpen(false)}
                                    >
                                        <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                                            <button
                                                type="button"
                                                className="absolute -top-10 right-0 text-white text-2xl font-bold bg-black/60 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                onClick={() => setIsZoomOpen(false)}
                                            >
                                                ✕
                                            </button>
                                            <img
                                                src={product.sizeChartImage}
                                                alt={`${product.title || 'Product'} Size Chart Full`}
                                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <SizeGuide category={sizeCategory} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
