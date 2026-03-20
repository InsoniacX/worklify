import { DashboardLayout } from "@/components/layout";
import { UserTable } from "@/components/ui";
import { useUsers } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const { users: usersList, loading, refetch } = useUsers();
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate("/users/${id}/edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete this user");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout title="User List">
      <UserTable
        users={usersList}
        loading={loading}
        buttonLabel="Create New User"
        url="users/new"
        actions={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
};

export default UserPage;
