'use client';
import React, { useState } from 'react';

/**
 * SizeGuide Component
 * Displays size charts for different product categories
 * - Men's Clothing (International sizes for jackets)
 * - Women's Clothing (Pakistani sizes for suits)
 * - Kids' Clothing
 * - Men's Shoes
 * - Women's Shoes
 */

const SizeGuide = ({ category = 'mens-clothing' }) => {
    // Size chart data for different categories
    const sizeCharts = {
        'mens-clothing': {
            title: "Men's Clothing Size Guide (International)",
            note: "Measurements in centimeters (cm)",
            headers: ['Size', 'Chest', 'Waist', 'Hip', 'Shoulder'],
            rows: [
                { size: 'XS', chest: '86-91', waist: '71-76', hip: '86-91', shoulder: '42-43' },
                { size: 'S', chest: '91-97', waist: '76-81', hip: '91-97', shoulder: '44-45' },
                { size: 'M', chest: '97-102', waist: '81-86', hip: '97-102', shoulder: '46-47' },
                { size: 'L', chest: '102-107', waist: '86-91', hip: '102-107', shoulder: '48-49' },
                { size: 'XL', chest: '107-112', waist: '91-97', hip: '107-112', shoulder: '50-51' },
                { size: 'XXL', chest: '112-117', waist: '97-102', hip: '112-117', shoulder: '52-53' },
                { size: '3XL', chest: '117-122', waist: '102-107', hip: '117-122', shoulder: '54-55' },
            ]
        },
        'womens-clothing': {
            title: "Women's Clothing Size Guide (Pakistani)",
            note: "Measurements in inches",
            headers: ['Size', 'Bust', 'Waist', 'Hip', 'Length'],
            rows: [
                { size: 'XS', bust: '32-34', waist: '26-28', hip: '34-36', length: '38-40' },
                { size: 'S', bust: '34-36', waist: '28-30', hip: '36-38', length: '40-42' },
                { size: 'M', bust: '36-38', waist: '30-32', hip: '38-40', length: '42-44' },
                { size: 'L', bust: '38-40', waist: '32-34', hip: '40-42', length: '44-46' },
                { size: 'XL', bust: '40-42', waist: '34-36', hip: '42-44', length: '46-48' },
                { size: 'XXL', bust: '42-44', waist: '36-38', hip: '44-46', length: '48-50' },
            ]
        },
        'kids-clothing': {
            title: "Kids' Clothing Size Guide",
            note: "Measurements in centimeters (cm) / Age range approximate",
            headers: ['Size', 'Age', 'Height', 'Chest', 'Waist'],
            rows: [
                { size: '2-3Y', age: '2-3 years', height: '92-98', chest: '52-54', waist: '50-52' },
                { size: '3-4Y', age: '3-4 years', height: '98-104', chest: '54-56', waist: '52-54' },
                { size: '4-5Y', age: '4-5 years', height: '104-110', chest: '56-58', waist: '54-56' },
                { size: '5-6Y', age: '5-6 years', height: '110-116', chest: '58-60', waist: '56-58' },
                { size: '6-7Y', age: '6-7 years', height: '116-122', chest: '60-63', waist: '58-60' },
                { size: '7-8Y', age: '7-8 years', height: '122-128', chest: '63-66', waist: '60-62' },
                { size: '8-10Y', age: '8-10 years', height: '128-140', chest: '66-72', waist: '62-66' },
                { size: '10-12Y', age: '10-12 years', height: '140-152', chest: '72-78', waist: '66-70' },
            ]
        },
        'mens-shoes': {
            title: "Men's Shoes Size Guide",
            note: "International size conversions",
            headers: ['US', 'UK', 'EU', 'CM'],
            rows: [
                { us: '6', uk: '5.5', eu: '39', cm: '24.1' },
                { us: '7', uk: '6', eu: '40', cm: '25.0' },
                { us: '8', uk: '7', eu: '41', cm: '25.9' },
                { us: '9', uk: '8', eu: '42', cm: '26.7' },
                { us: '10', uk: '9', eu: '43', cm: '27.6' },
                { us: '11', uk: '10', eu: '44', cm: '28.4' },
                { us: '12', uk: '11', eu: '45', cm: '29.2' },
                { us: '13', uk: '12', eu: '46', cm: '30.1' },
            ]
        },
        'womens-shoes': {
            title: "Women's Shoes Size Guide",
            note: "International size conversions",
            headers: ['US', 'UK', 'EU', 'CM'],
            rows: [
                { us: '5', uk: '3', eu: '36', cm: '22.5' },
                { us: '6', uk: '4', eu: '37', cm: '23.0' },
                { us: '7', uk: '5', eu: '38', cm: '23.5' },
                { us: '8', uk: '6', eu: '39', cm: '24.1' },
                { us: '9', uk: '7', eu: '40', cm: '25.0' },
                { us: '10', uk: '8', eu: '41', cm: '25.9' },
                { us: '11', uk: '9', eu: '42', cm: '26.7' },
            ]
        }
    };

    const chart = sizeCharts[category] || sizeCharts['mens-clothing'];

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {chart.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6 italic">
                {chart.note}
            </p>

            {/* Size Chart Table */}
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            {chart.headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border-r border-blue-500 last:border-r-0"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {chart.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-150`}
                            >
                                {Object.values(row).map((value, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className={`px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0 ${cellIndex === 0 ? 'font-semibold text-blue-700' : ''}`}
                                    >
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* How to Measure Guide */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">📏 How to Measure:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                    {category.includes('clothing') && (
                        <>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span><strong>Chest/Bust:</strong> Measure around the fullest part of your chest</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span><strong>Waist:</strong> Measure around your natural waistline</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span><strong>Hip:</strong> Measure around the fullest part of your hips</span>
                            </li>
                        </>
                    )}
                    {category.includes('shoes') && (
                        <>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Stand on a flat surface and measure from heel to longest toe</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Measure both feet and use the larger measurement</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>If between sizes, we recommend going up to the next size</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SizeGuide;
