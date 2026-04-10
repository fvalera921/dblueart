"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { euro } from "@/lib/utils";

type Order = {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  imagenDisenioUrl: string;
  precioChaqueta: string;
  precioDisenio: string;
  total: string;
  estado: "pendiente" | "confirmado" | "enviado";
  creadoEn: string;
  jacket: {
    nombre: string;
    imagenUrl: string;
  };
};

const estados: Order["estado"][] = ["pendiente", "confirmado", "enviado"];

export function OrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<"todos" | Order["estado"]>("todos");
  const [selected, setSelected] = useState<Order | null>(initialOrders[0] ?? null);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (filter === "todos") {
      return orders;
    }

    return orders.filter((order) => order.estado === filter);
  }, [filter, orders]);

  const updateStatus = async (orderId: string, estado: Order["estado"]) => {
    setLoadingId(orderId);
    setError("");

    try {
      const response = await fetch(`/api/pedidos/${orderId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el estado.");
      }

      setOrders((current) => current.map((order) => (order.id === orderId ? data : order)));
      setSelected((current) => (current?.id === orderId ? data : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el estado.");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky/10 px-6 py-5">
          <h2 className="font-display text-2xl text-white">Pedidos</h2>
          <div className="flex flex-wrap gap-2">
            {(["todos", ...estados] as const).map((estado) => (
              <button
                key={estado}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  filter === estado ? "bg-sky text-night" : "border border-sky/30 text-mist/70"
                }`}
                onClick={() => setFilter(estado)}
              >
                {estado === "todos" ? "Todos" : estado}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="px-6 pt-4 text-sm text-red-200">{error}</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-sky/15 bg-white/5 text-mist/60">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Chaqueta</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-b border-sky/10 transition hover:bg-white/5"
                  onClick={() => setSelected(order)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.clienteNombre}</div>
                    <div className="mt-1 text-xs text-mist/55">{order.clienteEmail}</div>
                  </td>
                  <td className="px-6 py-4">{order.jacket.nombre}</td>
                  <td className="px-6 py-4">{euro(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-sky/15 px-3 py-1 text-xs text-sky">
                      {order.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6">
        {selected ? (
          <>
            <h3 className="font-display text-2xl text-white">Detalle</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-mist/60">Cliente</p>
                <p className="mt-1 text-white">{selected.clienteNombre}</p>
                <p className="text-mist/70">{selected.clienteEmail}</p>
              </div>
              <div>
                <p className="text-mist/60">Chaqueta</p>
                <p className="mt-1 text-white">{selected.jacket.nombre}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={selected.jacket.imagenUrl}
                    alt={selected.jacket.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={selected.imagenDisenioUrl}
                    alt="Diseño del cliente"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-sky/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-mist/70">Total</span>
                  <span className="font-semibold text-white">{euro(selected.total)}</span>
                </div>
              </div>
              <div>
                <p className="mb-3 text-mist/60">Actualizar estado</p>
                <div className="flex flex-wrap gap-2">
                  {estados.map((estado) => (
                    <Button
                      key={estado}
                      variant={selected.estado === estado ? "primary" : "secondary"}
                      className="px-4 py-2 text-xs"
                      disabled={loadingId === selected.id}
                      onClick={() => updateStatus(selected.id, estado)}
                    >
                      {loadingId === selected.id ? "Guardando..." : estado}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-mist/70">Selecciona un pedido para ver el detalle.</p>
        )}
      </div>
    </div>
  );
}
