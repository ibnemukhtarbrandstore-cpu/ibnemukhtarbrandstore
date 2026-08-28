"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const defaultSlides = [
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg",
    alt: "best fighting uniforms",
    title: "Martial Arts Gift Bundle – Shirts, Mugs & Hoodies Combo",
    linkUrl: "/products"
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728170/QuillBot-generated-image-2_qxgwka.png",
    alt: "best fighting uniforms",
    title: "Premium Pre-Loved Winter Collection",
    linkUrl: "/collections/winter"
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg",
    alt: "best fighting uniforms",
    title: "Quality Shoes & Sports Apparel",
    linkUrl: "/collections/shoes"
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
    alt: "best fighting uniforms",
    title: "Exclusive Winter Jackets Sale",
    linkUrl: "/collections/clothing"
  },
];

const DesktopBanner = () => {
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchDynamicBanners = async () => {
      try {
        const res = await fetch("/api/banners?placement=home-desktop");
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          const dynamicMapped = data.banners.map((b) => ({
            image: b.image,
            alt: b.title || "Homepage Banner",
            title: b.title,
            subtitle: b.subtitle,
            buttonText: b.buttonText,
            linkUrl: b.linkUrl || "/products",
          }));
          setSlides(dynamicMapped);
        }
      } catch (err) {
        // Quiet fallback to defaultSlides
      }
    };

    fetchDynamicBanners();
  }, []);

  return (
    <>
      {/* Desktop Banner */}
      <div className="hidden md:block w-full overflow-hidden mt-0">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="w-full h-[280px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[280px] bg-[#0F172A]"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || "Banner"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  quality={85}
                  unoptimized={false}
                />
                {slide.title && (
                  <div className="absolute left-8 bottom-12 max-w-2xl bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-gray-300 text-xs mt-1 uppercase font-bold tracking-widest">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.linkUrl && (
                      <Link href={slide.linkUrl} className="inline-block mt-3 px-6 py-2 bg-[#D4AF37] text-[#0F172A] text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors">
                        {slide.buttonText || "EXPLORE NOW"}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default DesktopBanner;
