"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties; 
    loading?: "lazy" | "eager"; 
}

export default function OptimizedImage({ 
    src, 
    alt, 
    className = "", 
    style,
    loading = "lazy" 
}: OptimizedImageProps) {
    const [isLoading, setLoading] = useState(true);

    return (
        <div 
            style={style} 
            className={`relative w-full overflow-hidden bg-gray-100 ${className}`}
        >
            {/* Skeleton Loader */}
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-10" />
            )}
            
            <Image
                src={src}
                alt={alt}
                width={800} 
                height={500}
                sizes="100vw"
                loading={loading} 
                style={{ width: '100%', height: 'auto', ...style }} 
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                priority={false}
            />
        </div>
    );
}