"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  RefreshCw,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  LogOut,
  Users,
  UserCheck,
  UserX,
  Search,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from "lucide-react";

interface UserRecord {
  id: string;
  nombre: string;
  email: string;
  imagen: string;
  rol: "administrador" | "editor" | "visitante";
  activo: boolean;
  creadoEn: string;
  ultimoIngreso: string;
  isSuperAdmin: boolean;
}

interface CaseSummary {
  id: string;
  fullName: string;
  email: string;
  legalArea: string;
  status: string;
  createdAt: string;
}

interface DecryptedCaseDetails {
  id: string;
  fullName: string;
  email: string;
  nationalId: string;
  phone: string;
  legalArea: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminPortalPage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"usuarios" | "expedientes">("usuarios");
  const [apiKey, setApiKey] = useState("");
  const [manualAuth, setManualAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  // Estados de Usuarios
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userUpdating, setUserUpdating] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  // Estados de Expedientes
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DecryptedCaseDetails | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const sessionUser = session?.user
    ? (session.user as { name?: string | null; email?: string | null; image?: string | null; rol?: string; activo?: boolean })
    : undefined;
  const isSuperAdmin = sessionUser?.email?.toLowerCase() === "david.artavia.rodriguez@gmail.com";
  const isSessionAdmin = isSuperAdmin || (sessionUser?.rol === "administrador" && sessionUser?.activo === true);
  const isAuthorized = isSessionAdmin || manualAuth;

