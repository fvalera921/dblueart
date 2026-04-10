"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FolderHeart, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { SignOutButton } from "@/components/admin/signout-button";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/chaquetas", label: "Chaquetas", icon: Package },
  { href: "/admin/terminadas", label: "Terminadas", icon: FolderHeart },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[2rem] p-5">
          <div className="mb-8">
            <p className="font-display text-2xl text-white">dblueart</p>
            <p className="mt-2 text-sm text-mist/60">Panel de administración</p>
          </div>
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-mist/80 transition hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <SignOutButton />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
