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
  MessageCircle,
  Sparkles,
  ChevronRight,
  Clock,
  HeartHandshake,
  Compass,
  FileCheck,
  Stamp,
  ExternalLink,
} from "lucide-react";
import UserNavButton from "@/components/auth/UserNavButton";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"familia" | "notarial" | "sucesiones" | "especiales">("familia");
  const [selectedGuide, setSelectedGuide] = useState<string>("divorcio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectService = (serviceName: string) => {
    const text = encodeURIComponent(`Hola, quisiera consultar con Valverde & Asociados sobre el trámite de: ${serviceName}`);
    window.open(`https://wa.me/50672188963?text=${text}`, "_blank");
  };

  const serviceCategories = {
    familia: {
      label: "Familia & Pareja",
      icon: Users,
      badge: "Procesos Sensibles",
      items: [
        {
          title: "Divorcio Judicial",
          desc: "Disolución matrimonial con liquidación de bienes gananciales y acuerdos de salvaguarda de hijos menores.",
          key: "derecho_familia_divorcios",
          highlight: "Atención prioritaria y confidencial",
        },
        {
          title: "Pensión Alimentaria",
          desc: "Fijación, adecuación, aumento o defensa en procesos de pensión para menores y cónyuges.",
          key: "pension_alimentaria_menores",
          highlight: "Cálculo técnico y asesoría legal",
        },
        {
          title: "Guarda, Crianza y Educación",
          desc: "Regulación de patria potestad, régimen de visitas y protección del bienestar superior de los hijos.",
          key: "pension_alimentaria_menores",
          highlight: "Enfoque conciliatorio y firme",
        },
        {
          title: "Adopción de Mayor de Edad",
          desc: "Procedimiento judicial para legalizar vínculos afectivos consolidados con plenos efectos sucesorios y civiles.",
          key: "matrimonios_civiles",
          highlight: "Trámite ágil y respetuoso",
        },
        {
          title: "Matrimonios Civiles",
          desc: "Celebración y formalización notarial de matrimonios civiles con inscripción inmediata en el Registro Civil.",
          key: "matrimonios_civiles",
          highlight: "Dentro y fuera del consultorio",
        },
        {
          title: "Cambio de Orden de Apellidos",
          desc: "Gestión legal para la rectificación y cambio voluntario en el orden de los apellidos en el Registro Civil.",
          key: "otros_tramites_juridicos",
          highlight: "Derecho a la identidad",
        },
      ],
    },
    notarial: {
      label: "Propiedades & Vehículos",
      icon: HomeIcon,
      badge: "Garantía Registral",
      items: [
        {
          title: "Traspasos de Propiedades",
          desc: "Escrituras notariales de compraventa, donaciones, hipotecas y cesiones con estudio de gravámenes al día.",
          key: "traspasos_vehiculos_propiedades",
          highlight: "Inscripción en Registro Nacional",
        },
        {
          title: "Traspasos de Vehículos",
          desc: "Compraventa notarial de automóviles, motocicletas y maquinaria con verificación inmediata de multas y gravámenes.",
          key: "traspasos_vehiculos_propiedades",
          highlight: "Entrega de protocolo en el acto",
        },
        {
          title: "Segregaciones de Terrenos",
          desc: "División legal de fincas y lotes para reparto familiar o ventas parciales con visado municipal y catastro.",
          key: "segregaciones_servidumbres",
          highlight: "Estudio de planos y linderos",
        },
        {
          title: "Inscripción de Servidumbres",
          desc: "Formalización de servidumbres de paso, acueducto, electricidad y acceso para garantizar el valor de su inmueble.",
          key: "segregaciones_servidumbres",
          highlight: "Seguridad jurídica territorial",
        },
      ],
    },
    sucesiones: {
      label: "Sucesiones & Herencias",
      icon: ScrollText,
      badge: "Protección Patrimonial",
      items: [
        {
          title: "Sucesorios Judiciales y Notariales",
          desc: "Apertura y tramitación de mortuales con o sin testamento para la adjudicación legal de bienes a herederos.",
          key: "procesos_sucesorios_testamentos",
          highlight: "Vía notarial rápida si hay acuerdo",
        },
        {
          title: "Redacción de Testamentos",
          desc: "Elaboración de testamentos abiertos o cerrados con estricta solemnidad notarial para evitar litigios futuros.",
          key: "procesos_sucesorios_testamentos",
          highlight: "Custodia notarial fiduciaria",
        },
      ],
    },
    especiales: {
      label: "Notarial Especial",
      icon: Stamp,
      badge: "San Carlos & Zona Norte",
      items: [
        {
          title: "Registro de Marcas de Ganado",
          desc: "Inscripción, renovación y traspaso de fierros y marcas de ganado ante el Registro Nacional y SENASA.",
          key: "registro_marcas_ganado",
          highlight: "Especial para productores ganaderos",
        },
        {
          title: "Declaraciones Juradas",
          desc: "Protocolización de actas, declaraciones de ingresos, constancias de unión de hecho y fe de vida.",
          key: "declaraciones_juradas_notarial",
          highlight: "Validez oficial inmediata",
        },
        {
          title: "Permisos de Salida del País",
          desc: "Autorizaciones notariales expeditas para que menores de edad puedan viajar al extranjero sin demoras en migración.",
          key: "pension_alimentaria_menores",
          highlight: "Gestión rápida y segura",
        },
      ],
    },
  };

  const quickGuides: Record<string, { title: string; requirements: string[]; tip: string; area: string }> = {
    divorcio: {
      title: "Requisitos Clave para Divorcio Judicial",
      requirements: [
        "Certificado de matrimonio expedido por el Registro Civil.",
        "Certificación de nacimiento de los hijos menores de edad.",
        "Listado de bienes adquiridos dentro del matrimonio (muebles e inmuebles).",
        "Propuesta de pensión alimentaria y visitas si hay acuerdo mutuo.",
      ],
      tip: "Si existe mutuo acuerdo, el proceso judicial o notarial es considerablemente más rápido y económico.",
      area: "derecho_familia_divorcios",
    },
    traspaso_propiedad: {
      title: "Requisitos para Traspaso de Propiedad",
      requirements: [
        "Número de finca (folio real) y plano catastrado.",
        "Cédula de identidad vigente del comprador y vendedor.",
        "Impuestos territoriales y municipales al día.",
        "Estar al día con la cuota obrero-patronal de CCSS si aplica persona jurídica.",
      ],
      tip: "Efectuamos el estudio registral previo en el Registro Nacional para verificar que la finca esté libre de anotaciones o embargos.",
      area: "traspasos_vehiculos_propiedades",
    },
    pension: {
      title: "Requisitos para Proceso de Pensión Alimentaria",
      requirements: [
        "Certificado de nacimiento de los hijos beneficiarios.",
        "Detalle mensual de gastos escolares, salud, alimentación y recreación.",
        "Dirección o datos laborales del demandado para su notificación judicial.",
      ],
      tip: "El juez fija una pensión provisional casi de forma inmediata mientras dura la tramitación.",
      area: "pension_alimentaria_menores",
    },
    traspaso_vehiculo: {
      title: "Requisitos para Traspaso de Vehículo",
      requirements: [
        "Título de propiedad del vehículo y derechos de circulación (marchamo al día).",
        "Inspección técnica vehicular (DEKRA) vigente.",
        "Cédula de comprador y vendedor (físicos o representantes jurídicos).",
      ],
      tip: "Revisamos de inmediato en el sistema del Registro y COSEVI que el automotor no cuente con gravámenes ni infracciones pendientes.",
      area: "traspasos_vehiculos_propiedades",
    },
    testamento: {
      title: "Requisitos para Testamento Notarial",
      requirements: [
        "Cédula de identidad del testador.",
        "Presencia de tres testigos instrumentales que sepan leer y escribir (no familiares directos).",
        "Listado claro y detallado de la distribución de bienes y herederos.",
      ],
      tip: "El testamento abierto garantiza que sus herederos reciban los bienes sin disputas ni bloqueos judiciales.",
      area: "procesos_sucesorios_testamentos",
    },
  };

  return (
    <div className="min-h-screen bg-[#07130F] text-[#F0FDF4] selection:bg-[#CCA046]/40 selection:text-[#FFF9EB] relative overflow-x-hidden">
      
      {/* Fondo Ambiental Esmeralda & Oro Imperial */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(20,53,42,0.65),transparent_70%)]" />
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_65%)]" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(204,160,70,0.08),transparent_65%)]" />
      </div>

      {/* Top Banner de Seguridad & Contacto en Vivo */}
      <div className="relative z-50 border-b border-[#1F4A3B]/60 bg-[#0A1B15]/95 backdrop-blur-md px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="text-[#E5BE6E] font-semibold tracking-wider uppercase text-[11px] font-mono">
              CONSULTORIO JURÍDICO & NOTARIAL
            </span>
            <span className="hidden lg:inline text-emerald-200/60 font-mono text-[11px]">
              | Ciudad Quesada, San Carlos • Bóveda Fiduciaria AES-256-GCM
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://wa.me/50672188963"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: 7218 8963
            </a>
            <span className="text-emerald-800">|</span>
            <a
              href="tel:87578891"
              className="flex items-center gap-1.5 text-[#E5BE6E] hover:text-white transition font-medium"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Tel: 8757 88 91
            </a>
          </div>
        </div>
      </div>

      {/* Header Institucional con Acabado Esmeralda y Oro */}
      <header className="relative z-40 border-b border-[#1F4A3B]/60 bg-[#07130F]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative h-14 w-14 rounded-full p-1 bg-gradient-to-br from-[#1A3E31] via-[#0E251D] to-[#0A1B15] border border-[#CCA046]/50 shadow-xl shadow-[#10B981]/10 flex items-center justify-center overflow-hidden transition group-hover:scale-105 group-hover:border-[#E5BE6E]">
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
              <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#FBF5E8] transition">
                Valverde & Asociados
              </span>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#CCA046]">
                CONSULTORIO JURÍDICO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-emerald-100/90 font-medium">
            <a href="#servicios" className="hover:text-[#CCA046] transition">Nuestros servicios</a>
            <a href="#requisitos" className="hover:text-[#CCA046] transition">Requisitos Rápidos</a>
            <Link href="/boveda" className="hover:text-[#CCA046] transition flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
              Verificar Folio
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/50672188963?text=Hola,%20quisiera%20consultar%20con%20Valverde%20%26%20Asociados"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] hover:from-[#DFB55D] hover:to-[#F5E7C8] text-[#07130F] text-xs font-bold tracking-wider uppercase transition shadow-lg shadow-[#CCA046]/20 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              CONSULTA DIRECTA
            </a>

            {/* Botón Ingresar / Perfil de Usuario Google */}
            <UserNavButton />
          </div>

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-[#1F4A3B] bg-[#0A1B15] text-[#CCA046] hover:border-[#CCA046] transition"
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
              className="md:hidden border-t border-[#1F4A3B] bg-[#07130F] px-6 py-6 space-y-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-3 text-sm">
                <a
                  href="#servicios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-emerald-100 hover:text-[#CCA046] border-b border-[#1F4A3B]/40 transition flex items-center justify-between"
                >
                  Nuestros servicios
                  <ChevronRight className="h-4 w-4 text-[#CCA046]" />
                </a>
                <a
                  href="#requisitos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-emerald-100 hover:text-[#CCA046] border-b border-[#1F4A3B]/40 transition flex items-center justify-between"
                >
                  Guía de Requisitos
                  <ChevronRight className="h-4 w-4 text-[#CCA046]" />
                </a>
                <Link
                  href="/boveda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-emerald-300 hover:text-[#CCA046] border-b border-[#1F4A3B]/40 flex items-center gap-2 transition"
                >
                  <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
                  Verificar Folio Cifrado
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-[#CCA046] hover:text-white flex items-center gap-2 transition"
                >
                  <Lock className="h-4 w-4" />
                  Panel Admin (Usuarios y Expedientes)
                </Link>
              </nav>

              <div className="pt-2">
                <a
                  href="https://wa.me/50672188963?text=Hola,%20quisiera%20consultar%20con%20Valverde%20%26%20Asociados"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#CCA046]/20 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  CONSULTA DIRECTA POR WHATSAPP
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION DE IMPACTO: VERDE ESMERALDA & ORO */}
      <section className="relative z-10 pt-16 pb-24 sm:pt-24 sm:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge de Prestigio Local */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#CCA046]/40 bg-[#0F2B21]/80 backdrop-blur-md text-[#E5BE6E] text-xs font-medium mb-8 shadow-lg shadow-[#10B981]/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#CCA046]" />
            Consultorio Jurídico & Notarial en Ciudad Quesada
          </motion.div>

          {/* Titular Imponente con el Verde y Oro de Valverde */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
          >
            Justicia con honor y respaldo fiduciario. <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E5BE6E] via-[#CCA046] to-[#FBF5E8]">
              Defendemos lo que más le importa.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            En <strong className="text-white font-medium">Valverde & Asociados</strong> resolvemos sus procesos de familia, traspasos de vehículos y propiedades, sucesiones y trámites notariales con el más alto rigor profesional y bajo custodia digital blindada.
          </motion.p>

          {/* Botones de Acción Primarios */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#servicios"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] hover:from-[#DFB55D] hover:to-[#F5E7C8] text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-[#CCA046]/25 transition active:scale-95"
            >
              <Scale className="h-4 w-4" />
              Explorar Nuestros Servicios
              <ArrowRight className="h-4 w-4" />
            </a>
            
            <a
              href="https://wa.me/50672188963"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl border border-emerald-500/40 hover:border-emerald-400 bg-[#0F2B21]/70 hover:bg-[#14352A] text-emerald-200 font-semibold text-xs uppercase tracking-wider flex items-center gap-2.5 transition active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp Directo: 7218 8963
            </a>
          </motion.div>

          {/* Tres Puntos Clave Flotantes (Apple Touch & Depth) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
          >
            <div className="p-5 rounded-2xl glass-emerald transition hover:translate-y-[-2px]">
              <div className="h-10 w-10 rounded-xl bg-[#CCA046]/10 border border-[#CCA046]/30 flex items-center justify-center text-[#CCA046] mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-white">Sede Central Ciudad Quesada</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Frente a la casa parroquial, altos de Decoqueques. Atención cercana en San Carlos.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-emerald transition hover:translate-y-[-2px]">
              <div className="h-10 w-10 rounded-xl bg-[#CCA046]/10 border border-[#CCA046]/30 flex items-center justify-center text-[#CCA046] mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-white">Bóveda Criptográfica AES-256</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Sus datos confidenciales se cifran en reposo en MongoDB Atlas. Cero filtraciones.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-emerald transition hover:translate-y-[-2px]">
              <div className="h-10 w-10 rounded-xl bg-[#CCA046]/10 border border-[#CCA046]/30 flex items-center justify-center text-[#CCA046] mb-3">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-white">Acompañamiento Integral</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Soluciones ágiles en familia, divorcios, traspasos, sucesiones y ganadería.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXPLORADOR INTERACTIVO DE SERVICIOS */}
      <section id="servicios" className="relative z-10 py-24 px-6 border-t border-[#1F4A3B]/60 bg-gradient-to-b from-[#07130F] to-[#0A1B15]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CCA046] font-semibold font-mono">
              VALVERDE & ASOCIADOS
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-2">
              Nuestros servicios
            </h2>
            <p className="text-sm text-emerald-200/80 mt-3 font-light">
              Haga clic en las categorías para explorar los trámites y requisitos que atendemos en nuestro consultorio:
            </p>
          </div>

          {/* Selector de Pestañas Interactivo */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {(Object.keys(serviceCategories) as Array<keyof typeof serviceCategories>).map((key) => {
              const cat = serviceCategories[key];
              const Icon = cat.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] shadow-lg shadow-[#CCA046]/20 font-bold scale-105"
                      : "bg-[#0F2B21]/60 hover:bg-[#14352A] text-emerald-100 border border-[#1F4A3B]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid de Servicios Activos */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {serviceCategories[activeTab].items.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-emerald flex flex-col justify-between group transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-md bg-[#CCA046]/15 text-[#E5BE6E] border border-[#CCA046]/30">
                      {item.highlight}
                    </span>
                    <span className="text-xs font-serif text-[#CCA046]">0{idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2.5 group-hover:text-[#E5BE6E] transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-100/70 leading-relaxed font-light mb-6">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleSelectService(item.key)}
                  className="w-full py-2.5 rounded-lg border border-[#CCA046]/40 hover:border-[#CCA046] hover:bg-[#CCA046] hover:text-[#07130F] text-[#CCA046] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95"
                >
                  Iniciar este trámite
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Barra Rápida de Atención Directa */}
          <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-[#CCA046]/40 bg-gradient-to-r from-[#0F2B21] via-[#14352A] to-[#0A1B15] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#CCA046]/10 border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046] flex-shrink-0">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-white font-serif font-bold text-lg">¿Prefiere visitarnos personalmente en Ciudad Quesada?</h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Estamos ubicados frente a la casa parroquial, altos de Decoqueques.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/50672188963"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: 7218 8963
              </a>
              <a
                href="tel:87578891"
                className="px-6 py-3 rounded-xl border border-[#CCA046] text-[#E5BE6E] hover:bg-[#CCA046] hover:text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar: 8757 88 91
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GUÍA INTERACTIVA DE REQUISITOS (DA GUSTO EXPLORAR) */}
      <section id="requisitos" className="relative z-10 py-24 px-6 border-t border-[#1F4A3B]/60 bg-[#07130F]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CCA046] font-semibold font-mono">
              ASESORÍA PREVIA TRANSPARENTE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              ¿Qué necesita para su trámite?
            </h2>
            <p className="text-xs text-emerald-200/80 mt-2 font-light">
              Seleccione un trámite frecuente para conocer los requisitos fundamentales antes de iniciar su gestión:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Lista de Trámites Frecuentes (Botones interactivos) */}
            <div className="lg:col-span-5 space-y-3">
              {[
                { id: "divorcio", title: "Divorcio Judicial & Bienes", icon: Users },
                { id: "traspaso_propiedad", title: "Traspaso de Propiedad / Lote", icon: HomeIcon },
                { id: "pension", title: "Pensión Alimentaria & Visitas", icon: Scale },
                { id: "traspaso_vehiculo", title: "Traspaso de Vehículo / Moto", icon: Car },
                { id: "testamento", title: "Testamento Notarial", icon: ScrollText },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedGuide === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGuide(item.id)}
                    className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-[#14352A] border-2 border-[#CCA046] text-white shadow-xl shadow-[#10B981]/10"
                        : "bg-[#0F2B21]/50 border border-[#1F4A3B] text-emerald-100 hover:bg-[#14352A]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-[#CCA046] text-[#07130F]" : "bg-[#1A3E31] text-[#CCA046]"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold">{item.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isSelected ? "text-[#CCA046]" : "text-emerald-700"}`} />
                  </button>
                );
              })}
            </div>

            {/* Panel de Requisitos Detallados */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGuide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10 rounded-2xl glass-emerald relative"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-[#1F4A3B]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#CCA046] tracking-wider">
                        GUÍA PRÁCTICA NOTARIAL
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white mt-1">
                        {quickGuides[selectedGuide].title}
                      </h3>
                    </div>
                    <FileCheck className="h-8 w-8 text-[#CCA046] opacity-80" />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h5 className="text-xs uppercase tracking-wider text-[#E5BE6E] font-semibold font-mono">
                      Documentación Recomendada:
                    </h5>
                    <ul className="space-y-3">
                      {quickGuides[selectedGuide].requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-3 text-xs text-emerald-100 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 p-4 rounded-xl bg-[#0A1B15] border border-[#CCA046]/30 text-xs text-emerald-200/90 leading-relaxed">
                      <strong className="text-[#CCA046] block mb-1">Consejo de Valverde & Asociados:</strong>
                      {quickGuides[selectedGuide].tip}
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4">
                      <button
                        onClick={() => handleSelectService(quickGuides[selectedGuide].title)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#CCA046]/20 transition"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Consultar este trámite por WhatsApp
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="relative z-10 border-t border-[#1F4A3B]/60 bg-[#050D0A] py-16 px-6 text-emerald-200/70 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 rounded-full p-1 bg-[#0A1B15] border border-[#CCA046]/40 flex items-center justify-center overflow-hidden">
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
            <p className="text-emerald-200/70 text-xs max-w-md leading-relaxed font-light">
              Consultorio Jurídico y Notarial dedicado a la resolución ágil y fiduciaria de asuntos familiares, de propiedades, traspasos y gestiones civiles en San Carlos y toda la Zona Norte.
            </p>
            <div className="space-y-2 pt-2 text-emerald-100">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#CCA046] flex-shrink-0" />
                Ciudad Quesada frente a la casa parroquial, altos de Decoqueques
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-[#CCA046] flex-shrink-0" />
                Tel: 8757 88 91 • WhatsApp: 7218 8963
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-white font-serif font-bold text-sm mb-3">Nuestros servicios</h5>
            <ul className="space-y-2 text-emerald-200/70">
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
            <h5 className="text-white font-serif font-bold text-sm mb-3">Redes & Contacto Directo</h5>
            <ul className="space-y-2.5 text-emerald-200/70">
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
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#07130F] font-bold text-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escribir a WhatsApp (7218 8963)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#1F4A3B]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/50">
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

      {/* BOTÓN FLOTANTE DE WHATSAPP CON PULSO ESMERALDA */}
      <a
        href="https://wa.me/50672188963"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Valverde & Asociados"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07130F] shadow-2xl shadow-emerald-500/50 flex items-center justify-center transition transform hover:scale-110 active:scale-95 group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
        </span>
        <MessageCircle className="h-7 w-7 text-[#07130F]" />
        <span className="absolute right-16 bg-[#0A1B15] text-[#CCA046] border border-[#CCA046]/40 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-2xl">
          WhatsApp: 7218 8963
        </span>
      </a>
    </div>
  );
}
