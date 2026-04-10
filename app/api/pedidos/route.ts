import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoSchema } from "@/lib/validations";
import { resend } from "@/lib/resend";
import { requireAdmin, serializeOrder } from "@/lib/api";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const orders = await prisma.pedido.findMany({
      include: {
        jacket: {
          select: {
            nombre: true,
            imagenUrl: true
          }
        }
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    return NextResponse.json(orders.map(serializeOrder));
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los pedidos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = pedidoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Datos inválidos." },
        { status: 400 }
      );
    }

    const jacket = await prisma.jacket.findFirst({
      where: {
        id: parsed.data.jacketId,
        activo: true
      }
    });

    if (!jacket) {
      return NextResponse.json(
        { error: "La chaqueta seleccionada ya no está disponible." },
        { status: 404 }
      );
    }

    const precioChaqueta = Number(jacket.precio);
    const precioDisenio = 40;
    const total = precioChaqueta + precioDisenio;

    const order = await prisma.pedido.create({
      data: {
        ...parsed.data,
        precioChaqueta,
        precioDisenio,
        total
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

    if (resend && process.env.RESEND_FROM_EMAIL) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: parsed.data.clienteEmail,
        subject: `Confirmación de pedido dblueart: ${jacket.nombre}`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; color: #0b1220;">
            <h2>Pedido recibido</h2>
            <p>Hola ${parsed.data.clienteNombre}, hemos recibido tu pedido en dblueart.</p>
            <p><strong>Chaqueta:</strong> ${jacket.nombre}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)} €</p>
            <p>Te contactaremos cuando el estado avance.</p>
          </div>
        `
      });
    }

    return NextResponse.json(serializeOrder(order), { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear el pedido." }, { status: 500 });
  }
}
