"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tenants", label: "Tenants" },
  { href: "/preview", label: "Preview" },
  { href: "/diff", label: "Diff" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col md:flex-row">
      <header className="md:hidden flex items-center gap-3 h-14 px-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="p-1 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-bold tracking-wide text-gray-900">MTC Admin</span>
      </header>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-sm font-bold tracking-wide text-gray-900">MTC Admin</span>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
