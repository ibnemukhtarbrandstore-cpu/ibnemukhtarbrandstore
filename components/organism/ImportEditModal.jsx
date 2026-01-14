"use client";
import { useState, useEffect } from "react";
import { X, Save, RefreshCcw } from "lucide-react";
import React from 'react';

const PKR_RATE = 280;
const MARKUP = 2.5;

export default function ImportEditModal({ isOpen, onClose, onSave, cjProduct, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        price: 0,
        description: "",
        category: "",
    });

    // Helper to calculate default price
    const calculateDefaultPrice = (prod) => {
        const costUSD = parseFloat(prod.sellPrice || prod.price || 0);
        const shippingUSD = parseFloat(prod.shippingCost || 0);
        const defaultPrice = Math.ceil((costUSD * MARKUP) * PKR_RATE);
        return defaultPrice > 0 ? defaultPrice : 0;
    };

    useEffect(() => {
        if (isOpen && cjProduct) {
            setFormData({
                title: cjProduct.productNameEn || cjProduct.productName || "",
                price: calculateDefaultPrice(cjProduct),
                description: cjProduct.description || cjProduct.productDescriptionEn || "",
                category: cjProduct.categoryName || "Uncategorized",
            });
        }
    }, [isOpen, cjProduct]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(cjProduct, formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Product Before Import</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Pricing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price (PKR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500 font-bold">Rs.</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Suggested: Rs.{calculateDefaultPrice(cjProduct)} (2.5x Markup)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Note: HTML tags can be used.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                        <span className="font-semibold">Note:</span> Images, Stock, and Variants (Size/Color) are automatically synced from CJ and cannot be edited here to ensure data integrity.
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save & Import
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
