import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  Settings,
  BrainCircuit,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Receipts", icon: Receipt, path: "/receipts" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Budget", icon: Wallet, path: "/budget" },
  { name: "AI Advisor", icon: BrainCircuit, path: "/ai-advisor" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <motion.div
      animate={{ width: open ? 260 : 80 }}
      transition={{ duration: 0.25 }}
      className="h-screen bg-[#0B1220] border-r border-white/10 flex flex-col"
    >
      {/* TOP */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {open && (
          <h1 className="text-white font-bold text-lg tracking-wide">
            AI Copilot
          </h1>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-1 mt-4 px-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  active
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon size={20} />

              {open && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}