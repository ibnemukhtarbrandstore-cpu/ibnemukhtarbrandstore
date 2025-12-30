import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Pre-Loved Collection | Sustainable Fashion | Pakistan",
    description: "Shop sustainable pre-loved items. Quality products at great prices with reduced environmental impact.",
    keywords: ["pre-loved pakistan", "second hand", "sustainable fashion", "vintage", "eco-friendly", "refurbished"],
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
        name: "Pre-Loved Collection",
        description: "Shop sustainable pre-loved items. Quality products at great prices with reduced environmental impact.",
        slug: "pre-loved",
        productCount: Object.keys(product).length,
        parentCategory: "Sustainable Collections"
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
            <ProductsPageLayout product={product} category={category} tag={tag} collectionTitle="Pre-Loved Collection" collectionDescription="Sustainable fashion with a story"
                bannerImage="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop&q=80" />
        </>
    );
};

export default Page;
