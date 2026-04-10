import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Instagram, Mail, Palette, Send, ShieldCheck } from "lucide-react";
import { CreatedJacketsShowcase } from "@/components/home/created-jackets-showcase";
import { JacketsCarousel } from "@/components/home/jackets-carousel";
import { LocalBusinessSchema } from "@/components/home/local-business-schema";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Catálogo de chaquetas personalizadas y proceso visual de dblueart."
};

export default function HomePage() {
  return (
    <main className="pb-16">
      <LocalBusinessSchema />
      <section className="section-shell pt-8 sm:pt-12">
        <div className="glass-panel overflow-hidden rounded-[2rem] bg-hero-grid px-6 py-10 sm:px-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-sky">Atelier de chaquetas personalizadas</p>
            <h1 className="mt-6 font-display text-5xl leading-none text-white sm:text-7xl">
              dblueart
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-mist/80">
              Convierte una chaqueta en una pieza única. Tú subes el arte, nosotros transformamos
              la prenda en una edición personalizada lista para destacar.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#catalogo">
                <Button>
                  Explorar chaquetas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="secondary">Acceso admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="section-shell pt-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky">Selección</p>
            <h2 className="mt-3 font-display text-4xl text-white">Colección para personalizar</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-mist/70">
            Cada modelo está preparado para recibir tu diseño con un coste fijo de 40€ por
            personalización.
          </p>
        </div>
        <JacketsCarousel />
      </section>

      <section className="section-shell pt-16">
        <CreatedJacketsShowcase />
      </section>

      <section className="section-shell pt-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sky">Proceso</p>
          <h2 className="mt-3 font-display text-4xl text-white">Cómo funciona</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Palette,
              title: "1. Elige tu base",
              description: "Selecciona una chaqueta del catálogo y abre el editor visual."
            },
            {
              icon: ShieldCheck,
              title: "2. Sube tu diseño",
              description: "Sube la imagen que quieres aplicar y la recibimos lista para preparar tu encargo."
            },
            {
              icon: Send,
              title: "3. Confirma el pedido",
              description: "Envía tus datos y recibe por email la confirmación del encargo."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="glass-panel rounded-[2rem] p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-sky/15 p-3 text-sky">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist/72">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="section-shell pt-16">
        <div className="glass-panel grid gap-8 rounded-[2rem] px-6 py-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl text-white">dblueart</h3>
            <p className="mt-3 text-sm leading-7 text-mist/72">
              Chaquetas personalizadas en España con proceso creativo guiado y atención directa.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contacto</p>
            <div className="mt-3 space-y-2 text-sm text-mist/72">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky" />
                hola@dblueart.com
              </p>
              <p>Bullas, Murcia</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">SEO y redes</p>
            <div className="mt-3 space-y-2 text-sm text-mist/72">
              <p>Moda personalizada, chaquetas pintadas y diseño textil exclusivo.</p>
              <a
                href="https://www.instagram.com/dblueart"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sky"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
