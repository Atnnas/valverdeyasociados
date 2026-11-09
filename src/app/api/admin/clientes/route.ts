import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { auth, SUPER_ADMIN_EMAIL } from "@/auth";
import { ObjectId } from "mongodb";
import { ClienteRecord } from "@/types/cliente";

/**
 * Valida si la petición proviene de un usuario autenticado con rol de Administrador activo
 * o mediante la llave de interoperabilidad administrativa (ADMIN_API_KEY).
 */
async function isAuthorizedAdmin(req: NextRequest): Promise<{ authorized: boolean; email?: string }> {
  // 1. Revisar Bearer Token para interoperabilidad administrativa
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.ADMIN_API_KEY || "valverde_admin_key_2026";
  if (authHeader === `Bearer ${expectedKey}`) {
    return { authorized: true, email: "api_system@valverde.cr" };
  }

  // 2. Revisar sesión activa de NextAuth
  const session = await auth();
  const sessionUser = session?.user
    ? (session.user as { email?: string | null; rol?: string; activo?: boolean })
    : undefined;
  const email = sessionUser?.email?.toLowerCase()?.trim();

  // Super Administrador siempre autorizado
  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { authorized: true, email };
  }

  // Solo administradores activos
  if (sessionUser?.rol === "administrador" && sessionUser?.activo === true) {
    return { authorized: true, email };
  }

  return { authorized: false };
}

// GET: Listar clientes con filtrado y búsqueda
export async function GET(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Requiere rol de Administrador activo." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase()?.trim() || "";
    const area = searchParams.get("area")?.trim() || "";
    const estado = searchParams.get("estado")?.trim() || "";

    const db = await getDatabase();
    const clientesCollection = db.collection("clientes");

    const filter: Record<string, unknown> = {};

    if (area && area !== "todas") {
      filter.areaLegal = area;
    }

    if (estado && estado !== "todos") {
      filter.estadoTramite = estado;
    }

    if (query) {
      filter.$or = [
        { nombre: { $regex: query, $options: "i" } },
        { primerApellido: { $regex: query, $options: "i" } },
        { segundoApellido: { $regex: query, $options: "i" } },
        { nombreCompleto: { $regex: query, $options: "i" } },
        { cedula: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { telefono: { $regex: query, $options: "i" } },
        { detalleAsunto: { $regex: query, $options: "i" } },
        { numeroExpedienteOFinca: { $regex: query, $options: "i" } },
      ];
    }

    const clientes = await clientesCollection
      .find(filter)
      .sort({ actualizadoEn: -1, creadoEn: -1 })
      .toArray();

    const formatted: ClienteRecord[] = clientes.map((c) => ({
      id: c._id.toString(),
      nombre: c.nombre || "",
      primerApellido: c.primerApellido || "",
      segundoApellido: c.segundoApellido || "",
      nombreCompleto:
        c.nombreCompleto ||
        `${c.nombre || ""} ${c.primerApellido || ""} ${c.segundoApellido || ""}`.trim(),
      tipoIdentificacion: c.tipoIdentificacion || "cedula",
      cedula: c.cedula || "",
      email: c.email || "",
      telefono: c.telefono || "",
      telefonoSecundario: c.telefonoSecundario || "",
      estadoCivil: c.estadoCivil || "soltero",
      profesion: c.profesion || "",
      nacionalidad: c.nacionalidad || "Costarricense",
      domicilio: c.domicilio || "",
      areaLegal: c.areaLegal || "notarial_propiedades",
      estadoTramite: c.estadoTramite || "consulta_inicial",
      detalleAsunto: c.detalleAsunto || "",
      numeroExpedienteOFinca: c.numeroExpedienteOFinca || "",
      honorariosTotal: Number(c.honorariosTotal) || 0,
      honorariosPagado: Number(c.honorariosPagado) || 0,
      honorariosSaldo:
        (Number(c.honorariosTotal) || 0) - (Number(c.honorariosPagado) || 0),
      proximaCita: c.proximaCita || "",
      notasConfidenciales: c.notasConfidenciales || "",
      creadoEn: c.creadoEn || new Date().toISOString(),
      actualizadoEn: c.actualizadoEn || new Date().toISOString(),
      creadoPor: c.creadoPor || "",
    }));

    return NextResponse.json({ success: true, clientes: formatted });
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    return NextResponse.json(
      { success: false, error: "Error al recuperar la lista de clientes." },
      { status: 500 }
    );
  }
}

