import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Eid Collection | Special Occasion Wear | Pakistan",
    description: "Celebrate Eid in style with our special collection. Traditional and modern wear for the entire family.",
    keywords: ["eid collection pakistan", "eid wear", "festive clothing", "special occasion", "eid fashion"],
};

const Page = async ({ searchParams }) => {
    if (mongoose.connections[0].readyState !== 1) {
        await connectDb();
    }

    const params = await searchParams;
    const category = params?.category;
    const tag = params?.tag;

    let query = {
        availability: { $gt: 0 },
        $or: [
            { tags: { $in: ['eid', 'festive', 'special', 'occasion', 'traditional', 'formal'] } }
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

    const categoryData = {
        name: "Eid Collection",
        description: "Celebrate Eid in style with our special collection for the entire family.",
        slug: "eid",
        productCount: Object.keys(product).length,
        parentCategory: "Seasonal Collections"
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
            <ProductsPageLayout product={product} category={category} tag={tag} collectionTitle="Eid Collection" collectionDescription="Celebrate in style"
                bannerImage="https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=1200&h=400&fit=crop&q=80" />
        </>
    );
};

export default Page;
