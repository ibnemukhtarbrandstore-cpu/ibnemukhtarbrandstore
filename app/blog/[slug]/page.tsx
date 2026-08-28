import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import BlogPost from '@/models/BlogPost';
import CommentSection from '@/components/blog/CommentSection';
import LikeButton from '@/components/blog/LikeButton';
import { connectDb } from '@/utils/mongodb';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import BlogSEO from '@/components/atom/BlogSEO';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDb();
  const { slug } = await params;
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    return {
      title: 'Post Not Found | Ibnemukhtar Brand Store',
      description: 'The requested blog post could not be found.',
    };
  }

  const cleanText = (post.excerpt || post.content || '').replace(/<[^>]*>?/gm, '').trim();
  const description = cleanText.substring(0, 160) || `${post.title} - Read our latest insights on Ibnemukhtar Brand Store.`;
  const url = `https://ibnemukhtarbrandstore.vercel.app/blog/${slug}`;
  const images = post.featuredImage?.url ? [post.featuredImage.url] : ['https://ibnemukhtarbrandstore.vercel.app/images/ibnemukhtar-logo.png'];

  return {
    title: `${post.title} | Ibnemukhtar Brand Store Blog`,
    description: description,
    keywords: [...(post.tags || []), 'Ibnemukhtar Brand Store', 'fashion Pakistan', 'winter jackets', 'suits', 'blog'],
    authors: [{ name: post.author?.name || 'Ibnemukhtar Team' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      siteName: 'Ibnemukhtar Brand Store',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [post.author?.name || 'Ibnemukhtar Team'],
      section: post.category || 'Fashion & Lifestyle',
      tags: post.tags || [],
      images: [
        {
          url: images[0],
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: images,
      site: '@ibnemukhtar',
      creator: '@ibnemukhtar',
    },
    other: {
      'article:published_time': post.createdAt,
      'article:modified_time': post.updatedAt || post.createdAt,
      'article:section': post.category || 'Fashion & Lifestyle',
      'article:tag': (post.tags || []).join(', '),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  await connectDb();
  const { slug } = await params;
  if (!mongoose.models.User) {
    mongoose.model('User', new mongoose.Schema({ name: String }));
  }

  const post = await BlogPost.findOne({ slug }).populate('author', 'name');

  if (!post) {
    notFound();
  }

  const cleanText = (post.content || '').replace(/<[^>]*>?/gm, '').trim();
  const readTime = Math.max(1, Math.ceil(cleanText.split(/\s+/).length / 200));

  return (
    <>
      <BlogSEO
        post={{
          title: post.title,
          content: post.content,
          excerpt: post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
          author: post.author?.name || 'Ibnemukhtar Team',
          publishedAt: post.createdAt,
          updatedAt: post.updatedAt,
          tags: post.tags || [],
          category: post.category || 'Fashion & Lifestyle',
          image: post.featuredImage?.url,
          slug: post.slug
        }}
        url="https://ibnemukhtarbrandstore.vercel.app"
      />
      <main className="container mx-auto px-4 mt-8 py-8 max-w-4xl">
        <article className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#D4AF37] text-[#0F172A] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {post.category || 'Article'}
            </span>
            <span className="text-gray-400 text-xs font-semibold">
              • {readTime} min read
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-6 uppercase tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-gray-400 text-xs md:text-sm mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span>By <strong className="text-white">{post.author?.name || 'Ibnemukhtar Team'}</strong></span>
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            </div>
            <LikeButton postId={post._id.toString()} initialLikes={post.likes?.map((like: any) => like.user) || []} />
          </div>

          {post.featuredImage?.url && (
            <div className="relative h-[300px] md:h-[450px] w-full mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <Image
                src={post.featuredImage.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-invert lg:prose-lg max-w-none mb-12 text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}></div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-white/10 mb-12 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Tags:</span>
              {post.tags.map((tag: string) => (
                <span key={tag} className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <CommentSection postId={post._id.toString()} />
        </article>
      </main>
    </>
  );
}