import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jacketSchema } from "@/lib/validations";
import { requireAdmin, serializeJacket } from "@/lib/api";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
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

    const jacket = await prisma.jacket.update({
      where: { id: params.id },
      data: parsed.data
    });

    return NextResponse.json(serializeJacket(jacket));
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar la chaqueta." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const jacket = await prisma.jacket.update({
      where: { id: params.id },
      data: { activo: false }
    });

    return NextResponse.json(serializeJacket(jacket));
  } catch {
    return NextResponse.json(
      { error: "No se pudo desactivar la chaqueta." },
      { status: 500 }
    );
  }
}
