import { Avatar } from "../ui";
import NavItem from "../ui/NavItem";
import type { ReactNode } from "react";
import {
  MdAccessTime,
  MdBarChart,
  MdDashboard,
  MdInventory,
  MdPeople,
} from "react-icons/md";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const navLinks = [
  {
    section: "Main",
    items: [
      {
        url: "/dashboard",
        label: "Dashboard",
        icon: <MdDashboard size={14} />,
      },
      {
        url: "/dashboard/users",
        label: "Users",
        icon: <MdPeople size={14} />,
      },
      {
        url: "/dashboard/products",
        label: "Products",
        icon: <MdInventory size={14} />,
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        url: "/dashboard/reports",
        label: "Reports",
        icon: <MdBarChart size={14} />,
      },
      {
        url: "/dashboard/activity",
        label: "Activity",
        icon: <MdAccessTime size={14} />,
      },
    ],
  },
];

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a09] text-neutral-300 font-sans">
      {/* Sidebar */}
      <aside className="w-50 shrink-0 bg-[#0f0f0d] border-r border-neutral-900 flex flex-col">
        {/* Logo */}
        <div className="px-5 pt-5 pb-6 text-[15px] font-medium text-neutral-100">
          <span className="text-blue-400">●</span> GCI Dashboard
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

        {/* Footer */}
        <div className="mt-auto border-t border-neutral-900 px-5 py-4">
          <div className="flex items-center gap-2">
            <Avatar name="Arsyad" />
            <span className="text-[12px] text-neutral-500">Arsyad</span>
          </div>
        </div>
      </aside>

      {/*  Main  */}
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

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
