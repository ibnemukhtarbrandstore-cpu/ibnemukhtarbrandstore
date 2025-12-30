import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const slides = [
  {
    imgSrc: "/images/slide-1.png",
    heading: "Premium Women's Suits – Elegant & Affordable Fashion",
    paragraph:
      "Discover our collection of formal and casual women's suits at unbeatable prices in Pakistan.",
    buttonText: "Shop Women's Suits",
    buttonLink: "/uniforms",
  },
  {
    imgSrc: "/images/slide-2.png",
    heading: "Winter Jackets & Hoodies – Stay Warm in Style",
    paragraph:
      "Browse premium winter jackets and cozy hoodies for men, women & kids. Pre-loved and new items available.",
    buttonText: "Shop Winter Wear",
    buttonLink: "/hoodies",
  },
  {
    imgSrc: "/images/slide-3.png",
    heading: "Shoes & Footwear – Comfortable & Stylish",
    paragraph:
      "Explore our collection of shoes for men, women & kids. Quality footwear at affordable prices.",
    buttonText: "Shop Shoes",
    buttonLink: "/tshirts",
  },
  {
    imgSrc: "/images/slide-4.png",
    heading: "Fashion Accessories – Complete Your Look",
    paragraph:
      "Browse bags, jewelry and lifestyle items to complement your style. Affordable fashion for everyone.",
    buttonText: "Shop Accessories",
    buttonLink: "/mugs",
  },
];

const MobileBanner = () => {
  return (
    <div>
      {" "}
      {/* Mobile Banner */}
      <div className="block md:hidden w-full overflow-hidden pt-14">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          // pagination={{ clickable: true }}
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
                {/* <div className="absolute left-2 bottom-12 ">
                  <h1 className="text-white font-semibold mb-3 text-xl w-1/2">
                    {slide.heading}
                  </h1>
                  <Link href={"#"} className="text-white font-[100] bg-black py-2 px-4">
                    COLLECTION
                  </Link>
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MobileBanner;