  // Cargar lista de usuarios
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUserMessage(null);
    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch("/api/admin/usuarios", { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.usuarios || []);
      } else {
        if (!isSessionAdmin) setAuthError(data.error || "No autorizado");
      }
    } catch {
      console.error("Error cargando usuarios");
    } finally {
      setUsersLoading(false);
    }
  }, [apiKey, isSessionAdmin]);

  // Cargar lista de expedientes
  const fetchCases = useCallback(async () => {
    setCasesLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch("/api/admin/cases", { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setCases(data.cases || []);
      }
    } catch {
      console.error("Error cargando expedientes");
    } finally {
      setCasesLoading(false);
    }
  }, [apiKey]);

  // Auto-cargar datos si la sesión es administrador
  useEffect(() => {
    if (isSessionAdmin || manualAuth) {
      fetchUsers();
      fetchCases();
    }
  }, [isSessionAdmin, manualAuth, fetchUsers, fetchCases]);

  // Manejo de login manual con API Key
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setUsersLoading(true);

    try {
      const res = await fetch("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setManualAuth(true);
        setUsers(data.usuarios || []);
        fetchCases();
      } else {
        setAuthError(data.error || "Clave administrativa no autorizada.");
      }
    } catch {
      setAuthError("Error de conexión al servidor.");
    } finally {
      setUsersLoading(false);
    }
  };

  // Actualizar rol o estado de activación de un usuario
  const handleUpdateUser = async (
    email: string,
    updates: { rol?: "administrador" | "editor" | "visitante"; activo?: boolean }
  ) => {
    setUserUpdating(email);
    setUserMessage(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch("/api/admin/usuarios", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ email, ...updates }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers((prev: UserRecord[]) =>
          prev.map((u) => (u.email === email ? ({ ...u, ...updates } as UserRecord) : u))
        );
        setUserMessage(data.message || "Usuario actualizado correctamente.");
      } else {
        alert(data.error || "No fue posible actualizar el usuario.");
      }
    } catch {
      alert("Error de red al actualizar usuario.");
    } finally {
      setUserUpdating(null);
    }
  };

  // Descifrar expediente confidencial
  const handleDecrypt = async (id: string) => {
    setIsDecrypting(true);
    setDecryptError("");
    setSelectedCase(null);

    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch(`/api/cases/${id}`, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setSelectedCase(data.case);
      } else {
        setDecryptError(data.error || "No se pudo descifrar el expediente.");
      }
    } catch {
      setDecryptError("Fallo criptográfico al recuperar la llave.");
    } finally {
      setIsDecrypting(false);
    }
  };

  // Actualizar estado del caso
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch("/api/admin/cases", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, newStatus }),
      });

      if (res.ok) {
        setCases((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        if (selectedCase && selectedCase.id === id) {
          setSelectedCase({ ...selectedCase, status: newStatus });
        }
      }
    } catch {
      console.error("Error updating status");
    }
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#1F1F1F] flex flex-col font-sans antialiased selection:bg-[#C2E7FF] selection:text-[#001D35]">
      {/* Top Header Estilo Gmail / Google Workspace */}
      <header className="sticky top-0 z-40 bg-[#F6F8FC] border-b border-[#E0E2EC]/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 min-w-fit">
          <Link href="/" className="flex items-center gap-3 group">
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
                  Admin
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Buscador Central Estilo Barra de Búsqueda Gmail */}
        {isAuthorized && (
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Buscar usuarios por nombre, correo o rol..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-[#EAF1FB] hover:bg-[#E1E9F5] focus:bg-white text-sm text-[#1F1F1F] placeholder-[#444746] focus:outline-none focus:ring-1 focus:ring-[#0B57D0] focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] transition-all border border-transparent focus:border-transparent"
              />
              <Search className="absolute left-4 top-3 h-4.5 w-4.5 text-[#444746]" />
            </div>
          </div>
        )}

        {/* Acciones de la Derecha / Cuenta de Usuario */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#444746] hover:bg-[#EAF1FB] hover:text-[#1F1F1F] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Sitio Web</span>
          </Link>

          {isAuthorized && (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2.5 pl-3 pr-2 py-1 rounded-full bg-white border border-[#DADCE0] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#188038]" />
                <span className="text-xs font-medium text-[#444746] truncate max-w-[200px]">
                  {isSuperAdmin ? "david.artavia.rodriguez@gmail.com" : sessionUser?.email}
                </span>
                {isSuperAdmin && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D3E3FD] text-[#041E49]">
                    Super Admin
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (session) {
                    signOut({ callbackUrl: "/" });
                  } else {
                    setManualAuth(false);
                    setApiKey("");
                  }
                }}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#B3261E] hover:bg-[#FCE8E6] transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="w-full max-w-[1920px] mx-auto py-5 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {!isAuthorized ? (
          // Vista de Autenticación Sobria Estilo Google Accounts
          <div className="max-w-md w-full mx-auto my-auto py-12">
            <div className="bg-white rounded-3xl border border-[#DADCE0] p-8 sm:p-10 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-full bg-[#EAF1FB] flex items-center justify-center mx-auto text-[#0B57D0]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-normal text-[#1F1F1F] tracking-tight">
                  Iniciar sesión
                </h1>
                <p className="text-sm text-[#444746]">
                  Panel de Administración · Valverde & Asociados
                </p>
              </div>

              {/* Mensaje de cuenta no activa */}
              {sessionUser && !isSessionAdmin && (
                <div className="p-4 rounded-2xl bg-[#FEF7D0] border border-[#E0D782] text-[#3B2D00] text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Info className="h-4 w-4 text-[#8C6D00] flex-shrink-0" />
                    <span>Cuenta pendiente de activación</span>
                  </div>
                  <p className="leading-relaxed">
                    Has iniciado sesión con <strong>{sessionUser.email}</strong>, pero tu cuenta debe ser activada por el Super Administrador.
                  </p>
                </div>
              )}

              {/* Botón Oficial Google */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
                className="w-full py-2.5 px-4 rounded-full border border-[#DADCE0] hover:bg-[#F8FAFD] hover:border-[#C4C7C5] active:bg-[#EAF1FB] text-sm font-medium text-[#1F1F1F] flex items-center justify-center gap-3 transition shadow-sm cursor-pointer"
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
                <span>Continuar con Google</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px bg-[#E0E2EC] flex-1" />
                <span className="text-[11px] font-medium text-[#727775] uppercase tracking-wider">o clave de acceso</span>
                <span className="h-px bg-[#E0E2EC] flex-1" />
              </div>

              {/* Formulario Manual de Clave */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#444746] mb-1.5">
                    Clave administrativa (API Key)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Ingrese clave de sistema"
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-[#747775] focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] text-sm text-[#1F1F1F] placeholder-[#727775] focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={usersLoading}
                  className="w-full py-2.5 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-sm font-medium transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {usersLoading ? "Validando..." : "Acceder al Panel"}
                </button>
              </form>

              {authError && (
                <div className="p-3 rounded-lg bg-[#FCE8E6] text-[#B3261E] text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista Autorizada: Consola Gmail / Google Workspace
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Barra de Pestañas / Navegación Estilo Gmail Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab("usuarios")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                    activeTab === "usuarios"
                      ? "bg-[#C2E7FF] text-[#001D35] font-semibold"
                      : "text-[#444746] hover:bg-[#EAF1FB] hover:text-[#1F1F1F]"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Usuarios</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/70 text-[#001D35] font-bold">
                    {users.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("expedientes")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                    activeTab === "expedientes"
                      ? "bg-[#C2E7FF] text-[#001D35] font-semibold"
                      : "text-[#444746] hover:bg-[#EAF1FB] hover:text-[#1F1F1F]"
                  }`}
                >
                  <FolderLock className="h-4 w-4" />
                  <span>Expedientes</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/70 text-[#001D35] font-bold">
                    {cases.length}
                  </span>
                </button>
              </div>

              {/* Botón de Actualizar / Refrescar */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={activeTab === "usuarios" ? fetchUsers : fetchCases}
                  disabled={usersLoading || casesLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DADCE0] bg-white hover:bg-[#F8FAFD] text-[#444746] hover:text-[#1F1F1F] text-xs font-medium shadow-sm transition cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-[#0B57D0] ${usersLoading || casesLoading ? "animate-spin" : ""}`} />
                  <span>Sincronizar</span>
                </button>
              </div>
            </div>

            {/* Notificación de Confirmación */}
            {userMessage && (
              <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] flex-shrink-0" />
                  <span className="font-medium">{userMessage}</span>
                </div>
                <button
                  onClick={() => setUserMessage(null)}
                  className="text-[#16A34A] hover:text-[#14532D] font-bold text-sm px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Buscador Móvil (Visible en pantallas pequeñas) */}
            <div className="md:hidden">
              <div className="relative w-full">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#EAF1FB] text-sm text-[#1F1F1F] placeholder-[#444746] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0B57D0]"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#444746]" />
              </div>
            </div>

            {/* PESTAÑA 1: LISTADO DE USUARIOS ESTILO GMAIL INBOX / GOOGLE CONTACTS */}
            {activeTab === "usuarios" && (
              <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden flex-1">
                {/* Header de la Tabla */}
                <div className="px-6 py-3 border-b border-[#E0E2EC] bg-[#F8FAFD] flex items-center justify-between text-xs font-medium text-[#444746]">
                  <div className="flex items-center gap-4">
                    <span>USUARIO ({filteredUsers.length})</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="hidden sm:inline">ROL</span>
                    <span className="hidden sm:inline">ESTADO</span>
                    <span>ACCIONES</span>
                  </div>
                </div>

                {/* Contenido / Filas de Usuarios */}
                {usersLoading && users.length === 0 ? (
                  <div className="py-24 text-center space-y-3">
                    <div className="h-7 w-7 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#444746]">Sincronizando con Google Workspace y MongoDB Atlas...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-20 text-center space-y-2">
                    <Users className="h-10 w-10 text-[#C4C7C5] mx-auto" />
                    <p className="text-sm font-medium text-[#1F1F1F]">No hay usuarios que coincidan con la búsqueda</p>
                    <p className="text-xs text-[#727775]">Intenta con otro término o limpia el buscador</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F1F3F4]">
                    {filteredUsers.map((u) => {
                      const isProcessing = userUpdating === u.email;

                      return (
                        <div
                          key={u.id || u.email}
                          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F2F6FC] transition-colors"
                        >
                          {/* Avatar + Datos del Usuario */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-11 w-11 rounded-full overflow-hidden border border-[#DADCE0] bg-[#E8F0FE] flex items-center justify-center flex-shrink-0">
                              {u.imagen ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={u.imagen}
                                  alt={u.nombre}
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-base font-semibold text-[#0B57D0]">
                                  {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#1F1F1F] truncate">
                                  {u.nombre}
                                </span>
                                {u.isSuperAdmin && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#D3E3FD] text-[#041E49] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles className="h-3 w-3 text-[#0B57D0]" />
                                    Super Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#444746] font-normal truncate mt-0.5">
                                {u.email}
                              </p>
                              <span className="text-[11px] text-[#727775] sm:hidden block mt-1">
                                Registrado: {u.creadoEn ? new Date(u.creadoEn).toLocaleDateString("es-CR") : "Reciente"}
                              </span>
                            </div>
                          </div>

                          {/* Controles de Rol, Estado y Activación */}
                          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                            {/* Selector de Rol Estilo Google Material */}
                            <select
                              value={u.rol}
                              disabled={u.isSuperAdmin || isProcessing}
                              onChange={(e) =>
                                handleUpdateUser(u.email, {
                                  rol: e.target.value as "administrador" | "editor" | "visitante",
                                })
                              }
                              className="px-3 py-1.5 rounded-lg border border-[#747775]/30 bg-white hover:bg-[#F8FAFD] text-xs font-medium text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] disabled:opacity-60 disabled:cursor-not-allowed capitalize cursor-pointer shadow-sm transition"
                            >
                              <option value="visitante">Visitante</option>
                              <option value="editor">Editor</option>
                              <option value="administrador">Administrador</option>
                            </select>

                            {/* Badge de Estado */}
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                                u.activo
                                  ? "bg-[#C4EED0] text-[#072711]"
                                  : "bg-[#FEF7D0] text-[#3B2D00]"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  u.activo ? "bg-[#188038]" : "bg-[#8C6D00]"
                                }`}
                              />
                              <span>{u.activo ? "Activo" : "Desactivado"}</span>
                            </span>

                            {/* Botón de Acción Sobrio */}
                            {!u.isSuperAdmin ? (
                              <button
                                onClick={() => handleUpdateUser(u.email, { activo: !u.activo })}
                                disabled={isProcessing}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                                  u.activo
                                    ? "text-[#B3261E] hover:bg-[#FCE8E6] border border-[#F5C2CB]"
                                    : "bg-[#0B57D0] hover:bg-[#0842A0] text-white shadow-sm"
                                }`}
                              >
                                {isProcessing ? (
                                  "..."
                                ) : u.activo ? (
                                  "Desactivar"
                                ) : (
                                  "Activar"
                                )}
                              </button>
                            ) : (
                              <span className="text-xs text-[#727775] italic px-2">
                                Protegido
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 2: EXPEDIENTES ESTILO GOOGLE DRIVE / WORKSPACE */}
            {activeTab === "expedientes" && (
              <div className="space-y-4">
                {casesLoading && cases.length === 0 ? (
                  <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-[#DADCE0]">
                    <div className="h-7 w-7 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#444746]">Cargando expedientes cifrados...</p>
                  </div>
                ) : cases.length === 0 ? (
                  <div className="py-20 text-center space-y-2 bg-white rounded-2xl border border-[#DADCE0]">
                    <FileText className="h-10 w-10 text-[#C4C7C5] mx-auto" />
                    <p className="text-sm font-medium text-[#1F1F1F]">No hay consultas registradas aún</p>
                    <p className="text-xs text-[#727775]">Las consultas de clientes desde la web aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-[#DADCE0] hover:border-[#B4B7B9] hover:shadow-md p-5 transition space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-[#E8F0FE] text-[#0B57D0] font-mono text-xs font-semibold">
                              FOLIO: {c.id.slice(-8).toUpperCase()}
                            </span>
                            <h3 className="text-base font-semibold text-[#1F1F1F] mt-2">{c.fullName}</h3>
                            <p className="text-xs text-[#444746] font-mono mt-0.5">{c.email}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F3F4] text-[#444746]">
                            {c.status}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-[#F1F3F4] flex items-center justify-between text-xs text-[#727775]">
                          <span className="capitalize font-medium text-[#444746]">
                            {c.legalArea.replace(/_/g, " ")}
                          </span>
                          <span>{new Date(c.createdAt).toLocaleDateString("es-CR")}</span>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-[#DADCE0] bg-white text-xs text-[#444746] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
                          >
                            <option value="recibido">Recibido</option>
                            <option value="en_revision">En Revisión</option>
                            <option value="atendido">Atendido</option>
                            <option value="archivado">Archivado</option>
                          </select>

                          <button
                            onClick={() => handleDecrypt(c.id)}
                            disabled={isDecrypting}
                            className="px-3.5 py-1.5 rounded-full bg-[#EAF1FB] hover:bg-[#D3E3FD] text-[#0B57D0] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Ver Detalle</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalle Criptográfico Estilo Google Material Dialog */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl border border-[#DADCE0] shadow-2xl p-6 sm:p-8 space-y-6 text-[#1F1F1F]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4]">
                <div>
                  <span className="text-xs font-mono font-bold text-[#0B57D0]">
                    FOLIO: {selectedCase.id.slice(-8).toUpperCase()}
                  </span>
                  <h3 className="text-lg font-semibold text-[#1F1F1F] mt-1">
                    {selectedCase.fullName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="h-8 w-8 rounded-full hover:bg-[#F1F3F4] text-[#444746] flex items-center justify-center text-lg font-medium cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC]">
                  <span className="text-[#727775] font-medium block">Cédula (Descifrado AES-256)</span>
                  <span className="text-sm font-semibold text-[#1F1F1F] font-mono mt-1 block">
                    {selectedCase.nationalId}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC]">
                  <span className="text-[#727775] font-medium block">Teléfono (Descifrado AES-256)</span>
                  <span className="text-sm font-semibold text-[#1F1F1F] font-mono mt-1 block">
                    {selectedCase.phone}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC] space-y-1.5">
                <span className="text-xs text-[#727775] font-medium block">
                  Relato de Hechos / Asunto
                </span>
                <p className="text-sm text-[#1F1F1F] whitespace-pre-wrap leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-5 py-2 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-xs font-medium cursor-pointer shadow-sm transition"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
