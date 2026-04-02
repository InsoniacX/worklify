import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "..";
import NavItem from "../ui/NavItem";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MdAccessTime,
  MdApps,
  MdBarChart,
  MdDashboard,
  MdInventory,
  MdLogout,
  MdPeople,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import { FiActivity, FiUsers } from "react-icons/fi";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const navLinks = [
  {
    section: "Main",
    items: [
      {
        url: "/admin/dashboard",
        label: "Dashboard",
        icon: <MdDashboard size={14} />,
      },
      {
        url: "/admin/dashboard/users",
        label: "Users",
        icon: <MdPeople size={14} />,
      },
      {
        url: "/admin/dashboard/products",
        label: "Products",
        icon: <MdInventory size={14} />,
      },
      {
        url: "/admin/dashboard/teams",
        label: "Teams",
        icon: <FiUsers size={14} />,
      },
      {
        url: "/admin/dashboard/activities",
        label: "Activities",
        icon: <FiActivity size={14} />,
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        url: "/admin/dashboard/reports",
        label: "Reports",
        icon: <MdBarChart size={14} />,
      },
      /* {
        url: "/admin/dashboard/activity",
        label: "Activity",
        icon: <MdAccessTime size={14} />,
      }, */
    ],
  },
];

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClicksOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClicksOutside);
    return () => document.addEventListener("mousedown", handleClicksOutside);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a09] text-neutral-300 font-sans">
      {/* Sidebar */}
      <aside className="w-50 shrink-0 bg-[#0f0f0d] border-r border-neutral-900 flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-5 pb-6 text-[15px] font-medium text-neutral-100">
          <span className="text-blue-400">●</span> Worklify Dashboard
        </div>

        {/* Nav */}
        {navLinks.map((group) => (
          <div key={group.section}>
            <p className="px-5 text-[10px] font-medium tracking-[0.12em] uppercase text-[#444441] mb-1.5 mt-4 first:mt-0">
              {group.section}
            </p>
            {group.items.map((item) => (
              <NavItem
                key={item.url}
                url={item.url}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        ))}
        <Link
          to="/app"
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 rounded-lg transition-colors mx-2 mb-1"
        >
          <MdApps size={14} /> Switch to app
        </Link>

        {/* Footer */}
        <div
          className="mt-auto border-t border-neutral-900 px-3 py-3"
          ref={menuRef}
        >
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="mb-2 bg-[#0a0a09] border border-neutral-800 rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  navigate("/dashboard/profile");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
              >
                <MdPerson size={14} />
                Profile
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
              >
                <MdSettings size={14} />
                Settings
              </button>
              <div className="border-t border-neutral-800" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-500 hover:bg-red-950 hover:text-red-400 transition-colors"
              >
                <MdLogout size={14} />
                Logout
              </button>
            </div>
          )}

          {/* User button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-900 transition-colors"
          >
            <Avatar name={user.name} picture={user.picture} />
            <span className="text-[12px] text-neutral-500 flex-1 text-left">
              {user.name}
            </span>
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

      {/*  Main  */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-medium text-neutral-100">
              {title}
            </h1>
            <p className="text-[12px] text-neutral-700 font-mono mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-teal-950 text-teal-400 border border-teal-800">
            ● live
          </span>
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
