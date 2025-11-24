import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, CreditCard, Send, History, LogOut, User } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { clsx } from "clsx";

export function Layout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Send, label: "Transfer", path: "/transfer" },
    { icon: CreditCard, label: "Services", path: "/services" },
    { icon: History, label: "History", path: "/history" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/favicon.png"
              alt="PaySwift Logo"
              className="w-8 h-8 rounded-lg shadow-lg shadow-green-500/30"
            />
            <h1 className="text-xl font-bold text-slate-800">PaySwift</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    size={20}
                    className={clsx(
                      isActive
                        ? "text-green-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span className="">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-slate-700">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg w-full transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center gap-1",
                  isActive ? "text-green-600" : "text-slate-400"
                )}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
