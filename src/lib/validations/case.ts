import { z } from "zod";

export const LegalAreaEnum = z.enum([
  "derecho_corporativo",
  "litigios_civiles",
  "defensa_penal",
  "derecho_laboral",
  "propiedad_intelectual",
  "compliance_tributario",
]);

export type LegalArea = z.infer<typeof LegalAreaEnum>;

export const CaseConsultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(120, "El nombre excede el límite permitido")
    .regex(/^[\p{L}\s.'-]+$/u, "El nombre contiene caracteres inválidos"),

  email: z
    .string()
    .trim()
    .email("Correo electrónico inválido")
    .max(254, "Correo demasiado largo"),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Número telefónico inválido"),

  // Campo altamente sensible: Cédula o Identificación Fiscal
  nationalId: z
    .string()
    .trim()
    .min(5, "Identificación demasiado corta")
    .max(30, "Identificación demasiado larga"),

  legalArea: LegalAreaEnum,

  // Campo altamente sensible: Descripción confidencial de los hechos
  description: z
    .string()
    .trim()
    .min(10, "La descripción del caso debe tener al menos 10 caracteres")
    .max(4000, "La descripción supera los 4000 caracteres"),

  // Consentimiento explícito de tratamiento de datos confidenciales
  consentAccepted: z
    .boolean()
    .refine((val) => val === true, "Debe aceptar el tratamiento de datos y secreto profesional"),
});

export type CaseConsultationInput = z.infer<typeof CaseConsultationSchema>;

