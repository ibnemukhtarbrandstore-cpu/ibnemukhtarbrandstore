"use client";
import { IconFilter } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import ProductCard from "../atom/ProductCard";
import FilterSidebar from "../atom/FilterSidebar";

const ProductsPageLayout = ({
  product,
  category,
  tag,
  collectionTitle,
  bannerImage,
  collectionDescription
}) => {
  const [selectedTag, setSelectedTag] = useState(tag || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    tags: [],
    sizes: [],
    colors: [],
    rating: 0,
    availability: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    search: "",
  });
  const router = useRouter();

  const filterOptions = useMemo(() => {
    const categories = new Set();
    const tags = new Set();
    const sizes = new Set();
    const colors = new Set();

    Object.values(product || {}).forEach((prod) => {
      if (prod.category) categories.add(prod.category);
      if (prod.tags && Array.isArray(prod.tags)) {
        prod.tags.forEach((t) => tags.add(t));
      }
      if (prod.size) sizes.add(prod.size);
      if (prod.color) colors.add(prod.color);
    });

    return {
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort(),
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
    };
  }, [product]);

  const filteredProducts = useMemo(() => {
    let filtered = Object.values(product || {});

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (prod) =>
          prod.title?.toLowerCase().includes(searchLower) ||
          prod.disc?.toLowerCase().includes(searchLower) ||
          (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(searchLower)))
      );
    }

    if (filters.category) filtered = filtered.filter((prod) => prod.category === filters.category);
    if (selectedTag) filtered = filtered.filter((prod) => prod.tags?.includes(selectedTag));
    if (filters.tags.length > 0) filtered = filtered.filter((prod) => prod.tags?.some((t) => filters.tags.includes(t)));
    if (filters.sizes.length > 0) filtered = filtered.filter((prod) => filters.sizes.includes(prod.size));
    if (filters.colors.length > 0) filtered = filtered.filter((prod) => filters.colors.includes(prod.color));
    if (filters.rating > 0) filtered = filtered.filter((prod) => prod.rating >= filters.rating);

    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      filtered = filtered.filter((prod) => {
        const price = prod.flashPrice || prod.price;
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
    }

    if (filters.availability) {
      switch (filters.availability) {
        case "in-stock": filtered = filtered.filter((prod) => prod.availability > 0); break;
        case "flash-sale": filtered = filtered.filter((prod) => prod.flashPrice && new Date(prod.flashEnd) > new Date()); break;
        case "featured": filtered = filtered.filter((prod) => prod.featured); break;
      }
    }

    filtered.sort((a, b) => {
      const priceA = a.flashPrice || a.price;
      const priceB = b.flashPrice || b.price;
      switch (filters.sortBy) {
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low": return priceA - priceB;
        case "price-high": return priceB - priceA;
        case "rating": return (b.rating || 0) - (a.rating || 0);
        case "popular": return (b.views || 0) - (a.views || 0);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [product, filters, selectedTag])

  const handleTagClick = (clickedTag) => {
    const newTag = selectedTag === clickedTag ? "" : clickedTag;
    setSelectedTag(newTag);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (newTag) params.set("tag", newTag);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const clearFilters = () => {
    setSelectedTag("");
    setFilters({
      category: "", tags: [], sizes: [], colors: [], rating: 0,
      availability: "", minPrice: 0, maxPrice: 10000, sortBy: "newest", search: "",
    });
    router.push("/products");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <FilterSidebar
          filters={filters}
          setFilters={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          categories={filterOptions.categories}
          tags={filterOptions.tags}
          sizes={filterOptions.sizes}
          colors={filterOptions.colors}
          onApplyFilters={() => setShowFilters(false)}
          isOpen={true}
        />
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full">
            <FilterSidebar
              filters={filters}
              setFilters={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
              categories={filterOptions.categories}
              tags={filterOptions.tags}
              sizes={filterOptions.sizes}
              colors={filterOptions.colors}
              onApplyFilters={() => setShowFilters(false)}
              isOpen={showFilters}
              onToggle={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1">
        {(collectionTitle || bannerImage) && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-900 overflow-hidden">
            {bannerImage && (
              <Image src={bannerImage} alt={collectionTitle || 'Collection'} fill className="object-cover opacity-40" priority sizes="100vw" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
              {collectionTitle && <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{collectionTitle}</h1>}
              {collectionDescription && <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl">{collectionDescription}</p>}
            </div>
          </div>
        )}

        <section className="bg-white body-font pb-8">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-600 font-medium">{filteredProducts.length} RESULTS</span>
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-1 p-2 bg-blue-600 text-white rounded-md">
                <IconFilter className="w-4 h-4" /> <span className="text-sm">Filters</span>
              </button>
            </div>

            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">No products found</p>
                <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white rounded-md">Clear Filters</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPageLayout;
