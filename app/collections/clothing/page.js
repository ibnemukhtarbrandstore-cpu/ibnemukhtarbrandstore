import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Clothing & Apparel | Men Women Kids | Pakistan",
    description: "Discover stylish clothing for all. Winter jackets, hoodies, t-shirts, formal wear at best prices in Pakistan.",
    keywords: ["clothing pakistan", "fashion apparel", "men clothing", "women clothing", "kids clothing", "jackets hoodies"],
};

const Page = async ({ searchParams }) => {
    if (mongoose.connections[0].readyState !== 1) {
        await connectDb();
    }

    const params = await searchParams;
    const subCategory = params?.category;
    const tag = params?.tag;

    let query = {
        availability: { $gt: 0 },
        $or: [
            { category: { $in: ['hoodies', 'tshirts', 'jackets', 'shirts', 'pants', 'dress', 'sweaters', 'jeans'] } },
            { tags: { $in: ['clothing', 'apparel', 'fashion', 'wear', 'outfit'] } }
        ]
    };

    if (subCategory) {
        query.category = subCategory;
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
        name: "Clothing & Apparel",
        description: "Discover stylish clothing for all. Winter jackets, hoodies, t-shirts, formal wear at best prices.",
        slug: "clothing",
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
            <ProductsPageLayout product={product} category={subCategory} tag={tag} collectionTitle="Clothing & Apparel" collectionDescription="Fashion for everyone - Men, Women & Kids"
                bannerImage="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&h=400&fit=crop&q=80" />
        </>
    );
};

export default Page;
