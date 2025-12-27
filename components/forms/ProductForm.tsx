'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    price: string;
    description: string;
    images: string[];
    published?: boolean;
    estado?: boolean;
    order?: number;
  };
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      description: initialData?.description || '',
      images: initialData?.images || [],
      published: initialData?.published ?? true,
      estado: initialData?.estado ?? true,
    },
  });

  // Sincronizar imágenes con el formulario cuando cambien
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setValue('images', newImages, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Asegurar que las imágenes estén incluidas en los datos
      await onSubmit({ ...data, images });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Precio *</Label>
        <Input
          id="price"
          {...register('price')}
          placeholder="$60.000"
          className={errors.price ? 'border-red-500' : ''}
        />
        {errors.price && (
          <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={6}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <ImageUpload images={images} onImagesChange={handleImagesChange} />
      {errors.images && (
        <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
      )}

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            {...register('published')}
            defaultChecked={initialData?.published !== false}
            className="rounded"
          />
          <Label htmlFor="published">Publicado</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="estado"
            {...register('estado')}
            defaultChecked={initialData?.estado !== false}
            className="rounded"
          />
          <Label htmlFor="estado">Estado Activo</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
