"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas. Revisa los datos e inténtalo de nuevo.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-sky">Acceso privado</p>
      <h1 className="mt-3 font-display text-4xl text-white">Admin dblueart</h1>
      <div className="mt-6 space-y-4">
        <Input name="email" type="email" placeholder="Email admin" required />
        <Input name="password" type="password" placeholder="Contraseña" required />
      </div>
      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? "Entrando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
