'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * OptimizedImage Component
 * 
 * A reusable image component with:
 * - Automatic error handling and retry logic
 * - Fast loading with Next.js optimization
 * - High quality image display
 * - Fallback placeholder on error
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {boolean} fill - Whether to fill the parent container
 * @param {string} className - Additional CSS classes
 * @param {string} sizes - Image sizes for responsive loading
 * @param {number} width - Image width (if not using fill)
 * @param {number} height - Image height (if not using fill)
 * @param {string} fallbackIcon - Emoji or icon to show on error (default: 📷)
 * @param {number} maxRetries - Maximum retry attempts (default: 2)
 * @param {Object} ...props - Other Next.js Image props
 */
export default function OptimizedImage({
    src,
    alt = '',
    fill = false,
    className = '',
    sizes,
    width,
    height,
    fallbackIcon = '📷',
    maxRetries = 2,
    priority = false,
    quality = 90,
    ...props
}) {
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    // Reset error state when src changes
    useEffect(() => {
        setImageError(false);
        setRetryCount(0);
        setImageSrc(src);
        setIsLoading(true);
    }, [src]);

    // Handle image load error with retry logic
    const handleImageError = () => {
        if (retryCount < maxRetries) {
            // Retry loading the image after a short delay
            setTimeout(() => {
                setRetryCount(prev => prev + 1);
                // Add cache-busting parameter to force reload
                const separator = src.includes('?') ? '&' : '?';
                setImageSrc(`${src}${separator}retry=${retryCount + 1}`);
            }, 1000 * (retryCount + 1)); // Exponential backoff
        } else {
            // Show fallback after max retries
            setImageError(true);
            setIsLoading(false);
        }
    };

    // Handle successful image load
    const handleImageLoad = () => {
        setIsLoading(false);
        setImageError(false);
    };

    // If image failed after retries, show fallback
    if (imageError) {
        return (
            <div
                className={`w-full h-full flex items-center justify-center bg-gray-200 ${className}`}
                style={!fill && width && height ? { width, height } : {}}
            >
                <span className="text-4xl md:text-6xl opacity-50">{fallbackIcon}</span>
            </div>
        );
    }

    // Render optimized image
    const imageProps = {
        src: imageSrc,
        alt,
        className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
        onError: handleImageError,
        onLoad: handleImageLoad,
        quality,
        priority,
        ...props
    };

    if (fill) {
        return (
            <>
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                    {...imageProps}
                    fill
                    sizes={sizes || '100vw'}
                />
            </>
        );
    }

    return (
        <>
            {isLoading && width && height && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{ width, height }}
                />
            )}
            <Image
                {...imageProps}
                width={width}
                height={height}
                sizes={sizes}
            />
        </>
    );
}
