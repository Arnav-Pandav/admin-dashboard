import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  LayoutDashboard,
  Moon,
  Sun,
  Bell,
  Search,
  Menu,
  Download,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dataFile from "../data/dashboardData.json";
import LoadingSplash from "../components/LoadingSplash";
import GoodbyeSplash from "../components/GoodbyeSplash";

// 🔔 Import the doorbell sound (WAV file)
import doorbellSound from "../assets/sounds/mixkit-software-interface-start-2574.wav";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const icons = { DollarSign, ShoppingCart, Users, TrendingUp };

export default function PortfolioAdminDashboard() {
  const navigate = useNavigate();

  // ✅ All states
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [bellActive, setBellActive] = useState(false); // 🔔 control bell ring animation

  // ✅ Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Theme sync
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // ✅ Load local JSON data
  useEffect(() => {
    setDashboardData(dataFile);
  }, []);

  // ✅ Play doorbell sound
  const playBellSound = () => {
    const audio = new Audio(doorbellSound);
    audio.volume = 0.3;
    audio.play().catch(() => {});
    setBellActive(true);
    setTimeout(() => setBellActive(false), 1000); // reset animation
  };

  // ✅ Logout with goodbye splash
  const handleLogout = () => {
    setShowGoodbye(true);
    setTimeout(() => {
      localStorage.removeItem("loggedInUser");
      sessionStorage.removeItem("loggedInUser");
      navigate("/");
    }, 1200);
  };

  // ✅ Chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const revenueData = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: "Revenue",
          data: dashboardData?.revenue || [],
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(96, 165, 250, 0.3)",
          borderColor: "#60a5fa",
          pointRadius: 3,
          tension: 0.35,
        },
      ],
    }),
    [dashboardData]
  );

  const ordersData = useMemo(
    () => ({
      labels: dashboardData?.orders?.labels || [],
      datasets: [
        {
          label: "Online",
          data: dashboardData?.orders?.online || [],
          backgroundColor: "#22d3ee",
        },
        {
          label: "Retail",
          data: dashboardData?.orders?.retail || [],
          backgroundColor: "#a78bfa",
        },
      ],
    }),
    [dashboardData]
  );

  const channelsData = useMemo(
    () => ({
      labels: dashboardData?.channels?.labels || [],
      datasets: [
        {
          label: "Traffic",
          data: dashboardData?.channels?.data || [],
          backgroundColor: ["#60a5fa", "#a78bfa", "#34d399", "#facc15"],
          borderWidth: 0,
        },
      ],
    }),
    [dashboardData]
  );

  const exportToCSV = () => {
    if (!dashboardData) return;
    const headers = ["Order ID", "Customer", "Items", "Amount", "Status"];
    const csvRows = [headers.join(",")];

    dashboardData.ordersTable.forEach((row) => {
      const values = [row.id, row.customer, row.items, row.amount, row.status];
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recent_orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const iconColors = ["#60a5fa", "#34d399", "#a78bfa", "#facc15"];

  // ✅ Conditional splashes
  if (showGoodbye) return <GoodbyeSplash />;
  if (loading) return <LoadingSplash />;

  // ✅ Main dashboard UI
  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-[#1f2335] text-gray-900 dark:text-[#e0e6f0]`}>
      {/* Background Gradient */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-44 bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-cyan-500/30 blur-2xl dark:opacity-40 opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="sticky top-0 z-30 -mx-3 sm:-mx-6 lg:-mx-8 mb-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#2a2f45]/40 border-b border-gray-200/60 dark:border-[#3b4261]">
          <div className="px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2f45] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-semibold tracking-tight text-base sm:text-lg">Webworks Admin</span>
            </div>

            {/* Search */}
            <div className="flex-grow sm:flex-grow-0 flex items-center gap-2 px-3 py-2 w-full sm:w-auto rounded-xl bg-gray-100 dark:bg-[#2a2f45] ring-1 ring-gray-200/80 dark:ring-[#3b4261]">
              <Search className="h-4 w-4 opacity-70" />
              <input
                placeholder="Search orders, names, amounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full sm:w-48 text-gray-900 dark:text-[#e0e6f0] placeholder:text-gray-500 dark:placeholder:text-[#a1accd]"
              />
            </div>

            {/* Icons + Logout */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {/* 🔔 Bell with sound + animation */}
              <motion.button
                onClick={playBellSound}
                animate={bellActive ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                transition={{ duration: 0.8 }}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2f45] group"
              >
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              </motion.button>

              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#45474d]"
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-100 dark:bg-[#727379] dark:hover:bg-[#494b53] text-sm"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>

              <div className="ml-1 h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {!dashboardData ? (
          <div className="text-center py-20 text-gray-500">Loading dashboard data...</div>
        ) : (
          <main className="space-y-6">
            {/* KPI Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {dashboardData.kpis.map((kpi, idx) => {
                const Icon = icons[kpi.icon];
                return (
                  <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * idx }}
                    className="rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-[#a1accd]">{kpi.title}</p>
                      <p className="text-xl sm:text-2xl font-semibold mt-1">{kpi.value}</p>
                      <p className="mt-2 text-xs">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{kpi.delta}</span> vs last month
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 h-10 w-10 rounded-xl grid place-items-center bg-gray-100 dark:bg-[#1f2335] mx-auto sm:mx-0">
                      {Icon && <Icon className="h-5 w-5" style={{ color: iconColors[idx % iconColors.length] }} />}
                    </div>
                  </motion.div>
                );
              })}
            </section>

            {/* Charts */}
            <section className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
              <div className="col-span-12 xl:col-span-7 p-2 sm:p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur">
                <h3 className="font-semibold mb-3">Revenue (Last 12 months)</h3>
                <div className="h-64 sm:h-72">
                  <Line data={revenueData} />
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 xl:col-span-5 p-2 sm:p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur">
                <h3 className="font-semibold mb-3">Orders by Channel</h3>
                <div className="h-64 sm:h-72 flex items-center justify-center">
                  <Doughnut data={channelsData} />
                </div>
              </div>

              <div className="col-span-12 p-2 sm:p-4 rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur">
                <h3 className="font-semibold mb-3">Orders (Online vs Retail)</h3>
                <div className="h-64 sm:h-72">
                  <Bar data={ordersData} />
                </div>
              </div>
            </section>

          {/* Orders + Activity Section */}
            <section className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
              <div className="col-span-12 xl:col-span-8 rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur p-4 overflow-x-auto">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <button
                    onClick={exportToCSV}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                </div>
                <div className="mt-3">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-[#a1accd]">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Items</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.ordersTable
                        .filter((r) =>
                          [r.customer, r.id, r.amount, r.status]
                            .join(" ")
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((r) => (
                          <tr key={r.id} className="border-t border-gray-200/70 dark:border-[#3b4261]">
                            <td className="py-3 font-medium">{r.id}</td>
                            <td className="py-3">{r.customer}</td>
                            <td className="py-3">{r.items}</td>
                            <td className="py-3">{r.amount}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded-md text-xs ${
                                  r.status === "Paid"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Section */}
              <div className="col-span-12 xl:col-span-4 rounded-2xl ring-1 ring-gray-200 dark:ring-[#3b4261] bg-white/70 dark:bg-[#2a2f45]/70 backdrop-blur p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Activity</h3>
                  <span className="text-xs opacity-70 text-gray-500 dark:text-[#a1accd]">Live</span>
                </div>
                <div className="space-y-3">
                  {dashboardData.activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-sm">{a.text}</p>
                        <p className="text-xs text-gray-500 dark:text-[#a1accd]">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>


          </main>
        )}
      </div>
    </div>
  );
}
