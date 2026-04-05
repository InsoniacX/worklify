import { useToast } from "@/context/ToastContext";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Floating orbs ─────────────────────────────────────────────────────────────
const Orbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl"
      style={{
        background: "radial-gradient(circle, #6366f1, transparent)",
        top: "-4rem",
        left: "-4rem",
        animation: "float1 8s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-64 h-64 rounded-full opacity-15 blur-3xl"
      style={{
        background: "radial-gradient(circle, #8b5cf6, transparent)",
        bottom: "-3rem",
        right: "-3rem",
        animation: "float2 10s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(20px, -20px) scale(1.05); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-15px, 15px) scale(1.08); }
      }
      @keyframes slideLeft {
        from { transform: translateX(60px); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
      @keyframes slideRight {
        from { transform: translateX(-60px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
      }
    `}</style>
  </div>
);

// ── Input ─────────────────────────────────────────────────────────────────────
const Input = ({
  type,
  name,
  placeholder,
  label,
  value,
  onChange,
  required,
}: {
  type: string;
  name: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-medium tracking-widest uppercase text-white/40">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-400/60 focus:bg-white/8 transition-all duration-200"
    />
  </div>
);

// ── Submit button ─────────────────────────────────────────────────────────────
const SubmitButton = ({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 rounded-xl text-[13px] font-medium text-white tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] mt-2"
    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        Signing in...
      </span>
    ) : (
      label
    )}
  </button>
);

// ── LoginPage ─────────────────────────────────────────────────────────────────
export const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"login" | "register">("login");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  // ── Login handler ───────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const { token, user } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showToast(`Good to see you again, ${user.name} 👋`, "info");

      if (user.role === "admin" || user.role === "owner") {
        navigate("/admin/dashboard");
      } else {
        navigate("/app");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ── Register handler ────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      showToast("Account created! Please sign in.", "success");
      setLoginForm({ email: registerForm.email, password: "" });
      setView("login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (to: "login" | "register") => {
    setError(null);
    setView(to);
  };

  return (
    <div
      className="h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0a0a12", fontFamily: "'Syne', sans-serif" }}
    >
      <Orbs />

      {/* Card */}
      <div
        className="relative w-full max-w-[780px] rounded-3xl overflow-hidden flex"
        style={{
          height: view === "login" ? "440px" : "520px",
          transition: "height 0.4s ease-in-out",
          boxShadow: "0 32px 80px rgba(99,102,241,0.15)",
        }}
      >
        {/* ── Left panel ── */}
        <div
          className="relative flex flex-col justify-between p-10 shrink-0 overflow-hidden"
          style={{
            width: "42%",
            background:
              "linear-gradient(145deg, #6366f1 0%, #7c3aed 60%, #4f46e5 100%)",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px),
                repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)
              `,
            }}
          />

          {/* Logo */}
          <div className="relative flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-[13px] font-medium text-white/80 tracking-widest uppercase">
              Workly
            </span>
          </div>

          {/* Text */}
          <div
            className="relative"
            key={view}
            style={{ animation: "slideRight 0.4s ease-out" }}
          >
            {view === "login" ? (
              <>
                <h1 className="text-[28px] font-medium text-white leading-tight mb-3">
                  Welcome
                  <br />
                  back.
                </h1>
                <p className="text-[13px] text-white/60 leading-relaxed mb-6">
                  Sign in to continue collaborating with your team.
                </p>
                <p className="text-[12px] text-white/50 mb-2">
                  Don't have an account?
                </p>
                <button
                  onClick={() => switchView("register")}
                  className="text-[12px] font-medium text-white border border-white/30 px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Create account →
                </button>
              </>
            ) : (
              <>
                <h1 className="text-[28px] font-medium text-white leading-tight mb-3">
                  Join the
                  <br />
                  team.
                </h1>
                <p className="text-[13px] text-white/60 leading-relaxed mb-6">
                  Start collaborating with your team today.
                </p>
                <p className="text-[12px] text-white/50 mb-2">
                  Already have an account?
                </p>
                <button
                  onClick={() => switchView("login")}
                  className="text-[12px] font-medium text-white border border-white/30 px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Sign in →
                </button>
              </>
            )}
          </div>

          <p className="relative text-[10px] text-white/30 tracking-widest uppercase">
            Team collaboration platform
          </p>
        </div>

        {/* ── Right panel ── */}
        <div
          className="flex-1 flex flex-col justify-center px-10 py-8 relative overflow-hidden"
          style={{ background: "#0f0f1a" }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6366f1 50%, transparent)",
            }}
          />

          <div key={view} style={{ animation: "slideLeft 0.4s ease-out" }}>
            {view === "login" ? (
              <>
                <p className="text-[11px] font-medium tracking-widest uppercase text-indigo-400 mb-1">
                  Sign in
                </p>
                <h2 className="text-[22px] font-medium text-white mb-6">
                  Good to see you again
                </h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="john.doe@mail.com"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                  <div className="flex justify-end -mt-1">
                    <button
                      type="button"
                      className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <p className="text-[12px] text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <SubmitButton loading={loading} label="Sign in" />
                </form>
              </>
            ) : (
              <>
                <p className="text-[11px] font-medium tracking-widest uppercase text-indigo-400 mb-1">
                  Create account
                </p>
                <h2 className="text-[22px] font-medium text-white mb-5">
                  Let's get started
                </h2>

                <form
                  onSubmit={handleRegister}
                  className="flex flex-col gap-2.5"
                >
                  <Input
                    type="text"
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="john.doe@mail.com"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Min 8 characters"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    type="text"
                    name="address"
                    label="Address"
                    placeholder="Your address"
                    value={registerForm.address}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: e.target.value,
                      })
                    }
                  />

                  {error && (
                    <p className="text-[12px] text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <SubmitButton loading={loading} label="Create account" />
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default AuthPage;
