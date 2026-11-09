import dns from "node:dns";
// Set reliable DNS servers for SRV lookups (prevents Windows ECONNREFUSED with local ISP DNS)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient, ServerApiVersion } from "mongodb";
import crypto from "node:crypto";

const uri = "mongodb+srv://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@kmadb.jodngjz.mongodb.net/valverde_asociados?retryWrites=true&w=majority";
const dbName = "valverde_asociados";
const ENCRYPTION_SECRET = "e4d2a1b9c87f6543210fedcba9876543210fedcba9876543210fedcba9876543";

function encrypt(text) {
  const key = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${enc}`;
}

async function init() {
  console.log("=== CONECTANDO A MONGODB ATLAS (kmadb.jodngjz.mongodb.net) ===");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 20000,
  });

  try {
    await client.connect();
    console.log("✓ Conexión establecida con éxito al clúster MongoDB Atlas.");

    const db = client.db(dbName);

    // 1. Configurar colección 'consultations' e índices
    console.log("\n1. Configurando colección 'consultations' con índices optimizados...");
    const consultations = db.collection("consultations");

    await consultations.createIndex({ createdAt: -1 });
    await consultations.createIndex({ email: 1 });
    await consultations.createIndex({ status: 1 });
    await consultations.createIndex({ legalArea: 1 });
    console.log("✓ Índices creados: createdAt (-1), email (1), status (1), legalArea (1).");

    // 2. Configurar colección 'audit_logs'
    console.log("\n2. Configurando colección 'audit_logs' para registro fiduciario de letrados...");
    const auditLogs = db.collection("audit_logs");
    await auditLogs.createIndex({ timestamp: -1 });
    console.log("✓ Índices creados en 'audit_logs'.");

    // 3. Registrar consulta inicial fiduciaria (Semilla encriptada)
    const existingCount = await consultations.countDocuments();
    console.log(`\nDocumentos existentes en 'consultations': ${existingCount}`);

    if (existingCount === 0) {
      console.log("Insertando expediente de apertura con cifrado AES-256-GCM...");
      const seedCase = {
        fullName: "Dra. Johana Silva Valverde",
        email: "consultorio@valverdeasociados.cr",
        encryptedNationalId: encrypt("2-0543-0891"),
        encryptedPhone: encrypt("+506 8757 8891"),
        encryptedDescription: encrypt("Apertura oficial del Consultorio Jurídico Valverde & Asociados en Ciudad Quesada. Asesoría en derecho de familia, traspasos, pensiones alimentarias y trámites notariales."),
        legalArea: "matrimonios_civiles",
        consentAccepted: true,
        status: "RECIBIDO_ENCRIPTADO",
        createdAt: new Date(),
        clientIpHash: "127.0.0.1",
      };

      const result = await consultations.insertOne(seedCase);
      console.log(`✓ Expediente inicial creado con Folio ID: ${result.insertedId.toString()}`);

      await auditLogs.insertOne({
        action: "DATABASE_INITIALIZATION",
        details: "Creación y configuración de la base de datos valverde_asociados en clúster Atlas kmadb",
        timestamp: new Date(),
        status: "SUCCESS",
      });
    }

    // Ping al servidor para verificar estado
    const pingResult = await client.db("admin").command({ ping: 1 });
    console.log("\n✓ Estado del clúster (Ping OK):", pingResult);
    console.log(`\n================================================================`);
    console.log(`¡BASE DE DATOS '${dbName}' CREADA Y LISTA EN MONGODB ATLAS!`);
    console.log(`================================================================`);

  } catch (error) {
    console.error("Error al inicializar la base de datos en MongoDB Atlas:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Conexión cerrada limpiamente.");
  }
}

init();
