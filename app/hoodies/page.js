import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import LoadingComponent from "../../components/atom/LoadingComponent";
import connectDb from "../../middleware/mongoose";
import { Product } from "../../models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Winter Jackets & Hoodies - IBNEMUKHTARBRANDSTORE",
  description:
    "Discover our premium winter jackets and hoodies designed for warmth, comfort, and style. Perfect for cold weather, casual wear, and outdoor activities. Affordable pre-loved and new items.",
  keywords: [
    "winter jackets Pakistan",
    "warm hoodies",
    "winter wear",
    "affordable jackets",
    "casual hoodies",
    "outdoor jackets",
    "pre-loved winter clothes",
    "men women jackets",
  ],
};

const Page = async ({ searchParams }) => {
  if (mongoose.connections[0].readyState !== 1) {
    await connectDb();
  }

  // Get category filter from URL - await searchParams
  const params = await searchParams;
  const category = params?.category || "hoodies";
  const tag = params?.tag;

  // Build query
  let query = {};
  if (category) {
    query.category = category;
  }
  if (tag) {
    query.tags = { $in: [tag] };
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
    name: "Martial Arts Hoodies",
    description: "Discover our premium martial arts hoodies designed for comfort, performance, and fashion. Perfect for sports training, casual wear, and martial arts enthusiasts.",
    slug: "hoodies",
    productCount: Object.keys(product).length,
    parentCategory: "Apparel"
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
