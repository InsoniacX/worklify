import { DashboardLayout, Forms } from "@/components";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/utils/AuthFetch";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [defaultValue, setDefaultValue] = useState({
    name: "",
    brand: "",
    category: "",
    stock: 0,
    supplier: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/product/${id}`
        );
        if (!response.ok) throw new Error("Product Not Found");
        const data = await response.json();
        setDefaultValue({
          name: data.name,
          brand: data.brand,
          category: data.category,
          stock: data.stock,
          supplier: data.supplier,
        });
      } catch (err) {
        showToast("Failed to Fetch Product Data", "error");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

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

    try {
      setLoading(true);
      const response = await authFetch(
        `http://localhost:8080/api/product/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      navigate("/dashboard/products");
      showToast("Successfully Edited Product Data", "success");
    } catch (err) {
      showToast("Failed to Update Product Data", "error");
    }
  };

  if (fetching) {
    return (
      <DashboardLayout title="Edit Page">
        <p className="text-[12px] text-neutral-600">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Product">
      <div className="flex items-center justify-center">
        <Forms
          title={`Edit Product`}
          buttonLabel="Submit"
          loading={loading}
          onSubmit={handleSubmit}
          defaultValue={defaultValue}
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

export default ProductEdit;
