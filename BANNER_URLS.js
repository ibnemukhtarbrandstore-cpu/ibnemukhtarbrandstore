// Collection Banner Images Mapping
// Use this to quickly add banner images to all collection pages

const collectionBanners = {
    // Gender Collections
    womens: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop&q=80',
    kids: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=400&fit=crop&q=80',

    // Product Categories
    clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&h=400&fit=crop&q=80',
    shoes: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop&q=80',
    health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=400&fit=crop&q=80',
    beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop&q=80',
    accessories: 'https://images.unsplash.com/photo-1532545261798-1ea38921e7c3?w=1200&h=400&fit=crop&q=80',
    sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=400&fit=crop&q=80',
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop&q=80',

    // Trending & Popular
    'new-arrivals': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop&q=80',
    'best-sellers': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop&q=80',
    trending: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop&q=80',
    sale: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=1200&h=400&fit=crop&q=80',

    // Activity/Lifestyle
    running: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=400&fit=crop&q=80',
    gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop&q=80',
    outdoor: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=400&fit=crop&q=80',
    casual: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=1200&h=400&fit=crop&q=80',
    formal: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=400&fit=crop&q=80',

    // Seasonal
    summer: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=1200&h=400&fit=crop&q=80',
    eid: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=1200&h=400&fit=crop&q=80',

    // Condition-Based
    'unique-finds': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop&q=80',
    'pre-loved': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop&q=80',
    'fresh-stock': 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&h=400&fit=crop&q=80',
};

// Add bannerImage prop to ProductsPageLayout in each collection page:
// bannerImage={collectionBanners.COLLECTION_NAME}

export default collectionBanners;
