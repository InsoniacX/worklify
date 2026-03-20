import { DashboardLayout } from "@/components/layout";
import { Forms } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [defaultValue, setDefaultValue] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`);
        if (!response.ok) throw new Error("User Not Found");
        const data = await response.json();
        setDefaultValue({
          name: data.name,
          email: data.email,
          address: data.address,
        });
      } catch (error) {
        console.error(error);
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
    };

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to Update User");
      console.log("Data has been Updated");
      navigate("/dashboard/users");
    } catch (error) {
      console.error(error);
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
      <Forms
        title="User Edit"
        buttonLabel="Submit"
        loading={loading}
        onSubmit={handleSubmit}
        defaultValue={defaultValue}
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
            type: "text",
            name: "address",
            label: "Address",
            placeholder: "Enter address",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default UserEdit;
