import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { estadoPedidoSchema } from "@/lib/validations";
import { requireAdmin, serializeOrder } from "@/lib/api";

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
    const parsed = estadoPedidoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Estado inválido." },
        { status: 400 }
      );
    }

    const order = await prisma.pedido.update({
      where: { id: params.id },
      data: {
        estado: parsed.data.estado
      },
      include: {
        jacket: {
          select: {
            nombre: true,
            imagenUrl: true
          }
        }
      }
    });

    return NextResponse.json(serializeOrder(order));
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar el estado del pedido." },
      { status: 500 }
    );
  }
}
