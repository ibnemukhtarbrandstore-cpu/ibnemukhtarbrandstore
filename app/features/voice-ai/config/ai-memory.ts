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
            '/terms-conditions',
            '/search',
            '/ai-shopping'
        ],
        products: [
            '/all-products/trending',
            '/all-products/recommended',
            '/all-products/flash-sale',
            '/tshirts',
            '/hoodies',
            '/mugs',
            '/stickers'
        ],
        collections: [
            '/collections/womens',
            '/collections/mens',
            '/collections/shoes',
            '/collections/winter',
            '/collections/summer',
            '/collections/casual',
            '/collections/formal',
            '/collections/accessories',
            '/collections/beauty',
            '/collections/kids',
            '/collections/sports',
            '/collections/gym',
            '/collections/running',
            '/collections/outdoor',
            '/collections/electronics',
            '/collections/health',
            '/collections/clothing',
            '/collections/new-arrivals',
            '/collections/fresh-stock',
            '/collections/best-sellers',
            '/collections/trending',
            '/collections/sale',
            '/collections/eid',
            '/collections/unique-finds',
            '/collections/pre-loved'
        ],
        blog: '/blog'
    },

    // Product Categories (for navigation with Urdu/English keywords)
    categories: {
        // Women's Fashion
        'women': '/collections/womens',
        'womens': '/collections/womens',
        'ladies': '/collections/womens',
        'khawateen': '/collections/womens',
        'خواتین': '/collections/womens',
        'women suit': '/collections/womens',
        'ladies suit': '/collections/womens',

        // Men's Fashion
        'men': '/collections/mens',
        'mens': '/collections/mens',
        'mard': '/collections/mens',
        'مرد': '/collections/mens',
        'gents': '/collections/mens',

        // Shoes
        'shoes': '/collections/shoes',
        'shoe': '/collections/shoes',
        'footwear': '/collections/shoes',
        'jutay': '/collections/shoes',
        'joota': '/collections/shoes',
        'جوتے': '/collections/shoes',

        // Winter Collection
        'winter': '/collections/winter',
        'jacket': '/collections/winter',
        'jackets': '/collections/winter',
        'winter jacket': '/collections/winter',
        'sardi': '/collections/winter',
        'سردی': '/collections/winter',

        // Summer Collection
        'summer': '/collections/summer',
        'garmi': '/collections/summer',
        'گرمی': '/collections/summer',

        // Casual Wear
        'casual': '/collections/casual',
        'casual wear': '/collections/casual',
        'روزمرہ': '/collections/casual',

        // Formal Wear
        'formal': '/collections/formal',
        'formal wear': '/collections/formal',
        'office wear': '/collections/formal',
        'رسمی': '/collections/formal',

        // T-shirts
        'tshirt': '/tshirts',
        'tshirts': '/tshirts',
        't-shirt': '/tshirts',
        'shirt': '/tshirts',
        'قمیض': '/tshirts',

        // Hoodies
        'hoodie': '/hoodies',
        'hoodies': '/hoodies',
        'sweatshirt': '/hoodies',

        // Accessories
        'accessories': '/collections/accessories',
        'accessory': '/collections/accessories',
        'bags': '/collections/accessories',
        'jewelry': '/collections/accessories',
        'زیورات': '/collections/accessories',

        // Beauty
        'beauty': '/collections/beauty',
        'makeup': '/collections/beauty',
        'cosmetics': '/collections/beauty',
        'خوبصورتی': '/collections/beauty',

        // Kids
        'kids': '/collections/kids',
        'children': '/collections/kids',
        'بچے': '/collections/kids',
        'bacche': '/collections/kids',

        // Sports & Gym
        'sports': '/collections/sports',
        'gym': '/collections/gym',
        'running': '/collections/running',
        'outdoor': '/collections/outdoor',
        'کھیل': '/collections/sports',

        // Electronics & Health
        'electronics': '/collections/electronics',
        'health': '/collections/health',

        // General Shopping
        'clothing': '/collections/clothing',
        'clothes': '/collections/clothing',
        'kapray': '/collections/clothing',
        'کپڑے': '/collections/clothing',

        // Special Collections
        'new arrivals': '/collections/new-arrivals',
        'new': '/collections/new-arrivals',
        'naya': '/collections/new-arrivals',
        'fresh stock': '/collections/fresh-stock',
        'best sellers': '/collections/best-sellers',
        'trending': '/collections/trending',
        'sale': '/collections/sale',
        'discount': '/collections/sale',
        'eid': '/collections/eid',
        'unique': '/collections/unique-finds',
        'pre loved': '/collections/pre-loved',
        'second hand': '/collections/pre-loved',

        // Other pages
        'mugs': '/mugs',
        'cup': '/mugs',
        'stickers': '/stickers',
        'sticker': '/stickers',
        'gifts': '/stickers',
        'gift': '/stickers',

        // Trending/Recommended
        'recommended': '/all-products/recommended',
        'flash': '/all-products/flash-sale',
        'flash sale': '/all-products/flash-sale',

        // Static Pages
        'contact': '/contact-us',
        'about': '/about',
        'cart': '/cart',
        'checkout': '/checkout',
        'orders': '/orders',
        'account': '/myaccount',
        'blog': '/blog'
    } as Record<string, string>,

    // Clothing Sizes
    clothingSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'],

    // Clothing Categories
    clothingCategories: ['Formal', 'Casual', 'Winter', 'Summer', 'Sports', 'Shoes', 'Accessories', 'Beauty'],

    // Colors (Urdu & English)
    colors: {
        'white': ['white', 'safed', 'سفید'],
        'black': ['black', 'kala', 'kali', 'کالا', 'کالی'],
        'red': ['red', 'lal', 'lali', 'سرخ'],
        'blue': ['blue', 'neela', 'neeli', 'نیلا', 'نیلی'],
        'yellow': ['yellow', 'peela', 'peeli', 'پیلا', 'پیلی'],
        'green': ['green', 'hara', 'hari', 'ہرا', 'ہری'],
        'brown': ['brown', 'bhoora', 'بھورا'],
        'pink': ['pink', 'gulabi', 'گلابی'],
        'purple': ['purple', 'jamni', 'جامنی'],
        'grey': ['grey', 'gray', 'surmae', 'سرمئی'],
        'orange': ['orange', 'narangi', 'نارنجی']
    },

    // Intent Keywords
    intents: {
        navigate: ['page', 'kholo', 'open', 'jao', 'dikhao', 'لے جاؤ', 'کھولو', 'دکھاؤ'],
        search: ['dhundo', 'search', 'chahiye', 'find', 'ڈھونڈو', 'چاہیے', 'تلاش'],
        filter: ['size', 'category', 'color', 'filter', 'سائز', 'رنگ', 'قسم'],
        addCart: ['cart', 'add', 'dalo', 'کارٹ', 'شامل', 'ڈالو'],
        checkout: ['buy', 'khareed', 'checkout', 'order', 'خرید', 'خریدو']
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
    return queryString ? `/collections/womens?${queryString}` : '/collections/womens';
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
