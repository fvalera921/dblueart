import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { normalizeImageUrl } from "@/lib/image";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  return null;
}

export function serializeJacket(jacket: {
  id: string;
  nombre: string;
  descripcion: string;
  precio: { toString(): string };
  imagenUrl: string;
  activo: boolean;
  creadoEn: Date;
}) {
  return {
    ...jacket,
    imagenUrl: normalizeImageUrl(jacket.imagenUrl),
    precio: jacket.precio.toString(),
    creadoEn: jacket.creadoEn.toISOString()
  };
}

export function serializeFinishedJacket(jacket: {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  activo: boolean;
  creadoEn: Date;
}) {
  return {
    ...jacket,
    imagenUrl: normalizeImageUrl(jacket.imagenUrl),
    creadoEn: jacket.creadoEn.toISOString()
  };
}

export function serializeOrder(order: {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  jacketId: string;
  imagenDisenioUrl: string;
  precioChaqueta: { toString(): string };
  precioDisenio: { toString(): string };
  total: { toString(): string };
  estado: "pendiente" | "confirmado" | "enviado";
  creadoEn: Date;
  jacket?: {
    nombre: string;
    imagenUrl: string;
  };
}) {
  return {
    ...order,
    jacket: order.jacket
      ? {
          ...order.jacket,
          imagenUrl: normalizeImageUrl(order.jacket.imagenUrl)
        }
      : order.jacket,
    precioChaqueta: order.precioChaqueta.toString(),
    precioDisenio: order.precioDisenio.toString(),
    total: order.total.toString(),
    creadoEn: order.creadoEn.toISOString()
  };
}
