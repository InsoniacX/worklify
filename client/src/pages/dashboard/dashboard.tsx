import { useEffect, useRef } from "react";
import { useRecentUsers, useProduct } from "@/hooks";
import { Avatar, NavItem, StatCard, Pill } from "@/components/ui";
import type { StatCardProps } from "@/types";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdBarChart,
  MdAccessTime,
} from "react-icons/md";

const navLinks = [
  {
    section: "Main",
    items: [
      { url: "/", label: "Dashboard", icon: <MdDashboard size={14} /> },
      { url: "/users", label: "Users", icon: <MdPeople size={14} /> },
      { url: "/products", label: "Products", icon: <MdInventory size={14} /> },
    ],
  },
  {
    section: "Analytics",
    items: [
      { url: "/reports", label: "Reports", icon: <MdBarChart size={14} /> },
      { url: "/activity", label: "Activity", icon: <MdAccessTime size={14} /> },
    ],
  },
];

const Dashboard = () => {
  const { users: latestUsers, loading } = useRecentUsers();
  const { products, loading: loadingProducts } = useProduct();
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);

  const stats: StatCardProps[] = [
    {
      label: "Total users",
      value: "1,284",
      delta: "12% this month",
      deltaUp: true,
    },
    { label: "Products", value: "342", delta: "4% this month", deltaUp: true },
    {
      label: "Revenue",
      value: "$8,420",
      delta: "8% this month",
      deltaUp: true,
    },
    {
      label: "Churn rate",
      value: "2.4%",
      delta: "0.3% this month",
      deltaUp: false,
    },
  ];

  useEffect(() => {
    let lineChart: any, barChart: any;

    const loadCharts = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      Chart.defaults.color = "#444441";
      Chart.defaults.borderColor = "#1e1e1c";
      (Chart.defaults.font as any).family = "JetBrains Mono";
      (Chart.defaults.font as any).size = 10;

      if (lineRef.current) {
        lineChart = new Chart(lineRef.current, {
          type: "line",
          data: {
            labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            datasets: [
              {
                data: [820, 940, 1050, 1100, 1200, 1284],
                borderColor: "#378ADD",
                borderWidth: 1.5,
                pointBackgroundColor: "#378ADD",
                pointRadius: 3,
                tension: 0.4,
                fill: false,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: "#151513" } },
            },
          },
        });
      }

      if (barRef.current) {
        barChart = new Chart(barRef.current, {
          type: "bar",
          data: {
            labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            datasets: [
              {
                data: [5200, 6100, 7800, 6900, 7400, 8420],
                backgroundColor: "#0c447c",
                borderColor: "#185fa5",
                borderWidth: 0.5,
                borderRadius: 4,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: "#151513" } },
            },
          },
        });
      }
    };

    loadCharts();
    return () => {
      lineChart?.destroy();
      barChart?.destroy();
    };
  }, []);

  return (
    <div
      className="grid min-h-screen overflow-hidden bg-[#0a0a09] text-[#d3d1c7]"
      style={{
        gridTemplateColumns: "200px 1fr",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside className="bg-[#0f0f0d] border-r border-[#1e1e1c] flex flex-col py-5 overflow-y-auto">
        <div className="px-5 pb-6 text-[15px] font-medium text-[#e8e8e4] tracking-[0.02em]">
          <span className="text-[#378ADD]">●</span> myapp
        </div>

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

        <div className="mt-auto border-t border-[#1e1e1c] px-5 py-4">
          <div className="flex items-center gap-2">
            <Avatar name="Arsyad" size="md" />
            <span className="text-[12px] text-[#888780]">Arsyad</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="p-6 overflow-y-auto h-full bg-[#0a0a09]">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[18px] font-medium text-[#e8e8e4]">Dashboard</p>
            <p className="text-[12px] text-[#444441] mt-0.5 font-mono">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#085041] text-[#5DCAA5] border border-[#0F6E56]">
            ● live
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Charts row */}
        <div className="flex gap-2.5 mb-5">
          <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
                User growth
              </span>
              <span className="text-[11px] text-[#378ADD] cursor-pointer">
                view all →
              </span>
            </div>
            <div className="h-[300px] w-full relative">
              <canvas ref={lineRef} height={140} />
            </div>
          </div>
          <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
                Revenue by month
              </span>
              <span className="text-[11px] text-[#378ADD] cursor-pointer">
                view all →
              </span>
            </div>
            <div className="h-[300px] w-full relative">
              <canvas ref={barRef} height={140} />
            </div>
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Latest users */}
          <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
                Latest users
              </span>
              <span className="text-[11px] text-[#378ADD] cursor-pointer">
                view all →
              </span>
            </div>
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  {["Name", "Email", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#444441] pb-2 text-left px-2 first:pl-0 border-b border-[#1e1e1c]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-[12px] text-[#444441] py-4 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  latestUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#151513] last:border-none hover:bg-[#151513] transition-colors"
                    >
                      <td className="py-2.5 px-2 first:pl-0">
                        <div className="flex items-center gap-2">
                          <Avatar name={user.name} size="sm" />
                          <span className="text-[12px] text-[#d3d1c7]">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[12px] text-[#888780]">
                        {user.email}
                      </td>
                      <td className="py-2.5 px-2">
                        <Pill label="active" variant="green" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Latest products */}
          <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
                Latest products
              </span>
              <span className="text-[11px] text-[#378ADD] cursor-pointer">
                view all →
              </span>
            </div>
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  {["Product", "Category", "Stock"].map((h) => (
                    <th
                      key={h}
                      className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#444441] pb-2 text-left px-2 first:pl-0 border-b border-[#1e1e1c]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingProducts ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-[12px] text-[#444441] py-4 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-[#151513] last:border-none hover:bg-[#151513] transition-colors"
                    >
                      <td className="py-2.5 px-2 first:pl-0 text-[12px] text-[#d3d1c7] font-medium">
                        {p.name}
                      </td>
                      <td className="py-2.5 px-2">
                        <Pill label={p.category} variant="blue" />
                      </td>
                      <td className="py-2.5 px-2">
                        <Pill
                          label={p.quantity}
                          variant={p.quantity > 10 ? "green" : "amber"}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
