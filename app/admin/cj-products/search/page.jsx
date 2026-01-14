'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Search, Plus, ExternalLink, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import ImportEditModal from '@/components/organism/ImportEditModal';

export default function CJProductsSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cjUrl, setCjUrl] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'url'

    const pageSize = 20;

    // Search CJ products
    const handleSearch = async (page = 1) => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/cj/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: searchQuery,
                    page: page,
                    pageSize: pageSize,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setProducts(data.products || []);
                setTotalProducts(data.total || 0);
                setCurrentPage(page);
                toast.success(`Found ${data.total} products`);
            } else {
                toast.error(data.error || 'Failed to search products');
                setProducts([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search CJ products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Import from CJ URL
    const handleImportFromUrl = async () => {
        if (!cjUrl.trim()) {
            toast.error('Please paste a CJ product URL');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/cj/import-from-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productUrl: cjUrl }),
            });

            const data = await response.json();

            if (data.success) {
                toast.info('Product details fetched! Please review and save.');
                handleOpenImportModal(data.cjProduct);
                setCjUrl('');
            } else {
                toast.error(data.error || 'Failed to fetch product details');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Failed to import product from URL');
        } finally {
            setLoading(false);
        }
    };

    // Import product to store
    // Step 1: Open Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenImportModal = (cjProduct) => {
        setSelectedProduct(cjProduct);
        setModalOpen(true);
    };

    // Step 2: Confirm & Save
    const handleConfirmImport = async (cjProduct, overrides) => {
        const productId = cjProduct.pid || cjProduct.productId;
        setImporting({ ...importing, [productId]: true });
        // Close modal immediately to avoid UI lag, but keep loading state in button if needed (or keep modal open?)
        // Let's keep modal logic handled by this function, maybe we close AFTER success.

        try {
            const response = await fetch('/api/cj/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cjProductId: productId,
                    productData: cjProduct,
                    overrides: overrides // Pass the edited data
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ "${overrides.title}" added to store!`);
                setModalOpen(false); // Close modal on success
                setSelectedProduct(null);
            } else {
                toast.error(data.error || 'Failed to import product');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Failed to import product');
        } finally {
            setImporting({ ...importing, [productId]: false });
        }
    };

    const totalPages = Math.ceil(totalProducts / pageSize);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        CJ Dropshipping Product Search
                    </h1>
                    <p className="text-gray-600">
                        Search and import products from CJ Dropshipping to your store
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'search'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Search className="inline w-5 h-5 mr-2" />
                                Search Products
                            </button>
                            <button
                                onClick={() => setActiveTab('url')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'url'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ExternalLink className="inline w-5 h-5 mr-2" />
                                Import from URL
                            </button>
                        </nav>
                    </div>

                    {/* Search Tab */}
                    {activeTab === 'search' && (
                        <div className="p-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                                    placeholder="Search for products (e.g., shoes, jacket, dress)..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => handleSearch(1)}
                                    disabled={loading}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCcw className="w-5 h-5 animate-spin" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            Search
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* URL Import Tab */}
                    {activeTab === 'url' && (
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paste CJ Product URL
                                </label>
                                <p className="text-sm text-gray-500 mb-3">
                                    Example: https://cjdropshipping.com/product/detail/123456789
                                </p>
                                <input
                                    type="text"
                                    value={cjUrl}
                                    onChange={(e) => setCjUrl(e.target.value)}
                                    placeholder="Paste CJ product URL here..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleImportFromUrl}
                                disabled={loading}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCcw className="w-5 h-5 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Import Product
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results */}
                {products.length > 0 && (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => {
                                const productId = product.pid || product.productId;
                                const isImporting = importing[productId];

                                return (
                                    <div
                                        key={productId}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-48 bg-gray-100">
                                            {product.productImage ? (
                                                <Image
                                                    src={product.productImage}
                                                    alt={product.productNameEn || 'Product'}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                                {product.productNameEn || product.productName}
                                            </h3>

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-bold text-blue-600">
                                                    ${product.sellPrice || product.price}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Stock: {product.stock || product.inventory || 0}
                                                </span>
                                            </div>

                                            {product.categoryName && (
                                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mb-3">
                                                    {product.categoryName}
                                                </span>
                                            )}

                                            <button
                                                onClick={() => handleOpenImportModal(product)}
                                                disabled={isImporting}
                                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                                            >
                                                {isImporting ? (
                                                    <>
                                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Add to Store
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handleSearch(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="px-4 py-2 text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handleSearch(currentPage + 1)}
                                    disabled={currentPage === totalPages || loading}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && searchQuery && (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                )}
            </div>
            {/* Import Edit Modal */}
            <ImportEditModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleConfirmImport}
                cjProduct={selectedProduct}
                isLoading={selectedProduct ? importing[selectedProduct.pid || selectedProduct.productId] : false}
            />
        </div>


    );
}
