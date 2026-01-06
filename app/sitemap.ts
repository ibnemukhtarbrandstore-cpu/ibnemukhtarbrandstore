import { MetadataRoute } from 'next';
import { Product } from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import { connectDb } from '@/middleware/mongodb';

// Helper function to escape XML special characters
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ibnemukhtarbrandstore.vercel.app';

    // Standard routes
    const routes = [
        '',
        '/about',
        '/products',
        '/blog',
        '/contact-us',
        '/login',
        '/signup',
        '/all-products',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Collection pages
    const collectionRoutes = [
        // Product Categories
        '/collections/health',
        '/collections/clothing',
        '/collections/shoes',
        '/collections/beauty',
        '/collections/accessories',
        '/collections/sports',
        '/collections/electronics',
        // Demographics
        '/collections/mens',
        '/collections/womens',
        '/collections/kids',
        // Trending & Popular
        '/collections/new-arrivals',
        '/collections/best-sellers',
        '/collections/trending',
        '/collections/sale',
        // Activity/Lifestyle
        '/collections/running',
        '/collections/gym',
        '/collections/outdoor',
        '/collections/casual',
        '/collections/formal',
        // Seasonal
        '/collections/winter',
        '/collections/summer',
        '/collections/eid',
        // Condition-Based
        '/collections/unique-finds',
        '/collections/pre-loved',
        '/collections/fresh-stock',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    try {
        await connectDb();

        // Fetch Products
        const products = await Product.find({}, 'slug updatedAt').lean();
        const productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${escapeXml(product.slug)}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        // Fetch Blog Posts
        const blogPosts = await BlogPost.find({}, 'slug updatedAt').lean();
        const blogUrls = blogPosts.map((post) => ({
            url: `${baseUrl}/blog/${escapeXml(post.slug)}`,
            lastModified: new Date(post.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...collectionRoutes, ...productUrls, ...blogUrls];

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return [...routes, ...collectionRoutes];
    }
}
