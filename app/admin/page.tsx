import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { euro } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard admin",
  description: "Resumen de pedidos, ingresos y estados en dblueart."
};

export default async function AdminDashboardPage() {
  const [totalPedidos, ingresos, pendientes] = await Promise.all([
    prisma.pedido.count(),
    prisma.pedido.aggregate({
      _sum: {
        total: true
      }
    }),
    prisma.pedido.count({
      where: {
        estado: "pendiente"
      }
    })
  ]);

  const cards = [
    { label: "Total pedidos", value: String(totalPedidos) },
    { label: "Ingresos", value: euro(ingresos._sum.total?.toString() ?? 0) },
    { label: "Pendientes", value: String(pendientes) }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky">Dashboard</p>
        <h1 className="mt-3 font-display text-4xl text-white">Resumen del negocio</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="glass-panel rounded-[2rem] p-6">
            <p className="text-sm text-mist/60">{card.label}</p>
            <p className="mt-4 font-display text-4xl text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
