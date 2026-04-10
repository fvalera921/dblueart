"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Jacket = {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
};

export function CreatedJacketsShowcase() {
  const [jackets, setJackets] = useState<Jacket[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/chaquetas-terminadas");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los ejemplos.");
        }

        setJackets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (jackets.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % jackets.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [jackets.length]);

  if (loading) {
    return <div className="glass-panel rounded-[2rem] p-8 text-sm text-mist/80">Cargando ejemplos...</div>;
  }

  if (error) {
    return <div className="glass-panel rounded-[2rem] p-8 text-sm text-red-200">{error}</div>;
  }

  if (!jackets.length) {
    return null;
  }

  return (
    <div className="glass-panel overflow-hidden rounded-[2rem] p-4 sm:p-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky">Ejemplos</p>
          <h3 className="mt-3 font-display text-3xl text-white">Chaquetas terminadas</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Ver ejemplo anterior"
            className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
            onClick={() => setCurrent((value) => (value - 1 + jackets.length) % jackets.length)}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Ver siguiente ejemplo"
            className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
            onClick={() => setCurrent((value) => (value + 1) % jackets.length)}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {jackets.map((jacket) => (
            <article key={jacket.id} className="min-w-full px-1">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-sky/15 md:col-span-2">
                  <Image
                    src={jacket.imagenUrl}
                    alt={jacket.nombre}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-sky">Trabajo finalizado</p>
                    <h4 className="mt-3 font-display text-3xl text-white">{jacket.nombre}</h4>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-[1.75rem] border border-sky/15 bg-night/70 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-mist/45">
                      Referencia visual
                    </p>
                    <p className="mt-4 text-sm leading-7 text-mist/74">{jacket.descripcion}</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-mist/45">
                      Ideal para mostrar acabados, composición y estilo
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {jackets.map((jacket, index) => (
          <button
            key={jacket.id}
            type="button"
            aria-label={`Ir al ejemplo ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition ${
              current === index ? "w-10 bg-sky" : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
