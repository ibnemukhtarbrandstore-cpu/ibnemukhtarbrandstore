/**
 * Multi-Currency Utility
 * Handles currency detection, conversion, and formatting
 */

/**
 * Supported currencies with their symbols and country codes
 */
export const SUPPORTED_CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar', countries: ['US', 'UM'] },
    PKR: { symbol: '₨', name: 'Pakistani Rupee', countries: ['PK'] },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', countries: ['AE'] },
    GBP: { symbol: '£', name: 'British Pound', countries: ['GB'] },
    EUR: { symbol: '€', name: 'Euro', countries: ['AT', 'BE', 'DE', 'ES', 'FR', 'IT', 'NL', 'PT'] },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', countries: ['CA'] },
    AUD: { symbol: 'A$', name: 'Australian Dollar', countries: ['AU'] },
    INR: { symbol: '₹', name: 'Indian Rupee', countries: ['IN'] },
    SAR: { symbol: 'ر.س', name: 'Saudi Riyal', countries: ['SA'] },
    QAR: { symbol: 'ر.ق', name: 'Qatari Riyal', countries: ['QA'] },
    KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar', countries: ['KW'] },
    OMR: { symbol: 'ر.ع', name: 'Omani Rial', countries: ['OM'] },
    BHD: { symbol: 'د.ب', name: 'Bahraini Dinar', countries: ['BH'] },
};

/**
 * Exchange rates (cached) - Will be fetched from API
 */
let cachedRates = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch latest exchange rates from API
 * @param {string} baseCurrency - Base currency (default: USD)
 * @returns {Promise<object>} - Exchange rates
 */
export async function fetchExchangeRates(baseCurrency = 'USD') {
    try {
        // Check if cache is still valid
        if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            return cachedRates;
        }

        const apiUrl = process.env.CURRENCY_API_URL || 'https://api.exchangerate-api.com/v4/latest';
        const response = await fetch(`${apiUrl}/${baseCurrency}`);

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        cachedRates = data.rates;
        lastFetchTime = Date.now();

        return cachedRates;
    } catch (error) {
        console.error('❌ Currency API Error:', error.message);

        // Fallback to hardcoded rates if API fails
        return getFallbackRates();
    }
}

/**
 * Fallback exchange rates (static)
 * Used when API is unavailable
 */
function getFallbackRates() {
    return {
        USD: 1,
        PKR: 280,
        AED: 3.67,
        GBP: 0.79,
        EUR: 0.92,
        CAD: 1.36,
        AUD: 1.53,
        INR: 83,
        SAR: 3.75,
        QAR: 3.64,
        KWD: 0.31,
        OMR: 0.38,
        BHD: 0.38,
    };
}

/**
 * Convert price from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {Promise<number>} - Converted amount
 */
export async function convertPrice(amount, fromCurrency = 'USD', toCurrency = 'USD') {
    try {
        if (fromCurrency === toCurrency) {
            return amount;
        }

        const rates = await fetchExchangeRates(fromCurrency);

        if (!rates[toCurrency]) {
            console.warn(`Currency ${toCurrency} not found, returning original amount`);
            return amount;
        }

        const convertedAmount = amount * rates[toCurrency];
        return Math.round(convertedAmount * 100) / 100; // Round to 2 decimals
    } catch (error) {
        console.error('❌ Price Conversion Error:', error.message);
        return amount; // Return original if conversion fails
    }
}

/**
 * Format price with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted price (e.g., "$50.00", "₨14,000")
 */
export function formatPrice(amount, currency = 'USD') {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];

    if (!currencyInfo) {
        return `${amount.toFixed(2)}`;
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);

    return `${currencyInfo.symbol}${formattedAmount}`;
}

/**
 * Detect user's currency based on country code
 * @param {string} countryCode - ISO country code (e.g., 'PK', 'US')
 * @returns {string} - Currency code
 */
export function detectCurrencyFromCountry(countryCode) {
    if (!countryCode) {
        return process.env.DEFAULT_CURRENCY || 'USD';
    }

    const country = countryCode.toUpperCase();

    for (const [currencyCode, info] of Object.entries(SUPPORTED_CURRENCIES)) {
        if (info.countries.includes(country)) {
            return currencyCode;
        }
    }

    return process.env.DEFAULT_CURRENCY || 'USD';
}

/**
 * Detect user's location and currency from IP
 * (Client-side version - uses external service)
 * @returns {Promise<object>} - { country, currency, symbol }
 */
export async function detectUserCurrency() {
    try {
        // Skip API call on localhost (development)
        if (typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1')) {
            console.log('🏠 Development mode: Using default currency (USD)');
            return {
                country: 'US',
                countryName: 'United States',
                currency: 'USD',
                symbol: '$',
                currencyName: 'US Dollar',
            };
        }

        // Use ipapi.co for geolocation (free tier: 1000 requests/day)
        const response = await fetch('https://ipapi.co/json/', {
            signal: AbortSignal.timeout(3000), // 3 second timeout
        });

        if (!response.ok) {
            throw new Error('Failed to detect location');
        }

        const data = await response.json();
        const countryCode = data.country_code;
        const currency = detectCurrencyFromCountry(countryCode);

        return {
            country: countryCode,
            countryName: data.country_name,
            currency: currency,
            symbol: SUPPORTED_CURRENCIES[currency]?.symbol || '$',
            currencyName: SUPPORTED_CURRENCIES[currency]?.name || 'US Dollar',
        };
    } catch (error) {
        // Silent fail in development - just use default
        if (typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1')) {
            // Don't log error in development
        } else {
            console.error('❌ Location Detection Error:', error.message);
        }

        // Return default
        return {
            country: 'US',
            countryName: 'United States',
            currency: 'USD',
            symbol: '$',
            currencyName: 'US Dollar',
        };
    }
}

/**
 * Convert USD price range to target currency
 * Used for filters
 * @param {number} minUSD - Min price in USD
 * @param {number} maxUSD - Max price in USD
 * @param {string} targetCurrency - Target currency
 * @returns {Promise<object>} - { min, max }
 */
export async function convertPriceRange(minUSD, maxUSD, targetCurrency) {
    try {
        const min = await convertPrice(minUSD, 'USD', targetCurrency);
        const max = await convertPrice(maxUSD, 'USD', targetCurrency);

        return { min, max };
    } catch (error) {
        console.error('❌ Price Range Conversion Error:', error.message);
        return { min: minUSD, max: maxUSD };
    }
}

/**
 * Get currency info
 * @param {string} currencyCode - Currency code
 * @returns {object} - Currency info
 */
export function getCurrencyInfo(currencyCode) {
    return SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
}

/**
 * Check if Pakistan (for COD eligibility)
 * @param {string} countryCode - Country code
 * @returns {boolean}
 */
export function isPakistan(countryCode) {
    return countryCode?.toUpperCase() === 'PK';
}

export default {
    SUPPORTED_CURRENCIES,
    fetchExchangeRates,
    convertPrice,
    formatPrice,
    detectCurrencyFromCountry,
    detectUserCurrency,
    convertPriceRange,
    getCurrencyInfo,
    isPakistan,
};
