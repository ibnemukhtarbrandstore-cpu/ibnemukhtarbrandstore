/**
 * CJ Dropshipping API Wrapper
 * Handles all interactions with CJ Dropshipping API
 */

import axios from 'axios';

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY;

if (!CJ_API_KEY) {
    console.warn('⚠️ CJ_API_KEY not found in environment variables');
    console.warn('⚠️ Get it from: CJ Dashboard → My CJ → Authorization → API → API Key');
}

// Token cache
let accessToken = null;
let tokenExpiry = null;

/**
 * Get Access Token from CJ API
 * Official Documentation: https://developers.cjdropshipping.com/
 * Token is cached and auto-refreshed when expired
 */
async function getAccessToken() {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    try {
        console.log('🔑 Fetching new CJ Access Token...');

        if (!CJ_API_KEY) {
            throw new Error('CJ_API_KEY is not configured. Get it from CJ Dashboard → My CJ → Authorization → API → API Key');
        }

        // Official CJ API authentication endpoint
        const response = await axios.post(
            `${CJ_API_URL}/authentication/getAccessToken`,
            {
                apiKey: CJ_API_KEY,  // Format: "CJUserNum@api@xxxxxxxxxxxxxxxx"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }
        );

        if (response.data?.code === 200 && response.data?.data?.accessToken) {
            accessToken = response.data.data.accessToken;
            // Token valid for 15 days, cache for 14 days to be safe
            tokenExpiry = Date.now() + (14 * 24 * 60 * 60 * 1000); // 14 days

            console.log('✅ CJ Access Token obtained successfully');
            console.log('Token expires:', new Date(tokenExpiry).toISOString());
            return accessToken;
        } else {
            const errorMsg = response.data?.message || 'Failed to get access token';
            console.error('❌ CJ API Response:', response.data);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('❌ CJ Access Token Error:', error.message);
        if (error.response?.data) {
            console.error('API Response:', error.response.data);
        }

        // If development mode, allow fallback to test mode
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Falling back to test mode');
            return 'TEST_MODE';
        }

        throw error;
    }
}

/**
 * Create authenticated API request
 */
async function makeAuthenticatedRequest(endpoint, data = {}, method = 'POST') {
    const token = await getAccessToken();

    // Test mode check
    if (token === 'TEST_MODE') {
        return { isTestMode: true };
    }

    const response = await axios({
        method: method,
        url: `${CJ_API_URL}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: data,
        timeout: 30000,
    });

    return response;
}

/**
 * Search products in CJ catalog
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 20)
 * @param {object} filters - Additional filters
 * @returns {Promise<object>} - { products, total, page }
 */
export async function searchCJProducts(query = '', page = 1, pageSize = 20, filters = {}) {
    try {
        const response = await makeAuthenticatedRequest('/product/list', {
            productNameEn: query,
            pageNum: page,
            pageSize: pageSize,
            ...filters,
        });

        // Fallback to test mode only if token fetch failed in dev
        if (response.isTestMode) {
            console.log('⚠️ Using TEST MODE - CJ API authentication failed');
            return {
                success: true,
                products: [
                    {
                        pid: 'TEST001',
                        productNameEn: 'Test Product - Winter Jacket',
                        productImage: 'https://via.placeholder.com/300x300?text=Winter+Jacket',
                        sellPrice: 29.99,
                        price: 29.99,
                        stock: 100,
                        inventory: 100,
                        categoryName: 'Jackets',
                        description: 'Test product - API authentication failed',
                    },
                ],
                total: 1,
                page: page,
            };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                products: response.data.data?.list || [],
                total: response.data.data?.total || 0,
                page: page,
            };
        } else {
            throw new Error(response.data.message || 'Failed to search products');
        }
    } catch (error) {
        console.error('❌ CJ API Search Error:', error.message);
        return {
            success: false,
            error: error.message,
            products: [],
            total: 0,
        };
    }
}

/**
 * Get product details by product ID
 * @param {string} productId - CJ Product ID
 * @returns {Promise<object>} - Product details
 */
export async function getCJProductDetails(productId) {
    try {
        const response = await makeAuthenticatedRequest('/product/query', {
            pid: productId,
        });

        // Test mode fallback
        if (response.isTestMode) {
            console.log('⚠️ TEST MODE: Mock product for ID:', productId);
            return {
                success: true,
                product: {
                    pid: productId,
                    productId: productId,
                    productNameEn: `Test Product ${productId}`,
                    productImage: 'https://via.placeholder.com/400x400?text=Test+Product',
                    sellPrice: 39.99,
                    price: 39.99,
                    stock: 100,
                    inventory: 100,
                    categoryName: 'Test Category',
                    description: 'Test product - API authentication failed',
                    currency: 'USD',
                },
            };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                product: response.data.data,
            };
        } else {
            throw new Error(response.data.message || 'Failed to get product details');
        }
    } catch (error) {
        console.error('❌ CJ API Product Details Error:', error.message);
        return {
            success: false,
            error: error.message,
            product: null,
        };
    }
}

/**
 * Get product variants/SKUs
 * @param {string} productId - CJ Product ID
 * @returns {Promise<object>} - Product variants
 */
export async function getCJProductVariants(productId) {
    try {
        const response = await makeAuthenticatedRequest('/product/variant/query', {
            pid: productId,
        });

        if (response.isTestMode) {
            return { success: true, variants: [] };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                variants: response.data.data?.variants || [],
            };
        } else {
            throw new Error(response.data.message || 'Failed to get variants');
        }
    } catch (error) {
        console.error('❌ CJ API Variants Error:', error.message);
        return {
            success: false,
            error: error.message,
            variants: [],
        };
    }
}

/**
 * Create order with CJ Dropshipping
 * @param {object} orderData - Order details
 * @returns {Promise<object>} - CJ order response with tracking
 */
export async function createCJOrder(orderData) {
    try {
        const {
            products,
            shippingAddress,
            country,
            orderNumber,
        } = orderData;

        // Map products to CJ format
        const cjProducts = products.map(item => ({
            productId: item.cjProductId,
            variantId: item.cjVariantId || item.cjProductId,
            quantity: item.quantity,
        }));

        // Create order payload
        const payload = {
            orderNumber: orderNumber, // Your store's order ID
            shippingMethod: 'AutoSelect', // Let CJ choose best shipping
            country: country,
            products: cjProducts,
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phoneNumber: shippingAddress.phone,
                email: shippingAddress.email,
                country: shippingAddress.country,
                state: shippingAddress.state || '',
                city: shippingAddress.city,
                address1: shippingAddress.address,
                address2: shippingAddress.address2 || '',
                zip: shippingAddress.zipCode || shippingAddress.postalCode || '',
            },
            warehousePreference: process.env.CJ_WAREHOUSE_PREFERENCE || 'AUTO',
        };

        const response = await makeAuthenticatedRequest('/order/create', payload);

        // Skip test mode for orders (production only)
        if (response.isTestMode) {
            return {
                success: false,
                error: 'Order creation requires production CJ API credentials',
            };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                cjOrderId: response.data.data?.orderId,
                trackingNumber: response.data.data?.trackingNumber || null,
                estimatedDelivery: response.data.data?.estimatedDelivery || null,
                message: 'Order placed successfully with CJ Dropshipping',
            };
        } else {
            throw new Error(response.data.message || 'Failed to create CJ order');
        }
    } catch (error) {
        console.error('❌ CJ Order Creation Error:', error.message);
        return {
            success: false,
            error: error.message,
            cjOrderId: null,
        };
    }
}

/**
 * Get order tracking information
 * @param {string} cjOrderId - CJ Order ID
 * @returns {Promise<object>} - Tracking details
 */
export async function getCJOrderTracking(cjOrderId) {
    try {
        const response = await makeAuthenticatedRequest('/order/tracking', {
            orderId: cjOrderId,
        });

        if (response.isTestMode) {
            return { success: false, error: 'Tracking requires production credentials' };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                tracking: response.data.data,
            };
        } else {
            throw new Error(response.data.message || 'Failed to get tracking');
        }
    } catch (error) {
        console.error('❌ CJ Tracking Error:', error.message);
        return {
            success: false,
            error: error.message,
            tracking: null,
        };
    }
}

/**
 * Sync inventory/stock for products
 * @param {array} productIds - Array of CJ product IDs
 * @returns {Promise<object>} - Updated stock levels
 */
export async function syncCJInventory(productIds = []) {
    try {
        const response = await makeAuthenticatedRequest('/product/inventory/query', {
            pids: productIds,
        });

        if (response.isTestMode) {
            return { success: true, inventory: [] };
        }

        if (response.data.code === 200) {
            return {
                success: true,
                inventory: response.data.data || [],
            };
        } else {
            throw new Error(response.data.message || 'Failed to sync inventory');
        }
    } catch (error) {
        console.error('❌ CJ Inventory Sync Error:', error.message);
        return {
            success: false,
            error: error.message,
            inventory: [],
        };
    }
}

/**
 * Extract product ID from CJ URL
 * Supports formats:
 * - https://cjdropshipping.com/product/detail/123456
 * - https://www.cjdropshipping.com/product/123456
 * - https://cjdropshipping.com/product/name-p-123456.html
 * @param {string} url - CJ product URL
 * @returns {string|null} - Extracted product ID or null
 */
export function extractCJProductId(url) {
    try {
        const patterns = [
            /\/product\/[^\/]*-p-(\d+)\.html/,  // New format: product/name-p-123456.html
            /\/p-(\d+)\.html/,                   // Short format: p-123456.html
            /\/product\/detail\/(\d+)/,          // Old format: product/detail/123456
            /\/product\/(\d+)/,                  // Simple format: product/123456
            /pid[=:](\d+)/,                      // Query param: pid=123456
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        // If URL is just a number
        if (/^\d+$/.test(url.trim())) {
            return url.trim();
        }

        // Test mode: Accept any non-empty string as product ID
        if (process.env.NODE_ENV === 'development' && url.trim()) {
            console.log('⚠️ TEST MODE: Using URL as product ID:', url.trim());
            return url.trim();
        }

        return null;
    } catch (error) {
        console.error('❌ URL Parse Error:', error.message);
        return null;
    }
}

/**
 * Map CJ product to our store format
 * @param {object} cjProduct - CJ product object
 * @returns {object} - Mapped product for our database
 */
export function mapCJProductToStore(cjProduct) {
    return {
        title: cjProduct.productNameEn || cjProduct.productName,
        description: cjProduct.description || cjProduct.productDescriptionEn || '',
        price: parseFloat(cjProduct.sellPrice || cjProduct.price || 0),
        images: cjProduct.productImage ? [cjProduct.productImage] : [],
        category: cjProduct.categoryName || 'Uncategorized',
        availableQty: cjProduct.stock || cjProduct.inventory || 0,

        // CJ specific fields
        cjProductId: cjProduct.pid || cjProduct.productId,
        cjVariantId: cjProduct.vid || null,
        cjSupplierId: cjProduct.supplierId || null,
        currency: cjProduct.currency || 'USD',
        baseCurrency: 'USD',
        shippingCost: parseFloat(cjProduct.shippingCost || 0),
        warehouseLocation: cjProduct.warehouseCountry || 'AUTO',
        isCJProduct: true,
        lastSyncedAt: new Date(),

        // Product details
        weight: cjProduct.weight || 0,
        dimensions: {
            length: cjProduct.packageLength || 0,
            width: cjProduct.packageWidth || 0,
            height: cjProduct.packageHeight || 0,
        },
    };
}

export default {
    searchCJProducts,
    getCJProductDetails,
    getCJProductVariants,
    createCJOrder,
    getCJOrderTracking,
    syncCJInventory,
    extractCJProductId,
    mapCJProductToStore,
};
