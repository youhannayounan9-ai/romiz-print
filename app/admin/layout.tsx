"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { siteConfig } from "../config/site";

/* ─── Constants ──────────────────────────────────────── */
const ADMIN_PASSWORD = "ROMIZ_ADMIN_2026";
const AUTH_KEY = "romiz_admin_auth";

/* ─── Nav items ─────────────────────────────────────── */
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/* ─── Auth Gate ─────────────────────────────────────── */
function AuthGate({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Check URL param first → persist to localStorage
    const param = searchParams.get("access");
    if (param === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "1");
      // Strip param from URL cleanly
      router.replace("/admin");
      setAuthed(true);
      return;
    }
    // Check localStorage
    const stored = localStorage.getItem(AUTH_KEY);
    setAuthed(stored === "1");
  }, [searchParams, router]);

  if (authed === null) {
    // Loading
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: siteConfig.colors.background }}>
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#0B4DA2] animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteConfig.colors.background }}>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: siteConfig.colors.primary }}>
              <Printer size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
              Admin Access
            </h1>
            <p className="text-xs text-gray-400 text-center">
              Append <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">?access=ROMIZ_ADMIN_2026</code> to the URL
            </p>
          </div>
          <div className="p-4 rounded-xl text-xs text-amber-700 bg-amber-50 border border-amber-200">
            ⚠️ Dev-only auth. Real authentication will be added before launch.
          </div>
          <a
            href={`/admin?access=${ADMIN_PASSWORD}`}
            className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            Enter as Developer →
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/* ─── Sidebar ───────────────────────────────────────── */
function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "/admin";
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: siteConfig.colors.dark }}>
      {/* Logo */}
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
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-white/60 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
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
              {active && (
                <ChevronRight size={14} className="ml-auto" style={{ color: siteConfig.colors.accent }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 fixed left-0 top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-56 flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

/* ─── Top Bar ───────────────────────────────────────── */
function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentPage = navItems.find((n) =>
    n.exact ? pathname === n.href : pathname.startsWith(n.href)
  );

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-14 border-b"
      style={{ backgroundColor: "#fff", borderColor: "#E8EEF7" }}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} style={{ color: siteConfig.colors.dark }} />
      </button>

      <h1
        className="font-bold text-base"
        style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}
      >
        {currentPage?.label ?? "Admin"}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold" style={{ color: siteConfig.colors.dark }}>
            Welcome, Admin
          </span>
          <span className="text-[10px] text-gray-400">ROMIZ PRINT Internal</span>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: siteConfig.colors.primary }}
        >
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
      {/* Suppress the public site's Header/Nav/Footer by wrapping in a standalone shell */}
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
