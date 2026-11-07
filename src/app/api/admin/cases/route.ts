import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import { auth, SUPER_ADMIN_EMAIL } from "@/auth";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.ADMIN_API_KEY || "valverde_admin_key_2026";
  if (authHeader === `Bearer ${expectedKey}`) {
    return true;
  }

  // Verificar por sesión Google OAuth
  const session = await auth();
  const sessionUser = session?.user
    ? (session.user as { email?: string | null; rol?: string; activo?: boolean })
    : undefined;
  const email = sessionUser?.email?.toLowerCase()?.trim();

  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  if (sessionUser?.activo === true && ["administrador", "editor"].includes(sessionUser?.rol || "")) {
    return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    const authorized = await isAuthorized(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Credenciales de letrado no válidas o cuenta no activa." },
        { status: 401 }
      );
    }

    const db = await getDatabase();
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
    const authorized = await isAuthorized(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, newStatus } = body;

    if (!id || !newStatus) {
      return NextResponse.json({ success: false, error: "Datos insuficientes." }, { status: 400 });
    }

    const db = await getDatabase();
    const casesCollection = db.collection("consultations");

    const result = await casesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Expediente no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Estado de expediente actualizado." });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[ADMIN CASES PATCH ERROR]:", err);
    return NextResponse.json({ success: false, error: "Error al actualizar estado." }, { status: 500 });
  }
}
