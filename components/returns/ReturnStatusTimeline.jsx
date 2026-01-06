"use client";

/**
 * ReturnStatusTimeline Component
 * Visual timeline showing return request progress
 * Displays all status changes with dates
 */

export default function ReturnStatusTimeline({ statusHistory, currentStatus }) {
    // Status steps in order
    const statusSteps = [
        { key: "pending", label: "Request Submitted" },
        { key: "approved", label: "Approved" },
        { key: "items_received", label: "Items Received" },
        { key: "refunded", label: "Refunded" },
        { key: "completed", label: "Completed" },
    ];

    // Get index of current status
    const currentStepIndex = statusSteps.findIndex((s) => s.key === currentStatus);

    return (
        <div className="py-6">
            <h3 className="font-semibold mb-4">Return Progress</h3>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Status History Items */}
                {statusHistory.map((history, index) => (
                    <div key={index} className="relative flex gap-4 mb-6">
                        {/* Status Dot */}
                        <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStepIndex
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                        >
                            {index <= currentStepIndex && (
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>

                        {/* Status Info */}
                        <div className="flex-1">
                            <p className="font-medium">
                                {history.status.replace(/_/g, " ").toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">
                                {new Date(history.updatedAt).toLocaleString()}
                            </p>
                            {history.note && (
                                <p className="text-sm text-gray-500 mt-1">{history.note}</p>
                            )}
                            {history.updatedBy && (
                                <p className="text-xs text-gray-400 mt-1">
                                    By: {history.updatedBy}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
