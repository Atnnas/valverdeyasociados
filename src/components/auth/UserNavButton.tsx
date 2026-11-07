"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShieldCheck,
  LogOut,
  ChevronDown,
  UserCheck,
  Clock,
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

export default function UserNavButton() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-9 w-24 rounded-lg bg-[#0F2B21]/60 animate-pulse border border-[#1F4A3B]" />
    );
  }

  // Si no está autenticado: Botón "Ingresar"
  if (!session || !session.user) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#CCA046]/70 bg-gradient-to-r from-[#0F2B21] to-[#0A1B15] hover:border-[#CCA046] hover:bg-[#14352A] text-[#E5BE6E] hover:text-[#FFF9EB] text-xs font-bold tracking-wider uppercase transition shadow-md shadow-[#000]/40 active:scale-95"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
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
        <span>Ingresar</span>
      </button>
    );
  }

  // Si está autenticado: Foto y Nombre en la esquina superior derecha
  const user = session.user as typeof session.user & { rol?: string; activo?: boolean };
  const userRole = user.rol || "visitante";
  const isActivo = Boolean(user.activo);
  const isSuperAdmin = user.email?.toLowerCase() === "david.artavia.rodriguez@gmail.com";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-[#CCA046]/50 bg-[#0A1B15] hover:border-[#CCA046] hover:bg-[#0F2B21] transition shadow-lg group active:scale-98"
        aria-label="Menú de usuario"
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-[#CCA046]/60 bg-[#07130F] flex items-center justify-center">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Usuario"}
              fill
              unoptimized
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <span className="text-xs font-bold text-[#E5BE6E]">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>

        <div className="text-left hidden lg:block">
          <p className="text-xs font-semibold text-white group-hover:text-[#E5BE6E] transition leading-tight max-w-[120px] truncate">
            {user.name || "Usuario"}
          </p>
          <p className="text-[10px] text-[#CCA046] font-mono leading-none capitalize">
            {isSuperAdmin ? "Super Admin" : userRole}
          </p>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-emerald-300 transition duration-200 ${
            dropdownOpen ? "rotate-180 text-[#CCA046]" : ""
          }`}
        />
      </button>

      {/* Menú Desplegable */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#CCA046]/40 bg-[#07130F]/95 backdrop-blur-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Perfil del Usuario */}
          <div className="p-3 rounded-xl bg-[#0A1B15] border border-[#1F4A3B] mb-2">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#CCA046] bg-[#07130F]">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Usuario"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-base text-[#CCA046]">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name || "Usuario"}
                </p>
                <p className="text-[11px] text-emerald-300/70 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Badges de Estado y Rol */}
            <div className="mt-3 pt-2.5 border-t border-[#1F4A3B]/60 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-mono">
                {isActivo ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300 font-medium">Cuenta Activa</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-medium">Desactivada (Pendiente)</span>
                  </>
                )}
              </span>

              <span className="px-2 py-0.5 rounded-full bg-[#1A3E31] border border-[#CCA046]/40 text-[#E5BE6E] font-semibold uppercase text-[10px] tracking-wider">
                {userRole}
              </span>
            </div>
          </div>

          {/* Botón Panel Admin */}
          <div className="space-y-1">
            <Link
              href="/admin"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F2B21] to-[#14352A] hover:from-[#14352A] hover:to-[#1A3E31] text-emerald-100 hover:text-white border border-[#CCA046]/30 hover:border-[#CCA046] transition text-xs font-semibold"
            >
              <LayoutDashboard className="h-4 w-4 text-[#CCA046]" />
              <span>Panel Admin (Usuarios y Expedientes)</span>
            </Link>

            <Link
              href="/boveda"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-[#0A1B15] text-emerald-200/80 hover:text-white transition text-xs"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Bóveda de Verificación de Folio</span>
            </Link>

            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-rose-950/40 text-rose-300/80 hover:text-rose-200 transition text-xs"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

