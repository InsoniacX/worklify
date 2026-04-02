import { DashboardLayout, Forms } from "@/components";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/utils/AuthFetch";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [defaultValue, setDefaultValue] = useState({
    name: "",
    email: "",
    address: "",
  });
  // const [success, setSuccess] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/user/${id}`
        );
        if (!response.ok) throw new Error("User Not Found");
        const data = await response.json();
        setDefaultValue({
          name: data.name,
          email: data.email,
          address: data.address,
        });
      } catch (err) {
        showToast("Failed to Fetch User Data", "error");
      } finally {
        setFetching(false);
      }
    };

    fetchUsers();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      password: formData.get("password") as string,
    };

    try {
      setLoading(true);
      const response = await authFetch(`http://localhost:8080/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }
      console.log("Data has been Updated");
      navigate("/admin/dashboard/users");
      showToast("Successfully Updated User Info", "success");
    } catch (error) {
      showToast("Failed to Update User Info", "error");
    } finally {
      setLoading(false);
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
    <DashboardLayout title="Edit Page">
      <div className="flex items-center justify-center">
        <Forms
          title="User Edit"
          buttonLabel="Submit"
          loading={loading}
          onSubmit={handleSubmit}
          defaultValue={defaultValue}
          error={error}
          fields={[
            {
              type: "text",
              name: "name",
              label: "Name",
              placeholder: "Enter name",
            },
            {
              type: "email",
              name: "email",
              label: "Email",
              placeholder: "Enter email",
            },
            {
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "Enter Password",
            },
            {
              type: "text",
              name: "address",
              label: "Address",
              placeholder: "Enter address",
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserEdit;
