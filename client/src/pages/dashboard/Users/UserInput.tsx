import React, { useState } from "react";
import { DashboardLayout } from "@/components";
import { Forms } from "@/components";
import { useNavigate } from "react-router-dom";
import { authFetch } from "@/utils/AuthFetch";
import { useToast } from "@/context/ToastContext";

const UserInput = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      setError(null);
      setLoading(true);
      const response = await authFetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      navigate("/dashboard/users");
      showToast("User Successfully registered", "success");
    } catch (err) {
      showToast("Failed to Input User", "error");
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
          error={error}
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
