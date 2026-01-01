"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function Foter() {
  const router = useRouter();
  const handleHover = (path) => {
    router.prefetch(`${path}`);
  };
  return (
    <div className="footer hidden md:block">
      <footer className="bg-white text-gray-700 border-t border-gray-200 shadow-lg">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Link
                  onMouseEnter={() => handleHover("/")}
                  href="/"
                  className="flex items-center"
                >
                  <span className="text-2xl font-bold text-gray-900">
                    IBNEMUKHTAR
                  </span>
                </Link>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Equipping Champions
                The ultimate destination for martial arts excellence.
                From durable uniforms to pro-level equipment, we have everything you need
                to win.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MdPhone className="text-[#DD8560] text-xl" />
                  <a
                    href="tel:+923164288921"
                    className="text-sm text-gray-700 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    +92 316 4288921
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MdEmail className="text-[#DD8560] text-xl" />
                  <span className="text-sm text-gray-700">
                    info@ibnemukhtarbrandstore.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MdLocationOn className="text-[#DD8560] text-xl" />
                  <span className="text-sm text-gray-700">Pakistan</span>
                </div>
              </div>
            </div>

            {/* Martial Arts Gear */}
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6 border-b border-[#DD8560] pb-2">
                Collections
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/tshirts"
                    onMouseEnter={() => handleHover("/tshirts")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Formal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/clothing"
                    onMouseEnter={() => handleHover("/collections/clothing")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens"
                    onMouseEnter={() => handleHover("/collections/mens")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Mens
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/womens"
                    onMouseEnter={() => handleHover("/collections/womens")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Womens
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/winter"
                    onMouseEnter={() => handleHover("/collections/winter")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Winter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6 border-b border-[#DD8560] pb-2">
                QUICK LINKS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    onMouseEnter={() => handleHover("/about")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onMouseEnter={() => handleHover("/blog")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Blog & Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    onMouseEnter={() => handleHover("/contact-us")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    onMouseEnter={() => handleHover("/search")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Search Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/myaccount"
                    onMouseEnter={() => handleHover("/myaccount")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    onMouseEnter={() => handleHover("/orders")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Track Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies & Support */}
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6 border-b border-[#DD8560] pb-2">
                POLICIES & SUPPORT
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy-policy"
                    onMouseEnter={() => handleHover("/privacy-policy")}
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-policy"
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund-policy"
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shiping-policy"
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="bg-gray-50 py-8 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              {/* Social Media */}
              <div className="mb-6 lg:mb-0">
                <h4 className="text-gray-900 font-semibold mb-4 text-center lg:text-left">
                  Follow Us
                </h4>
                <div className="flex space-x-4 justify-center lg:justify-start">
                  <Link
                    href="#"
                    className="bg-[#DD8560] hover:bg-[#c9734f] text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <FaFacebook className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-[#DD8560] hover:bg-[#c9734f] text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <FaInstagram className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-[#DD8560] hover:bg-[#c9734f] text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <FaYoutube className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-[#DD8560] hover:bg-[#c9734f] text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <FaTiktok className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-[#DD8560] hover:bg-[#c9734f] text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <FaWhatsapp className="text-xl" />
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div className="text-center lg:text-right">
                <h4 className="text-gray-900 font-semibold mb-4">
                  Stay Updated
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Get the latest martial arts tips and product updates
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    suppressHydrationWarning={true}
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 focus:border-[#DD8560] focus:outline-none"
                  />
                  <button
                    suppressHydrationWarning={true}
                    className="px-6 py-2 bg-[#DD8560] hover:bg-[#c9734f] text-white rounded-lg transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-100 py-6 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm text-center md:text-left mb-4 md:mb-0">
                © 2026 IBNEMUKHTAR BRAND STORE. All rights reserved. | Premium Martial
                Arts Gear
              </p>
              <div className="flex space-x-6 text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms-conditions"
                  className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                >
                  Terms
                </Link>
                <Link
                  href="/contact-us"
                  className="text-gray-600 hover:text-[#DD8560] transition-colors duration-200"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Foter;
