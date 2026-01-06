"use client";
import { useState } from "react";

/**
 * SizeSelectorComponent
 * Displays available sizes for a product with stock status
 * 
 * Props:
 * - sizeVariants: Array of {size, stock, priceAdjustment}
 * - selectedSize: Currently selected size
 * - onSizeChange: Callback when size is selected
 * - basePrice: Product base price
 */

export default function SizeSelector({
    sizeVariants,
    selectedSize,
    onSizeChange,
    basePrice
}) {
    // If no size variants, don't show selector
    if (!sizeVariants || sizeVariants.length === 0) {
        return null;
    }

    // Get final price for a size
    const getSizePrice = (variant) => {
        return basePrice + (variant.priceAdjustment || 0);
    };

    return (
        <div className="mb-6">
            <label className="block font-semibold mb-3">
                Select Size <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {sizeVariants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const isOutOfStock = variant.stock === 0;
                    const isLowStock = variant.stock > 0 && variant.stock <= 5;

                    return (
                        <button
                            key={variant.size}
                            type="button"
                            onClick={() => !isOutOfStock && onSizeChange(variant.size)}
                            disabled={isOutOfStock}
                            className={`
                relative p-4 border-2 rounded-lg font-medium transition-all
                ${isSelected
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 hover:border-gray-400'
                                }
                ${isOutOfStock
                                    ? 'opacity-40 cursor-not-allowed line-through'
                                    : 'cursor-pointer'
                                }
              `}
                        >
                            {/* Size Label */}
                            <div className={`text-lg ${isSelected ? 'font-bold' : ''}`}>
                                {variant.size}
                            </div>

                            {/* Stock Status */}
                            {!isOutOfStock && isLowStock && (
                                <div className="text-xs text-orange-600 mt-1">
                                    Only {variant.stock} left
                                </div>
                            )}

                            {isOutOfStock && (
                                <div className="text-xs text-red-600 mt-1">
                                    Out of Stock
                                </div>
                            )}

                            {/* Price Adjustment (if applicable) */}
                            {variant.priceAdjustment && variant.priceAdjustment !== 0 && !isOutOfStock && (
                                <div className="text-xs mt-1 text-green-600">
                                    {variant.priceAdjustment > 0 ? '+' : ''}
                                    Rs. {variant.priceAdjustment}
                                </div>
                            )}

                            {/* Selected Check Mark */}
                            {isSelected && !isOutOfStock && (
                                <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                                    <svg
                                        className="w-3 h-3 text-black"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Size Info */}
            {selectedSize && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                        <span className="font-medium">Selected Size:</span> {selectedSize}
                        {sizeVariants.find(v => v.size === selectedSize)?.priceAdjustment && (
                            <span className="ml-2 text-green-700 font-semibold">
                                (Rs. {getSizePrice(sizeVariants.find(v => v.size === selectedSize))}/-)
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        {sizeVariants.find(v => v.size === selectedSize)?.stock} units available
                    </p>
                </div>
            )}

            {/* Size Guide Link (optional) */}
            <button
                type="button"
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => {
                    // TODO: Open size guide modal
                    alert("Size guide coming soon!");
                }}
            >
                📏 View Size Guide
            </button>
        </div>
    );
}
