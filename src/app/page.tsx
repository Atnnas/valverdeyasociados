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

      {/* Top Bar Flotante de Alta Gama (Efecto Isla 3D Flotante & Specular Highlight) */}
      <header className="sticky top-3 sm:top-5 z-50 px-4 sm:px-6 w-full max-w-7xl mx-auto transition-all duration-300">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#CCA046]/45 bg-[#07130F]/85 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(204,160,70,0.18)] before:absolute before:inset-x-8 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#E5BE6E] before:to-transparent after:absolute after:inset-x-12 after:-bottom-[1px] after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-[#10B981]/40 after:to-transparent">
          
          {/* Logo Oficial con Efecto Halo y Relieve */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative h-12 w-12 rounded-full p-0.5 bg-gradient-to-tr from-[#CCA046] via-[#10B981] to-[#E5BE6E] shadow-[0_0_20px_rgba(204,160,70,0.35)] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(204,160,70,0.55)]">
              <div className="h-full w-full rounded-full bg-[#07130F] p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo Valverde & Asociados"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-[#FBF5E8] transition">
                Valverde & Asociados
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#CCA046] via-[#E5BE6E] to-[#CCA046]">
                CONSULTORIO JURÍDICO
              </span>
            </div>
          </Link>

          {/* Navegación Central con Cápsulas Flotantes */}
          <nav className="hidden md:flex items-center gap-2 p-1 rounded-full bg-[#0A1B15]/80 border border-[#1F4A3B]/60 shadow-inner">
            <a
              href="#servicios"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-100/90 hover:text-white hover:bg-[#14352A] transition duration-200"
            >
              Nuestros servicios
            </a>
            <a
              href="#requisitos"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-100/90 hover:text-white hover:bg-[#14352A] transition duration-200"
            >
              Requisitos Rápidos
            </a>
            <Link
              href="/boveda"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#E5BE6E] hover:text-white hover:bg-[#0F2B21] transition duration-200 border border-[#CCA046]/30 hover:border-[#CCA046]"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#CCA046]" />
              Verificar Folio
            </Link>
          </nav>

          {/* Acciones de la Derecha: Botón con Relieve 3D & Avatar de Usuario */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/50672188963?text=Hola,%20quisiera%20consultar%20con%20Valverde%20%26%20Asociados"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#CCA046] via-[#E5BE6E] to-[#CCA046] hover:from-[#DFB55D] hover:via-[#F5E7C8] hover:to-[#DFB55D] text-[#07130F] text-xs font-extrabold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_22px_rgba(204,160,70,0.4)] hover:shadow-[0_6px_28px_rgba(204,160,70,0.65)] hover:scale-[1.03] active:scale-95 border border-[#FFF9EB]/40 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>CONSULTA DIRECTA</span>
            </a>

            {/* Perfil de Usuario Google o Botón Ingresar */}
            <UserNavButton />

            {/* Botón Menú Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-[#CCA046]/40 bg-[#0A1B15] text-[#CCA046] hover:border-[#CCA046] hover:bg-[#0F2B21] transition shadow-md"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="md:hidden mt-2 rounded-2xl border border-[#CCA046]/40 bg-[#07130F]/95 backdrop-blur-2xl p-5 space-y-4 shadow-2xl"
            >
              <nav className="flex flex-col space-y-2 text-sm">
                <a
                  href="#servicios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-[#0F2B21] text-emerald-100 hover:text-[#CCA046] transition flex items-center justify-between font-medium"
                >
                  <span>Nuestros servicios</span>
                  <ChevronRight className="h-4 w-4 text-[#CCA046]" />
                </a>
                <a
                  href="#requisitos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-[#0F2B21] text-emerald-100 hover:text-[#CCA046] transition flex items-center justify-between font-medium"
                >
                  <span>Guía de Requisitos</span>
                  <ChevronRight className="h-4 w-4 text-[#CCA046]" />
                </a>
                <Link
                  href="/boveda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-[#0F2B21] text-emerald-300 hover:text-[#CCA046] flex items-center justify-between transition font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#CCA046]" />
                    Verificar Folio Cifrado
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#CCA046]" />
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#0F2B21]/60 text-[#CCA046] hover:text-white flex items-center justify-between transition font-medium border border-[#CCA046]/30"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Panel Admin (Usuarios y Expedientes)
                  </span>
                  <ChevronRight className="h-4 w-4" />
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
                  <MessageCircle className="h-4 w-4" />
                  CONSULTA DIRECTA POR WHATSAPP
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION DE IMPACTO: VERDE ESMERALDA & ORO - APROVECHAMIENTO TOTAL DEL ESPACIO */}
      <section className="relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-28 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Columna Izquierda: Mensaje Central & Llamados a la Acción */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge de Prestigio Local */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#CCA046]/40 bg-[#0F2B21]/80 backdrop-blur-md text-[#E5BE6E] text-xs font-medium shadow-lg shadow-[#10B981]/5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#CCA046]" />
                <span>Consultorio Jurídico & Notarial en Ciudad Quesada</span>
              </motion.div>

              {/* Titular Imponente con Tipografía Didone y Oro */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.12]"
              >
                Justicia con honor y respaldo fiduciario. <br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#E5BE6E] via-[#CCA046] to-[#FBF5E8]">
                  Defendemos lo que más le importa.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-emerald-100/80 font-light leading-relaxed max-w-2xl"
              >
                En <strong className="text-white font-medium">Valverde & Asociados</strong> brindamos asesoría jurídica y notarial ágil en Ciudad Quesada, San Carlos. Especialistas en procesos familiares, traspasos de bienes y vehículos, sucesiones y gestiones civiles.
              </motion.p>

              {/* Botones de Acción Primarios */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a
                  href="https://wa.me/50672188963?text=Hola,%20quisiera%20consultar%20con%20Valverde%20%26%20Asociados"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#CCA046] to-[#E5BE6E] hover:from-[#DFB55D] hover:to-[#F5E7C8] text-[#07130F] font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-[#CCA046]/25 transition active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp: 7218 8963</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>

                <a
                  href="tel:87578891"
                  className="px-7 py-3.5 rounded-xl border border-emerald-500/40 hover:border-[#CCA046] bg-[#0F2B21]/70 hover:bg-[#14352A] text-emerald-100 font-semibold text-xs uppercase tracking-wider flex items-center gap-2.5 transition active:scale-95"
                >
                  <PhoneCall className="h-4 w-4 text-[#CCA046]" />
                  <span>Teléfono: 8757 88 91</span>
                </a>
              </motion.div>

              {/* Tiras de Confianza y Ubicación */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-200/70"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#CCA046] flex-shrink-0" />
                  <span>Ciudad Quesada, frente a la casa parroquial</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Secreto profesional y reserva absoluta</span>
                </div>
              </motion.div>
            </div>

            {/* Columna Derecha: Tarjeta de Servicios Destacados & Trámites Frecuentes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="p-6 sm:p-7 rounded-3xl border border-[#CCA046]/40 bg-gradient-to-br from-[#0A1B15] to-[#07130F] shadow-2xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCA046] to-transparent" />

                <div className="flex items-center justify-between pb-3 border-b border-[#1F4A3B]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[#0F2B21] border border-[#CCA046]/40 flex items-center justify-center text-[#CCA046]">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Nuestros Servicios Principales</h3>
                      <p className="text-[11px] text-emerald-300/60">Atención directa en San Carlos</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#E5BE6E] bg-[#14352A] px-2.5 py-1 rounded-full border border-[#10B981]/30">
                    Consultorio
                  </span>
                </div>

                {/* 4 Trámites Rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => handleSelectService("Divorcios y Familia")}
                    className="p-3.5 rounded-2xl bg-[#07130F]/80 border border-[#1F4A3B] hover:border-[#CCA046]/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#CCA046] mb-1">
                      <Users className="h-4 w-4 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-white group-hover:text-[#E5BE6E] transition">Familia & Pareja</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/60 leading-snug">
                      Divorcio judicial, pensión alimentaria, guarda y crianza.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSelectService("Traspaso de Bienes y Vehículos")}
                    className="p-3.5 rounded-2xl bg-[#07130F]/80 border border-[#1F4A3B] hover:border-[#CCA046]/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#CCA046] mb-1">
                      <Car className="h-4 w-4 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-white group-hover:text-[#E5BE6E] transition">Traspasos</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/60 leading-snug">
                      Vehículos, propiedades, escrituras y declaraciones.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSelectService("Procesos Sucesorios y Herencias")}
                    className="p-3.5 rounded-2xl bg-[#07130F]/80 border border-[#1F4A3B] hover:border-[#CCA046]/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#CCA046] mb-1">
                      <ScrollText className="h-4 w-4 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-white group-hover:text-[#E5BE6E] transition">Sucesiones</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/60 leading-snug">
                      Juicios sucesorios, testamentos y herencias.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSelectService("Segregaciones y Marcas de Ganado")}
                    className="p-3.5 rounded-2xl bg-[#07130F]/80 border border-[#1F4A3B] hover:border-[#CCA046]/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#CCA046] mb-1">
                      <HomeIcon className="h-4 w-4 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-white group-hover:text-[#E5BE6E] transition">Bienes & Tierras</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/60 leading-snug">
                      Segregaciones, servidumbres y marcas de ganado.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0F2B21] border border-[#10B981]/30 flex items-center justify-between text-xs">
                  <span className="text-emerald-200 font-medium flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Atención presencial en San Carlos
                  </span>
                  <a
                    href="#servicios"
                    className="text-[#CCA046] hover:text-[#FFF9EB] font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    Ver detalles &rarr;
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tres Puntos Clave Flotantes (Apple Touch & Depth) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
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
