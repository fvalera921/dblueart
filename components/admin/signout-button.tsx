"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      className="mt-8 rounded-full border border-sky/30 px-4 py-2 text-sm text-mist transition hover:bg-white/10"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      Cerrar sesión
    </button>
  );
}
