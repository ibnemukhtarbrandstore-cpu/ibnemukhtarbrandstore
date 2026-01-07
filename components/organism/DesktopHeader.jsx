"use client";
import Link from "next/link";
import { useRef } from "react";
import { BiSolidMinusCircle, BiSolidPlusCircle, BiChevronDown } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa6";
import { IoBagCheckOutline, IoCloseCircleSharp } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "../../app/globals.css";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../hooks/useAuth";
import DropdownMenu from "../molecules/DropDownMenue";
import Logo from "../atom/Logo";

const DesktopHeader = () => {
    const { cart, addToCart, removeFromCart, clearCart, subTotle } = useCart();
    const { localToken } = useAuth();
    const ref = useRef();

    const toggleCart = () => {
        if (ref.current.classList.contains("translate-x-full")) {
            ref.current.classList.remove("translate-x-full");
            ref.current.classList.add("translate-x-0");
        } else {
            ref.current.classList.remove("translate-x-0");
            ref.current.classList.add("translate-x-full");
        }
    };

    const navLinks = [
        { name: "Hoodies", href: "/hoodies" },
        { name: "T-Shirts", href: "/tshirts" },
        { name: "Mugs", href: "/mugs" },
        { name: "Stickers", href: "/stickers" },
    ];

    return (
        <div className="hidden md:block sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <ToastContainer position="bottom-left" autoClose={1000} theme="light" />

            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo width={120} height={40} showLink={true} />

                    <nav className="flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#DD8560] transition-colors">
                            HOME
                        </Link>

                        {/* Professional Dropdown */}
                        <div className="relative group">
                            <button
                                aria-label="Collections menu"
                                className="flex items-center text-sm font-medium text-gray-700 group-hover:text-[#DD8560] transition-colors py-4"
                            >
                                COLLECTIONS
                                <BiChevronDown className="ml-1 text-lg group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#DD8560] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#DD8560] transition-colors">
                            OUR STORY
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-5">
                        {localToken.value ? (
                            <DropdownMenu />
                        ) : (
                            <Link href="/login">
                                <button className="text-xs font-semibold uppercase tracking-widest text-white bg-black hover:bg-[#DD8560] px-5 py-2 transition-all duration-300 rounded-sm">
                                    Login
                                </button>
                            </Link>
                        )}

                        <div
                            className="relative cursor-pointer group"
                            onClick={toggleCart}
                            role="button"
                            aria-label="Open shopping cart"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && toggleCart()}
                        >
                            <FaCartPlus className="text-2xl text-gray-800 group-hover:text-[#DD8560] transition-colors" />
                            {Object.keys(cart).length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#DD8560] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                                    {Object.keys(cart).length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar Cart */}
            <div
                ref={ref}
                className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-2xl z-[60] transition-transform duration-500 ease-in-out translate-x-full p-8 flex flex-col"
            >
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="font-bold text-2xl text-gray-800">Your Cart</h2>
                    <IoCloseCircleSharp
                        onClick={toggleCart}
                        aria-label="Close cart"
                        role="button"
                        tabIndex={0}
                        className="text-3xl text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    />
                </div>

                <div className="flex-grow overflow-y-auto">
                    {Object.keys(cart).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {Object.keys(cart).map((k) => {
                                const item = cart[k];
                                return (
                                    <li key={k} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                            <span className="text-xs text-gray-500">{item.size} / {item.variant}</span>
                                        </div>
                                        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                            <BiSolidMinusCircle
                                                onClick={() => removeFromCart(k, 1, item.price, item.name, item.variant, item.size)}
                                                aria-label="Decrease quantity"
                                                role="button"
                                                tabIndex={0}
                                                className="text-[#DD8560] cursor-pointer hover:scale-110 transition-transform"
                                            />
                                            <span className="mx-3 text-sm font-bold">{item.qty}</span>
                                            <BiSolidPlusCircle
                                                onClick={() => addToCart(k, 1, item.price, item.name, item.variant, item.size)}
                                                aria-label="Increase quantity"
                                                role="button"
                                                tabIndex={0}
                                                className="text-[#DD8560] cursor-pointer hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="border-t pt-6 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 uppercase tracking-tighter">Subtotal</span>
                        <span className="text-xl font-bold text-gray-900">Rs.{subTotle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/checkout" className="w-full">
                            <button
                                disabled={Object.keys(cart).length <= 0}
                                aria-label="Proceed to checkout"
                                className="w-full flex items-center justify-center space-x-2 bg-black text-white py-3 rounded-sm hover:bg-[#DD8560] disabled:bg-gray-200 transition-colors"
                            >
                                <IoBagCheckOutline />
                                <span className="text-sm font-bold uppercase">Checkout</span>
                            </button>
                        </Link>
                        <button
                            onClick={clearCart}
                            disabled={Object.keys(cart).length <= 0}
                            aria-label="Clear cart"
                            className="w-full border border-gray-200 text-gray-600 py-3 rounded-sm hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-bold uppercase"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopHeader;