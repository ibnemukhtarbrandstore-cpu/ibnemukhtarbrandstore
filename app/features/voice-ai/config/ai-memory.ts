// AI Memory - Website Knowledge Base
// This file contains all website data and functions for AI to use

export const AI_MEMORY = {
    // Website Structure (from sitemap)
    routes: {
        static: [
            '/',
            '/about',
            '/contact-us',
            '/checkout',
            '/myaccount',
            '/orders',
            '/login',
            '/signup',
            '/privacy-policy',
            '/refund-policy',
            '/return-policy',
            '/shiping-policy',
            '/terms-conditions'
        ],
        products: [
            '/all-products/trending',
            '/all-products/recommended',
            '/all-products/flash-sale',
            '/tshirts',
            '/hoodies',
            '/mugs',
            '/stickers',
            '/uniforms',
            '/uniforms-company'
        ],
        blog: '/blog'
    },

    // Product Categories (for navigation)
    categories: {
        'shirt': '/tshirts',
        'shirts': '/tshirts',
        'shoes': '/tshirts',
        'footwear': '/tshirts',
        'jutay': '/tshirts',

        'hoodie': '/hoodies',
        'hoodies': '/hoodies',
        'jacket': '/hoodies',
        'jackets': '/hoodies',
        'winter': '/hoodies',

        'accessories': '/mugs',
        'bags': '/mugs',
        'jewelry': '/mugs',

        'gifts': '/stickers',
        'gift': '/stickers',

        'suit': '/uniforms',
        'suits': '/uniforms',
        'women suit': '/uniforms',
        'formal': '/uniforms',
        'casual': '/uniforms',
        'office wear': '/uniforms',

        'trending': '/all-products/trending',
        'recommended': '/all-products/recommended',
        'flash': '/all-products/flash-sale',
        'sale': '/all-products/flash-sale',

        'contact': '/contact-us',
        'about': '/about',
        'cart': '/cart',
        'checkout': '/checkout',
        'orders': '/orders',
        'account': '/myaccount'
    } as Record<string, string>,

    // Suit Sizes (Women's)
    suitSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'],

    // Clothing Categories
    clothingCategories: ['Formal Suits', 'Casual Suits', 'Winter Jackets', 'Shoes', 'Accessories'],

    // Colors (Urdu & English)
    colors: {
        'white': ['white', 'safed', 'سفید'],
        'black': ['black', 'kala', 'کالا'],
        'red': ['red', 'lal', 'سرخ'],
        'blue': ['blue', 'neela', 'نیلا'],
        'yellow': ['yellow', 'peela', 'پیلا'],
        'green': ['green', 'hara', 'ہرا']
    },

    // Intent Keywords
    intents: {
        navigate: ['page', 'kholo', 'open', 'jao', 'dikhaو', 'لے جاؤ', 'کھولو'],
        search: ['dhundo', 'search', 'chahiye', 'find', 'ڈھونڈو', 'چاہیے'],
        filter: ['size', 'category', 'color', 'filter', 'سائز', 'رنگ'],
        addCart: ['cart', 'add', 'dalo', 'کارٹ', 'شامل'],
        checkout: ['buy', 'khareed', 'checkout', 'order', 'خرید']
    }
};

// Helper Functions for AI

/**
 * Detect intent from transcript
 */
export function detectIntent(transcript: string): string {
    const lower = transcript.toLowerCase();

    // Check navigate keywords
    if (AI_MEMORY.intents.navigate.some(k => lower.includes(k))) {
        return 'navigate';
    }

    // Check search keywords
    if (AI_MEMORY.intents.search.some(k => lower.includes(k))) {
        return 'search';
    }

    // Check filter keywords
    if (AI_MEMORY.intents.filter.some(k => lower.includes(k))) {
        return 'filter';
    }

    // Check cart keywords
    if (AI_MEMORY.intents.addCart.some(k => lower.includes(k))) {
        return 'addCart';
    }

    // Check checkout keywords
    if (AI_MEMORY.intents.checkout.some(k => lower.includes(k))) {
        return 'checkout';
    }

    return 'search'; // Default to search
}

/**
 * Find route from category name
 */
export function findRoute(categoryName: string): string | null {
    const lower = categoryName.toLowerCase();
    return AI_MEMORY.categories[lower] || null;
}

/**
 * Extract suit/clothing parameters from transcript
 */
export function extractSuitParams(transcript: string) {
    const params: any = {};

    // Extract size
    const sizeMatch = transcript.match(/\b(XS|S|M|L|XL|XXL|2XL|3XL)\b/i);
    if (sizeMatch) {
        params.size = sizeMatch[1].toUpperCase();
    }

    // Extract category
    if (transcript.toLowerCase().includes('formal')) {
        params.category = 'formal';
    } else if (transcript.toLowerCase().includes('casual')) {
        params.category = 'casual';
    }

    // Extract color
    for (const [colorEn, variations] of Object.entries(AI_MEMORY.colors)) {
        if (variations.some(v => transcript.toLowerCase().includes(v))) {
            params.color = colorEn;
            break;
        }
    }

    return params;
}

/**
 * Build filter URL for suits/clothing
 */
export function buildSuitURL(params: any): string {
    const queryParams = new URLSearchParams();

    if (params.size) queryParams.append('size', params.size);
    if (params.category) queryParams.append('category', params.category);
    if (params.color) queryParams.append('color', params.color);

    const queryString = queryParams.toString();
    return queryString ? `/uniforms?${queryString}` : '/uniforms';
}

/**
 * Extract product name from transcript
 */
export function extractProductName(transcript: string): string {
    // Remove filler words
    const fillers = ['mujhe', 'chahiye', 'dikhao', 'show', 'find', 'search', 'dhundo'];
    let words = transcript.toLowerCase().split(' ');
    words = words.filter(w => !fillers.includes(w) && w.length > 2);
    return words.join(' ');
}
