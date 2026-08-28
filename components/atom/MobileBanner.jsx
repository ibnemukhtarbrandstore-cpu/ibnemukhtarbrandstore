"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const defaultSlides = [
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg",
    heading: "Premium Women's Suits – Elegant & Affordable Fashion",
    paragraph:
      "Discover our collection of formal and casual women's suits at unbeatable prices in Pakistan.",
    buttonText: "Shop Women's Suits",
    buttonLink: "/products",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728170/QuillBot-generated-image-2_qxgwka.png",
    heading: "Winter Jackets & Hoodies – Stay Warm in Style",
    paragraph:
      "Browse premium winter jackets and cozy hoodies for men, women & kids.",
    buttonText: "Shop Winter Wear",
    buttonLink: "/hoodies",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg",
    heading: "Shoes & Footwear – Comfortable & Stylish",
    paragraph:
      "Explore our collection of shoes for men, women & kids.",
    buttonText: "Shop Shoes",
    buttonLink: "/collections/shoes",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
    heading: "Fashion Accessories – Complete Your Look",
    paragraph:
      "Browse lifestyle items to complement your style.",
    buttonText: "Shop Winter",
    buttonLink: "/collections/winter",
  },
];

const MobileBanner = () => {
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchDynamicBanners = async () => {
      try {
        const res = await fetch("/api/banners?placement=home-mobile");
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          const dynamicMapped = data.banners.map((b) => ({
            imgSrc: b.image,
            heading: b.title || "Mobile Banner",
            paragraph: b.subtitle || "",
            buttonText: b.buttonText || "Shop Now",
            buttonLink: b.linkUrl || "/products",
          }));
          setSlides(dynamicMapped);
        }
      } catch (err) {
        // Quiet fallback
      }
    };

    fetchDynamicBanners();
  }, []);

  return (
    <div>
      {/* Mobile Banner */}
      <div className="block md:hidden w-full overflow-hidden pt-14 pb-0 m-0">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          className="w-full h-60"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-60 bg-[#0F172A]">
                <Image
                  src={slide.imgSrc}
                  alt={slide.heading || "Mobile Banner"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  quality={85}
                  unoptimized={false}
                />
                {slide.heading && (
                  <div className="absolute left-3 bottom-4 right-3 bg-black/50 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                    <h3 className="text-white text-sm font-black uppercase tracking-tight line-clamp-1">
                      {slide.heading}
                    </h3>
                    {slide.buttonLink && (
                      <Link
                        href={slide.buttonLink}
                        className="inline-block mt-1.5 px-4 py-1 bg-[#D4AF37] text-[#0F172A] text-[9px] font-black uppercase tracking-widest rounded-full"
                      >
                        {slide.buttonText || "SHOP NOW"}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MobileBanner;
