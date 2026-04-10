import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login admin",
  description: "Acceso al panel de administración de dblueart."
};

export default function AdminLoginPage() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center py-10">
      <LoginForm />
    </main>
  );
}
