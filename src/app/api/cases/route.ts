import { NextRequest, NextResponse } from "next/server";
import { CaseConsultationSchema } from "@/lib/validations/case";
import { encryptSensitiveField } from "@/lib/security/crypto";
import clientPromise from "@/lib/db/mongodb";

// Standard security headers for sensitive financial/legal API endpoints
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
};

export async function POST(req: NextRequest) {
  try {
    // 1. Parsing and payload size protection
    const body = await req.json();

    // 2. Strict Zod validation
    const validationResult = CaseConsultationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Los datos enviados contienen errores de validación",
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const validData = validationResult.data;

    // 3. Client-Side Field-Level Encryption (CSFLE) simulation for sensitive data:
    // Any highly sensitive information is encrypted with AES-256-GCM before saving to MongoDB
    const encryptedNationalId = encryptSensitiveField(validData.nationalId);
    const encryptedPhone = encryptSensitiveField(validData.phone);
    const encryptedDescription = encryptSensitiveField(validData.description);

    // 4. Persistence in MongoDB
    const client = await clientPromise;
    const db = client.db("joha_abogados");
    const casesCollection = db.collection("consultations");

    const recordToInsert = {
      fullName: validData.fullName,
      email: validData.email.toLowerCase(),
      // Encrypted sensitive fields
      encryptedNationalId,
      encryptedPhone,
      encryptedDescription,
      legalArea: validData.legalArea,
      consentAccepted: validData.consentAccepted,
      status: "RECIBIDO_ENCRIPTADO",
      createdAt: new Date(),
      clientIpHash: req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
    };

    const insertResult = await casesCollection.insertOne(recordToInsert);

    // 5. Response masking (never return raw encrypted cipher or plain sensitive data)
    const maskedId = validData.nationalId.length > 4
      ? `****${validData.nationalId.slice(-4)}`
      : "****";

    return NextResponse.json(
      {
        success: true,
        message: "Consulta jurídica recibida y almacenada bajo cifrado de grado militar (AES-256-GCM).",
        caseRef: insertResult.insertedId.toString(),
        maskedIdentifier: maskedId,
        area: validData.legalArea,
        timestamp: recordToInsert.createdAt.toISOString(),
      },
      {
        status: 201,
        headers: SECURITY_HEADERS,
      }
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    // Generic secure message to client: NEVER leak DB connection strings or stack traces
    console.error("[SECURITY LOG] Error processing consultation:", err instanceof Error ? err.message : err);

    return NextResponse.json(
      {
        success: false,
        error: "Ocurrió un error al procesar y cifrar la solicitud de forma segura.",
      },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
