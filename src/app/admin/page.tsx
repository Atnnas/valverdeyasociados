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
    <div className="min-h-screen bg-[#0E131F] text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Top Header Corporativo Limpio */}
      <header className="border-b border-slate-800 bg-[#141B2D]/95 backdrop-blur sticky top-0 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-11 w-11 rounded-xl bg-[#1C263D] border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Valverde & Asociados Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition leading-tight">
                  Valverde & Asociados
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
                  PANEL DE ADMINISTRACIÓN
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Sitio Principal</span>
            </Link>

            {isAuthorized && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#1C263D] border border-slate-700 text-sm font-medium text-slate-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {isSuperAdmin ? "Super Admin:" : "Usuario:"}
                  </span>
                  <span className="font-semibold text-white">
                    {isSuperAdmin ? "david.artavia.rodriguez@gmail.com" : sessionUser?.email}
                  </span>
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
                  className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Área Principal de Contenido - Aprovechamiento Total de Pantallas Grandes */}
      <main className="w-full max-w-[1920px] mx-auto py-8 sm:py-10 px-6 sm:px-10 lg:px-12 flex-1">
        {!isAuthorized ? (
          // Vista de Autenticación / Requerimiento de Acceso
          <div className="max-w-xl mx-auto my-12">
            <div className="text-center mb-8">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-lg">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Acceso al Panel de Administración
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Gestión centralizada de usuarios, permisos y expedientes fiduciarios.
              </p>
            </div>

            {/* Aviso si está logueado pero desactivado o no es admin */}
            {sessionUser && !isSessionAdmin && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-950/50 border border-amber-600/60 text-amber-200 text-sm space-y-2">
                <div className="flex items-center gap-2.5 font-bold text-amber-300 text-base">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Cuenta registrada pero Desactivada</span>
                </div>
                <p className="leading-relaxed">
                  Has iniciado sesión como <strong className="text-white">{sessionUser.email}</strong>, pero tu cuenta requiere activación por parte de un Administrador.
                </p>
                <p className="text-xs text-amber-300/80">
                  Contacta a <code className="text-amber-200 font-mono font-bold">david.artavia.rodriguez@gmail.com</code> para habilitar tus permisos.
                </p>
              </div>
            )}

            <div className="p-8 sm:p-10 rounded-2xl border border-slate-800 bg-[#141B2D] shadow-2xl space-y-7">
              {/* Opción 1: Google OAuth */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Autenticación Oficial con Cuenta de Google
                </label>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/admin" })}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition shadow-md cursor-pointer active:scale-[0.99]"
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
                  <span>Ingresar con Google</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px bg-slate-800 flex-1" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">O CON CLAVE DE SISTEMA</span>
                <span className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Formulario de Clave API */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Clave de Acceso Administrativo (API Key)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Ingrese la clave administrativa"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono"
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={usersLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {usersLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Ingresar al Panel
                    </>
                  )}
                </button>
              </form>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista Autorizada: Panel Administrativo Corporativo
          <div className="space-y-6">
            {/* Barra Superior de Controles: Título, Pestañas y Estadísticas */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-blue-400" />
                  <span>Panel de Control & Administración</span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Administración de usuarios, roles de acceso y bóveda de expedientes fiduciarios.
                </p>
              </div>

              {/* Selector de Pestañas Corporativas */}
              <div className="flex items-center gap-3 bg-[#141B2D] p-1.5 rounded-xl border border-slate-800 self-start xl:self-auto">
                <button
                  onClick={() => setActiveTab("usuarios")}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-bold transition cursor-pointer ${
                    activeTab === "usuarios"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Users className="h-4.5 w-4.5" />
                  <span>Control de Usuarios ({users.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("expedientes")}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-bold transition cursor-pointer ${
                    activeTab === "expedientes"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <FolderLock className="h-4.5 w-4.5" />
                  <span>Bóveda de Expedientes ({cases.length})</span>
                </button>
              </div>
            </div>

            {/* Mensaje de confirmación de acción */}
            {userMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-sm flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">{userMessage}</span>
                </div>
                <button
                  onClick={() => setUserMessage(null)}
                  className="text-emerald-400 hover:text-white font-bold px-2 py-1 text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* PESTAÑA 1: GESTIÓN DE USUARIOS REGISTRADOS */}
            {activeTab === "usuarios" && (
              <div className="space-y-5">
                {/* Barra de Filtro, Búsqueda y Métricas Rápidas en una Sola Fila */}
                <div className="p-4 rounded-2xl bg-[#141B2D] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Buscador */}
                  <div className="relative flex-1 max-w-xl">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Buscar usuario por nombre o correo de Google..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-medium"
                    />
                    <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>

                  {/* Badges de Conteo Rápido */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C263D] border border-slate-700">
                      <span className="text-slate-400 font-medium">Total:</span>
                      <strong className="text-white font-bold">{users.length}</strong>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/50 border border-emerald-600/50 text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="font-medium">Activos:</span>
                      <strong className="font-bold">{users.filter((u) => u.activo).length}</strong>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-950/50 border border-amber-600/50 text-amber-300">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="font-medium">Pendientes:</span>
                      <strong className="font-bold">{users.filter((u) => !u.activo).length}</strong>
                    </div>

                    <button
                      onClick={fetchUsers}
                      disabled={usersLoading}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <RefreshCw className={`h-4 w-4 text-blue-400 ${usersLoading ? "animate-spin" : ""}`} />
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>

                {/* Listado de Usuarios con Formato Corporativo de Alta Legibilidad */}
                <div className="rounded-2xl border border-slate-800 bg-[#141B2D] overflow-hidden shadow-xl">
                  {usersLoading && users.length === 0 ? (
                    <div className="py-24 text-center space-y-3">
                      <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-slate-400 font-medium">Cargando base de datos de usuarios en MongoDB...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <Users className="h-12 w-12 text-slate-600 mx-auto" />
                      <p className="text-base font-bold text-white">No se encontraron usuarios</p>
                      <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Cuando un usuario inicie sesión con Google por primera vez, quedará registrado automáticamente aquí.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {filteredUsers.map((u) => {
                        const isProcessing = userUpdating === u.email;

                        return (
                          <div
                            key={u.id || u.email}
                            className="p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:bg-[#1A233A] transition"
                          >
                            {/* Información del Usuario con Tipografía Grande y Clara */}
                            <div className="flex items-center gap-5 min-w-0">
                              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-800 flex-shrink-0 flex items-center justify-center shadow-md">
                                {u.imagen ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={u.imagen}
                                    alt={u.nombre}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-xl font-bold text-blue-400">
                                    {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-lg font-bold text-white tracking-tight truncate">
                                    {u.nombre}
                                  </h3>
                                  {u.isSuperAdmin && (
                                    <span className="px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/50 text-blue-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                                      Super Administrador
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-300 font-mono font-medium truncate">
                                  {u.email}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">
                                  Registrado el: {u.creadoEn ? new Date(u.creadoEn).toLocaleDateString("es-CR", { year: "numeric", month: "long", day: "numeric" }) : "Reciente"}
                                </p>
                              </div>
                            </div>

                            {/* Controles de Rol y Activación Corporativos */}
                            <div className="flex flex-wrap items-center gap-4 self-start xl:self-center">
                              {/* Selector de Rol */}
                              <div className="flex items-center gap-2.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Rol:
                                </label>
                                <select
                                  value={u.rol}
                                  disabled={u.isSuperAdmin || isProcessing}
                                  onChange={(e) =>
                                    handleUpdateUser(u.email, {
                                      rol: e.target.value as "administrador" | "editor" | "visitante",
                                    })
                                  }
                                  className="px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed capitalize cursor-pointer shadow-sm"
                                >
                                  <option value="visitante">Visitante</option>
                                  <option value="editor">Editor</option>
                                  <option value="administrador">Administrador</option>
                                </select>
                              </div>

                              {/* Estado Actual */}
                              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-slate-700">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    u.activo ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                                  }`}
                                />
                                <span className={`text-sm font-bold ${u.activo ? "text-emerald-300" : "text-amber-300"}`}>
                                  {u.activo ? "Activo" : "Desactivado"}
                                </span>
                              </div>

                              {/* Botón Toggle de Activación */}
                              {!u.isSuperAdmin ? (
                                <button
                                  onClick={() => handleUpdateUser(u.email, { activo: !u.activo })}
                                  disabled={isProcessing}
                                  className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-50 ${
                                    u.activo
                                      ? "border border-red-800 bg-red-950/40 text-red-300 hover:bg-red-900/60"
                                      : "border border-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-white"
                                  }`}
                                >
                                  {isProcessing ? (
                                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : u.activo ? (
                                    <>
                                      <UserX className="h-4 w-4" />
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4" />
                                      Activar Usuario
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-slate-400 italic px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
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
              </div>
            )}

            {/* PESTAÑA 2: BÓVEDA DE EXPEDIENTES Y CONSULTAS */}
            {activeTab === "expedientes" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#141B2D] border border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Expedientes y Consultas Registradas
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Los datos sensibles (cédula, teléfono, hechos) se mantienen cifrados en reposo bajo AES-256-GCM.
                    </p>
                  </div>

                  <button
                    onClick={fetchCases}
                    disabled={casesLoading}
                    className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-white flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className={`h-4 w-4 text-blue-400 ${casesLoading ? "animate-spin" : ""}`} />
                    <span>Actualizar Expedientes</span>
                  </button>
                </div>

                {casesLoading && cases.length === 0 ? (
                  <div className="py-24 text-center space-y-3">
                    <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-400 font-medium">Recuperando expedientes...</p>
                  </div>
                ) : cases.length === 0 ? (
                  <div className="py-20 text-center space-y-3 rounded-2xl bg-[#141B2D] border border-slate-800">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto" />
                    <p className="text-base font-bold text-white">No hay expedientes registrados aún</p>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                      Cuando un cliente envíe una consulta desde el formulario web, aparecerá aquí.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        className="p-6 rounded-2xl border border-slate-800 bg-[#141B2D] shadow-lg space-y-4 hover:border-slate-700 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                              FOLIO: {c.id.slice(-8).toUpperCase()}
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1">{c.fullName}</h3>
                            <p className="text-sm text-slate-300 font-mono">{c.email}</p>
                          </div>

                          <span className="px-3 py-1.5 rounded-full bg-[#1C263D] border border-slate-700 text-xs font-mono font-bold text-slate-200">
                            {c.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs font-medium text-slate-400">
                          <span className="capitalize text-sm font-semibold text-slate-300">
                            Área: {c.legalArea.replace(/_/g, " ")}
                          </span>
                          <span>
                            Fecha: {c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-CR") : ""}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-2">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="RECIBIDO_ENCRIPTADO">Recibido (Encriptado)</option>
                            <option value="EN_REVISION_LETRADA">En Revisión Letrada</option>
                            <option value="DICTAMEN_CONCLUIDO">Dictamen Concluido</option>
                            <option value="EXPEDIENTE_ARCHIVADO">Archivado</option>
                          </select>

                          <button
                            onClick={() => handleDecrypt(c.id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition active:scale-95"
                          >
                            <Eye className="h-4 w-4" />
                            Descifrar
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

      {/* Modal de Expediente Descifrado */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-[#141B2D] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <FolderLock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Expediente Cifrado Descifrado</h3>
                    <p className="text-xs font-mono font-bold text-blue-400">
                      FOLIO: {selectedCase.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCase(null)}
                  className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nombre Completo</p>
                  <p className="text-base font-bold text-white mt-1">{selectedCase.fullName}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Correo Electrónico</p>
                  <p className="text-base font-bold text-white mt-1 font-mono">{selectedCase.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <p className="text-xs text-blue-400 font-semibold uppercase font-mono">Cédula (Descifrada AES-256)</p>
                  <p className="text-base font-bold text-white mt-1 font-mono">{selectedCase.nationalId}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <p className="text-xs text-blue-400 font-semibold uppercase font-mono">Teléfono (Descifrado AES-256)</p>
                  <p className="text-base font-bold text-white mt-1 font-mono">{selectedCase.phone}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
                <p className="text-xs text-blue-400 font-semibold uppercase font-mono">
                  Relato de Hechos (Descifrado)
                </p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold cursor-pointer"
                >
                  Cerrar Expediente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}