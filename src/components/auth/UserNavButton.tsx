"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

export default function UserNavButton() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  // Si no está autenticado: Botón "Ingresar" con Estilo Moneda / Bisel 3D
  if (!session || !session.user) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full border border-[#CCA046]/70 bg-gradient-to-b from-[#14382B] via-[#0C241B] to-[#06140F] hover:border-[#E5BE6E] hover:from-[#1A4535] hover:to-[#0F2A20] text-[#F3DE9C] hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_6px_18px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
      >
        <svg className="h-4 w-4 drop-shadow-sm" viewBox="0 0 24 24">
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

  // Si está autenticado: Foto y Nombre en la esquina superior derecha con Relieve 3D
  const user = session.user as typeof session.user & {
    rol?: string;
    activo?: boolean;
    picture?: string;
    imagen?: string;
  };
  const userRole = user.rol || "visitante";
  const isActivo = Boolean(user.activo);
  const isSuperAdmin = user.email?.toLowerCase() === "david.artavia.rodriguez@gmail.com";
  const avatarUrl = user.image || user.picture || user.imagen || "";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 pr-2.5 sm:pr-3.5 rounded-full border border-[#CCA046]/70 bg-gradient-to-b from-[#123326] via-[#091F17] to-[#04100C] hover:border-[#E5BE6E] hover:from-[#173F30] hover:to-[#0D261C] transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:scale-[1.02] group active:scale-95 cursor-pointer"
        aria-label="Menú de usuario"
      >
        <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFF2CF] via-[#CCA046] to-[#7A5515] flex items-center justify-center flex-shrink-0 shadow-md">
          <div className="h-full w-full rounded-full overflow-hidden bg-[#07130F] flex items-center justify-center">
            {avatarUrl && !imageError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={user.name || "Usuario"}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xs font-bold text-[#E5BE6E]">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-[#07130F] shadow-sm ring-1 ring-emerald-300" />
        </div>

        <div className="text-left hidden lg:block">
          <p className="text-xs font-bold text-white group-hover:text-[#FBF5E8] transition leading-tight max-w-[130px] truncate">
            {user.name || "Usuario"}
          </p>
          <p className="text-[10px] text-[#CCA046] font-mono leading-none capitalize font-semibold">
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
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#CCA046] bg-[#07130F] flex items-center justify-center flex-shrink-0 shadow-lg">
                {avatarUrl && !imageError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={user.name || "Usuario"}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover rounded-full"
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
                <p className="text-[11px] text-emerald-300/70 truncate font-mono">
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
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-rose-950/40 text-rose-300/80 hover:text-rose-200 transition text-xs cursor-pointer"
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
