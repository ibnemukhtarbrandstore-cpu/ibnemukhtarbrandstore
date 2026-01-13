/**
 * Currency Context
 * Global state management for multi-currency support
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    detectUserCurrency,
    convertPrice,
    formatPrice,
    SUPPORTED_CURRENCIES,
    isPakistan,
} from '@/utils/currencyConverter';

const CurrencyContext = createContext();

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
}

export function CurrencyProvider({ children }) {
    const [currencyData, setCurrencyData] = useState({
        currency: 'USD',
        country: 'US',
        symbol: '$',
        currencyName: 'US Dollar',
        countryName: 'United States',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isCODAvailable, setIsCODAvailable] = useState(false);

    // Detect user currency on mount
    useEffect(() => {
        async function detectCurrency() {
            try {
                const detected = await detectUserCurrency();
                setCurrencyData(detected);
                setIsCODAvailable(isPakistan(detected.country));
            } catch (error) {
                console.error('Failed to detect currency:', error);
                // Keep default USD
            } finally {
                setIsLoading(false);
            }
        }

        detectCurrency();
    }, []);

    /**
     * Convert price from USD to user's currency
     * @param {number} amountUSD - Amount in USD
     * @returns {Promise<number>} - Converted amount
     */
    const convert = async (amountUSD) => {
        if (!amountUSD) return 0;
        return await convertPrice(amountUSD, 'USD', currencyData.currency);
    };

    /**
     * Format price for display
     * @param {number} amount - Amount to format
     * @returns {string} - Formatted price with symbol
     */
    const format = (amount) => {
        if (!amount) return formatPrice(0, currencyData.currency);
        return formatPrice(amount, currencyData.currency);
    };

    /**
     * Convert and format price in one step
     * @param {number} amountUSD - Amount in USD
     * @returns {Promise<string>} - Formatted price in user currency
     */
    const convertAndFormat = async (amountUSD) => {
        const converted = await convert(amountUSD);
        return format(converted);
    };

    /**
     * Manually change currency (for currency selector)
     * @param {string} newCurrency - Currency code
     */
    const changeCurrency = (newCurrency) => {
        if (!SUPPORTED_CURRENCIES[newCurrency]) {
            console.error('Unsupported currency:', newCurrency);
            return;
        }

        const currencyInfo = SUPPORTED_CURRENCIES[newCurrency];
        const country = currencyInfo.countries[0]; // First country for this currency

        setCurrencyData({
            currency: newCurrency,
            country: country,
            symbol: currencyInfo.symbol,
            currencyName: currencyInfo.name,
            countryName: '', // We don't have country name mapping
        });

        setIsCODAvailable(isPakistan(country));
    };

    const value = {
        // Current currency info
        currency: currencyData.currency,
        country: currencyData.country,
        symbol: currencyData.symbol,
        currencyName: currencyData.currencyName,
        countryName: currencyData.countryName,

        // COD availability
        isCODAvailable,
        isPakistan: isCODAvailable,

        // State
        isLoading,

        // Functions
        convert,
        format,
        convertAndFormat,
        changeCurrency,

        // All supported currencies
        supportedCurrencies: SUPPORTED_CURRENCIES,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export default CurrencyContext;
