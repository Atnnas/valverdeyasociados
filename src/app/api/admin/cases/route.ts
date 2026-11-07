import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import { decryptSensitiveField } from "@/lib/security/crypto";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.ADMIN_API_KEY || "valverde_admin_key_2026";
  return authHeader === `Bearer ${expectedKey}`;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: "Credenciales de letrado no válidas." },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("joha_abogados");
    const casesCollection = db.collection("consultations");

    const cases = await casesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const formatted = cases.map((c) => ({
      id: c._id.toString(),
      fullName: c.fullName,
      email: c.email,
      legalArea: c.legalArea,
      status: c.status || "RECIBIDO_ENCRIPTADO",
      createdAt: c.createdAt,
      // Provide encrypted strings so the frontend client can request on-demand decryption
      hasEncryptedData: Boolean(c.encryptedDescription),
    }));

    return NextResponse.json({ success: true, cases: formatted });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[ADMIN CASES GET ERROR]:", err);
    return NextResponse.json({ success: false, error: "Error al recuperar expedientes." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: "No autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, newStatus } = body;

    if (!id || !ObjectId.isValid(id) || !newStatus) {
      return NextResponse.json({ success: false, error: "Datos de actualización inválidos." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("joha_abogados");
    const casesCollection = db.collection("consultations");

    await casesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, message: "Estado de expediente actualizado con éxito." });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[ADMIN CASES PATCH ERROR]:", err);
    return NextResponse.json({ success: false, error: "Error al actualizar estado." }, { status: 500 });
  }
}

