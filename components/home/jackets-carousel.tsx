"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Grid2x2, X } from "lucide-react";
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
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

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

  useEffect(() => {
    if (!isCatalogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCatalogOpen]);

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
    <>
      <div className="glass-panel grid overflow-hidden rounded-[2rem] lg:min-h-[620px] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[440px] lg:min-h-[620px]">
          <Image src={jacket.imagenUrl} alt={jacket.nombre} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between p-8 lg:p-10">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-sky">Colección base</p>
            <h3 className="font-display text-3xl text-white sm:text-4xl">{jacket.nombre}</h3>
            <p className="mt-4 text-sm leading-7 text-mist/78 sm:text-base">{jacket.descripcion}</p>
          </div>
          <div className="mt-8 flex flex-col gap-5">
            <div className="text-2xl font-semibold text-white">{euro(jacket.precio)}</div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/personalizar/${jacket.id}`}>
                <Button>Personalizar ahora</Button>
              </Link>
              <Button variant="secondary" onClick={() => setIsCatalogOpen(true)}>
                <Grid2x2 className="mr-2 h-4 w-4" />
                Ver todas
              </Button>
              <button
                type="button"
                aria-label="Anterior"
                className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
                onClick={() => setCurrent((value) => (value - 1 + jackets.length) % jackets.length)}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                className="rounded-full border border-sky/30 p-3 text-mist transition hover:bg-white/10"
                onClick={() => setCurrent((value) => (value + 1) % jackets.length)}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {jackets.slice(0, 4).map((item, index) => {
                const active = current === index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border transition ${
                      active ? "border-sky shadow-[0_0_0_1px_rgba(114,197,255,0.45)]" : "border-white/10"
                    }`}
                    onClick={() => setCurrent(index)}
                  >
                    <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/70 to-transparent p-3 text-left">
                      <p className="text-xs font-medium text-white">{item.nombre}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isCatalogOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-night/80 p-4 backdrop-blur-md sm:p-6">
          <div className="glass-panel relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-sky/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky">Catálogo completo</p>
                <h3 className="mt-2 font-display text-3xl text-white">Todas las chaquetas</h3>
              </div>
              <button
                type="button"
                aria-label="Cerrar catálogo"
                className="rounded-full border border-sky/20 p-3 text-mist transition hover:bg-white/10"
                onClick={() => setIsCatalogOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {jackets.map((item, index) => (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[1.75rem] border bg-white/[0.03] transition ${
                      current === index ? "border-sky/60" : "border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => {
                        setCurrent(index);
                        setIsCatalogOpen(false);
                      }}
                    >
                      <div className="relative aspect-[4/5]">
                        <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-display text-2xl text-white">{item.nombre}</h4>
                          <span className="text-sm font-semibold text-sky">{euro(item.precio)}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-mist/72">{item.descripcion}</p>
                      </div>
                    </button>
                    <div className="px-5 pb-5">
                      <Link href={`/personalizar/${item.id}`} className="block">
                        <Button className="w-full">Personalizar esta chaqueta</Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
