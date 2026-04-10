"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { euro } from "@/lib/utils";

type Jacket = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  imagenUrl: string;
  activo: boolean;
};

const initialForm = {
  id: "",
  nombre: "",
  descripcion: "",
  precio: "",
  imagenUrl: ""
};

export function JacketManager({ initialJackets }: { initialJackets: Jacket[] }) {
  const [jackets, setJackets] = useState(initialJackets);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const resetForm = () => setForm(initialForm);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: payload
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen.");
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
        throw new Error("Debes subir una imagen antes de guardar la chaqueta.");
      }

      const response = await fetch(form.id ? `/api/jackets/${form.id}` : "/api/jackets", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: Number(form.precio),
          imagenUrl: form.imagenUrl
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar la chaqueta.");
      }

      if (form.id) {
        setJackets((current) => current.map((item) => (item.id === data.id ? data : item)));
        setMessage("Chaqueta actualizada.");
      } else {
        setJackets((current) => [data, ...current]);
        setMessage("Chaqueta creada.");
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la chaqueta.");
    } finally {
      setLoading(false);
    }
  };

  const deactivateJacket = async (id: string) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/jackets/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo desactivar la chaqueta.");
      }

      setJackets((current) =>
        current.map((item) => (item.id === id ? { ...item, activo: false } : item))
      );
      setMessage("Chaqueta desactivada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo desactivar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6">
        <h2 className="font-display text-2xl text-white">
          {isEditing ? "Editar chaqueta" : "Nueva chaqueta"}
        </h2>
        <div className="mt-5 space-y-4">
          <Input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
            required
          />
          <Textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(event) =>
              setForm((current) => ({ ...current, descripcion: event.target.value }))
            }
            required
          />
          <Input
            type="number"
            min="1"
            step="0.01"
            placeholder="Precio"
            value={form.precio}
            onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))}
            required
          />
          <label className="block rounded-2xl border border-dashed border-sky/30 px-4 py-4 text-sm text-mist/70">
            {uploading ? "Subiendo imagen..." : "Subir imagen a Cloudinary"}
            <input type="file" accept="image/*" className="mt-2 block w-full" onChange={handleUpload} />
          </label>
          {form.imagenUrl ? (
            <p className="text-xs text-sky">Imagen cargada correctamente.</p>
          ) : (
            <p className="text-xs text-mist/55">Debes subir una imagen para poder guardar.</p>
          )}
        </div>
        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-sky">{message}</p> : null}
        <div className="mt-6 flex gap-3">
          <Button disabled={loading || uploading}>{loading ? "Guardando..." : "Guardar"}</Button>
          {isEditing ? (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-sky/15 bg-white/5 text-mist/60">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jackets.map((jacket) => (
                <tr key={jacket.id} className="border-b border-sky/10">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{jacket.nombre}</div>
                    <div className="mt-1 text-xs text-mist/55">{jacket.descripcion}</div>
                  </td>
                  <td className="px-6 py-4">{euro(jacket.precio)}</td>
                  <td className="px-6 py-4">
                    {jacket.activo ? (
                      <span className="rounded-full bg-sky/15 px-3 py-1 text-xs text-sky">Activa</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-mist/70">
                        Desactivada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        className="px-4 py-2 text-xs"
                        onClick={() =>
                          setForm({
                            id: jacket.id,
                            nombre: jacket.nombre,
                            descripcion: jacket.descripcion,
                            precio: String(jacket.precio),
                            imagenUrl: jacket.imagenUrl
                          })
                        }
                      >
                        Editar
                      </Button>
                      {jacket.activo ? (
                        <Button
                          variant="ghost"
                          className="px-4 py-2 text-xs text-red-200"
                          onClick={() => deactivateJacket(jacket.id)}
                        >
                          Desactivar
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
