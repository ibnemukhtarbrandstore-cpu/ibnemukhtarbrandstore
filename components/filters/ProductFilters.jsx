'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductFilters({ onFilterChange, currentPath = '/all-products' }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currency, convert } = useCurrency();

    // Parse initial filters from URL
    const [filters, setFilters] = useState({
        category: searchParams.get('category')?.split(',').filter(Boolean) || [],
        size: searchParams.get('size')?.split(',').filter(Boolean) || [],
        color: searchParams.get('color')?.split(',').filter(Boolean) || [],
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({
        min: '',
        max: '',
    });

    // Available filter options
    const categories = ['T-Shirts', 'Jackets', 'Suits', 'Shoes', 'Hoodies', 'Accessories'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];
    const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy', 'Brown'];

    // Update URL when filters change
    const applyFilters = () => {
        const params = new URLSearchParams();

        if (filters.category.length > 0) {
            params.set('category', filters.category.join(','));
        }
        if (filters.size.length > 0) {
            params.set('size', filters.size.join(','));
        }
        if (filters.color.length > 0) {
            params.set('color', filters.color.join(','));
        }
        if (priceRange.min) {
            params.set('minPrice', priceRange.min);
        }
        if (priceRange.max) {
            params.set('maxPrice', priceRange.max);
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

        router.push(newUrl);

        if (onFilterChange) {
            onFilterChange(filters);
        }
    };

    // Toggle filter selection
    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const current = prev[type];
            const newValues = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

            return { ...prev, [type]: newValues };
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            category: [],
            size: [],
            color: [],
            minPrice: '',
            maxPrice: '',
        });
        setPriceRange({ min: '', max: '' });
        router.push(currentPath);
    };

    // Count active filters
    const activeFilterCount =
        filters.category.length +
        filters.size.length +
        filters.color.length +
        (priceRange.min || priceRange.max ? 1 : 0);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-gray-900 font-semibold"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-600 hover:underline flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Chips (Active Filters) */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filters.category.map(cat => (
                        <span
                            key={cat}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {cat}
                            <button onClick={() => toggleFilter('category', cat)}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.size.map(s => (
                        <span
                            key={s}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                            Size: {s}
                            <button onClick={() => toggleFilter('size', s)}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {filters.color.map(c => (
                        <span
                            key={c}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                            {c}
                            <button onClick={() => toggleFilter('color', c)}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {(priceRange.min || priceRange.max) && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {priceRange.min && `${currency}${priceRange.min}`}
                            {priceRange.min && priceRange.max && ' - '}
                            {priceRange.max && `${currency}${priceRange.max}`}
                            <button onClick={() => setPriceRange({ min: '', max: '' })}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Filter Options */}
            {showFilters && (
                <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => toggleFilter('category', cat)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.category.includes(cat)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleFilter('size', s)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.size.includes(s)
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                        <div className="flex flex-wrap gap-2">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => toggleFilter('color', c)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.color.includes(c)
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Price Range ({currency})
                        </h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={applyFilters}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
}
