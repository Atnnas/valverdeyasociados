"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen bg-[#07130F] text-[#F0FDF4] selection:bg-[#CCA046]/40 selection:text-[#FFF9EB] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#1F4A3B]/60 bg-[#07130F]/90 backdrop-blur px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-full p-1 bg-[#0A1B15] border border-[#CCA046]/40 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo Valverde & Asociados"
              width={44}
              height={44}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-white group-hover:text-[#CCA046] transition">
              Valverde & Asociados
            </span>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCA046]">AUTENTICACIÓN SEGURA</p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-emerald-200/70 hover:text-[#CCA046] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-[#CCA046]/40 bg-gradient-to-br from-[#0A1B15] to-[#07130F] shadow-2xl space-y-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCA046] to-transparent" />

          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046] shadow-xl">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Acceso Institucional
            </h1>
            <p className="text-xs text-emerald-200/70 max-w-xs mx-auto leading-relaxed">
              Inicie sesión mediante su cuenta autorizada de Google para consultar expedientes o gestionar causas fiduciarias.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-xl transition active:scale-98"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 pt-2">
              <span className="h-px bg-[#1F4A3B] flex-1" />
              <span className="text-[11px] font-mono text-emerald-400/60 uppercase">O ACCESO CON CLAVE</span>
              <span className="h-px bg-[#1F4A3B] flex-1" />
            </div>

            <Link
              href="/admin"
              className="block w-full py-3.5 rounded-xl border border-[#1F4A3B] hover:border-[#CCA046] bg-[#0A1B15] text-[#CCA046] text-xs font-semibold uppercase tracking-wider transition"
            >
              Ingresar con Clave Judicial de Firma
            </Link>
          </div>

          <p className="text-[11px] text-emerald-200/50 leading-relaxed pt-2">
            La autenticación OAuth verifica su identidad con los servidores de Google sin compartir sus contraseñas con el consultorio.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-emerald-300/40 border-t border-[#1F4A3B]/40">
        Valverde & Asociados – Consultorio Jurídico. Ciudad Quesada, Costa Rica.
      </footer>
    </div>
  );
}

