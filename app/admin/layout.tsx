"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Printer,
  Lock,
} from "lucide-react";
import { siteConfig } from "../config/site";

const ADMIN_PASSWORD = "ROMIZ_ADMIN_2026";
const COOKIE_NAME = "romiz_admin_token";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/* ─── Cookie Helper Functions ─── */
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/* ─── Auth Gate ─────────────────────────────────────── */
function AuthGateInner({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = getCookie(COOKIE_NAME);
    setAuthed(token === "ROMIZ_ADMIN_SESSION_ACTIVE");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setCookie(COOKIE_NAME, "ROMIZ_ADMIN_SESSION_ACTIVE", 7);
      setAuthed(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid Admin Credentials. Please try again.");
    }
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: siteConfig.colors.background }}>
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#0B4DA2] animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteConfig.colors.background }}>
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: siteConfig.colors.primary }}>
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Admin Portal Sign In
            </h1>
            <p className="text-xs text-gray-400 text-center">
              Restricted area for Romiz Print internal staff only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Admin Security Key
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:border-[#0B4DA2]"
              />
            </div>

            {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-md"
              style={{ backgroundColor: siteConfig.colors.primary }}
            >
              Authenticate Cookie Session →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: siteConfig.colors.background }}>
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#0B4DA2] animate-spin" />
        </div>
      }
    >
      <AuthGateInner>{children}</AuthGateInner>
    </Suspense>
  );
}

/* ─── Sidebar ───────────────────────────────────────── */
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  function handleLogout() {
    deleteCookie(COOKIE_NAME);
    window.location.href = "/";
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: siteConfig.colors.dark }}>
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: siteConfig.colors.accent }}>
            <Printer size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              ROMIZ<span style={{ color: siteConfig.colors.accent }}>PRINT</span>
            </span>
            <p className="text-[10px] text-white/40 leading-none">Admin Panel</p>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1 rounded text-white/60 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" style={{ color: siteConfig.colors.accent }} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 fixed left-0 top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-56 flex flex-col z-50">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}

/* ─── Top Bar ───────────────────────────────────────── */
function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentPage = navItems.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)));

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-14 border-b bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Menu size={20} style={{ color: siteConfig.colors.dark }} />
      </button>

      <h1 className="font-bold text-base text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        {currentPage?.label ?? "Admin"}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">Welcome, Admin</span>
          <span className="text-[10px] text-gray-400">ROMIZ PRINT Internal</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: siteConfig.colors.primary }}>
          A
        </div>
      </div>
    </header>
  );
}

/* ─── Root Layout ───────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeMenu = useCallback(() => setSidebarOpen(false), []);

  return (
    <AuthGate>
      <div className="min-h-screen flex" style={{ backgroundColor: siteConfig.colors.background }}>
        <Sidebar isOpen={sidebarOpen} onClose={closeMenu} />
        <div className="flex-1 flex flex-col lg:ml-56 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}