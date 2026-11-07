"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Scale,
  Building2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Fingerprint,
  Gavel,
  ScrollText,
  BadgeCheck,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    legalArea: "derecho_corporativo",
    description: "",
    consentAccepted: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [caseRef, setCaseRef] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback(null);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFeedback(data.message);
        setCaseRef(data.caseRef);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          nationalId: "",
          legalArea: "derecho_corporativo",
          description: "",
          consentAccepted: false,
        });
      } else {
        setStatus("error");
        setFeedback(data.error || "No fue posible registrar la consulta confidencial.");
      }
    } catch {
      setStatus("error");
      setFeedback("Fallo de conexión al servicio seguro.");
    }
  };

  const areas = [
    {
      id: "corporativo",
      title: "Derecho Corporativo y M&A",
      desc: "Reorganizaciones empresariales, acuerdos fiduciarios y asesoramiento societario de alta confidencialidad.",
      icon: Building2,
    },
    {
      id: "litigios",
      title: "Litigios Civiles & Comerciales",
      desc: "Estrategias procesales de alta precisión en tribunales arbitrales, cortes superiores y resolución de controversias.",
      icon: Scale,
    },
    {
      id: "penal",
      title: "Defensa Penal Económica",
      desc: "Protección judicial en delitos socioeconómicos, responsabilidad penal de directivos y compliance sancionatorio.",
      icon: Gavel,
    },
    {
      id: "constitucional",
      title: "Casación & Amparo Constitucional",
      desc: "Defensa de garantías fundamentales y recursos extraordinarios ante tribunales supremos y cortes constitucionales.",
      icon: ScrollText,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E151A] text-[#EAEFF2] selection:bg-[#CCA046]/30 selection:text-[#F5E7C8]">
      {/* Top Banner de Seguridad Criptográfica */}
      <div className="border-b border-[#2B3840]/60 bg-[#141C22]/90 backdrop-blur-md px-4 py-2.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCA046] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCA046]"></span>
            </span>
            <span className="text-[#CCA046] font-semibold tracking-wider uppercase text-[11px]">
              CANAL DE COMUNICACIÓN CIFRADO
            </span>
            <span className="hidden lg:inline text-slate-400">| Protocolo AES-256-GCM / Secreto Profesional Garantizado</span>
          </div>
          <div className="flex items-center gap-5 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#CCA046]" />
              Conexión TLS 1.3
            </span>
            <span className="hidden sm:inline text-slate-400">Confidencialidad Jurídica Absoluta</span>
          </div>
        </div>
      </div>

      {/* Header Institucional con el Logo */}
      <header className="border-b border-[#2B3840]/60 bg-[#0E151A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="relative h-14 w-14 rounded-full p-1 bg-[#1A242B] border border-[#CCA046]/40 shadow-lg shadow-[#CCA046]/10 flex items-center justify-center overflow-hidden transition group-hover:border-[#CCA046]">
              <Image
                src="/logo.png"
                alt="Logo Valverde & Asociados"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#F5E7C8] transition">
                Valverde & Asociados
              </span>
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#CCA046]">
                CONSULTORIO JURÍDICO
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#areas" className="hover:text-[#CCA046] transition">Áreas del Consultorio</a>
            <a href="#seguridad" className="hover:text-[#CCA046] transition">Protocolo de Confidencialidad</a>
            <Link href="/boveda" className="hover:text-[#CCA046] transition flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
              Verificar Folio
            </Link>
          </nav>

          <a
            href="#consulta"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#CCA046] hover:bg-[#DFB55D] text-[#0E151A] text-xs font-bold tracking-wider uppercase transition shadow-md shadow-[#CCA046]/20 active:scale-95"
          >
            <Lock className="h-3.5 w-3.5" />
            CONSULTA CONFIDENCIAL
          </a>

          {/* Botón de Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg border border-[#2B3840] bg-[#141C22] text-[#CCA046] hover:border-[#CCA046] transition focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú Desplegable Móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#2B3840]/60 bg-[#0E151A] px-6 py-6 space-y-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-3 text-sm">
                <a
                  href="#areas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-slate-200 hover:text-[#CCA046] border-b border-[#2B3840]/40 transition"
                >
                  Áreas de Práctica
                </a>
                <a
                  href="#seguridad"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-slate-200 hover:text-[#CCA046] border-b border-[#2B3840]/40 transition"
                >
                  Protocolo de Confidencialidad
                </a>
                <Link
                  href="/boveda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-slate-200 hover:text-[#CCA046] border-b border-[#2B3840]/40 flex items-center gap-2 transition"
                >
                  <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
                  Verificar Folio Cifrado
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-[#CCA046] hover:text-[#DFB55D] flex items-center gap-2 transition"
                >
                  <Lock className="h-4 w-4" />
                  Acceso Letrados / Socios
                </Link>
              </nav>

              <div className="pt-2">
                <a
                  href="#consulta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-md bg-[#CCA046] hover:bg-[#DFB55D] text-[#0E151A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#CCA046]/20 transition"
                >
                  <Lock className="h-3.5 w-3.5" />
                  CONSULTA CONFIDENCIAL
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-6">
        {/* Glow dorado y pizarra detrás del hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(204,160,70,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#CCA046]/40 bg-[#141C22] text-[#CCA046] text-xs font-medium mb-8 shadow-sm"
          >
            <BadgeCheck className="h-3.5 w-3.5 text-[#CCA046]" />
            Defensa Estratégica & Bóveda de Secreto Profesional
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
          >
            Excelencia jurídica y defensa rigurosa. <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#CCA046] via-[#F5E7C8] to-[#CCA046]">
              Absoluta reserva en cada caso.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            En <strong className="text-white font-medium">Valverde & Asociados</strong> representamos a empresas, directivos y personas naturales ante los litigios más complejos, garantizando que su información y antecedentes permanezcan protegidos bajo los más rigurosos estándares de seguridad y deber fiduciario.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#consulta"
              className="px-7 py-3.5 rounded-md bg-[#CCA046] hover:bg-[#DFB55D] text-[#0E151A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#CCA046]/20 transition active:scale-95"
            >
              Iniciar Consulta Cifrada
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#seguridad"
              className="px-7 py-3.5 rounded-md border border-[#2B3840] hover:border-[#CCA046]/60 bg-[#141C22]/90 text-slate-200 font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              <KeyRound className="h-4 w-4 text-[#CCA046]" />
              Conocer Protocolo de Seguridad
            </a>
          </motion.div>
        </div>
      </section>

      {/* Áreas de Especialidad del Consultorio */}
      <section id="areas" className="py-24 px-6 border-t border-[#2B3840]/60 bg-[#0E151A]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CCA046] font-semibold font-mono">
              Especialidades Procesales
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3">
              Áreas de Práctica del Consultorio Jurídico
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Atención jurídica integral respaldada por un equipo de litigantes de amplia trayectoria judicial y arbitral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areas.map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-xl border border-[#2B3840] bg-[#141C22]/60 hover:border-[#CCA046]/60 hover:bg-[#1A242B]/80 transition group relative"
                >
                  <div className="h-12 w-12 rounded-lg bg-[#2B3840]/50 border border-[#CCA046]/30 flex items-center justify-center text-[#CCA046] mb-6 group-hover:scale-105 group-hover:border-[#CCA046] transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#F5E7C8] transition">
                    {area.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {area.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protocolo de Confidencialidad y Bóveda Segura */}
      <section id="seguridad" className="py-24 px-6 border-t border-[#2B3840]/60 bg-[#12191F]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Información Institucional */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#CCA046] font-semibold">
              SECRETO PROFESIONAL & TECNOLOGÍA
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              ¿Por qué sus datos sensibles están 100% blindados con Valverde & Asociados?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              La confianza fiduciaria es la piedra angular de nuestro despacho. Para garantizar que ningún detalle de su situación jurídica quede expuesto a filtraciones o accesos no autorizados, hemos implementado una infraestructura criptográfica avanzada:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Cifrado de Campo en Reposo (AES-256-GCM)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Identificaciones, teléfonos y detalles del caso son transformados en texto cifrado con vector de inicialización único antes de guardarse en la base de datos MongoDB.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Validación Estricta y Sanitización Zod</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Protección estricta contra inyecciones NoSQL, bloqueo de scripts maliciosos y aislamiento de memoria en ejecución serverless.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Acceso Restringido mediante Token Judicial</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Solo los letrados apoderados de la causa disponen de llaves de descifrado autorizadas para acceder al expediente del cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Bóveda de Consulta Cifrada */}
          <div id="consulta" className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl border border-[#CCA046]/40 bg-[#141C22] shadow-2xl relative">
              <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#2B3840] gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#CCA046]/10 border border-[#CCA046]/30 flex items-center justify-center text-[#CCA046]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Bóveda de Consulta Jurídica
                    </h3>
                    <p className="text-xs text-slate-400">Canal directo al equipo legal bajo cifrado de grado militar</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2B3840]/60 border border-[#2B3840] text-[11px] font-mono text-[#CCA046]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AES-256-GCM
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nombre Completo o Denominación Social
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Dr. Carlos Valverde / Inversiones Valverde S.A."
                    className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Correo Electrónico de Contacto
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Teléfono Móvil Confidencial
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 9 11 4000-0000"
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Identificación / Cédula (Dato Sensible Cifrado)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder="DNI / CUIT / Pasaporte"
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Materia Jurídica del Caso
                    </label>
                    <select
                      value={formData.legalArea}
                      onChange={(e) => setFormData({ ...formData, legalArea: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 focus:outline-none focus:border-[#CCA046] transition"
                    >
                      <option value="derecho_corporativo">Derecho Corporativo & Societario</option>
                      <option value="litigios_civiles">Litigios Civiles & Comerciales</option>
                      <option value="defensa_penal">Defensa Penal Económica</option>
                      <option value="derecho_laboral">Derecho Laboral Ejecutivo</option>
                      <option value="propiedad_intelectual">Propiedad Intelectual & Marcas</option>
                      <option value="compliance_tributario">Compliance Tributario</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Descripción Confidencial de los Hechos (Cifrado Punto a Punto)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Exponga los antecedentes de su consulta. Este texto se procesa con clave criptográfica y nunca se almacena en texto legible."
                    className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consentAccepted}
                    onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded bg-[#0E151A] border-[#2B3840] text-[#CCA046] focus:ring-0"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
                    Acepto el tratamiento de mis datos personales bajo el amparo de la legislación de secreto profesional y confidencialidad fiduciaria con <strong>Valverde & Asociados</strong>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !formData.consentAccepted}
                  className="w-full mt-4 py-3.5 rounded-md bg-[#CCA046] hover:bg-[#DFB55D] text-[#0E151A] font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-[#CCA046]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 border-2 border-[#0E151A] border-t-transparent rounded-full animate-spin" />
                      Cifrando y registrando en bóveda...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      ENVIAR CONSULTA CONFIDENCIAL CIFRADA
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mt-4 p-4 rounded-lg text-xs flex items-start gap-3 ${
                        status === "success"
                          ? "bg-emerald-950/60 border border-emerald-700 text-emerald-200"
                          : "bg-rose-950/60 border border-rose-700 text-rose-200"
                      }`}
                    >
                      {status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{feedback}</p>
                        {caseRef && (
                          <div className="mt-1 space-y-1">
                            <p className="font-mono text-[11px] text-emerald-400">
                              Número de Folio en Bóveda: {caseRef}
                            </p>
                            <Link
                              href="/boveda"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#CCA046] hover:text-[#DFB55D] underline"
                            >
                              Verificar estado del folio en la Bóveda &rarr;
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Institucional con Logo Oficial */}
      <footer className="border-t border-[#2B3840]/60 bg-[#0A0F13] py-16 px-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 rounded-full p-1 bg-[#1A242B] border border-[#CCA046]/40 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Valverde & Asociados Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-white">Valverde & Asociados</span>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCA046]">CONSULTORIO JURÍDICO</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed font-light">
              Firma legal dedicada a la asesoría de alta dirección, resolución de disputas complejas y litigios estratégicos, con garantía de secreto profesional y custodia digital blindada.
            </p>
          </div>

          <div>
            <h5 className="text-white font-serif font-bold text-sm mb-3">Consultorio Jurídico</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#areas" className="hover:text-[#CCA046] transition">Derecho Corporativo</a></li>
              <li><a href="#areas" className="hover:text-[#CCA046] transition">Litigios Civiles & Arbitraje</a></li>
              <li><a href="#areas" className="hover:text-[#CCA046] transition">Defensa Penal Económica</a></li>
              <li><a href="#areas" className="hover:text-[#CCA046] transition">Casación Constitucional</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-serif font-bold text-sm mb-3">Canal Confidencial</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
                Cifrado AES-256-GCM Activo
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#CCA046]" />
                Custodia de Datos Fiduciarios
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#CCA046]" />
                Atención Preferencial 24/7
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2B3840]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Valverde & Asociados – Consultorio Jurídico. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-[#CCA046] transition">Políticas de Privacidad</a>
            <a href="#" className="hover:text-[#CCA046] transition">Secreto Profesional</a>
            <Link href="/admin" className="hover:text-[#CCA046] transition flex items-center gap-1 text-[#CCA046]">
              <Lock className="h-3 w-3" />
              Acceso Letrados
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
