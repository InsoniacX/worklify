import { Avatar } from "../ui";
import NavItem from "../ui/NavItem";
import type { ReactNode } from "react";
import { MdOutlineSpaceDashboard, MdQueryStats } from "react-icons/md";
import { FiUser, FiPackage, FiClock } from "react-icons/fi";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const navLinks = [
  { label: "Home", url: "/", icon: <MdOutlineSpaceDashboard /> },
  { label: "Users", url: "/users", icon: <FiUser /> },
  { label: "Product", url: "/products", icon: <FiPackage /> },
  { label: "Report", url: "/report", icon: <MdQueryStats /> },
  { label: "Activity", url: "/activity", icon: <FiClock /> },
];

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a09] text-neutral-300 font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-50 shrink-0 bg-[#0f0f0d] border-r border-neutral-900 flex flex-col">
        {/* Logo */}
        <div className="px-5 pt-5 pb-6 text-[15px] font-medium text-neutral-100">
          <span className="text-blue-400">●</span> myapp
        </div>

        {/* Nav */}
        <p className="px-5 text-[10px] font-medium tracking-widest uppercase text-neutral-700 mb-1.5">
          Main
        </p>

        {navLinks.map((navlink) => (
          <NavItem
            key={navlink.label}
            url={navlink.url}
            label={navlink.label}
            icon={navlink.icon}
          />
        ))}

        {/* Footer */}
        <div className="mt-auto border-t border-neutral-900 px-5 py-4">
          <div className="flex items-center gap-2">
            <Avatar name="Arsyad" />
            <span className="text-[12px] text-neutral-500">Arsyad</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-6 overflow-auto">
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

        {/* Page content goes here */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
