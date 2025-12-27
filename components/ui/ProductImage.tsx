'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any;
}

export function ProductImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  ...props
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Si la imagen empieza con /uploads, es una imagen local
  // Si es una URL completa de Blob, no es local
  const isLocalImage =
    imgSrc.startsWith('/uploads') && !imgSrc.startsWith('http');

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}>
        <span className="text-gray-400 text-xs">Imagen no disponible</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        unoptimized={isLocalImage}
        onError={() => {
          console.error('Error loading image:', imgSrc);
          setHasError(true);
        }}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={isLocalImage}
      onError={() => {
        console.error('Error loading image:', imgSrc);
        setHasError(true);
      }}
      {...props}
    />
  );
}
