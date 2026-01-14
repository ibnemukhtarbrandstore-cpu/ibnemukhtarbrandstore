"use client";
import { useState, useEffect } from "react";
import { X, Save, RefreshCcw, Info, Settings, Zap, List } from "lucide-react";
import React from 'react';

const PKR_RATE = 280;
const MARKUP = 2.5;

export default function ImportEditModal({ isOpen, onClose, onSave, cjProduct, isLoading }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState({
        title: "",
        price: 0,
        description: "",
        category: "",
        brand: "Ibnemukhtar",
        material: "",
        careInstructions: "",
        warranty: "",
        videoUrl: "",
        tags: "",
        // AIDA
        howItWorks: "",
        mainBenefitHeadline: "",
        mainBenefitText: "",
        howToUseHeadline: "",
        howToUseText: "",
        resultsHeadline: "",
        resultsText: "",
    });

    // Simple array field handlers would go here if we wanted complex inputs, 
    // but for now we'll stick to the requested text fields for "rich content".

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
                brand: "Ibnemukhtar",
                material: "",
                careInstructions: "",
                warranty: "",
                videoUrl: "",
                tags: "",
                howItWorks: "",
                mainBenefitHeadline: "",
                mainBenefitText: "",
                howToUseHeadline: "",
                howToUseText: "",
                resultsHeadline: "",
                resultsText: "",
            });
        }
    }, [isOpen, cjProduct]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(cjProduct, formData);
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Customize Imported Product</h2>
                        <p className="text-sm text-gray-500">Edit AIDA content, pricing, and details before saving.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-gray-100 overflow-x-auto">
                    <TabButton id="basic" label="Basic Info" icon={Info} />
                    <TabButton id="aida" label="Marketing (AIDA)" icon={Zap} />
                    <TabButton id="technical" label="Technical & Shipping" icon={Settings} />
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">

                        {activeTab === "basic" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (PKR)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500 font-bold">Rs.</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Description (Rich Text/HTML)</label>
                                    <textarea
                                        rows={8}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "aida" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Benefit Headline</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Why you'll love this"
                                            value={formData.mainBenefitHeadline}
                                            onChange={(e) => setFormData({ ...formData, mainBenefitHeadline: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Results Headline</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Proven Results"
                                            value={formData.resultsHeadline}
                                            onChange={(e) => setFormData({ ...formData, resultsHeadline: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Benefit Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.mainBenefitText}
                                        onChange={(e) => setFormData({ ...formData, mainBenefitText: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">How It Works (Collapsible)</label>
                                        <textarea
                                            rows={4}
                                            value={formData.howItWorks}
                                            onChange={(e) => setFormData({ ...formData, howItWorks: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">How To Use Description</label>
                                        <textarea
                                            rows={4}
                                            value={formData.howToUseText}
                                            onChange={(e) => setFormData({ ...formData, howToUseText: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Results/Statistics Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.resultsText}
                                        onChange={(e) => setFormData({ ...formData, resultsText: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "technical" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                        <input
                                            type="text"
                                            value={formData.material}
                                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            placeholder="nike, shoes, winter"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Info</label>
                                        <textarea
                                            rows={3}
                                            value={formData.warranty}
                                            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                                        <textarea
                                            rows={3}
                                            value={formData.careInstructions}
                                            onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-200"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save & Import Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
