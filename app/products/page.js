import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import LoadingComponent from "../../components/atom/LoadingComponent";
import connectDb from "../../middleware/mongoose";
import { Product } from "../../models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products - Ibnemukhtar | Winter Jackets & Shoes in Pakistan",
  description:
    "Browse our complete collection of winter jackets and shoes. Quality products for men, women, and kids at affordable prices. Shop now!",
  keywords: [
    "women's suits Pakistan",
    "winter jackets",
    "shoes Pakistan",
    "affordable fashion",
    "pre-loved clothing",
    "formal suits",
    "casual wear",
    "fashion Pakistan",
    "women fashion Lahore",
    "women fashion Karachi",
    "women fashion Islamabad",
    "suits Faisalabad",
    "winter wear Rawalpindi",
    "shoes Multan",
    "affordable clothing Gujranwala"
  ],
};

const Page = async ({ searchParams }) => {
  if (mongoose.connections[0].readyState !== 1) {
    await connectDb();
  }

  // Get all filter parameters from URL - await searchParams
  const params = await searchParams;
  const category = params?.category;
  const tag = params?.tag;
  const sizeParam = params?.size;
  const colorParam = params?.color;
  const minPrice = params?.minPrice;
  const maxPrice = params?.maxPrice;

  // Build advanced query
  let query = {};

  // Category filter (can be comma-separated)
  if (category) {
    const categories = category.split(',').filter(Boolean);
    if (categories.length > 1) {
      query.category = { $in: categories };
    } else {
      query.category = categories[0];
    }
  }

  // Tag filter
  if (tag) {
    const tags = tag.split(',').filter(Boolean);
    query.tags = { $in: tags };
  }

  // Size filter (multi-select support)
  if (sizeParam) {
    const sizes = sizeParam.split(',').filter(Boolean);
    if (sizes.length > 0) {
      // Match products with ANY of the selected sizes
      query.$or = [
        { size: { $in: sizes } }, // Old size field
        { 'sizeVariants.size': { $in: sizes } } // New size variants
      ];
    }
  }

  // Color filter (multi-select support)
  if (colorParam) {
    const colors = colorParam.split(',').filter(Boolean);
    if (colors.length > 0) {
      query.color = { $in: colors.map(c => new RegExp(c, 'i')) }; // Case insensitive
    }
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  const Products = await Product.find(query);
  let tShirts = {};

  for (let item of Products) {
    const title = item.title;

    if (tShirts.hasOwnProperty(title)) {
      if (item.availability > 0) {
        if (!tShirts[title].color.includes(item.color)) {
          tShirts[title].color.push(item.color);
        }
        if (!tShirts[title].size.includes(item.size)) {
          tShirts[title].size.push(item.size);
        }
      }
    } else {
      tShirts[title] = JSON.parse(JSON.stringify(item));
      tShirts[title].color = item.availability > 0 ? [item.color] : [];
      tShirts[title].size = item.availability > 0 ? [item.size] : [];
    }
  }

  const product = JSON.parse(JSON.stringify(tShirts));
  if (!product) {
    return <LoadingComponent />;
  }

  // Prepare category data for SEO
  const categoryData = {
    name: category || "All Products",
    description: category
      ? `Explore ${category} products at Ibnemukhtar Brand Store. High quality winter wear at affordable prices.`
      : "Browse our complete collection of winter jackets and shoes for men, women, and kids. Quality products at best prices.",
    slug: category?.toLowerCase() || "products",
    productCount: Object.keys(product).length,
    parentCategory: "Women's Fashion & Accessories"
  };

  // Prepare products data for SEO
  const productsForSEO = Object.values(product).slice(0, 10).map(item => ({
    name: item.title,
    price: item.price || 0,
    currency: "PKR",
    image: item.images?.[0] || "/images/ibnemukhtar-logo.png",
    url: `https://ibnemukhtarbrandstore.vercel.app/product/${item.slug}`
  }));

  return (
    <>
      <CategorySEO
        category={categoryData}
        products={productsForSEO}
        url="https://ibnemukhtarbrandstore.vercel.app/"
      />
      <ProductsPageLayout product={product} category={category} tag={tag} />
    </>
  );
};

export default Page;
