import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise, { getDatabase } from "@/lib/db/mongodb";
import { decryptSensitiveField } from "@/lib/security/crypto";

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

    // Require Bearer Authorization for viewing sensitive consultation records
    const authHeader = req.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "joha_secure_admin_key_2026";

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Se requiere token de acceso judicial o de la firma.",
        },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const casesCollection = db.collection("consultations");

    const record = await casesCollection.findOne({ _id: new ObjectId(id) });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Consulta no encontrada en la bóveda" },
        { status: 404 }
      );
    }

    // Securely decrypt fields on demand for authorized attorney
    const decryptedNationalId = decryptSensitiveField(record.encryptedNationalId);
    const decryptedPhone = decryptSensitiveField(record.encryptedPhone);
    const decryptedDescription = decryptSensitiveField(record.encryptedDescription);

    return NextResponse.json({
      success: true,
      case: {
        id: record._id.toString(),
        fullName: record.fullName,
        email: record.email,
        nationalId: decryptedNationalId,
        phone: decryptedPhone,
        legalArea: record.legalArea,
        description: decryptedDescription,
        status: record.status,
        createdAt: record.createdAt,
      },
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[SECURITY LOG] Error retrieving case:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "Error interno al recuperar el expediente cifrado." },
      { status: 500 }
    );
  }
}

