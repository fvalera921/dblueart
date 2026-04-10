import type { Metadata } from "next";
import { normalizeImageUrl } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { JacketManager } from "@/components/admin/jacket-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chaquetas admin",
  description: "Gestión del catálogo de chaquetas de dblueart."
};

export default async function AdminChaquetasPage() {
  const jackets = await prisma.jacket.findMany({
    orderBy: {
      creadoEn: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky">Inventario</p>
        <h1 className="mt-3 font-display text-4xl text-white">Gestión de chaquetas</h1>
      </div>
      <JacketManager
        initialJackets={jackets.map((jacket) => ({
          ...jacket,
          imagenUrl: normalizeImageUrl(jacket.imagenUrl),
          precio: jacket.precio.toString()
        }))}
      />
    </div>
  );
}
