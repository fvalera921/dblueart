import type { Metadata } from "next";
import { normalizeImageUrl } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { FinishedJacketsManager } from "@/components/admin/finished-jackets-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terminadas admin",
  description: "Gestión del portfolio de chaquetas terminadas de dblueart."
};

export default async function AdminTerminadasPage() {
  const items = await prisma.finishedJacket.findMany({
    where: {
      activo: true
    },
    orderBy: {
      creadoEn: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky">Portfolio</p>
        <h1 className="mt-3 font-display text-4xl text-white">Chaquetas terminadas</h1>
      </div>
      <FinishedJacketsManager
        initialItems={items.map((item) => ({
          ...item,
          imagenUrl: normalizeImageUrl(item.imagenUrl),
          creadoEn: item.creadoEn.toISOString()
        }))}
      />
    </div>
  );
}
