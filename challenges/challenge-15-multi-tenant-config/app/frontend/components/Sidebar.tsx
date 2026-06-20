"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tenants", label: "Tenants" },
  { href: "/preview", label: "Preview" },
  { href: "/diff", label: "Diff" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-200">
        <span className="text-sm font-bold tracking-wide text-gray-900">MTC Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
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
  );
}
