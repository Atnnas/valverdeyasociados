"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";

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
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DecryptedCaseDetails | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/cases", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setCases(data.cases || []);
      } else {
        setAuthError(data.error || "Clave judicial no autorizada.");
      }
    } catch {
      setAuthError("Error de conexión al servidor judicial.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/cases", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCases(data.cases || []);
      }
    } catch {
      console.error("Error refreshing cases");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async (id: string) => {
    setIsDecrypting(true);
    setDecryptError("");
    setSelectedCase(null);

    try {
      const res = await fetch(`/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/cases", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
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

  return (
    <div className="min-h-screen bg-[#0E151A] text-[#EAEFF2] selection:bg-[#CCA046]/30 selection:text-[#F5E7C8]">
      {/* Top Bar */}
      <header className="border-b border-[#2B3840]/60 bg-[#141C22]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full p-1 bg-[#1A242B] border border-[#CCA046]/40 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Valverde & Asociados Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-white">Valverde & Asociados</span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCA046]">PANEL DE LETRADOS</p>
            </div>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-4 text-xs">
              <span className="hidden sm:inline font-mono text-[#CCA046] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                SESIÓN JUDICIAL ACTIVA
              </span>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setApiKey("");
                  setSelectedCase(null);
                }}
                className="px-3.5 py-1.5 rounded border border-[#2B3840] hover:border-rose-800 hover:bg-rose-950/40 text-rose-300 transition flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {!isAuthenticated ? (
          // Vista de Autenticación Judicial
          <div className="max-w-md mx-auto my-12">
            <div className="text-center mb-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#1A242B] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046] mb-4 shadow-xl">
                <FolderLock className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-white">
                Bóveda de Expedientes y Consultas
              </h1>
              <p className="text-slate-400 text-xs mt-2">
                Acceso restringido a abogados y socios de Valverde & Asociados amparados bajo secreto fiduciario.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-[#CCA046]/30 bg-[#141C22] shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Clave de Acceso Judicial / API Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Ingrese el token de seguridad de la firma"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#CCA046] transition font-mono"
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Clave de desarrollo por defecto: <code className="text-[#CCA046]">valverde_admin_key_2026</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-[#CCA046] hover:bg-[#DFB55D] text-[#0E151A] font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-[#CCA046]/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-[#0E151A] border-t-transparent rounded-full animate-spin" />
                      Verificando credenciales...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      AUTORIZAR ENTRADA A BÓVEDA
                    </>
                  )}
                </button>
              </form>

              {authError && (
                <div className="mt-4 p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Vista del Panel de Expedientes
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2B3840]">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white">
                  Expedientes y Consultas en Custodia
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Listado cronológico de antecedentes recibidos con cifrado de grado militar.
                </p>
              </div>

              <button
                onClick={fetchCases}
                disabled={isLoading}
                className="px-4 py-2 rounded border border-[#2B3840] hover:border-[#CCA046] bg-[#141C22] text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#CCA046] ${isLoading ? "animate-spin" : ""}`} />
                Actualizar Registros
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Tabla de Expedientes (Columna Izquierda) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Expedientes detectados: <strong className="text-white">{cases.length}</strong></span>
                  <span className="font-mono text-[#CCA046]">Cifrado Activo: AES-256-GCM</span>
                </div>

                {cases.length === 0 ? (
                  <div className="p-12 text-center rounded-xl border border-dashed border-[#2B3840] bg-[#141C22]/50">
                    <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-300 font-medium">No hay consultas registradas aún</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Las consultas enviadas a través del formulario principal aparecerán aquí protegidas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleDecrypt(c.id)}
                        className={`p-5 rounded-xl border transition cursor-pointer ${
                          selectedCase?.id === c.id
                            ? "border-[#CCA046] bg-[#1A242B]"
                            : "border-[#2B3840] bg-[#141C22] hover:border-[#CCA046]/50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-slate-400">
                            Folio: <strong className="text-[#CCA046]">{c.id.slice(-8)}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2B3840] text-slate-200 uppercase">
                            {c.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-serif font-bold text-white">{c.fullName}</h4>
                            <p className="text-xs text-slate-400 mt-0.5 capitalize">
                              {c.legalArea.replace("_", " ")} | {c.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[#CCA046] flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              Ver Detalle
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visor de Expediente Descifrado (Columna Derecha) */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-xl border border-[#CCA046]/40 bg-[#141C22] sticky top-28 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2B3840]">
                    <div className="flex items-center gap-2 text-sm font-serif font-bold text-white">
                      <Fingerprint className="h-5 w-5 text-[#CCA046]" />
                      Detalle del Expediente Fiduciario
                    </div>
                    {selectedCase && (
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                        DESCIFRADO OK
                      </span>
                    )}
                  </div>

                  {isDecrypting ? (
                    <div className="py-16 text-center space-y-3">
                      <span className="h-8 w-8 border-2 border-[#CCA046] border-t-transparent rounded-full animate-spin inline-block" />
                      <p className="text-xs text-slate-400 font-mono">
                        Validando vector IV y autenticando firma GCM...
                      </p>
                    </div>
                  ) : decryptError ? (
                    <div className="py-12 text-center text-xs text-rose-300">
                      <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                      <p>{decryptError}</p>
                    </div>
                  ) : selectedCase ? (
                    <div className="mt-5 space-y-4 text-xs">
                      <div className="p-3 rounded bg-[#0E151A] border border-[#2B3840]">
                        <span className="text-slate-500 block mb-1">Folio Completo de Bóveda</span>
                        <span className="font-mono text-white text-[11px] select-all">
                          {selectedCase.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded bg-[#0E151A] border border-[#2B3840]">
                          <span className="text-slate-500 block mb-1">Identificación / DNI</span>
                          <span className="font-semibold text-emerald-300 font-mono">
                            {selectedCase.nationalId}
                          </span>
                        </div>
                        <div className="p-3 rounded bg-[#0E151A] border border-[#2B3840]">
                          <span className="text-slate-500 block mb-1">Teléfono Directo</span>
                          <span className="font-semibold text-white font-mono">
                            {selectedCase.phone}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded bg-[#0E151A] border border-[#2B3840]">
                        <span className="text-slate-500 block mb-1">Materia Legal</span>
                        <span className="font-semibold text-white capitalize">
                          {selectedCase.legalArea.replace("_", " ")}
                        </span>
                      </div>

                      <div className="p-3.5 rounded bg-[#0E151A] border border-[#2B3840]">
                        <span className="text-slate-500 block mb-1.5 font-semibold">
                          Descripción Confidencial de los Hechos:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                          {selectedCase.description}
                        </p>
                      </div>

                      <div className="pt-2">
                        <label className="block text-slate-400 text-xs mb-1.5 font-medium">
                          Actualizar Estado Procesal:
                        </label>
                        <select
                          value={selectedCase.status}
                          onChange={(e) => handleStatusChange(selectedCase.id, e.target.value)}
                          className="w-full px-3 py-2 rounded bg-[#0E151A] border border-[#2B3840] text-xs text-white focus:outline-none focus:border-[#CCA046]"
                        >
                          <option value="RECIBIDO_ENCRIPTADO">RECIBIDO ENCRIPTADO</option>
                          <option value="EN_ANALISIS_JURIDICO">EN ANÁLISIS JURÍDICO</option>
                          <option value="CITA_CONCERTADA">CITA CONCERTADA</option>
                          <option value="AUDIENCIA_PROGRAMADA">AUDIENCIA PROGRAMADA</option>
                          <option value="EXPEDIENTE_ARCHIVADO">EXPEDIENTE ARCHIVADO</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-500">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Seleccione un expediente de la lista para descifrar sus datos.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

