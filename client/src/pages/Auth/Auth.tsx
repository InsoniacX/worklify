import { Forms } from "@/components";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const { token, user } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex justify-center items-center">
      <Forms
        title="Login Page"
        buttonLabel="Login"
        loading={loading}
        onSubmit={handleLogin}
        error={error}
        fields={[
          {
            type: "email",
            name: "email",
            label: "email",
            placeholder: "john.doe@mail.ex",
          },
          {
            type: "password",
            name: "password",
            label: "password",
            placeholder: "••••••••",
          },
        ]}
      />
    </div>
  );
};
