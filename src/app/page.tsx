"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Fingerprint,
  ScrollText,
  BadgeCheck,
  PhoneCall,
  Mail,
  MapPin,
  Menu,
  X,
  FileText,
  Users,
  Car,
  Home as HomeIcon,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    legalArea: "derecho_familia_divorcios",
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
          legalArea: "derecho_familia_divorcios",
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

  const familiaServices = [
    "Adopción de mayor edad.",
    "Divorcio Judicial, en los que existan menores y bienes.",
    "Pensión Alimentaria.",
    "Guarda crianza y educación.",
    "Régimen de visitas.",
    "Cambio del orden del apellido.",
    "Permisos de salida de menores de edad.",
    "Matrimonios civiles.",
  ];

  const notarialServices = [
    "Traspasos de vehículos y propiedades.",
    "Declaraciones juradas.",
    "Sucesorios judiciales y notariales.",
    "Testamentos.",
    "Segregaciones.",
    "Inscripción de servidumbre.",
    "Registros de Marcas de Ganado.",
  ];

  return (
    <div className="min-h-screen bg-[#0E151A] text-[#EAEFF2] selection:bg-[#CCA046]/30 selection:text-[#F5E7C8]">
      {/* Top Banner de Seguridad y Atención Rápida */}
      <div className="border-b border-[#2B3840]/60 bg-[#141C22]/90 backdrop-blur-md px-4 py-2.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
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
            <a
              href="https://wa.me/50672188963"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-sans font-medium"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: 7218 8963
            </a>
            <a
              href="tel:87578891"
              className="hidden sm:flex items-center gap-1.5 text-[#CCA046] hover:text-[#DFB55D] transition font-sans font-medium"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Tel: 8757 88 91
            </a>
          </div>
        </div>
      </div>

      {/* Header Institucional con Logo */}
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
            <a href="#servicios" className="hover:text-[#CCA046] transition">Nuestros servicios</a>
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
                  href="#servicios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-slate-200 hover:text-[#CCA046] border-b border-[#2B3840]/40 transition"
                >
                  Nuestros servicios
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(204,160,70,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#CCA046]/40 bg-[#141C22] text-[#CCA046] text-xs font-medium mb-8 shadow-sm"
          >
            <BadgeCheck className="h-3.5 w-3.5 text-[#CCA046]" />
            Consultorio Jurídico en Ciudad Quesada & Bóveda Digital Cifrada
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
            En <strong className="text-white font-medium">Valverde & Asociados</strong> brindamos asesoría legal y notarial especializada en derecho de familia, trámites de propiedades, traspasos, sucesiones y gestiones judiciales con total garantía fiduciaria.
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
              href="https://wa.me/50672188963"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-md border border-emerald-600/60 hover:border-emerald-500 bg-emerald-950/40 text-emerald-300 font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp Directo
            </a>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN: NUESTROS SERVICIOS */}
      <section id="servicios" className="py-24 px-6 border-t border-[#2B3840]/60 bg-[#0E151A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CCA046] font-semibold font-mono">
              CONSULTORIO JURÍDICO
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-2">
              Nuestros servicios
            </h2>
            <p className="text-xl font-serif text-[#CCA046] mt-1 font-medium">
              Valverde & Asociados
            </p>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed font-light">
              Soluciones integrales en materia judicial, familiar, civil y notarial con el más alto rigor profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna 1: Derecho de Familia y Civil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 sm:p-10 rounded-2xl border border-[#2B3840] bg-[#141C22]/80 hover:border-[#CCA046]/60 transition shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-[#2B3840]">
                <div className="h-12 w-12 rounded-xl bg-[#2B3840]/60 border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Derecho de Familia & Civil
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">PROCESOS JUDICIALES Y EXTRAJUDICIALES</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3.5">
                {familiaServices.map((service, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#CCA046] mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Columna 2: Derecho Notarial, Bienes y Registral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 sm:p-10 rounded-2xl border border-[#2B3840] bg-[#141C22]/80 hover:border-[#CCA046]/60 transition shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-[#2B3840]">
                <div className="h-12 w-12 rounded-xl bg-[#2B3840]/60 border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                  <ScrollText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Derecho Notarial & Registral
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">BIENES, PROPIEDADES Y REGISTROS</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3.5">
                {notarialServices.map((service, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#CCA046] mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Tarjeta de Contacto Directo */}
          <div className="mt-12 p-6 rounded-xl border border-[#CCA046]/30 bg-gradient-to-r from-[#141C22] to-[#1A242B] flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#CCA046]/10 border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-white font-serif font-bold text-base">Ubicación del Consultorio</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ciudad Quesada frente a la casa parroquial, altos de Decoqueques
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/50672188963"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: 7218 8963
              </a>
              <a
                href="tel:87578891"
                className="px-5 py-2.5 rounded-md border border-[#CCA046] text-[#CCA046] hover:bg-[#CCA046] hover:text-[#0E151A] font-semibold text-xs flex items-center gap-2 transition"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar: 8757 88 91
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Protocolo de Confidencialidad y Bóveda Segura */}
      <section id="seguridad" className="py-24 px-6 border-t border-[#2B3840]/60 bg-[#12191F]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#CCA046] font-semibold">
              SECRETO PROFESIONAL & TECNOLOGÍA
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              ¿Por qué sus datos sensibles están 100% blindados con Valverde & Asociados?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              Los asuntos de familia, traspasos, pensiones alimentarias y sucesiones requieren máxima reserva. Para proteger su privacidad frente a terceros, nuestra plataforma aplica criptografía militar:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Cifrado de Campo en Reposo (AES-256-GCM)</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Cédulas, teléfonos y los detalles confidenciales de su situación familiar o notarial se almacenan cifrados en base de datos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Validación Estricta con Esquemas Zod</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Filtrado estricto contra inyecciones y validación rigurosa de entradas en cada Web Service.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-[#141C22] border border-[#2B3840]">
                <div className="h-8 w-8 rounded-md bg-[#CCA046]/10 border border-[#CCA046]/30 flex-shrink-0 flex items-center justify-center text-[#CCA046]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Acceso Restringido a Abogados Apoderados</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Únicamente el equipo legal a cargo del caso puede solicitar el descifrado seguro de los expedientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Consulta Bóveda */}
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
                    Nombre Completo o Razón Social
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. María Elena Valverde / Agropecuaria del Norte S.A."
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
                      placeholder="contacto@correo.com"
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
                      placeholder="8757 88 91 / 7218 8963"
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cédula / Identificación (Dato Cifrado)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder="Cédula nacional / DIMEX / Pasaporte"
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#CCA046] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Servicio Solicitado
                    </label>
                    <select
                      value={formData.legalArea}
                      onChange={(e) => setFormData({ ...formData, legalArea: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-md bg-[#0E151A] border border-[#2B3840] text-sm text-slate-100 focus:outline-none focus:border-[#CCA046] transition"
                    >
                      <option value="derecho_familia_divorcios">Divorcio Judicial (Menores y Bienes)</option>
                      <option value="pension_alimentaria_menores">Pensión Alimentaria / Guarda / Visitas</option>
                      <option value="traspasos_vehiculos_propiedades">Traspasos de Vehículos y Propiedades</option>
                      <option value="procesos_sucesorios_testamentos">Sucesorios Judiciales, Notariales & Testamentos</option>
                      <option value="declaraciones_juradas_notarial">Declaraciones Juradas & Trámites Notariales</option>
                      <option value="segregaciones_servidumbres">Segregaciones & Inscripción de Servidumbre</option>
                      <option value="registro_marcas_ganado">Registros de Marcas de Ganado</option>
                      <option value="matrimonios_civiles">Matrimonios Civiles & Adopción Mayor Edad</option>
                      <option value="otros_tramites_juridicos">Otros Trámites Jurídicos</option>
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
                    placeholder="Indique los antecedentes de su trámite. Esta información se cifra de inmediato con AES-256 antes de guardarse."
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
                    Acepto el tratamiento fiduciario de mis datos amparado por el secreto profesional legal con <strong>Valverde & Asociados</strong>.
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

      {/* Footer Institucional con Datos de Contacto Exactos */}
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
              Consultorio Jurídico especializado en derecho de familia, trámites notariales, bienes y procesos civiles con total reserva y resguardo fiduciario.
            </p>
            <div className="space-y-1.5 pt-2 text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#CCA046] flex-shrink-0" />
                Ciudad Quesada frente a la casa parroquial, altos de Decoqueques
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-[#CCA046] flex-shrink-0" />
                8757 88 91 / WhatsApp: 7218 8963
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-white font-serif font-bold text-sm mb-3">Nuestros servicios</h5>
            <ul className="space-y-2 text-slate-400">
              <li>Adopción de mayor edad & Matrimonios</li>
              <li>Divorcios, Menores y Bienes</li>
              <li>Pensión Alimentaria & Régimen de Visitas</li>
              <li>Traspasos de Vehículos y Propiedades</li>
              <li>Sucesorios Judiciales y Notariales</li>
              <li>Testamentos & Declaraciones Juradas</li>
              <li>Segregaciones & Marcas de Ganado</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-serif font-bold text-sm mb-3">Redes & Contacto</h5>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#CCA046] transition flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Facebook: Consultorio Jurídico Valverde
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#CCA046] transition flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-pink-500" />
                  Instagram: Consultorio_ Jurídico Valverde
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/50672188963"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-semibold"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Contactar por WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2B3840]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Valverde & Asociados – Consultorio Jurídico. Ciudad Quesada, Costa Rica.
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

      {/* Botón Flotante de WhatsApp para Atención Inmediata */}
      <a
        href="https://wa.me/50672188963"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Valverde & Asociados"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition transform hover:scale-110 active:scale-95 group"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="h-7 w-7" />
        <span className="absolute right-16 bg-[#141C22] text-[#CCA046] border border-[#CCA046]/40 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl">
          Escribir por WhatsApp: 7218 8963
        </span>
      </a>
    </div>
  );
}
