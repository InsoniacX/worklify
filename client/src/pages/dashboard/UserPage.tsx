import { DashboardLayout } from "@/components/layout";
import { UserTable } from "@/components/ui";
import { useUsers } from "@/hooks";

const UserPage = () => {
  const { users: usersList, loading } = useUsers();

  return (
    <DashboardLayout title="User List">
      <UserTable
        users={usersList}
        loading={loading}
        buttonLabel="Create New User"
        url="users/new"
        actions={true}
      />
    </DashboardLayout>
  );
};

export default UserPage;
