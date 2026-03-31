import {
  DashboardLayout,
  Pagination,
  ProductTable,
  SearchBar,
} from "@/components";
import { useToast } from "@/context/ToastContext";
import { useProduct } from "@/hooks";
import { authFetch } from "@/utils/AuthFetch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [filters, setFilters] = useState({ name: "", category: "", stock: "" });
  const [page, setPage] = useState(1);

  const { products, loading, totalPages } = useProduct(filters, page);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await authFetch(
        `http://localhost:8080/api/product/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to Delete User");
      showToast("Successfully Deleted Products", "error");
      setFilters({ ...filters });
    } catch (err) {
      showToast("Failed to Delete Products", "error");
    }
  };

  return (
    <DashboardLayout title="Product List">
      <div className="flex items-center gap-2 mb-4">
        <SearchBar
          placeholder="Search by name..."
          onSearch={(val) => setFilters((prev) => ({ ...prev, name: val }))}
        />
        <SearchBar
          placeholder="Filter by category..."
          onSearch={(val) => setFilters((prev) => ({ ...prev, category: val }))}
        />
      </div>
      <ProductTable
        products={products}
        loading={loading}
        title="All products"
        buttonLabel="Create New Product"
        url="/dashboard/products/new"
        actions={true}
        onEdit={(id) => navigate(`/dashboard/products/${id}/edit`)}
        onDelete={(id) => handleDelete(id)}
      />
      <Pagination
        currentPages={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </DashboardLayout>
  );
};

export default ProductPage;
