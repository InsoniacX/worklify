import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MdApps,
  MdCalendarMonth,
  MdDashboard,
  MdGroup,
  MdHome,
  MdLogout,
  MdNotifications,
  MdPerson,
  MdSettings,
  MdTask,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const navLinks = [
  { url: "/app/", label: "Home", icon: <MdHome size={15} /> },
  { url: "/app/tasks", label: "Tasks", icon: <MdTask size={15} /> },
  { url: "/app/teams", label: "Teams", icon: <MdGroup size={15} /> },
  {
    url: "/app/schedule",
    label: "Schedule",
    icon: <MdCalendarMonth size={15} />,
  },
  {
    url: "/app/notifications",
    label: "Notification",
    icon: <MdNotifications size={15} />,
  },
];

const NavItem = ({
  url,
  label,
  icon,
}: {
  url: string;
  label: string;
  icon: ReactNode;
}) => {
  const { pathname } = useLocation();
  const active = pathname === url;

  return (
    <Link
      to={url}
      className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 rounded-lg mx-2 no-underline ${
        active
          ? "bg-blue-950 text-blue-400 border border-blue-900"
          : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </Link>
  );
};

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0a0a09] text-neutral-300"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-55 shrink-0 bg-[#0f0f0d] border-r border-neutral-900 flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-5 pb-6">
          <p className="text-[15px] font-medium text-neutral-100">
            <span className="text-blue-400">●</span> Workly
          </p>
          <p className="text-[11px] text-neutral-700 mt-0.5">
            Team collaboration
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-0.5">
          {navLinks.map((item) => (
            <NavItem key={item.url} {...item} />
          ))}
          {user.role === "admin" && (
            <div className="px-2 pb-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 rounded-lg transition-colors"
              >
                <MdDashboard size={14} /> Admin panel
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="mt-auto px-2 py-3 border-t border-neutral-900"
          ref={menuRef}
        >
          {/* Dropdown */}
          {menuOpen && (
            <div className="mb-2 bg-[#0a0a09] border border-neutral-800 rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  navigate("/app/profile");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
              >
                <MdPerson size={14} /> Profile
              </button>
              <button
                onClick={() => {
                  navigate("/app/settings");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
              >
                <MdSettings size={14} /> Settings
              </button>
              <div className="border-t border-neutral-800" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-500 hover:bg-red-950 transition-colors"
              >
                <MdLogout size={14} /> Logout
              </button>
            </div>
          )}

          {/* User button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-colors"
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-neutral-800 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-[10px] font-medium shrink-0">
                {user.name?.slice(0, 2).toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[12px] text-neutral-300 truncate">
                {user.name || "User"}
              </p>
              <p className="text-[10px] text-neutral-600 truncate">
                {user.email || ""}
              </p>
            </div>
            <span
              className={`text-neutral-700 text-[10px] transition-transform duration-150 ${
                menuOpen ? "rotate-180" : ""
              }`}
            >
              ▲
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 shrink-0">
          <div>
            <h1 className="text-[18px] font-medium text-neutral-100">
              {title}
            </h1>
            <p className="text-[12px] text-neutral-700 font-mono mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => navigate("/app/notifications")}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-900 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300 transition-colors"
          >
            <MdNotifications size={16} />
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
