"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { euro } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Jacket = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
};

export function Customizer({ jacket }: { jacket: Jacket }) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [designUrl, setDesignUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const total = Number(jacket.precio) + 40;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const nextPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return nextPreviewUrl;
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo subir la imagen.");
      }

      setDesignUrl(data.url);
      setMessage("Imagen subida. Revisa la preview y envía el pedido cuando quieras.");
    } catch (err) {
      setDesignUrl("");
      setError(err instanceof Error ? err.message : "Ha ocurrido un error inesperado.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      if (!designUrl) {
        throw new Error("Debes subir tu diseño antes de enviar el pedido.");
      }

      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clienteNombre: formData.get("clienteNombre"),
          clienteEmail: formData.get("clienteEmail"),
          jacketId: jacket.id,
          imagenDisenioUrl: designUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar el pedido.");
      }

      event.currentTarget.reset();
      setDesignUrl("");
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }

        return "";
      });
      setMessage("Pedido enviado. Hemos enviado la confirmación a tu correo.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-panel rounded-[2rem] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-white">Sube tu diseño</h2>
            <p className="mt-2 text-sm text-mist/75">
              Selecciona el archivo y revisa la preview antes de confirmar el pedido.
            </p>
          </div>
          <label className="cursor-pointer rounded-full border border-sky/30 px-4 py-2 text-sm text-mist transition hover:bg-white/10">
            {uploading ? "Subiendo..." : "Subir archivo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-sky/20 bg-night/70 p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-white/5">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview del diseño" fill className="object-contain" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-mist/55">
                Tu archivo aparecerá aquí en cuanto lo subas.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image src={jacket.imagenUrl} alt={jacket.nombre} fill className="object-cover" />
          </div>
          <h1 className="font-display text-3xl text-white">{jacket.nombre}</h1>
          <p className="mt-3 text-sm leading-7 text-mist/78">{jacket.descripcion}</p>
          <div className="mt-6 space-y-2 rounded-[1.5rem] border border-sky/20 bg-white/5 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mist/70">Chaqueta</span>
              <span>{euro(jacket.precio)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist/70">Diseño personalizado</span>
              <span>{euro(40)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-sky/10 pt-3 text-base font-semibold text-white">
              <span>Total</span>
              <span>{euro(total)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6">
          <h2 className="font-display text-2xl text-white">Confirmar pedido</h2>
          <div className="mt-5 space-y-4">
            <Input name="clienteNombre" placeholder="Tu nombre" required />
            <Input name="clienteEmail" type="email" placeholder="Tu email" required />
          </div>

          {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-sky">{message}</p> : null}

          <Button className="mt-6 w-full" disabled={saving || uploading}>
            {saving ? "Enviando pedido..." : "Enviar pedido"}
          </Button>
        </form>
      </div>
    </div>
  );
}
