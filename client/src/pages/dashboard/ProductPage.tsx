import { DashboardLayout, ProductTable } from "@/components";
import { useProduct } from "@/hooks";
import { authFetch } from "@/utils/AuthFetch";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { products: productsList, loading, refetch } = useProduct();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure want to delete this user?")) return;

    try {
      const response = await authFetch(
        `http://localhost:8080/api/product/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete this Product");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Product List">
      <ProductTable
        products={productsList}
        loading={loading}
        title="All products"
        buttonLabel="Create New Product"
        url="/dashboard/products/new"
        actions={true}
        onEdit={(id) => navigate(`/products/${id}/edit`)}
        onDelete={(id) => handleDelete(id)}
      />
    </DashboardLayout>
  );
};

export default ProductPage;
