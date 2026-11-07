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
  EyeOff,
  RefreshCw,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Fingerprint,
  Calendar,
  LogOut,
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Check,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
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
  const { data: session, status: authStatus } = useSession();

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
        setAuthError(data.error || "Clave judicial de firma no autorizada.");
      }
    } catch {
      setAuthError("Error de conexión al servidor judicial.");
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
    <div className="min-h-screen bg-[#07130F] text-[#F0FDF4] selection:bg-[#CCA046]/40 selection:text-[#FFF9EB] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#1F4A3B]/60 bg-[#0A1B15]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-full p-1 bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Valverde & Asociados Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-white group-hover:text-[#CCA046] transition">
                Valverde & Asociados
              </span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCA046]">
                PANEL DE CONTROL & ADMINISTRACIÓN
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-emerald-200/70 hover:text-[#CCA046] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Sitio Principal
            </Link>

            {isAuthorized && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#E5BE6E] hidden sm:flex items-center gap-1.5 bg-[#0F2B21] px-3 py-1.5 rounded-lg border border-[#CCA046]/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isSuperAdmin
                    ? "SUPER ADMIN: david.artavia.rodriguez@gmail.com"
                    : sessionUser?.email || "SESIÓN JUDICIAL ACTIVA"}
                </span>

                <button
                  onClick={() => {
                    if (session) {
                      signOut({ callbackUrl: "/" });
                    } else {
                      setManualAuth(false);
                      setApiKey("");
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-[#1F4A3B] hover:border-rose-700 hover:bg-rose-950/40 text-rose-300 transition flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full py-10 px-6 flex-1">
        {!isAuthorized ? (
          // Vista de Autenticación / Requerimiento de Acceso
          <div className="max-w-md mx-auto my-8">
            <div className="text-center mb-8">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046] mb-4 shadow-xl">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Acceso al Panel de Administración
              </h1>
              <p className="text-xs text-emerald-200/70 mt-2 max-w-sm mx-auto leading-relaxed">
                Gestión de usuarios registrados, asignación de roles fiduciarios y bóveda de expedientes confidenciales.
              </p>
            </div>

            {/* Aviso si está logueado pero desactivado o no es admin */}
            {sessionUser && !isSessionAdmin && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>Cuenta registrada pero Desactivada</span>
                </div>
                <p className="leading-relaxed">
                  Has iniciado sesión como <strong>{sessionUser.email}</strong>, pero tu cuenta se encuentra en estado <strong>DESACTIVADO</strong> o no cuenta con rol de Administrador.
                </p>
                <p className="text-[11px] text-amber-300/80">
                  Un administrador (<code className="text-[#CCA046]">david.artavia.rodriguez@gmail.com</code>) debe habilitar y activar tu cuenta en la colección de usuarios para conceder acceso.
                </p>
              </div>
            )}

            <div className="p-8 rounded-3xl border border-[#CCA046]/40 bg-gradient-to-br from-[#0A1B15] to-[#07130F] shadow-2xl space-y-6">
              {/* Botón Google OAuth */}
              <div className="space-y-3">
                <p className="text-xs text-emerald-200/80 font-semibold">
                  Opción 1: Autenticación con Google OAuth
                </p>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/admin" })}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-3 transition shadow-lg active:scale-98"
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
                  <span>Iniciar Sesión como Administrador</span>
                </button>
                <p className="text-[11px] text-emerald-300/50 text-center">
                  El correo <code>david.artavia.rodriguez@gmail.com</code> tiene acceso como Administrador raíz permanente.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px bg-[#1F4A3B] flex-1" />
                <span className="text-[10px] font-mono text-emerald-400/60 uppercase">O CON CLAVE DE FIRMA</span>
                <span className="h-px bg-[#1F4A3B] flex-1" />
              </div>

              {/* Formulario de Clave API Manual */}
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-100 mb-2">
                    Clave Judicial de Acceso / API Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Ingrese la clave secreta de la firma"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07130F] border border-[#1F4A3B] text-xs text-white placeholder-emerald-800 focus:outline-none focus:border-[#CCA046] transition font-mono"
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-emerald-200/50 mt-1 font-mono">
                    Clave de prueba: <code className="text-[#CCA046]">valverde_admin_key_2026</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={usersLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] hover:from-[#DFB55D] hover:to-[#F5E7C8] text-[#07130F] font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-[#CCA046]/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {usersLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-[#07130F] border-t-transparent rounded-full animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      INGRESAR CON CLAVE
                    </>
                  )}
                </button>
              </form>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista Autorizada: Panel Administrativo con Pestañas
          <div className="space-y-8">
            {/* Header del Panel con Selector de Pestañas */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F4A3B]">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7 text-[#CCA046]" />
                  Panel Central de Administración
                </h1>
                <p className="text-xs text-emerald-200/70 mt-1">
                  Control de usuarios registrados en MongoDB y Bóveda Criptográfica de Valverde & Asociados.
                </p>
              </div>

              {/* Selector de Pestañas */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B]">
                <button
                  onClick={() => setActiveTab("usuarios")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === "usuarios"
                      ? "bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] shadow-lg shadow-[#CCA046]/20 font-bold"
                      : "text-emerald-200/70 hover:text-white"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Control de Usuarios ({users.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("expedientes")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === "expedientes"
                      ? "bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] shadow-lg shadow-[#CCA046]/20 font-bold"
                      : "text-emerald-200/70 hover:text-white"
                  }`}
                >
                  <FolderLock className="h-4 w-4" />
                  <span>Bóveda de Expedientes ({cases.length})</span>
                </button>
              </div>
            </div>

            {/* Mensaje de confirmación de acción */}
            {userMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>{userMessage}</span>
                </div>
                <button
                  onClick={() => setUserMessage(null)}
                  className="text-emerald-400 hover:text-emerald-200 font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* PESTAÑA 1: GESTIÓN DE USUARIOS REGISTRADOS */}
            {activeTab === "usuarios" && (
              <div className="space-y-6">
                {/* Métricas rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B] flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase text-emerald-400/70">TOTAL USUARIOS</p>
                      <p className="text-2xl font-bold text-white">{users.length}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B] flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase text-emerald-400/70">USUARIOS ACTIVOS</p>
                      <p className="text-2xl font-bold text-emerald-300">
                        {users.filter((u) => u.activo).length}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B] flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <UserX className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase text-amber-400/70">PENDIENTES / DESACTIVADOS</p>
                      <p className="text-2xl font-bold text-amber-300">
                        {users.filter((u) => !u.activo).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barra de Búsqueda y Actualización */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B]">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Buscar por nombre o correo de Google..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07130F] border border-[#1F4A3B] text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-[#CCA046] transition"
                    />
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
                  </div>

                  <button
                    onClick={fetchUsers}
                    disabled={usersLoading}
                    className="px-4 py-2.5 rounded-xl border border-[#1F4A3B] hover:border-[#CCA046] bg-[#07130F] text-emerald-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-[#CCA046] ${usersLoading ? "animate-spin" : ""}`} />
                    <span>Actualizar Lista</span>
                  </button>
                </div>

                {/* Listado de Usuarios */}
                <div className="rounded-3xl border border-[#CCA046]/30 bg-gradient-to-br from-[#0A1B15] to-[#07130F] overflow-hidden shadow-2xl">
                  {usersLoading && users.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="h-8 w-8 border-2 border-[#CCA046] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-emerald-200/60 font-mono">Consultando colección &apos;usuarios&apos; en MongoDB Atlas...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <Users className="h-10 w-10 text-emerald-600 mx-auto" />
                      <p className="text-sm font-semibold text-white">No se encontraron usuarios</p>
                      <p className="text-xs text-emerald-200/60 max-w-sm mx-auto">
                        Cuando un usuario inicie sesión con Google por primera vez, quedará registrado automáticamente aquí en estado desactivado.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1F4A3B]/60">
                      {filteredUsers.map((u) => {
                        const isProcessing = userUpdating === u.email;

                        return (
                          <div
                            key={u.id || u.email}
                            className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#0F2B21]/40 transition"
                          >
                            {/* Información del Usuario */}
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#CCA046]/50 bg-[#07130F] flex-shrink-0 flex items-center justify-center shadow-lg">
                                {u.imagen ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={u.imagen}
                                    alt={u.nombre}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-base font-bold text-[#E5BE6E]">
                                    {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-bold text-white truncate">{u.nombre}</h3>
                                  {u.isSuperAdmin && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#1A3E31] border border-[#CCA046] text-[#E5BE6E] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                                      <Sparkles className="h-3 w-3 text-[#CCA046]" />
                                      Super Administrador
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-emerald-300/80 font-mono truncate">{u.email}</p>
                                <p className="text-[11px] text-emerald-400/50 mt-0.5">
                                  Registrado: {u.creadoEn ? new Date(u.creadoEn).toLocaleDateString("es-CR", { year: "numeric", month: "short", day: "numeric" }) : "Reciente"}
                                </p>
                              </div>
                            </div>

                            {/* Controles de Rol y Activación */}
                            <div className="flex flex-wrap items-center gap-3">
                              {/* Selector de Rol */}
                              <div className="flex items-center gap-1.5">
                                <label className="text-[11px] font-mono text-emerald-300/70 hidden sm:inline">
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
                                  className="px-3 py-2 rounded-xl bg-[#07130F] border border-[#1F4A3B] text-xs font-semibold text-[#E5BE6E] focus:outline-none focus:border-[#CCA046] transition disabled:opacity-60 disabled:cursor-not-allowed capitalize cursor-pointer"
                                >
                                  <option value="visitante">Visitante</option>
                                  <option value="editor">Editor</option>
                                  <option value="administrador">Administrador</option>
                                </select>
                              </div>

                              {/* Estado Actual */}
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    u.activo ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-amber-400 animate-pulse"
                                  }`}
                                />
                                <span className={`text-xs font-semibold ${u.activo ? "text-emerald-300" : "text-amber-300"}`}>
                                  {u.activo ? "Activo" : "Desactivado"}
                                </span>
                              </div>

                              {/* Botón Toggle de Activación */}
                              {!u.isSuperAdmin ? (
                                <button
                                  onClick={() => handleUpdateUser(u.email, { activo: !u.activo })}
                                  disabled={isProcessing}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 ${
                                    u.activo
                                      ? "border border-rose-800/80 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60"
                                      : "border border-emerald-500/80 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30"
                                  }`}
                                >
                                  {isProcessing ? (
                                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : u.activo ? (
                                    <>
                                      <UserX className="h-3.5 w-3.5" />
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-3.5 w-3.5" />
                                      Activar
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-[11px] font-mono text-emerald-400/60 italic px-2">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">
                      Expedientes Registrados bajo Secreto Fiduciario
                    </h2>
                    <p className="text-xs text-emerald-200/60 mt-0.5">
                      Los datos sensibles (cédula, teléfono, relato) están cifrados en reposo con AES-256-GCM.
                    </p>
                  </div>

                  <button
                    onClick={fetchCases}
                    disabled={casesLoading}
                    className="px-4 py-2 rounded-xl border border-[#1F4A3B] hover:border-[#CCA046] bg-[#0A1B15] text-xs text-emerald-200 flex items-center gap-2 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-[#CCA046] ${casesLoading ? "animate-spin" : ""}`} />
                    <span>Actualizar</span>
                  </button>
                </div>

                {casesLoading && cases.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="h-8 w-8 border-2 border-[#CCA046] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-emerald-200/60 font-mono">Recuperando expedientes...</p>
                  </div>
                ) : cases.length === 0 ? (
                  <div className="py-20 text-center space-y-3 rounded-2xl bg-[#0A1B15] border border-[#1F4A3B]">
                    <FileText className="h-10 w-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-semibold text-white">No hay expedientes registrados aún</p>
                    <p className="text-xs text-emerald-200/60">
                      Cuando un cliente envíe una consulta desde el formulario web, aparecerá aquí.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl border border-[#CCA046]/30 bg-gradient-to-br from-[#0A1B15] to-[#07130F] shadow-lg space-y-4 hover:border-[#CCA046]/60 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-[#CCA046] uppercase tracking-wider">
                              FOLIO: {c.id.slice(-8).toUpperCase()}
                            </span>
                            <h3 className="text-base font-bold text-white mt-0.5">{c.fullName}</h3>
                            <p className="text-xs text-emerald-300/80 font-mono">{c.email}</p>
                          </div>

                          <span className="px-2.5 py-1 rounded-full bg-[#0F2B21] border border-[#10B981]/30 text-[10px] font-mono text-emerald-300">
                            {c.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1F4A3B]/60 text-xs text-emerald-200/60">
                          <span className="capitalize">
                            {c.legalArea.replace(/_/g, " ")}
                          </span>
                          <span>
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-CR") : ""}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-[#07130F] border border-[#1F4A3B] text-[11px] text-[#CCA046] font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="RECIBIDO_ENCRIPTADO">Recibido (Encriptado)</option>
                            <option value="EN_REVISION_LETRADA">En Revisión Letrada</option>
                            <option value="DICTAMEN_CONCLUIDO">Dictamen Concluido</option>
                            <option value="EXPEDIENTE_ARCHIVADO">Archivado</option>
                          </select>

                          <button
                            onClick={() => handleDecrypt(c.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            <Eye className="h-3.5 w-3.5" />
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
              className="w-full max-w-2xl rounded-3xl border border-[#CCA046] bg-[#0A1B15] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F4A3B]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                    <FolderLock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Expediente Cifrado Descifrado</h3>
                    <p className="text-[11px] font-mono text-[#CCA046]">
                      FOLIO: {selectedCase.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCase(null)}
                  className="h-8 w-8 rounded-lg bg-[#07130F] border border-[#1F4A3B] text-emerald-400 hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                  <p className="text-[10px] text-emerald-400/60 uppercase font-mono">Nombre Completo</p>
                  <p className="font-semibold text-white mt-0.5">{selectedCase.fullName}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                  <p className="text-[10px] text-emerald-400/60 uppercase font-mono">Correo de Contacto</p>
                  <p className="font-semibold text-white mt-0.5">{selectedCase.email}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                  <p className="text-[10px] text-[#CCA046] uppercase font-mono">Cédula (Descifrada AES-256)</p>
                  <p className="font-semibold text-white mt-0.5 font-mono">{selectedCase.nationalId}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                  <p className="text-[10px] text-[#CCA046] uppercase font-mono">Teléfono (Descifrado AES-256)</p>
                  <p className="font-semibold text-white mt-0.5 font-mono">{selectedCase.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07130F] border border-[#1F4A3B] space-y-1.5">
                <p className="text-[10px] text-[#CCA046] uppercase font-mono">
                  Relato Confidencial de Hechos (Descifrado)
                </p>
                <p className="text-xs text-emerald-100/90 whitespace-pre-wrap leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F2B21] hover:bg-[#14352A] border border-[#CCA046]/40 text-[#E5BE6E] text-xs font-semibold"
                >
                  Cerrar Bóveda de Expediente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-emerald-400/40 border-t border-[#1F4A3B]/40">
        Valverde & Asociados – Consultorio Jurídico y Notarial. Ciudad Quesada, Costa Rica.
      </footer>
    </div>
  );
}
