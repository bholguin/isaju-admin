import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200, "El nombre es demasiado largo"),
  price: z.string().min(1, "El precio es requerido"),
  description: z.string().min(1, "La descripción es requerida").max(2000, "La descripción es demasiado larga"),
  images: z.array(z.string()).min(1, "Debe haber al menos una imagen").max(10, "Máximo 10 imágenes"),
  published: z.boolean().optional().default(true),
  estado: z.boolean().optional().default(true),
  order: z.number().int().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

