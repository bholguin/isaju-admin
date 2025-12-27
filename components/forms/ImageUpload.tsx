'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProductImage } from '@/components/ui/ProductImage';
import { X, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }

      setUploading(true);
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          onImagesChange([...images, ...data.files]);
        } else {
          alert(data.error || 'Error al subir imágenes');
        }
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error al subir imágenes');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Eliminar del servidor
    try {
      // Si es una URL completa (Blob en producción), enviar como query param
      // Si es una ruta relativa (filesystem en desarrollo), enviar como path param
      const isUrl =
        imageToRemove.startsWith('http://') ||
        imageToRemove.startsWith('https://');

      if (isUrl) {
        // URL completa - enviar como query param
        await fetch(
          `/api/upload/${encodeURIComponent(
            imageToRemove.split('/').pop() || ''
          )}?url=${encodeURIComponent(imageToRemove)}`,
          {
            method: 'DELETE',
          }
        );
      } else {
        // Ruta relativa - enviar como path param
        const filename = imageToRemove.split('/').pop();
        if (filename) {
          await fetch(`/api/upload/${filename}`, {
            method: 'DELETE',
          });
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    onImagesChange(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Imágenes</label>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-secondary bg-secondary/10'
            : 'border-gray-300 hover:border-gray-400',
          uploading || images.length >= maxImages
            ? 'opacity-50 cursor-not-allowed'
            : ''
        )}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Suelta las imágenes aquí'
              : 'Arrastra imágenes aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG o WebP (máx. 5MB cada una, máx. {maxImages} imágenes)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <ProductImage
                src={image}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
              {index > 0 && (
                <button
                  onClick={() => moveImageUp(index)}
                  className="absolute top-2 left-2 bg-secondary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Mover arriba">
                  ↑
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  onClick={() => moveImageDown(index)}
                  className="absolute bottom-10 left-2 bg-secondary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Mover abajo">
                  ↓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