// POST: Registrar nuevo cliente en el CRM
export async function POST(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Requiere rol de Administrador activo." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      nombre,
      primerApellido,
      segundoApellido,
      tipoIdentificacion,
      cedula,
      email,
      telefono,
      telefonoSecundario,
      estadoCivil,
      profesion,
      nacionalidad,
      domicilio,
      areaLegal,
      estadoTramite,
      detalleAsunto,
      numeroExpedienteOFinca,
      honorariosTotal,
      honorariosPagado,
      proximaCita,
      notasConfidenciales,
    } = body;

    if (!nombre || !primerApellido || !telefono) {
      return NextResponse.json(
        { success: false, error: "El nombre, primer apellido y teléfono móvil son obligatorios." },
        { status: 400 }
      );
    }

    const total = Math.max(0, Number(honorariosTotal) || 0);
    const pagado = Math.max(0, Number(honorariosPagado) || 0);
    const saldo = total - pagado;

    const nombreCompleto = `${nombre.trim()} ${primerApellido.trim()} ${(segundoApellido || "").trim()}`.trim();
    const now = new Date().toISOString();

    const db = await getDatabase();
    const clientesCollection = db.collection("clientes");

    // Verificar si ya existe un cliente con la misma cédula (si fue provista)
    if (cedula && cedula.trim()) {
      const existing = await clientesCollection.findOne({
        cedula: cedula.trim(),
      });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: `Ya existe un cliente registrado con la cédula ${cedula.trim()} (${existing.nombreCompleto}).`,
          },
          { status: 409 }
        );
      }
    }

    const nuevoCliente = {
      nombre: nombre.trim(),
      primerApellido: primerApellido.trim(),
      segundoApellido: (segundoApellido || "").trim(),
      nombreCompleto,
      tipoIdentificacion: tipoIdentificacion || "cedula",
      cedula: (cedula || "").trim(),
      email: (email || "").trim().toLowerCase(),
      telefono: (telefono || "").trim(),
      telefonoSecundario: (telefonoSecundario || "").trim(),
      estadoCivil: estadoCivil || "soltero",
      profesion: (profesion || "").trim(),
      nacionalidad: (nacionalidad || "Costarricense").trim(),
      domicilio: (domicilio || "").trim(),
      areaLegal: areaLegal || "notarial_propiedades",
      estadoTramite: estadoTramite || "consulta_inicial",
      detalleAsunto: (detalleAsunto || "").trim(),
      numeroExpedienteOFinca: (numeroExpedienteOFinca || "").trim(),
      honorariosTotal: total,
      honorariosPagado: pagado,
      honorariosSaldo: saldo,
      proximaCita: (proximaCita || "").trim(),
      notasConfidenciales: (notasConfidenciales || "").trim(),
      creadoEn: now,
      actualizadoEn: now,
      creadoPor: authResult.email || "administrador",
    };

    const result = await clientesCollection.insertOne(nuevoCliente);

    return NextResponse.json(
      {
        success: true,
        message: "Cliente registrado exitosamente en el CRM.",
        id: result.insertedId.toString(),
        cliente: { ...nuevoCliente, id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error al registrar cliente:", err);
    return NextResponse.json(
      { success: false, error: "Error en el servidor al registrar el cliente." },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar datos de un cliente existente
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Requiere rol de Administrador activo." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Identificador de cliente no válido." },
        { status: 400 }
      );
    }

    // Recalcular nombre completo si cambiaron nombres
    if (updates.nombre || updates.primerApellido || updates.segundoApellido !== undefined) {
      const db = await getDatabase();
      const current = await db.collection("clientes").findOne({ _id: new ObjectId(id) });
      if (current) {
        const n = updates.nombre !== undefined ? updates.nombre.trim() : current.nombre;
        const a1 = updates.primerApellido !== undefined ? updates.primerApellido.trim() : current.primerApellido;
        const a2 = updates.segundoApellido !== undefined ? updates.segundoApellido.trim() : current.segundoApellido;
        updates.nombreCompleto = `${n} ${a1} ${a2}`.trim();
      }
    }

    // Recalcular saldo si se actualizaron honorarios
    if (updates.honorariosTotal !== undefined || updates.honorariosPagado !== undefined) {
      const db = await getDatabase();
      const current = await db.collection("clientes").findOne({ _id: new ObjectId(id) });
      if (current) {
        const total =
          updates.honorariosTotal !== undefined
            ? Math.max(0, Number(updates.honorariosTotal) || 0)
            : current.honorariosTotal || 0;
        const pagado =
          updates.honorariosPagado !== undefined
            ? Math.max(0, Number(updates.honorariosPagado) || 0)
            : current.honorariosPagado || 0;
        updates.honorariosTotal = total;
        updates.honorariosPagado = pagado;
        updates.honorariosSaldo = total - pagado;
      }
    }

    updates.actualizadoEn = new Date().toISOString();

    const db = await getDatabase();
    const result = await db.collection("clientes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Cliente no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ficha del cliente actualizada correctamente.",
    });
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    return NextResponse.json(
      { success: false, error: "Error en el servidor al actualizar el cliente." },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar cliente del CRM
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await isAuthorizedAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Requiere rol de Administrador activo." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Identificador de cliente no válido." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("clientes").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Cliente no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cliente eliminado del CRM correctamente.",
    });
  } catch (err) {
    console.error("Error al eliminar cliente:", err);
    return NextResponse.json(
      { success: false, error: "Error en el servidor al eliminar el cliente." },
      { status: 500 }
    );
  }
}

