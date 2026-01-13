import { NextResponse } from 'next/server';

/**
 * GET /api/geolocation
 * Server-side proxy for IP geolocation to avoid CORS issues
 */
export async function GET() {
    try {
        // Fetch from ipapi.co server-side (no CORS restrictions)
        const response = await fetch('https://ipapi.co/json/', {
            headers: {
                'User-Agent': 'ibnemukhtarbrandstore/1.0',
            },
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) {
            throw new Error(`ipapi.co returned status ${response.status}`);
        }

        const data = await response.json();

        // Return only necessary data
        return NextResponse.json({
            success: true,
            country: data.country_code || 'US',
            countryName: data.country_name || 'United States',
            city: data.city,
            region: data.region,
        });
    } catch (error) {
        console.error('❌ Geolocation API Error:', error.message);

        // Return default location (USA) on error
        return NextResponse.json({
            success: true,
            country: 'US',
            countryName: 'United States',
            city: null,
            region: null,
            fallback: true,
        });
    }
}
