import { z } from "zod";

export const jacketSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  precio: z.coerce.number().positive("El precio debe ser mayor que 0."),
  imagenUrl: z.string().url("La imagen debe ser una URL válida.")
});

export const pedidoSchema = z.object({
  clienteNombre: z.string().min(2, "Indica tu nombre."),
  clienteEmail: z.string().email("Introduce un email válido."),
  jacketId: z.string().min(1, "Falta la chaqueta seleccionada."),
  imagenDisenioUrl: z.string().url("La imagen del diseño no es válida.")
});

export const finishedJacketSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  descripcion: z.string().min(6, "La descripción debe tener al menos 6 caracteres."),
  imagenUrl: z.string().url("La imagen debe ser una URL válida.")
});

export const estadoPedidoSchema = z.object({
  estado: z.enum(["pendiente", "confirmado", "enviado"])
});
