"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Star,
  Store,
  LogOut,
  Lock,
  Menu,
  X,
} from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if already authenticated in this session
  useEffect(() => {
    const isSessionAuthed = sessionStorage.getItem("admin_authed");
    if (isSessionAuthed === "true") {
      setAuthed(true);
    }
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
    } else {
      setLoginError("Incorrect password");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Store", href: "/admin/manage", icon: UtensilsCrossed },
    { label: "Orders", href: "/admin/order", icon: ShoppingBag },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // LOGIN SCREEN (Agar Session me Auth nahi hai)
  if (!authed) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full space-y-4"
        >
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Lock size={20} />
            <h1 className="text-xl font-bold text-white">Admin Login</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600"
          />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors">
            Login
          </button>
        </form>
      </main>
    );
  }

  // MAIN ADMIN LAYOUT
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-950 border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl text-white">
            <Store size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none">ADMIN PANEL</h2>
            <span className="text-xs text-gray-500">Restaurant Control</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-neutral-900 rounded-lg text-gray-300 hover:text-white border border-white/10"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Permanent Sidebar (Desktop View + Mobile Overlay Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } md:flex w-full md:w-64 bg-neutral-950 border-r border-white/10 p-6 flex-col justify-between shrink-0`}
      >
        <div>
          <div className="hidden md:flex items-center gap-3 mb-10">
            <div className="bg-red-600 p-2 rounded-xl text-white">
              <Store size={22} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">ADMIN PANEL</h2>
              <span className="text-xs text-gray-500">Restaurant Control</span>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => {
            setMobileMenuOpen(false);
            handleLogout();
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium px-4 py-3 mt-6 transition-colors"
        >
          <LogOut size={16} />
          Exit Admin
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}