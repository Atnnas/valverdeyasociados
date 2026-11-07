import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { auth, SUPER_ADMIN_EMAIL } from "@/auth";

// Verifica si la solicitud proviene de un administrador autenticado por sesión o por Bearer Token
async function isAuthorizedAdmin(req: NextRequest): Promise<{ authorized: boolean; bySession: boolean }> {
  // 1. Revisar Bearer Token para interoperabilidad judicial
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.ADMIN_API_KEY || "valverde_admin_key_2026";
  if (authHeader === `Bearer ${expectedKey}`) {
    return { authorized: true, bySession: false };
  }

  // 2. Revisar sesión activa de NextAuth
  const session = await auth();
  const sessionUser = session?.user
    ? (session.user as { email?: string | null; rol?: string; activo?: boolean })
    : undefined;
  const email = sessionUser?.email?.toLowerCase()?.trim();

  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { authorized: true, bySession: true };
  }

  if (sessionUser?.rol === "administrador" && sessionUser?.activo === true) {
    return { authorized: true, bySession: true };
  }

  return { authorized: false, bySession: false };
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Requiere rol de Administrador activo." },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("usuarios");

    const usuarios = await usersCollection
      .find({})
      .sort({ creadoEn: -1 })
      .toArray();

    const formatted = usuarios.map((u) => ({
      id: u._id.toString(),
      nombre: u.nombre || "Usuario",
      email: u.email,
      imagen: u.imagen || "",
      rol: u.rol || "visitante",
      activo: Boolean(u.activo),
      creadoEn: u.creadoEn || new Date().toISOString(),
      ultimoIngreso: u.ultimoIngreso || u.creadoEn || "",
      isSuperAdmin: u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase(),
    }));

    return NextResponse.json({ success: true, usuarios: formatted });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[ADMIN USUARIOS GET ERROR]:", err);
    return NextResponse.json(
      { success: false, error: "Error al recuperar los usuarios del sistema." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Solo administradores pueden gestionar usuarios." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, rol, activo } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "El correo electrónico del usuario es obligatorio." },
        { status: 400 }
      );
    }

    const targetEmail = String(email).toLowerCase().trim();
    const isTargetSuperAdmin = targetEmail === SUPER_ADMIN_EMAIL.toLowerCase();

    // Protección para la cuenta raíz del administrador principal
    if (isTargetSuperAdmin && (activo === false || (rol && rol !== "administrador"))) {
      return NextResponse.json(
        { success: false, error: "La cuenta raíz del administrador principal no puede ser desactivada ni degradada." },
        { status: 400 }
      );
    }

    const updateFields: Record<string, unknown> = {};

    if (rol !== undefined) {
      if (!["administrador", "editor", "visitante"].includes(rol)) {
        return NextResponse.json(
          { success: false, error: "Rol no válido. Permitidos: administrador, editor, visitante." },
          { status: 400 }
        );
      }
      updateFields.rol = rol;
    }

    if (activo !== undefined) {
      updateFields.activo = Boolean(activo);
    }

    updateFields.actualizadoEn = new Date().toISOString();

    const db = await getDatabase();
    const usersCollection = db.collection("usuarios");

    const result = await usersCollection.updateOne(
      { email: targetEmail },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado en la base de datos." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Usuario ${targetEmail} actualizado correctamente.`,
      updated: updateFields,
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[ADMIN USUARIOS PATCH ERROR]:", err);
    return NextResponse.json(
      { success: false, error: "Error al actualizar usuario." },
      { status: 500 }
    );
  }
}
