export type TipoIdentificacion = "cedula" | "dimex" | "pasaporte" | "juridica";

export type EstadoCivil = "soltero" | "casado" | "divorciado" | "viudo" | "union_hecho";

export type AreaLegalCliente =
  | "familia"
  | "notarial_propiedades"
  | "notarial_vehiculos"
  | "sucesiones"
  | "notarial_especial"
  | "civil_general";

export type EstadoTramite =
  | "consulta_inicial"
  | "recoleccion_requisitos"
  | "en_tramite"
  | "pendiente_firma"
  | "concluido"
  | "archivado";

export interface ClienteRecord {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  tipoIdentificacion: TipoIdentificacion;
  cedula: string;
  email: string;
  telefono: string;
  telefonoSecundario?: string;
  estadoCivil: EstadoCivil;
  profesion: string;
  nacionalidad: string;
  domicilio: string;
  areaLegal: AreaLegalCliente;
  estadoTramite: EstadoTramite;
  detalleAsunto: string;
  numeroExpedienteOFinca?: string;
  honorariosTotal: number;
  honorariosPagado: number;
  honorariosSaldo: number;
  proximaCita?: string;
  notasConfidenciales?: string;
  creadoEn: string;
  actualizadoEn: string;
  creadoPor?: string;
}

