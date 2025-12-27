"use client";

import { ProductForm } from "@/components/forms/ProductForm";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/products");
      } else {
        alert(result.error || "Error al crear producto");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error al crear producto");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-gray-600 mt-1">
          Agrega un nuevo producto al catálogo de Isaju
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
          <CardDescription>
            Completa todos los campos para crear el producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}

