import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, serializeFinishedJacket } from "@/lib/api";
import { finishedJacketSchema } from "@/lib/validations";

export async function GET() {
  try {
    const jackets = await prisma.finishedJacket.findMany({
      where: {
        activo: true
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    return NextResponse.json(jackets.map(serializeFinishedJacket));
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las chaquetas terminadas." },
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
    const parsed = finishedJacketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Datos inválidos." },
        { status: 400 }
      );
    }

    const jacket = await prisma.finishedJacket.create({
      data: parsed.data
    });

    return NextResponse.json(serializeFinishedJacket(jacket), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar la chaqueta terminada." },
      { status: 500 }
    );
  }
}
