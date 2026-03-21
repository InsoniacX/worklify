import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Forms } from "@/components/ui";
import { useNavigate } from "react-router-dom";

const UserInput = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create User");
      navigate("/dashboard/users");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Register New User">
      <div className="flex items-center justify-center">
        <Forms
          title="User Forms"
          buttonLabel="Submit"
          loading={loading}
          onSubmit={handleSubmit}
          fields={[
            {
              type: "text",
              name: "name",
              label: "Name",
              placeholder: "John Doe",
            },
            {
              type: "email",
              name: "email",
              label: "Email",
              placeholder: "you@example.com",
            },
            {
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "••••••••",
            },
            {
              type: "textarea",
              name: "address",
              label: "Address",
              placeholder: "123 Maple Street Anytown, PA 17101",
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserInput;
