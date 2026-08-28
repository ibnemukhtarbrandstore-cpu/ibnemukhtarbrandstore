'use client';

import { cancelPendingRequests } from '@/services/api';
import { useEffect, useState } from 'react';

interface BlogSEOProps {
  post: {
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    category: string;
    image?: string;
    slug: string;
  };
  url: string;
}

export default function BlogSEO({ post, url }: BlogSEOProps) {
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${url}${window.location.pathname}`);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [url]);

  const cleanText = (post.excerpt || post.content || '').replace(/<[^>]*>?/gm, '').trim();
  const description = cleanText.substring(0, 160);

  // BlogPosting Schema (Rich Search Snippets)
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.image ? [post.image] : ["https://ibnemukhtarbrandstore.vercel.app/images/ibnemukhtar-logo.png"],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": post.author || "Ibnemukhtar Team",
      "url": "https://ibnemukhtarbrandstore.vercel.app/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ibnemukhtar Brand Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ibnemukhtarbrandstore.vercel.app/images/ibnemukhtar-logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": post.category || "Fashion & Lifestyle",
    "keywords": (post.tags || []).join(", "),
    "wordCount": cleanText.split(/\s+/).length,
    "articleBody": cleanText
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ibnemukhtar Brand Store",
    "url": "https://ibnemukhtarbrandstore.vercel.app/",
    "logo": "https://ibnemukhtarbrandstore.vercel.app/images/ibnemukhtar-logo.png",
    "description": "Premium martial arts equipment and taekwondo uniforms",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ibnemukhtarbrandstore.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://ibnemukhtarbrandstore.vercel.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `https://ibnemukhtarbrandstore.vercel.app/blog/category/${post.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": fullUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}