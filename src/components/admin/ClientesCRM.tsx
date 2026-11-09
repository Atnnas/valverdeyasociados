"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Scale,
  MapPin,
  Briefcase,
  FolderOpen,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  ClienteRecord,
  TipoIdentificacion,
  EstadoCivil,
  AreaLegalCliente,
  EstadoTramite,
} from "@/types/cliente";

interface ClientesCRMProps {
  apiKey?: string;
  isAuthorized: boolean;
}

const INITIAL_CLIENTE_FORM = {
  nombre: "",
  primerApellido: "",
  segundoApellido: "",
  tipoIdentificacion: "cedula" as TipoIdentificacion,
  cedula: "",
  email: "",
  telefono: "",
  telefonoSecundario: "",
  estadoCivil: "soltero" as EstadoCivil,
  profesion: "",
  nacionalidad: "Costarricense",
  domicilio: "",
  areaLegal: "notarial_propiedades" as AreaLegalCliente,
  estadoTramite: "consulta_inicial" as EstadoTramite,
  detalleAsunto: "",
  numeroExpedienteOFinca: "",
  honorariosTotal: 0,
  honorariosPagado: 0,
  proximaCita: "",
  notasConfidenciales: "",
};

export default function ClientesCRM({ apiKey, isAuthorized }: ClientesCRMProps) {
  const [clientes, setClientes] = useState<ClienteRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState<string>("todas");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Estados de Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_CLIENTE_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de Detalle
  const [viewingCliente, setViewingCliente] = useState<ClienteRecord | null>(null);

  // Cargar lista de clientes desde la API
  const fetchClientes = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (filterArea !== "todas") params.append("area", filterArea);
      if (filterEstado !== "todos") params.append("estado", filterEstado);

      const res = await fetch(`/api/admin/clientes?${params.toString()}`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setClientes(data.clientes || []);
      } else {
        setStatusMessage(data.error || "No fue posible cargar los clientes.");
      }
    } catch {
      setStatusMessage("Error de conexión al cargar la cartera de clientes.");
    } finally {
      setLoading(false);
    }
  }, [apiKey, isAuthorized, search, filterArea, filterEstado]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Manejo de abrir modal en modo Crear
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(INITIAL_CLIENTE_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Manejo de abrir modal en modo Editar
  const handleOpenEdit = (c: ClienteRecord) => {
    setModalMode("edit");
    setEditingId(c.id);
    setFormData({
      nombre: c.nombre,
      primerApellido: c.primerApellido,
      segundoApellido: c.segundoApellido,
      tipoIdentificacion: c.tipoIdentificacion,
      cedula: c.cedula,
      email: c.email,
      telefono: c.telefono,
      telefonoSecundario: c.telefonoSecundario || "",
      estadoCivil: c.estadoCivil,
      profesion: c.profesion,
      nacionalidad: c.nacionalidad,
      domicilio: c.domicilio,
      areaLegal: c.areaLegal,
      estadoTramite: c.estadoTramite,
      detalleAsunto: c.detalleAsunto,
      numeroExpedienteOFinca: c.numeroExpedienteOFinca || "",
      honorariosTotal: c.honorariosTotal,
      honorariosPagado: c.honorariosPagado,
      proximaCita: c.proximaCita || "",
      notasConfidenciales: c.notasConfidenciales || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Editar)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const method = modalMode === "create" ? "POST" : "PATCH";
      const payload = modalMode === "create" ? formData : { id: editingId, ...formData };

      const res = await fetch("/api/admin/clientes", {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchClientes();
        setStatusMessage(
          modalMode === "create"
            ? "Cliente registrado exitosamente en el CRM."
            : "Ficha del cliente actualizada correctamente."
        );
      } else {
        setFormError(data.error || "No se pudo guardar la información.");
      }
    } catch {
      setFormError("Error de comunicación con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar cliente
  const handleDeleteCliente = async (id: string, nombre: string) => {
    if (!confirm(`¿Está seguro de eliminar del CRM a ${nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey.trim()}`;

      const res = await fetch(`/api/admin/clientes?id=${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setClientes((prev) => prev.filter((c) => c.id !== id));
        setStatusMessage("Cliente eliminado correctamente.");
      } else {
        alert(data.error || "No fue posible eliminar el cliente.");
      }
    } catch {
      alert("Error de red al intentar eliminar el cliente.");
    }
  };

  // Generar enlace WhatsApp con saludo profesional
  const getWhatsAppLink = (c: ClienteRecord) => {
    const cleanPhone = c.telefono.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("506") ? cleanPhone : `506${cleanPhone}`;
    const text = encodeURIComponent(
      `Estimado(a) ${c.nombre}, le saluda el Consultorio Jurídico & Notarial Valverde & Asociados en relación con su trámite.`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  // Estadísticas calculadas en memoria
  const metrics = useMemo(() => {
    const total = clientes.length;
    const enTramite = clientes.filter(
      (c) => c.estadoTramite === "en_tramite" || c.estadoTramite === "recoleccion_requisitos"
    ).length;
    const conSaldo = clientes.filter((c) => c.honorariosSaldo > 0).length;
    const concluidos = clientes.filter((c) => c.estadoTramite === "concluido").length;
    return { total, enTramite, conSaldo, concluidos };
  }, [clientes]);

  // Formato de moneda costarricense
  const formatCRC = (amount: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Etiquetas legibles de área legal
  const getAreaLabel = (area: AreaLegalCliente) => {
    const map: Record<AreaLegalCliente, string> = {
      familia: "Familia & Pareja",
      notarial_propiedades: "Propiedades & Bienes",
      notarial_vehiculos: "Traspaso de Vehículos",
      sucesiones: "Sucesorio & Herencias",
      notarial_especial: "Notarial Especial",
      civil_general: "Civil General",
    };
    return map[area] || area;
  };

  // Etiquetas legibles de estado de trámite
  const getEstadoBadge = (estado: EstadoTramite) => {
    switch (estado) {
      case "en_tramite":
        return { label: "En Trámite", bg: "bg-[#D3E3FD] text-[#041E49] border-[#A8C7FA]" };
      case "recoleccion_requisitos":
        return { label: "Requisitos Pendientes", bg: "bg-[#FEF7D0] text-[#3B2D00] border-[#E0D782]" };
      case "pendiente_firma":
        return { label: "Pendiente de Firma", bg: "bg-[#FCE8E6] text-[#B3261E] border-[#F5C2CB]" };
      case "concluido":
        return { label: "Concluido", bg: "bg-[#C4EED0] text-[#072711] border-[#86EFAC]" };
      case "archivado":
        return { label: "Archivado", bg: "bg-[#F1F3F4] text-[#444746] border-[#DADCE0]" };
      default:
        return { label: "Consulta Inicial", bg: "bg-[#E8F0FE] text-[#0B57D0] border-[#C2E7FF]" };
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Métricas Rápidas Estilo Google Workspace */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#444746]">Total Clientes</p>
            <p className="text-2xl font-bold text-[#1F1F1F] mt-1">{metrics.total}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#EAF1FB] text-[#0B57D0] flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#444746]">En Trámite Activo</p>
            <p className="text-2xl font-bold text-[#0B57D0] mt-1">{metrics.enTramite}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D3E3FD] text-[#041E49] flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#444746]">Con Saldo Pendiente</p>
            <p className="text-2xl font-bold text-[#B3261E] mt-1">{metrics.conSaldo}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#FCE8E6] text-[#B3261E] flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#444746]">Trámites Concluidos</p>
            <p className="text-2xl font-bold text-[#14532D] mt-1">{metrics.concluidos}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#DCFCE7] text-[#14532D] flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Botón de Acción */}
      <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cédula, nombre, teléfono o expediente..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#EAF1FB] text-sm text-[#1F1F1F] placeholder-[#444746] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0B57D0] transition"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#444746]" />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#DADCE0] bg-white text-xs font-medium text-[#444746] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
          >
            <option value="todas">Todas las áreas legales</option>
            <option value="familia">Familia & Pareja</option>
            <option value="notarial_propiedades">Propiedades & Bienes</option>
            <option value="notarial_vehiculos">Traspasos Vehiculares</option>
            <option value="sucesiones">Sucesiones & Herencias</option>
            <option value="notarial_especial">Notarial Especial</option>
            <option value="civil_general">Civil General</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#DADCE0] bg-white text-xs font-medium text-[#444746] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="consulta_inicial">Consulta Inicial</option>
            <option value="recoleccion_requisitos">Recolección de Requisitos</option>
            <option value="en_tramite">En Trámite</option>
            <option value="pendiente_firma">Pendiente de Firma</option>
            <option value="concluido">Concluido</option>
            <option value="archivado">Archivado</option>
          </select>

          <button
            onClick={fetchClientes}
            disabled={loading}
            title="Recargar lista"
            className="p-2 rounded-lg border border-[#DADCE0] hover:bg-[#F8FAFD] text-[#444746] hover:text-[#1F1F1F] transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-[#0B57D0] ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Botón Primario: Nuevo Cliente */}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Mensaje de Estado / Notificación */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A] flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[#16A34A] hover:text-[#14532D] font-bold text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabla Corporativa de Clientes */}
      <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden">
        {loading && clientes.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="h-7 w-7 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#444746]">Cargando cartera de clientes en MongoDB Atlas...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="h-12 w-12 text-[#C4C7C5] mx-auto" />
            <h3 className="text-base font-medium text-[#1F1F1F]">No hay clientes registrados en este filtro</h3>
            <p className="text-xs text-[#727775] max-w-md mx-auto">
              Presione el botón <strong>&quot;Nuevo Cliente&quot;</strong> para añadir el primer expediente a la cartera del bufete.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 px-5 py-2 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Registrar Primer Cliente</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFD] border-b border-[#E0E2EC] text-[#444746] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Cliente & Cédula</th>
                  <th className="px-4 py-3.5">Contacto Ágil</th>
                  <th className="px-4 py-3.5">Área & Expediente</th>
                  <th className="px-4 py-3.5">Estado del Trámite</th>
                  <th className="px-4 py-3.5">Honorarios</th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F4]">
                {clientes.map((c) => {
                  const estadoBadge = getEstadoBadge(c.estadoTramite);
                  return (
                    <tr key={c.id} className="hover:bg-[#F2F6FC] transition-colors">
                      {/* Cliente & Cédula */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm text-[#1F1F1F] flex items-center gap-2">
                          <span>{c.nombreCompleto}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#EAF1FB] text-[#0B57D0] font-mono text-[11px] font-semibold">
                            {c.tipoIdentificacion.toUpperCase()}: {c.cedula || "No indicada"}
                          </span>
                          <span className="text-[11px] text-[#727775] capitalize">
                            {c.profesion || c.estadoCivil}
                          </span>
                        </div>
                      </td>

                      {/* Contacto Directo */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={getWhatsAppLink(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] text-xs font-semibold transition"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-[#16A34A]" />
                            <span>{c.telefono}</span>
                          </a>

                          <a
                            href={`tel:${c.telefono.replace(/\D/g, "")}`}
                            className="p-1.5 rounded-full hover:bg-[#EAF1FB] text-[#444746] hover:text-[#0B57D0] transition"
                            title="Llamar"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="p-1.5 rounded-full hover:bg-[#EAF1FB] text-[#444746] hover:text-[#0B57D0] transition"
                              title={`Enviar correo a ${c.email}`}
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        {c.domicilio && (
                          <p className="text-[11px] text-[#727775] mt-1 truncate max-w-[200px]" title={c.domicilio}>
                            📍 {c.domicilio}
                          </p>
                        )}
                      </td>

                      {/* Área & Expediente */}
                      <td className="px-4 py-4">
                        <span className="font-medium text-[#1F1F1F]">
                          {getAreaLabel(c.areaLegal)}
                        </span>
                        {c.numeroExpedienteOFinca && (
                          <p className="text-[11px] text-[#0B57D0] font-mono mt-0.5">
                            Exp/Finca: {c.numeroExpedienteOFinca}
                          </p>
                        )}
                        {c.proximaCita && (
                          <p className="text-[10px] text-[#B3261E] font-medium mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(c.proximaCita).toLocaleDateString("es-CR")}
                          </p>
                        )}
                      </td>

                      {/* Estado del Trámite */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${estadoBadge.bg}`}
                        >
                          {estadoBadge.label}
                        </span>
                      </td>

                      {/* Honorarios */}
                      <td className="px-4 py-4 font-mono">
                        <div className="text-xs text-[#1F1F1F]">
                          Total: <strong className="font-semibold">{formatCRC(c.honorariosTotal)}</strong>
                        </div>
                        {c.honorariosSaldo > 0 ? (
                          <div className="text-[11px] text-[#B3261E] font-semibold mt-0.5">
                            Saldo: {formatCRC(c.honorariosSaldo)}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
                            ✓ Cancelado
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingCliente(c)}
                            className="p-1.5 rounded-lg text-[#0B57D0] hover:bg-[#EAF1FB] transition cursor-pointer"
                            title="Ver Ficha Notarial Completa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg text-[#444746] hover:bg-[#EAF1FB] hover:text-[#1F1F1F] transition cursor-pointer"
                            title="Editar Datos"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteCliente(c.id, c.nombreCompleto)}
                            className="p-1.5 rounded-lg text-[#B3261E] hover:bg-[#FCE8E6] transition cursor-pointer"
                            title="Eliminar Cliente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR CLIENTE (Estilo Google Material) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl border border-[#DADCE0] shadow-2xl p-6 sm:p-8 space-y-6 text-[#1F1F1F] my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4]">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F1F1F]">
                    {modalMode === "create" ? "Registrar Nuevo Cliente" : "Editar Ficha de Cliente"}
                  </h3>
                  <p className="text-xs text-[#727775] mt-0.5">
                    Complete los datos notariales requeridos para la custodia y tramitación legal.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-[#F1F3F4] text-[#444746] flex items-center justify-center text-lg font-medium cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-[#FCE8E6] text-[#B3261E] text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* BLOQUE 1: IDENTIFICACIÓN Y GENERALES DE LEY */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#0B57D0] uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5" />
                    <span>1. Generales de Ley (Requisitos Notariales)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej. Juan Carlos"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Primer Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.primerApellido}
                        onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })}
                        placeholder="Ej. Valverde"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Segundo Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.segundoApellido}
                        onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })}
                        placeholder="Ej. Rodríguez"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Tipo de Id
                      </label>
                      <select
                        value={formData.tipoIdentificacion}
                        onChange={(e) =>
                          setFormData({ ...formData, tipoIdentificacion: e.target.value as TipoIdentificacion })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
                      >
                        <option value="cedula">Cédula Nacional</option>
                        <option value="dimex">DIMEX / Residencia</option>
                        <option value="pasaporte">Pasaporte</option>
                        <option value="juridica">Cédula Jurídica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Número de Cédula / Id
                      </label>
                      <input
                        type="text"
                        value={formData.cedula}
                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                        placeholder="Ej. 2-0456-0789"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Estado Civil
                      </label>
                      <select
                        value={formData.estadoCivil}
                        onChange={(e) =>
                          setFormData({ ...formData, estadoCivil: e.target.value as EstadoCivil })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
                      >
                        <option value="soltero">Soltero(a)</option>
                        <option value="casado">Casado(a) una vez</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viudo">Viudo(a)</option>
                        <option value="union_hecho">Unión de hecho</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Profesión u Oficio (Requisito Notarial)
                      </label>
                      <input
                        type="text"
                        value={formData.profesion}
                        onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
                        placeholder="Ej. Comerciante, Agricultor, Educadora"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Domicilio / Vecindad
                      </label>
                      <input
                        type="text"
                        value={formData.domicilio}
                        onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                        placeholder="Ej. Ciudad Quesada, San Carlos"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>
                  </div>
                </div>

                {/* BLOQUE 2: CONTACTO Y CANALES */}
                <div className="space-y-3 pt-3 border-t border-[#F1F3F4]">
                  <h4 className="text-xs font-bold text-[#0B57D0] uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <span>2. Contacto Directo</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Teléfono Móvil (WhatsApp) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej. 8757 8891"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Teléfono Secundario / Fijo
                      </label>
                      <input
                        type="text"
                        value={formData.telefonoSecundario}
                        onChange={(e) => setFormData({ ...formData, telefonoSecundario: e.target.value })}
                        placeholder="Ej. 2460 0000"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="cliente@ejemplo.com"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>
                  </div>
                </div>

                {/* BLOQUE 3: ASUNTO JURÍDICO Y HONORARIOS */}
                <div className="space-y-3 pt-3 border-t border-[#F1F3F4]">
                  <h4 className="text-xs font-bold text-[#0B57D0] uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>3. Trámite Notarial & Honorarios</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Área Legal
                      </label>
                      <select
                        value={formData.areaLegal}
                        onChange={(e) =>
                          setFormData({ ...formData, areaLegal: e.target.value as AreaLegalCliente })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
                      >
                        <option value="familia">Familia & Pareja</option>
                        <option value="notarial_propiedades">Propiedades & Bienes</option>
                        <option value="notarial_vehiculos">Traspasos Vehiculares</option>
                        <option value="sucesiones">Sucesiones & Herencias</option>
                        <option value="notarial_especial">Notarial Especial</option>
                        <option value="civil_general">Civil General</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Estado del Trámite
                      </label>
                      <select
                        value={formData.estadoTramite}
                        onChange={(e) =>
                          setFormData({ ...formData, estadoTramite: e.target.value as EstadoTramite })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] cursor-pointer"
                      >
                        <option value="consulta_inicial">Consulta Inicial</option>
                        <option value="recoleccion_requisitos">Recolección de Requisitos</option>
                        <option value="en_tramite">En Trámite</option>
                        <option value="pendiente_firma">Pendiente de Firma</option>
                        <option value="concluido">Concluido</option>
                        <option value="archivado">Archivado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Nº Finca / Placa / Expediente
                      </label>
                      <input
                        type="text"
                        value={formData.numeroExpedienteOFinca}
                        onChange={(e) => setFormData({ ...formData, numeroExpedienteOFinca: e.target.value })}
                        placeholder="Ej. Finca 2-123456 / Placa BCD-123"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Honorarios Totales (₡)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.honorariosTotal || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, honorariosTotal: Number(e.target.value) || 0 })
                        }
                        placeholder="Ej. 150000"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Monto Abonado / Pagado (₡)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.honorariosPagado || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, honorariosPagado: Number(e.target.value) || 0 })
                        }
                        placeholder="Ej. 75000"
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* BLOQUE 4: DETALLE Y NOTAS CONFIDENCIALES */}
                <div className="space-y-3 pt-3 border-t border-[#F1F3F4]">
                  <h4 className="text-xs font-bold text-[#0B57D0] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>4. Detalle y Bitácora de la Abogada</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#444746] mb-1">
                      Detalle del Asunto / Solicitud del Cliente
                    </label>
                    <textarea
                      rows={2}
                      value={formData.detalleAsunto}
                      onChange={(e) => setFormData({ ...formData, detalleAsunto: e.target.value })}
                      placeholder="Describa el trámite solicitado (ej. Segregación de 2 lotes en San Roque con plano visado)..."
                      className="w-full p-2.5 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Próxima Cita / Vencimiento Registral
                      </label>
                      <input
                        type="date"
                        value={formData.proximaCita}
                        onChange={(e) => setFormData({ ...formData, proximaCita: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Notas Confidenciales del Bufete
                      </label>
                      <input
                        type="text"
                        value={formData.notasConfidenciales}
                        onChange={(e) => setFormData({ ...formData, notasConfidenciales: e.target.value })}
                        placeholder="Notas internas privadas de la abogada..."
                        className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#0B57D0]"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F3F4]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#DADCE0] text-[#444746] hover:bg-[#F8FAFD] text-xs font-medium transition cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {saving ? "Guardando en Atlas..." : modalMode === "create" ? "Guardar Cliente" : "Actualizar Cliente"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETALLE: FICHA NOTARIAL COMPLETA */}
      <AnimatePresence>
        {viewingCliente && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl border border-[#DADCE0] shadow-2xl p-6 sm:p-8 space-y-6 text-[#1F1F1F]"
            >
              {/* Encabezado Ficha */}
              <div className="flex items-start justify-between pb-4 border-b border-[#F1F3F4]">
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#EAF1FB] text-[#0B57D0] font-mono text-xs font-bold">
                    FICHA CLIENTE · VALVERDE & ASOCIADOS
                  </span>
                  <h3 className="text-xl font-bold text-[#1F1F1F] mt-2">
                    {viewingCliente.nombreCompleto}
                  </h3>
                  <p className="text-xs text-[#727775] mt-0.5">
                    {viewingCliente.tipoIdentificacion.toUpperCase()}: <span className="font-mono font-bold text-[#1F1F1F]">{viewingCliente.cedula || "No registrada"}</span>
                  </p>
                </div>
                <button
                  onClick={() => setViewingCliente(null)}
                  className="h-8 w-8 rounded-full hover:bg-[#F1F3F4] text-[#444746] flex items-center justify-center text-lg font-medium cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Generales de Ley para Redacción Notarial */}
              <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E0E2EC] space-y-2 text-xs">
                <p className="font-semibold text-[#0B57D0] uppercase tracking-wider text-[11px]">
                  Generales de Ley para Escritura Notarial:
                </p>
                <p className="text-[#1F1F1F] leading-relaxed">
                  <strong>{viewingCliente.nombreCompleto}</strong>, mayor de edad, estado civil{" "}
                  <strong>{viewingCliente.estadoCivil}</strong>, de profesión/oficio{" "}
                  <strong>{viewingCliente.profesion || "no especificado"}</strong>, nacionalidad{" "}
                  <strong>{viewingCliente.nacionalidad}</strong>, vecino de{" "}
                  <strong>{viewingCliente.domicilio || "Ciudad Quesada, San Carlos"}</strong>, portador del documento{" "}
                  <strong>
                    {viewingCliente.tipoIdentificacion.toUpperCase()} número {viewingCliente.cedula || "pendiente"}
                  </strong>.
                </p>
              </div>

              {/* Contacto y Estado */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC]">
                  <span className="text-[#727775] block">Teléfono / WhatsApp</span>
                  <span className="text-sm font-semibold text-[#1F1F1F] mt-1 block">
                    {viewingCliente.telefono}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC]">
                  <span className="text-[#727775] block">Estado del Trámite</span>
                  <span className="text-xs font-semibold text-[#0B57D0] mt-1 block capitalize">
                    {viewingCliente.estadoTramite.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Detalle del Asunto y Honorarios */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC] space-y-2 text-xs">
                <span className="text-[#727775] block">Detalle del Asunto:</span>
                <p className="text-sm text-[#1F1F1F] leading-relaxed">
                  {viewingCliente.detalleAsunto || "Sin observaciones adicionales registradas."}
                </p>
                {viewingCliente.numeroExpedienteOFinca && (
                  <p className="text-xs font-mono font-bold text-[#0B57D0] pt-1">
                    Expediente / Finca: {viewingCliente.numeroExpedienteOFinca}
                  </p>
                )}
              </div>

              {/* Estado de Cuenta */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E0E2EC] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#727775] block text-[11px]">Honorarios Totales</span>
                  <span className="text-sm font-bold text-[#1F1F1F]">
                    {formatCRC(viewingCliente.honorariosTotal)}
                  </span>
                </div>
                <div>
                  <span className="text-[#727775] block text-[11px]">Abonado</span>
                  <span className="text-sm font-bold text-[#16A34A]">
                    {formatCRC(viewingCliente.honorariosPagado)}
                  </span>
                </div>
                <div>
                  <span className="text-[#727775] block text-[11px]">Saldo Pendiente</span>
                  <span
                    className={`text-sm font-bold ${
                      viewingCliente.honorariosSaldo > 0 ? "text-[#B3261E]" : "text-[#16A34A]"
                    }`}
                  >
                    {formatCRC(viewingCliente.honorariosSaldo)}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href={getWhatsAppLink(viewingCliente)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <MessageCircle className="h-4 w-4 text-[#16A34A]" />
                  <span>Contactar por WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const c = viewingCliente;
                      setViewingCliente(null);
                      handleOpenEdit(c);
                    }}
                    className="px-4 py-2 rounded-full border border-[#DADCE0] text-[#444746] hover:bg-[#F8FAFD] text-xs font-medium transition cursor-pointer"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setViewingCliente(null)}
                    className="px-5 py-2 rounded-full bg-[#0B57D0] hover:bg-[#0842A0] text-white text-xs font-medium cursor-pointer transition shadow-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

