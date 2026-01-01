import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const slides = [
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg",
    heading: "Premium Women's Suits – Elegant & Affordable Fashion",
    paragraph:
      "Discover our collection of formal and casual women's suits at unbeatable prices in Pakistan.",
    buttonText: "Shop Women's Suits",
    buttonLink: "/uniforms",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728170/QuillBot-generated-image-2_qxgwka.png",
    heading: "Winter Jackets & Hoodies – Stay Warm in Style",
    paragraph:
      "Browse premium winter jackets and cozy hoodies for men, women & kids. Pre-loved and new items available.",
    buttonText: "Shop Winter Wear",
    buttonLink: "/hoodies",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg",
    heading: "Shoes & Footwear – Comfortable & Stylish",
    paragraph:
      "Explore our collection of shoes for men, women & kids. Quality footwear at affordable prices.",
    buttonText: "Shop Shoes",
    buttonLink: "/collections/shoes",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
    heading: "Fashion Accessories – Complete Your Look",
    paragraph:
      "Browse bags, jewelry and lifestyle items to complement your style. Affordable fashion for everyone.",
    buttonText: "Shop winter",
    buttonLink: "/collections/winter",
  },
  {
    imgSrc: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728166/LYL___Wecools_We_Choose_%E5%86%AC%E6%96%B0%E4%BD%9C%E7%B6%9A%E3%80%85%E5%85%A5%E8%8D%B7%E4%B8%AD_aojvpw.jpg",
    heading: "Premium Men's Suits – Style & Comfort",
    paragraph:
      "Discover our collection of formal and casual men's suits at unbeatable prices in Pakistan.",
    buttonText: "Shop Men's Suits",
    buttonLink: "/collections/mens",
  },
];

const MobileBanner = () => {
  return (
    <div>
      {" "}
      {/* Mobile Banner */}
      <div className="block md:hidden w-full overflow-hidden pt-14 pb-0 m-0">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          // pagination={{ clickable: true }}
          className="w-full h-60"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full"
                style={{ paddingBottom: `${(300 / 600) * 100}%` }}
              >
                <Image
                  src={slide.imgSrc}
                  alt={slide.heading}
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
