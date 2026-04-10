"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FinishedJacket = {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  creadoEn: string;
};

const initialForm = {
  nombre: "",
  descripcion: "",
  imagenUrl: ""
};

export function FinishedJacketsManager({
  initialItems
}: {
  initialItems: FinishedJacket[];
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: payload
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo subir la imagen.");
      }

      setForm((current) => ({ ...current, imagenUrl: data.url }));
      setMessage("Imagen subida correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!form.imagenUrl) {
        throw new Error("Debes subir una imagen antes de guardar la chaqueta terminada.");
      }

      const response = await fetch("/api/chaquetas-terminadas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar la chaqueta terminada.");
      }

      setItems((current) => [data, ...current]);
      setForm(initialForm);
      setMessage("Chaqueta terminada añadida.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la chaqueta terminada.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/chaquetas-terminadas/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar la imagen.");
      }

      setItems((current) => current.filter((item) => item.id !== id));
      setMessage("Chaqueta terminada eliminada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6">
        <h2 className="font-display text-2xl text-white">Nueva chaqueta terminada</h2>
        <div className="mt-5 space-y-4">
          <Input
            placeholder="Nombre o referencia"
            value={form.nombre}
            onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
            required
          />
          <Textarea
            placeholder="Descripción breve del trabajo"
            value={form.descripcion}
            onChange={(event) =>
              setForm((current) => ({ ...current, descripcion: event.target.value }))
            }
            required
          />
          <label className="block rounded-2xl border border-dashed border-sky/30 px-4 py-4 text-sm text-mist/70">
            {uploading ? "Subiendo imagen..." : "Subir imagen terminada"}
            <input type="file" accept="image/*" className="mt-2 block w-full" onChange={handleUpload} />
          </label>
          {form.imagenUrl ? (
            <p className="text-xs text-sky">Imagen cargada correctamente.</p>
          ) : (
            <p className="text-xs text-mist/55">Debes subir una imagen para añadirla al portfolio.</p>
          )}
        </div>
        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-sky">{message}</p> : null}
        <Button className="mt-6" disabled={loading || uploading}>
          {loading ? "Guardando..." : "Añadir al portfolio"}
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="relative aspect-[4/5]">
              <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl text-white">{item.nombre}</h3>
              <p className="mt-3 text-sm leading-7 text-mist/72">{item.descripcion}</p>
              <Button
                variant="ghost"
                className="mt-5 px-0 text-red-200"
                disabled={loading}
                onClick={() => handleDelete(item.id)}
              >
                Quitar imagen
              </Button>
            </div>
          </article>
        ))}
        {!items.length ? (
          <div className="glass-panel rounded-[2rem] p-6 text-sm text-mist/70">
            Todavía no hay chaquetas terminadas en el portfolio.
          </div>
        ) : null}
      </div>
    </div>
  );
}
