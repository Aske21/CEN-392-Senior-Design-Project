"use client";

import { useState } from "react";
import { FiImage } from "react-icons/fi";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (imageError || !src) {
    if (fill) {
      return (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        >
          <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-600 flex-shrink-0" />
        </div>
      );
    }

    const styleProps = width && height
      ? { width: `${width}px`, height: `${height}px` }
      : { width: "100%", height: "200px" };

    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={styleProps}
      >
        <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-600 flex-shrink-0" />
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width || 200}
      height={height || 200}
      className={className}
      onError={handleError}
    />
  );
}
