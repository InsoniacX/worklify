import { useState } from "react";
import { DashboardLayout } from "@/components";
import { authFetch } from "@/utils/AuthFetch";
import { MdLock, MdPerson, MdCamera } from "react-icons/md";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    address: storedUser.address || "",
    picture: storedUser.picture || "",
  });

  // ── Handle profile update ─────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileError(null);
      setProfileSuccess(null);

      const response = await authFetch(
        `http://localhost:8080/api/user/${storedUser._id}`,
        {
          method: "PATCH",
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const updated = await response.json();

      // Remove password from stored user just in case
      const { password: _, ...userWithoutPassword } = updated;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError((err as Error).message);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Handle password change ────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }

    try {
      setPassLoading(true);
      setPassError(null);
      setPassSuccess(null);

      const response = await authFetch(
        `http://localhost:8080/api/user/${storedUser._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      setPassSuccess("Password changed successfully");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setPassError((err as Error).message);
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* ── Avatar & name card ── */}
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4 flex items-center gap-2">
            <MdCamera size={13} /> Profile picture
          </p>
          <div className="flex items-center gap-4">
            {form.picture ? (
              <img
                src={form.picture}
                alt={form.name}
                className="w-16 h-16 rounded-full object-cover border border-neutral-800"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-[20px] font-medium shrink-0">
                {form.name.slice(0, 2).toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className="text-[15px] font-medium text-neutral-100">
                {form.name}
              </p>
              <p className="text-[12px] text-neutral-600">{form.email}</p>
              <p className="text-[11px] text-neutral-700 mt-1">
                Update your picture URL in the profile info section below
              </p>
            </div>
          </div>
        </div>

        {/* ── Profile info card ── */}
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4 flex items-center gap-2">
            <MdPerson size={13} /> Profile info
          </p>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            {[
              {
                label: "Name",
                key: "name",
                type: "text",
                placeholder: "Enter your name",
              },
              {
                label: "Email",
                key: "email",
                type: "email",
                placeholder: "Enter your email",
              },
              {
                label: "Address",
                key: "address",
                type: "text",
                placeholder: "Enter your address",
              },
              {
                label: "Picture URL",
                key: "picture",
                type: "text",
                placeholder: "https://your-image-url",
              },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
                />
              </div>
            ))}

            {profileError && (
              <p className="text-[12px] text-red-400">{profileError}</p>
            )}
            {profileSuccess && (
              <p className="text-[12px] text-teal-400">{profileSuccess}</p>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="mt-2 py-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[13px] font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileLoading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* ── Change password card ── */}
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4 flex items-center gap-2">
            <MdLock size={13} /> Change password
          </p>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            {[
              {
                label: "New password",
                name: "newPassword",
                placeholder: "Enter new password",
              },
              {
                label: "Confirm password",
                name: "confirmPassword",
                placeholder: "Confirm new password",
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
                  {field.label}
                </label>
                <input
                  type="password"
                  name={field.name}
                  placeholder={field.placeholder}
                  className="bg-[#0a0a09] border border-neutral-900 rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
                />
              </div>
            ))}

            {passError && (
              <p className="text-[12px] text-red-400">{passError}</p>
            )}
            {passSuccess && (
              <p className="text-[12px] text-teal-400">{passSuccess}</p>
            )}

            <button
              type="submit"
              disabled={passLoading}
              className="mt-2 py-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[13px] font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passLoading ? "Changing..." : "Change password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
