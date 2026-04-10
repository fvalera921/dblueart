import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizeImageUrl } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { Customizer } from "@/components/customizer";

export const dynamic = "force-dynamic";

type Params = {
  params: {
    jacketId: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const jacket = await prisma.jacket.findUnique({
    where: { id: params.jacketId }
  });

  if (!jacket) {
    return {
      title: "Chaqueta no encontrada"
    };
  }

  return {
    title: `Personalizar ${jacket.nombre}`,
    description: `Sube tu diseño y personaliza la ${jacket.nombre} en dblueart.`,
    openGraph: {
      title: `Personalizar ${jacket.nombre}`,
      description: `Sube tu diseño y personaliza la ${jacket.nombre} en dblueart.`,
      images: [normalizeImageUrl(jacket.imagenUrl)],
      url: `${siteConfig.url}/personalizar/${params.jacketId}`
    },
    twitter: {
      card: "summary_large_image",
      images: [normalizeImageUrl(jacket.imagenUrl)]
    }
  };
}

export default async function PersonalizarPage({ params }: Params) {
  const jacket = await prisma.jacket.findFirst({
    where: {
      id: params.jacketId,
      activo: true
    }
  });

  if (!jacket) {
    notFound();
  }

  return (
    <main className="section-shell py-10">
      <Customizer
        jacket={{
          id: jacket.id,
          nombre: jacket.nombre,
          descripcion: jacket.descripcion,
          precio: Number(jacket.precio),
          imagenUrl: normalizeImageUrl(jacket.imagenUrl)
        }}
      />
    </main>
  );
}
