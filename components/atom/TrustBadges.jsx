"use client";
import { FaTruckFast } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { BiMessageRoundedDots } from "react-icons/bi";
import BorderSection from "./BorderSection";

export default function TrustBadges() {
    return (
        <section className="py-6 md:py-8 px-4">
            <div className="container mx-auto">
                <BorderSection className="mb-6 md:mb-8" />
                <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
                    <div className="p-3 md:p-4 flex flex-col justify-center items-center">
                        <div className="text-2xl md:text-4xl font-bold text-black mb-1 md:mb-2">
                            <FaTruckFast />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            Free Shiping
                        </div>
                    </div>
                    <div className="p-3 md:p-4 flex flex-col justify-center items-center">
                        <div className="text-2xl md:text-4xl font-bold text-black mb-1 md:mb-2">
                            <BiMessageRoundedDots />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            24/7 Customer Support
                        </div>
                    </div>
                    <div className="p-3 md:p-4 flex flex-col justify-center items-center">
                        <div className="text-2xl md:text-4xl font-bold text-black mb-1 md:mb-2">
                            <FaLock />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            Secure Payments
                        </div>
                    </div>
                </div>
                <BorderSection className="mt-6 md:mt-8" />
            </div>
        </section>
    );
}
