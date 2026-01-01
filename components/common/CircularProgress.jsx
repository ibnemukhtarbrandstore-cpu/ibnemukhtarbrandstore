'use client';
import React, { useEffect, useState } from 'react';

/**
 * CircularProgress Component
 * A beautiful animated circular progress indicator with percentage display
 * 
 * @param {number} percentage - The percentage value (0-100)
 * @param {number} size - The size of the circle in pixels (default: 120)
 * @param {number} strokeWidth - The width of the progress ring (default: 8)
 * @param {string} color - The color of the progress ring (default: '#10b981' - green)
 * @param {string} backgroundColor - The color of the background ring (default: '#e5e7eb' - gray)
 * @param {number} animationDuration - Animation duration in milliseconds (default: 1500)
 */
export default function CircularProgress({
    percentage = 0,
    size = 120,
    strokeWidth = 8,
    color = '#10b981',
    backgroundColor = '#e5e7eb',
    animationDuration = 1500
}) {
    const [progress, setProgress] = useState(0);

    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Animate the progress on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(percentage);
        }, 100);

        return () => clearTimeout(timer);
    }, [percentage]);

    // Calculate the stroke offset for the progress
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    className="opacity-30"
                />

                {/* Progress Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                        transitionDuration: `${animationDuration}ms`,
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                    }}
                />
            </svg>

            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className="text-3xl font-bold transition-all duration-1000"
                    style={{
                        color: color,
                        transitionDuration: `${animationDuration}ms`
                    }}
                >
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}
