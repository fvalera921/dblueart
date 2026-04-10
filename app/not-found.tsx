import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center py-10">
      <div className="glass-panel max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-sky">404</p>
        <h1 className="mt-4 font-display text-4xl text-white">Página no encontrada</h1>
        <p className="mt-4 text-sm leading-7 text-mist/72">
          La ruta que buscas no existe o la chaqueta ya no está disponible.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </main>
  );
}
