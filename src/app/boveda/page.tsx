"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
  Building,
} from "lucide-react";

interface FolioResult {
  folio: string;
  clientMasked: string;
  legalArea: string;
  status: string;
  receivedAt: string;
  securityProtocol: string;
}

export default function BovedaPage() {
  const [folio, setFolio] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<FolioResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folio.trim()) return;

    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch(`/api/cases/status?folio=${encodeURIComponent(folio.trim())}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setStatus("success");
        setResult(json.data);
      } else {
        setStatus("error");
        setErrorMsg(json.error || "Folio no localizado en los registros fiduciarios.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión al servidor de custodia.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07130F] text-[#F0FDF4] selection:bg-[#CCA046]/40 selection:text-[#FFF9EB]">
      {/* Header */}
      <header className="border-b border-[#1F4A3B]/60 bg-[#07130F]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCA046]">CONSULTORIO JURÍDICO</p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-emerald-200/70 hover:text-[#CCA046] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la portada
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto py-16 px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#CCA046]/40 bg-[#0A1B15] text-[#E5BE6E] text-xs font-mono">
            <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
            SISTEMA DE VERIFICACIÓN DE EXPEDIENTES
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Verificación Criptográfica de Consulta
          </h1>
          <p className="text-emerald-200/70 text-sm max-w-lg mx-auto">
            Consulte el estado procesal y la integridad de su solicitud confidencial mediante su número de folio asignado.
          </p>
        </div>

        {/* Formulario de Consulta de Folio */}
        <div className="p-8 sm:p-10 rounded-3xl border border-[#CCA046]/40 bg-gradient-to-br from-[#0A1B15] to-[#07130F] shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-2">
                Identificador de Folio (ID de Bóveda)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="Ej. 67cd5bf5f7a9d01234567890"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#07130F] border border-[#1F4A3B] text-sm font-mono text-white placeholder-emerald-800 focus:outline-none focus:border-[#CCA046] transition"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-700" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] hover:from-[#DFB55D] hover:to-[#F5E7C8] text-[#07130F] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#CCA046]/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <span className="h-4 w-4 border-2 border-[#07130F] border-t-transparent rounded-full animate-spin" />
                  Verificando firma de bóveda...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  VERIFICAR ESTADO EN BÓVEDA
                </>
              )}
            </button>
          </form>

          {/* Mensajes de Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-3"
              >
                <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultado de Verificación */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 pt-6 border-t border-[#1F4A3B] space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F4A3B]">
                  <span className="text-xs font-mono uppercase text-[#CCA046]">Folio Confirmado</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-[#0F2B21] border border-emerald-500/40 px-3 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Autenticado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                    <span className="text-emerald-200/60 block mb-1">Titular Registrado</span>
                    <span className="font-semibold text-white">{result.clientMasked}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                    <span className="text-emerald-200/60 block mb-1">Área Especializada</span>
                    <span className="font-semibold text-white capitalize">
                      {result.legalArea.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                    <span className="text-emerald-200/60 block mb-1">Estado de Custodia</span>
                    <span className="font-mono text-[#E5BE6E] font-semibold">{result.status}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07130F] border border-[#1F4A3B]">
                    <span className="text-emerald-200/60 block mb-1">Protocolo Aplicado</span>
                    <span className="font-mono text-emerald-300">{result.securityProtocol}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0F2B21]/60 border border-[#CCA046]/40 text-xs text-emerald-200/90 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#CCA046] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Este registro cuenta con verificación de integridad de datos. Los campos confidenciales se encuentran bajo llave criptográfica y solo pueden ser descifrados por los letrados de Valverde & Asociados.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

