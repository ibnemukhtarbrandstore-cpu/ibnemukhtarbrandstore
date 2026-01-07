'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function StreamManagementPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFetchVideos = async () => {
        if (loading) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/stream/cron');
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Videos fetched successfully!');
                setResult(data);
            } else {
                toast.error(data.error || 'Failed to fetch videos');
                setResult({ error: data.error });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch videos');
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Stream Video Management</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">YouTube Video Fetcher</h2>
                    <p className="text-gray-600 mb-4">
                        Manually fetch videos from your YouTube channel to display on the stream page.
                    </p>

                    <button
                        onClick={handleFetchVideos}
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Fetching Videos...
                            </span>
                        ) : (
                            '🎬 Fetch Videos from YouTube'
                        )}
                    </button>
                </div>

                {result && (
                    <div className={`mt-6 p-4 rounded-lg ${result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                        <h3 className={`font-semibold mb-2 ${result.error ? 'text-red-800' : 'text-green-800'}`}>
                            {result.error ? 'Error' : 'Success'}
                        </h3>

                        {result.error ? (
                            <p className="text-red-700">{result.error}</p>
                        ) : (
                            <div className="text-green-800">
                                <p className="mb-2">{result.message}</p>
                                {result.archived && (
                                    <p className="text-sm">⚠️ Some old videos were archived to maintain feed limit.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Fetches latest 50 videos from your YouTube channel</li>
                        <li>Automatically categorizes videos (Poomsae, Fighter, Training)</li>
                        <li>Links relevant products to videos</li>
                        <li>Archives old videos if feed exceeds 200 videos</li>
                        <li>Skips videos that are already in the database</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Quick Links</h3>
                    <div className="flex gap-3">
                        <a
                            href="/stream"
                            target="_blank"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            View Stream Page →
                        </a>
                        <a
                            href="/api/stream/feed?category=all&limit=10"
                            target="_blank"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Check API Feed →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
