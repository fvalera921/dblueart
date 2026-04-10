import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jackets = await prisma.jacket.findMany({
    where: {
      activo: true
    },
    select: {
      id: true,
      creadoEn: true
    }
  });

  return [
    {
      url: siteConfig.url,
      lastModified: new Date()
    },
    ...jackets.map((jacket) => ({
      url: `${siteConfig.url}/personalizar/${jacket.id}`,
      lastModified: jacket.creadoEn
    }))
  ];
}
