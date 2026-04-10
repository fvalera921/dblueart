import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

  await prisma.admin.upsert({
    where: { email: "admin@dblueart.com" },
    update: { passwordHash },
    create: {
      email: "admin@dblueart.com",
      passwordHash
    }
  });

  const jackets = [
    {
      nombre: "Chaqueta Eclipse Azul",
      descripcion: "Denim premium azul marino con base ideal para arte frontal o trasero.",
      precio: 129.9,
      imagenUrl: "/placeholders/jacket-1.svg"
    },
    {
      nombre: "Bomber Cobalto Atelier",
      descripcion: "Bomber ligera con acabado satinado para diseños urbanos y piezas statement.",
      precio: 149.0,
      imagenUrl: "/placeholders/jacket-2.svg"
    },
    {
      nombre: "Overshirt Midnight Canvas",
      descripcion: "Sobrecamisa estructurada, pensada para ilustraciones grandes y composiciones complejas.",
      precio: 139.5,
      imagenUrl: "/placeholders/jacket-3.svg"
    }
  ];

  for (const jacket of jackets) {
    await prisma.jacket.upsert({
      where: { id: `${jacket.nombre.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `${jacket.nombre.toLowerCase().replace(/\s+/g, "-")}`,
        ...jacket
      }
    });
  }

  const finishedJackets = [
    {
      id: "goku-fuego-dual",
      nombre: "Goku fuego dual",
      descripcion: "Ejemplo de pieza terminada con contraste azul y rojo sobre fondo oscuro.",
      imagenUrl: "/placeholders/finished-1.svg"
    },
    {
      id: "flash-dinamico",
      nombre: "Flash dinámico",
      descripcion: "Chaqueta terminada con composición en movimiento y paleta roja intensa.",
      imagenUrl: "/placeholders/finished-2.svg"
    }
  ];

  for (const jacket of finishedJackets) {
    await prisma.finishedJacket.upsert({
      where: { id: jacket.id },
      update: {
        nombre: jacket.nombre,
        descripcion: jacket.descripcion,
        imagenUrl: jacket.imagenUrl,
        activo: true
      },
      create: jacket
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
