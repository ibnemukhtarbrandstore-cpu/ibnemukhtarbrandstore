import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Kids Collection | Children's Clothing & Toys | Pakistan",
    description: "Quality products for children. Comfortable clothing, shoes, toys and essentials for boys and girls.",
    keywords: ["kids fashion pakistan", "children clothing", "kids shoes", "boys clothing", "girls clothing", "kids toys"],
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
            { productFor: { $regex: /kids|children|child/i } },
            { tags: { $in: ['kids', 'children', 'child', 'baby', 'toddler', 'boys', 'girls'] } }
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
        name: "Kids Collection",
        description: "Quality products for children. Comfortable clothing, shoes, toys and essentials.",
        slug: "kids",
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
            <ProductsPageLayout product={product} category={category} tag={tag} collectionTitle="Kids Collection" collectionDescription="Comfortable & stylish for children"
                bannerImage="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=400&fit=crop&q=80" />
        </>
    );
};

export default Page;
