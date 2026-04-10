"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { euro } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Jacket = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  imagenUrl: string;
};

export function JacketsCarousel() {
  const [jackets, setJackets] = useState<Jacket[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/jackets");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar las chaquetas.");
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
    }, 5000);

    return () => window.clearInterval(timer);
  }, [jackets.length]);

  if (loading) {
    return <div className="glass-panel rounded-[2rem] p-8 text-sm text-mist/80">Cargando catálogo...</div>;
  }

  if (error) {
    return <div className="glass-panel rounded-[2rem] p-8 text-sm text-red-200">{error}</div>;
  }

  if (!jackets.length) {
    return <div className="glass-panel rounded-[2rem] p-8 text-sm text-mist/80">No hay chaquetas activas.</div>;
  }

  const jacket = jackets[current];

  return (
    <div className="glass-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative min-h-[360px]">
        <Image src={jacket.imagenUrl} alt={jacket.nombre} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-between p-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-sky">Colección base</p>
          <h3 className="font-display text-3xl text-white">{jacket.nombre}</h3>
          <p className="mt-4 text-sm leading-7 text-mist/78">{jacket.descripcion}</p>
        </div>
        <div className="mt-8 flex flex-col gap-5">
          <div className="text-2xl font-semibold text-white">{euro(jacket.precio)}</div>
          <div className="flex items-center gap-3">
            <Link href={`/personalizar/${jacket.id}`}>
              <Button>Personalizar ahora</Button>
            </Link>
            <button
              aria-label="Anterior"
              className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
              onClick={() => setCurrent((value) => (value - 1 + jackets.length) % jackets.length)}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Siguiente"
              className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
              onClick={() => setCurrent((value) => (value + 1) % jackets.length)}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
