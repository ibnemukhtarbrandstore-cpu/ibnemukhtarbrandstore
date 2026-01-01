'use client';
import React from 'react';
import OptimizedImage from '@/components/common/OptimizedImage';

/**
 * PaymentTrustBadges Component
 * Displays trusted payment method badge to build customer confidence
 */
export default function PaymentTrustBadges() {
    return (
        <div className="rounded-lg ">
            {/* Payment Methods Image */}
            <div className="flex justify-center">
                <div className="relative w-full max-w-md h-8 bg-white rounded-lg overflow-hidden">
                    <OptimizedImage
                        src="https://res.cloudinary.com/dwqchugmp/image/upload/v1767290933/2_zojaas.png"
                        alt="Accepted Payment Methods: Visa, Mastercard, JazzCash, Easypaisa"
                        fill
                        className="object-contain p-0"
                        sizes="(max-width: 768px) 100vw, 500px"
                        fallbackIcon="💳"
                        priority={false}
                    />
                </div>
            </div>
        </div>
    );
}
