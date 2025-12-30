import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
    {
        imgSrc: "/images/slide-1.png",
        heading: "Women's Formal Suits – Professional & Elegant",
        paragraph: "Shop premium quality women's formal suits for office wear and special occasions.",
        buttonText: "Shop Suits",
        buttonLink: "/uniforms",
    },
    {
        imgSrc: "/images/slide-2.png",
        heading: "Winter Jackets – Warm & Stylish",
        paragraph: "Stay cozy with our collection of winter jackets and hoodies at affordable prices.",
        buttonText: "Shop Jackets",
        buttonLink: "/hoodies",
    },
    {
        imgSrc: "/images/slide-3.png",
        heading: "Shoes Collection – For Everyone",
        paragraph: "Explore comfortable and stylish footwear for men, women and kids.",
        buttonText: "Shop Shoes",
        buttonLink: "/tshirts",
    },
    {
        imgSrc: "/images/slide-4.png",
        heading: "Fashion Accessories – Complete Your Style",
        paragraph: "Browse bags, jewelry and accessories to elevate your fashion game.",
        buttonText: "Shop Accessories",
        buttonLink: "/mugs",
    },
    {
        imgSrc: "/images/slide-5.png",
        heading: "Pre-Loved Premium Fashion – Quality Guaranteed",
        paragraph: "Discover high-quality pre-loved items at unbeatable prices. Eco-friendly shopping!",
        buttonText: "Shop Now",
        buttonLink: "/products",
    },
];

const MobilePageBanner = ({ slides = [], textPosition = 'left-2 bottom-12' }) => {
    return (
        <div>
            {" "}
            {/* Mobile Banner */}
            <div className="block md:hidden w-full overflow-hidden pt-14">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 4000 }}
                    pagination={{ clickable: true }}
                    className="w-full h-64"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="relative w-full"
                                style={{ paddingBottom: `${(300 / 600) * 100}%` }}
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority={index === 0}
                                    quality={85}
                                    unoptimized={false} // Let Next.js optimize these large banners
                                />
                                <div className={`absolute ${textPosition} `}>
                                    <h1 className="text-white font-semibold mb-3 text-xl w-1/2">
                                        {slide.heading}
                                    </h1>
                                    <Link href={"#"} className="text-white font-[100] bg-black py-2 px-4">
                                        COLLECTION
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default MobilePageBanner;
