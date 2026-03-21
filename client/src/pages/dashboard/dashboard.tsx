import { useEffect, useRef } from "react";
import { useRecentUsers, useUserCount, useProduct } from "@/hooks";
import { StatCard, UserTable, ProductTable } from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import type { StatCardProps } from "@/types";

const Dashboard = () => {
  const { users: latestUsers, loading } = useRecentUsers();
  const { products, loading: loadingProducts } = useProduct();
  const { count: userCount, delta, deltaUp } = useUserCount();
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);

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
            responsive: true,
            maintainAspectRatio: false,
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
            responsive: true,
            maintainAspectRatio: false,
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

  const stats: StatCardProps[] = [
    {
      label: "Total users",
      value: String(userCount),
      delta: `${Math.abs(delta)}% this month`,
      deltaUp: deltaUp,
    },
    {
      label: "Products",
      value: "342",
      delta: "4% this month",
      deltaUp: true,
    },
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

  return (
    <DashboardLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="flex gap-2.5 mb-5">
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
              User growth
            </span>
            <a href="/users">
              <span className="text-[11px] text-blue-400 cursor-pointer">
                View All →
              </span>
            </a>
          </div>
          <div className="h-50 w-full relative">
            <canvas ref={lineRef} />
          </div>
        </div>
        <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
              Revenue by month
            </span>
            <span className="text-[11px] text-blue-400 cursor-pointer">
              view all →
            </span>
          </div>
          <div className="h-50 w-full relative">
            <canvas ref={barRef} />
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-2 gap-2.5">
        <UserTable
          users={latestUsers}
          loading={loading}
          buttonLabel="View Users"
          url="dashboard/users"
          actions={false}
        />
        <ProductTable products={products} loading={loadingProducts} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
