import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import { decryptSensitiveField } from "@/lib/security/crypto";
import { auth, SUPER_ADMIN_EMAIL } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Identificador de consulta inválido" },
        { status: 400 }
      );
    }

    // Require Bearer Authorization or Google OAuth session with role
    const authHeader = req.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "valverde_admin_key_2026";
    let isAuthorized = authHeader === `Bearer ${adminKey}`;

    if (!isAuthorized) {
      const session = await auth();
      const sessionUser = session?.user
        ? (session.user as { email?: string | null; rol?: string; activo?: boolean })
        : undefined;
      const email = sessionUser?.email?.toLowerCase()?.trim();
      if (
        email === SUPER_ADMIN_EMAIL.toLowerCase() ||
        (sessionUser?.activo === true && ["administrador", "editor"].includes(sessionUser?.rol || ""))
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Se requiere token judicial o sesión autorizada activa.",
        },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const casesCollection = db.collection("consultations");

    const record = await casesCollection.findOne({ _id: new ObjectId(id) });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Expediente no encontrado en la bóveda." },
        { status: 404 }
      );
    }

    // Secure decryption of sensitive fields using AES-256-GCM
    const decryptedNationalId = decryptSensitiveField(record.encryptedNationalId);
    const decryptedPhone = decryptSensitiveField(record.encryptedPhone);
    const decryptedDescription = decryptSensitiveField(record.encryptedDescription);

    return NextResponse.json({
      success: true,
      case: {
        id: record._id.toString(),
        fullName: record.fullName,
        email: record.email,
        legalArea: record.legalArea,
        status: record.status || "RECIBIDO_ENCRIPTADO",
        createdAt: record.createdAt,
        nationalId: decryptedNationalId,
        phone: decryptedPhone,
        description: decryptedDescription,
      },
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[DECRYPT CASE ERROR]:", err);
    return NextResponse.json(
      { success: false, error: "Error criptográfico al recuperar expediente confidencial." },
      { status: 500 }
    );
  }
}
