import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-14 w-full flex items-center justify-between px-6 bg-[#0B1220] border-b border-white/10">

      {/* LEFT */}
      <div>
        <h1 className="text-lg font-semibold text-white">
          AI Finance Copilot
        </h1>
        <p className="text-xs text-gray-400">
          Smart finance tracking system
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-[#111827] border border-white/10 rounded-lg px-3 py-1.5 w-72">
          <Search className="text-gray-400" size={16} />

          <input
            type="text"
            placeholder="Search receipts..."
            className="bg-transparent outline-none text-white ml-2 w-full text-sm placeholder:text-gray-500"
          />
        </div>

        {/* NOTIFICATION */}
        <button className="relative p-2 rounded-lg bg-[#111827] border border-white/10 hover:bg-white/5 transition">
          <Bell size={18} className="text-white" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-2">
          <UserCircle2 size={34} className="text-indigo-400" />

          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium">
              Praveena
            </p>
            <p className="text-xs text-gray-400">
              AI Developer
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}