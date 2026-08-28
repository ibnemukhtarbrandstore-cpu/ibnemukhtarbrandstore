import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// const slides = [
//     {
//         image: "/images/mobile-images/mobile-home-fight (2).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight (3).png",
//         alt: "best image ",
//         heading: "BJJ & Grappling Shirts – Lightweight & Breathable for Fighters",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight (4).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight.png",
//         alt: "best image ",
//         heading: "Motivational Martial Arts Apparel – Train Hard, Fight Strong",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-mugs.png",
//         alt: "best image ",
//         heading: "MMA & Karate Mugs – Perfect Gift for Martial Artists",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-shirts.png",
//         alt: "best image ",
//         heading: "Martial Arts T-Shirts – Bold Designs for Fighters & Fans",
//     },
//     {
//         image: "/images/mobile-images/mobile-home.png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-hone-pomsa.png",
//         alt: "best image ",
//         heading: "Martial Arts Gift Bundle – Shirts, Mugs & Hoodies Combo",
//     },
//     {
//         image: "/images/mobile-images/mobile-hoodies (2).png",
//         alt: "best image ",
//         heading: "Taekwondo Hoodies – Comfortable & Stylish for Training & Casual Wear",
//     },
//     {
//         image: "/images/mobile-images/mobile-hoodies.png",
//         alt: "best image ",
//         heading: "Limited Edition Taekwondo Hoodies – Exclusive Designs for True Fans",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts (2).png",
//         alt: "best image ",
//         heading: "Custom Martial Arts Shirts – Personalized for Your Dojo or Team",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts (3).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts.png",
//         alt: "best image ",
//         heading: "Kids Martial Arts Shirts – Fun & Durable for Young Fighters",
//     },
// ];

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DesktopPageBanner = ({ slides: initialSlides = [], textPosition = 'left-2 bottom-12' }) => {
    const [slides, setSlides] = useState(initialSlides);

    useEffect(() => {
        const fetchDynamicBanners = async () => {
            try {
                const res = await fetch("/api/banners?placement=page-header");
                const data = await res.json();
                if (data.banners && data.banners.length > 0) {
                    const dynamicMapped = data.banners.map((b) => ({
                        image: b.image,
                        alt: b.title || "Page Header Banner",
                        heading: b.title,
                        linkUrl: b.linkUrl,
                    }));
                    setSlides(dynamicMapped);
                }
            } catch (err) {
                // Quiet fallback
            }
        };

        fetchDynamicBanners();
    }, []);

    const activeSlides = slides.length > 0 ? slides : initialSlides;

    if (activeSlides.length === 0) return null;

    return (
        <div>
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
                    {activeSlides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full h-[250px] flex items-center justify-center bg-[#0F172A] relative overflow-hidden">
                                <Image
                                    src={slide.image}
                                    alt={slide.alt || "Banner"}
                                    fill
                                    className="object-cover w-full h-full"
                                    priority={index === 0}
                                    quality={85}
                                    unoptimized={false}
                                />
                                {slide.heading && (
                                    <div className={`absolute ${textPosition} bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10`}>
                                        <h2 className="text-white font-black text-xl uppercase tracking-tight">
                                            {slide.heading}
                                        </h2>
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

export default DesktopPageBanner;
