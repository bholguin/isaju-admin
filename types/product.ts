export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  estado: boolean;
  order?: number | null;
}

export interface ProductFormData {
  name: string;
  price: string;
  description: string;
  images: string[];
  published?: boolean;
  order?: number;
}

