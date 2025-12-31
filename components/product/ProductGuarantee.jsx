import { GENERIC_GUARANTEE } from '@/lib/genericProductData';

export default function ProductGuarantee() {
    // Always show guarantee - it's generic for all products
    return (
        <div className="my-6 border-2 border-green-500 rounded-lg p-6 bg-green-50 text-center">
            <div className="text-4xl mb-2">🛡️</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
                {GENERIC_GUARANTEE.days}-Day Money Back Guarantee
            </h3>
            <p className="text-sm text-green-700 mb-4">100% Risk-Free Purchase</p>

            <div className="flex flex-wrap justify-center gap-3">
                {GENERIC_GUARANTEE.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-green-800 font-medium">
                        <span className="mr-1">✓</span>
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
