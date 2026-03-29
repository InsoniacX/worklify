import { DashboardLayout, Pagination, SearchBar } from "@/components";
import { UserTable } from "@/components";
import { useUsers } from "@/hooks";
import { authFetch } from "@/utils/AuthFetch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: "", email: "" });
  const [page, setPage] = useState(1);

  const { users, loading, totalPages } = useUsers(filters, page);

  const handleEdit = (id: string) => {
    navigate(`/dashboard/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure want to delete this user?")) return;
    await authFetch(`http://localhost:8080/api/user/${id}`, {
      method: "DELETE",
    });
    setFilters({ ...filters });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <DashboardLayout title="User List">
      <div className="flex items-center gap-2 mb-4">
        <SearchBar
          placeholder="Search by Name..."
          onSearch={(val) =>
            setFilters((prev) => ({ ...prev, name: val, email: val }))
          }
        />
        {/* <SearchBar
          placeholder="Search by Email..."
          onSearch={(val) => setFilters((prev) => ({ ...prev, email: val }))}
        /> */}
      </div>
      <UserTable
        users={users}
        loading={loading}
        title="All users"
        buttonLabel="Create New User"
        url="users/new"
        actions={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        currentPages={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </DashboardLayout>
  );
};

export default UserPage;
