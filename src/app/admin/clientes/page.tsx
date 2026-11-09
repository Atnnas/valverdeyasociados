"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Briefcase,
  LogOut,
  FolderLock,
  Users,
  ShieldAlert,
} from "lucide-react";
import ClientesCRM from "@/components/admin/ClientesCRM";

export default function AdminClientesPage() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState("");
  const [manualAuth, setManualAuth] = useState(false);

  const sessionUser = session?.user
    ? (session.user as { name?: string | null; email?: string | null; image?: string | null; rol?: string; activo?: boolean })
    : undefined;
  const isSuperAdmin = sessionUser?.email?.toLowerCase() === "david.artavia.rodriguez@gmail.com";
  const isSessionAdmin = isSuperAdmin || (sessionUser?.rol === "administrador" && sessionUser?.activo === true);
  const isAuthorized = isSessionAdmin || manualAuth;

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#1F1F1F] flex flex-col font-sans antialiased selection:bg-[#C2E7FF] selection:text-[#001D35]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F6F8FC] border-b border-[#E0E2EC]/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-white border border-[#DADCE0] flex items-center justify-center p-1.5 shadow-sm group-hover:shadow transition">
              <Image
                src="/logo.png"
                alt="Logo Valverde & Asociados"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-medium tracking-tight text-[#1F1F1F] group-hover:text-[#0B57D0] transition">
                  Valverde & Asociados
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#E8F0FE] text-[#0B57D0] tracking-wide">
                  CRM Clientes
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#444746] hover:bg-[#EAF1FB] hover:text-[#1F1F1F] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Panel Central</span>
          </Link>

          {isAuthorized && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-white border border-[#DADCE0] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#188038]" />
                <span className="text-xs font-medium text-[#444746] truncate max-w-[180px]">
                  {isSuperAdmin ? "david.artavia.rodriguez@gmail.com" : sessionUser?.email}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#B3261E] hover:bg-[#FCE8E6] transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1920px] mx-auto py-5 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {!isAuthorized ? (
          <div className="max-w-md w-full mx-auto my-auto py-12">
            <div className="bg-white rounded-3xl border border-[#DADCE0] p-8 sm:p-10 shadow-sm space-y-6 text-center">
              <div className="h-14 w-14 rounded-full bg-[#EAF1FB] flex items-center justify-center mx-auto text-[#0B57D0]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-normal text-[#1F1F1F] tracking-tight">
                Acceso al CRM de Clientes
              </h1>
              <p className="text-sm text-[#444746]">
                Este módulo requiere autenticación con rol de <strong>Administrador activo</strong> de Valverde & Asociados.
              </p>

              {sessionUser && !isSessionAdmin && (
                <div className="p-4 rounded-2xl bg-[#FEF7D0] border border-[#E0D782] text-[#3B2D00] text-xs text-left space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldAlert className="h-4 w-4 text-[#8C6D00] flex-shrink-0" />
                    <span>Permisos Insuficientes</span>
                  </div>
                  <p>
                    Sesión iniciada como <strong>{sessionUser.email}</strong>, pero tu rol actual no tiene privilegios de administración activa.
                  </p>
                </div>
              )}

              <button
                onClick={() => signIn("google", { callbackUrl: "/admin/clientes" })}
                className="w-full py-2.5 px-4 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-sm font-medium transition cursor-pointer shadow-sm"
              >
                Iniciar sesión con Google
              </button>

              <div className="pt-2">
                <Link
                  href="/"
                  className="text-xs text-[#0B57D0] hover:underline"
                >
                  ← Volver al sitio web principal
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E2EC]/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#E8F0FE] text-[#0B57D0] flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-[#1F1F1F]">
                    Cartera Notarial & CRM de Clientes
                  </h1>
                  <p className="text-xs text-[#727775]">
                    Gestión confidencial de clientes, generales de ley, honorarios y trámites en curso.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-4 py-1.5 rounded-full border border-[#DADCE0] bg-white hover:bg-[#F8FAFD] text-xs font-medium text-[#444746] transition"
                >
                  Ver Todo el Panel Admin
                </Link>
              </div>
            </div>

            <ClientesCRM apiKey={apiKey} isAuthorized={isAuthorized} />
          </div>
        )}
      </main>
    </div>
  );
}

