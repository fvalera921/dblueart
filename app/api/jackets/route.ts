import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jacketSchema } from "@/lib/validations";
import { requireAdmin, serializeJacket } from "@/lib/api";

export async function GET() {
  try {
    const jackets = await prisma.jacket.findMany({
      where: {
        activo: true
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    return NextResponse.json(jackets.map(serializeJacket));
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las chaquetas." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await request.json();
    const parsed = jacketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Datos inválidos." },
        { status: 400 }
      );
    }

    const jacket = await prisma.jacket.create({
      data: parsed.data
    });

    return NextResponse.json(serializeJacket(jacket), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear la chaqueta." },
      { status: 500 }
    );
  }
}
