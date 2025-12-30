import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Unique Finds | One-of-a-Kind Items | Pakistan",
    description: "Discover unique, one-of-a-kind items. Limited availability - grab them before they're gone!",
    keywords: ["unique items", "one of a kind", "limited edition", "pre-loved", "vintage pakistan"],
};

const Page = async ({ searchParams }) => {
    if (mongoose.connections[0].readyState !== 1) {
        await connectDb();
    }

    const params = await searchParams;
    const category = params?.category;
    const tag = params?.tag;

    let query = {
        $or: [
            { availability: 1 },
            { condition: 'Pre-loved' },
            { condition: 'Refurbished' }
        ]
    };

    if (category) {
        query.category = category;
    }
    if (tag) {
        query.tags = { $in: [tag] };
    }

    const Products = await Product.find(query).sort({ createdAt: -1 });

    let tShirts = {};

    for (let item of Products) {
        const title = item.title;
        if (!tShirts.hasOwnProperty(title)) {
            tShirts[title] = JSON.parse(JSON.stringify(item));
            tShirts[title].color = item.availability > 0 ? [item.color] : [];
            tShirts[title].size = item.availability > 0 ? [item.size] : [];
        }
    }

    const product = JSON.parse(JSON.stringify(tShirts));

    const categoryData = {
        name: "Unique Finds",
        description: "Discover unique, one-of-a-kind items. Limited availability - grab them before they're gone!",
        slug: "unique-finds",
        productCount: Object.keys(product).length,
        parentCategory: "Collections"
    };

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
            <ProductsPageLayout product={product} category={category} tag={tag} collectionTitle="Unique Finds" collectionDescription="One-of-a-kind and limited availability items"
                bannerImage="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop&q=80" />
        </>
    );
};

export default Page;
