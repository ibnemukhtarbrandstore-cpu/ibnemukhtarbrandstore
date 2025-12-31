'use client';
import React from 'react';
import Banner from '../organism/Banner';
import OverviewSection from '../organism/OverviewSection';
import DealSection from '../atom/DealSection';
import FlashSale from '../atom/FlashSale';
import LimitedDeals from '../atom/LimitedDeals';
import UnderPriceDeals from '../atom/UnderPriceDeals';
import FeaturedProducts from '../atom/FeaturedProducts';
import CustomerReviews from '../atom/CustomerReviews';
import Recommended from '../atom/Recommended';
import FooterSirProject from '../organism/FooterSirProject';
import CategoryGrid from '../atom/CategoryGrid';
import Componies from '../organism/Componies';
import EmailSubscriptionForm from '../EmailSubscriptionForm';
import WinterBanner from '../atom/WinterBanner';
import WhyChooseUs from '../atom/WhyChooseUs';
import TrustBadges from '../atom/TrustBadges';
import QualityPromise from '../atom/QualityPromise';
import AffordableFashion from '../atom/AffordableFashion';
import FastDelivery from '../atom/FastDelivery';
import CustomerTestimonials from '../atom/CustomerTestimonials';
import LatestBlogs from '../atom/LatestBlogs';
import AnnouncementBar from '../atom/AnnouncementBar';
import AnnouncementBarAdvanced from '../atom/AnnouncementBarAdvanced';

// NEW COMPONENTS
import NewArrivals from '../atom/NewArrivals';
import BestSellers from '../atom/BestSellers';
import UniqueFinds from '../atom/UniqueFinds';
import FreshStock from '../atom/FreshStock';
import ShopByCollection from '../atom/ShopByCollection';
import TrendingNow from '../atom/TrendingNow';
import ShopByActivity from '../atom/ShopByActivity';
import SeasonalCollections from '../atom/SeasonalCollections';
import GenderCollectionGrid from '../atom/GenderCollectionGrid';

export default function Home() {
  return (
    <div className="min-h-screen pb-20">

      <Banner />
      {/* <AnnouncementBar
        messages={[
          'Welcome to Ibnemukhtar Brand Store! خوش آمدید 🎉',
          'Free Shipping on Orders Over Rs. 2000 📦',
          'Limited Time Offer - Up to 30% Off! 🔥',
          'Cash on Delivery Available 💰'
        ]}
        bgColor="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        speed={25}
        icon="✨"
      /> */}
      <AnnouncementBarAdvanced
        messages={[
          'Special Eid Sale - Up to 50% Off! 🌙',
          'New Collection Available Now 🎁',
          'Free Delivery Across Pakistan 🚚'
        ]}
        bgColor="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600"
        speed={20}
        icon="⚡"
        glowEffect={true}
        separator="★"
      />
      <FlashSale />
      <LimitedDeals />
      <Recommended />
      {/* NEW - Main category grid */}
      <ShopByCollection />
      <CategoryGrid />
      {/* NEW - High visibility for latest products */}
      <NewArrivals />
      <TrustBadges />

      {/* NEW - Build trust with top sellers */}
      <BestSellers />


      {/* NEW - FOMO and social proof */}
      <TrendingNow />

      <QualityPromise />
      {/* <Componies /> */}

      {/* NEW - Showcase limited inventory */}
      <UniqueFinds />



      <AffordableFashion />
      {/* <DealSection /> */}

      {/* NEW - Bulk new items */}
      <FreshStock />

      {/* NEW - Gender navigation */}
      <GenderCollectionGrid />


      {/* <UnderPriceDeals /> */}
      <FeaturedProducts />

      {/* NEW - Lifestyle navigation */}
      <ShopByActivity />

      <FastDelivery />

      {/* NEW - Current season highlights */}
      <SeasonalCollections />
      <WinterBanner />
      <CustomerReviews />
      {/* <CustomerTestimonials /> */}
      <WhyChooseUs />
      <LatestBlogs />
      <div className="container mx-auto px-4 py-12">
        <EmailSubscriptionForm />
      </div>
      <OverviewSection />
      <FooterSirProject />
    </div>
  );
}