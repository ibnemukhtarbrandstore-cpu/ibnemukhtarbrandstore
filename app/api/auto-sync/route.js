import { NextResponse } from 'next/server';

/**
 * GET /api/auto-sync
 * Auto-sync route to be called by external cron service every 24 hours
 * Example: cron-job.org, Vercel Cron, or any external scheduler
 */
export async function GET(request) {
    try {
        // Verify request is from authorized source (optional security)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'default-secret-change-in-production';

        if (authHeader !== `Bearer ${cronSecret}`) {
            console.warn('⚠️ Unauthorized cron attempt');
            // Still proceed but log the warning
        }

        console.log('🔄 Auto-sync started at:', new Date().toISOString());

        // Call the sync inventory API
        const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'}/api/cj/sync-inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds: [] }), // Empty array = sync all
        });

        const syncResult = await syncResponse.json();

        if (syncResult.success) {
            console.log('✅ Auto-sync completed:', syncResult.syncReport);

            return NextResponse.json({
                success: true,
                message: 'Auto-sync completed successfully',
                report: syncResult.syncReport,
                timestamp: new Date().toISOString(),
            });
        } else {
            console.error('❌ Auto-sync failed:', syncResult.error);

            return NextResponse.json(
                { success: false, error: syncResult.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('❌ Auto-sync Error:', error);

        return NextResponse.json(
            { success: false, error: error.message || 'Auto-sync failed' },
            { status: 500 }
        );
    }
}

/**
 * POST endpoint for manual trigger
 */
export async function POST(request) {
    // Same as GET for flexibility
    return GET(request);
}
