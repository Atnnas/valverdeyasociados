import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";

export async function GET(req: NextRequest) {
  try {
    const folio = req.nextUrl.searchParams.get("folio");

    if (!folio || !ObjectId.isValid(folio)) {
      return NextResponse.json(
        { success: false, error: "Identificador de folio no válido" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("joha_abogados");
    const casesCollection = db.collection("consultations");

    const record = await casesCollection.findOne(
      { _id: new ObjectId(folio) },
      { projection: { legalArea: 1, status: 1, createdAt: 1, fullName: 1 } }
    );

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Folio no encontrado en la bóveda fiduciaria" },
        { status: 404 }
      );
    }

    // Return only non-sensitive public audit data
    const nameParts = record.fullName.split(" ");
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1][0]}.***`
      : `${record.fullName[0]}***`;

    return NextResponse.json({
      success: true,
      data: {
        folio: record._id.toString(),
        clientMasked: maskedName,
        legalArea: record.legalArea,
        status: record.status || "RECIBIDO_ENCRIPTADO",
        receivedAt: record.createdAt,
        securityProtocol: "AES-256-GCM / TLS 1.3",
      },
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[SECURITY STATUS LOG] Error checking folio:", err);
    return NextResponse.json(
      { success: false, error: "Error de verificación criptográfica" },
      { status: 500 }
    );
  }
}

