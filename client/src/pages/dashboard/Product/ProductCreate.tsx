import { DashboardLayout, Forms } from "@/components";
import { authFetch } from "@/utils/AuthFetch";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      supplier: formData.get("supplier") as string,
    };

    if (isNaN(data.stock))
      return console.error("The Value of Stock need to be Number");

    try {
      setError(null);
      setLoading(true);
      const response = await authFetch("http://localhost:8080/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      navigate("/dashboard/products");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="New Product">
      <div className="flex items-center justify-center">
        <Forms
          title="Input Product"
          buttonLabel="Submit"
          loading={loading}
          onSubmit={handleSubmit}
          error={error}
          fields={[
            {
              type: "text",
              name: "name",
              label: "Product Name",
              placeholder: "Name of the Product",
            },
            {
              type: "text",
              name: "brand",
              label: "Brand",
              placeholder: "Name of the Product Brand",
            },
            {
              type: "text",
              name: "category",
              label: "Category",
              placeholder: "Name of the Product Category",
            },
            {
              type: "number",
              name: "stock",
              label: "Stock",
              placeholder: "Stock Available",
            },
            {
              type: "text",
              name: "supplier",
              label: "Supplier",
              placeholder: "Company Name that supply the Product",
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateProduct;
