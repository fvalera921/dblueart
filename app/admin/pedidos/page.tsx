import type { Metadata } from "next";
import { normalizeImageUrl } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { OrdersManager } from "@/components/admin/orders-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedidos admin",
  description: "Gestión y seguimiento de pedidos en dblueart."
};

export default async function AdminPedidosPage() {
  const orders = await prisma.pedido.findMany({
    include: {
      jacket: true
    },
    orderBy: {
      creadoEn: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky">Gestión</p>
        <h1 className="mt-3 font-display text-4xl text-white">Pedidos y estados</h1>
      </div>
      <OrdersManager
        initialOrders={orders.map((order) => ({
          ...order,
          jacket: {
            ...order.jacket,
            imagenUrl: normalizeImageUrl(order.jacket.imagenUrl)
          },
          creadoEn: order.creadoEn.toISOString(),
          precioChaqueta: order.precioChaqueta.toString(),
          precioDisenio: order.precioDisenio.toString(),
          total: order.total.toString()
        }))}
      />
    </div>
  );
}
