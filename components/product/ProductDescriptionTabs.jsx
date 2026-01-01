'use client';
import React, { useState } from 'react';
import SizeGuide from './SizeGuide';

/**
 * ProductDescriptionTabs Component
 * Displays tabbed interface with Description and Size Guide
 * 
 * @param {Object} product - Product object with disc field
 * @param {boolean} isHtml - Whether description is HTML
 * @param {string} sizeCategory - Size category for size guide
 */
export default function ProductDescriptionTabs({ product, isHtml, sizeCategory }) {
    const [activeTab, setActiveTab] = useState('description');

    return (
        <div className="mt-6">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all duration-200 ${activeTab === 'description'
                            ? 'text-[#DD8560] border-b-2 border-[#DD8560]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    📝 Description
                </button>
                <button
                    onClick={() => setActiveTab('sizeGuide')}
                    className={`px-4 md:px-6 py-3 font-semibold text-sm md:text-base transition-all duration-200 ${activeTab === 'sizeGuide'
                            ? 'text-[#DD8560] border-b-2 border-[#DD8560]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    📏 Size Guide
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
                        <SizeGuide category={sizeCategory} />
                    </div>
                )}
            </div>
        </div>
    );
}
