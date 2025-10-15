"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "@/lib/motion";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  enableHover?: boolean;
}

// Helper function to optimize Unsplash URLs
const optimizeImageUrl = (url: string, width: number = 800): string => {
  if (!url.includes("unsplash.com")) return url;

  // Add Unsplash URL parameters for optimization
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&q=75&auto=format`;
};

const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzYwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjAnIGZpbGw9JyNmNGY0ZjUnIC8+PC9zdmc+";

export default function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  enableHover = true,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const optimizedSrc = optimizeImageUrl(src);
  const fallbackImage = "/placeholder-image.svg";
  const blurDataURL = DEFAULT_BLUR_DATA_URL;

  const ImageComponent = (
    <>
      {/* Loading skeleton with shimmer effect */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Actual image */}
      <Image
        src={imageError ? fallbackImage : optimizedSrc}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </>
  );

  if (enableHover) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full relative"
      >
        {ImageComponent}
      </motion.div>
    );
  }

  return <div className="w-full h-full relative">{ImageComponent}</div>;
}
