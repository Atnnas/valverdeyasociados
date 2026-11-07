import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient, ObjectId } from "mongodb";
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

function decrypt(cipherPayload) {
  const [ivHex, authTagHex, cipherHex] = cipherPayload.split(":");
  const key = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let dec = decipher.update(cipherHex, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

async function runEndToEndAtlasTest() {
  console.log("=== TEST DE FLUJO COMPLETO EN MONGODB ATLAS (kmadb) ===");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("consultations");

    // 1. Simulación de envío desde la web de Valverde & Asociados
    console.log("\n1. Registrando consulta de prueba desde formulario...");
    const testCase = {
      fullName: "Carlos Eduardo Vargas Solís",
      email: "carlos.vargas@ejemplo.cr",
      encryptedNationalId: encrypt("2-0789-0123"),
      encryptedPhone: encrypt("+506 8899 7766"),
      encryptedDescription: encrypt("Consulta sobre proceso de traspaso de propiedad y segregación en Ciudad Quesada."),
      legalArea: "traspasos_vehiculos_propiedades",
      consentAccepted: true,
      status: "RECIBIDO_ENCRIPTADO",
      createdAt: new Date(),
      clientIpHash: "190.113.10.5",
    };

    const insertResult = await collection.insertOne(testCase);
    const folioId = insertResult.insertedId.toString();
    console.log(`✓ Consulta guardada en MongoDB Atlas. Folio generado: ${folioId}`);

    // 2. Simulación de verificación pública por folio (/boveda)
    console.log("\n2. Simulando verificación en /boveda con Folio ID...");
    const publicRecord = await collection.findOne(
      { _id: new ObjectId(folioId) },
      { projection: { fullName: 1, legalArea: 1, status: 1, createdAt: 1 } }
    );
    console.log("✓ Datos públicos visibles para el cliente:");
    console.log({
      folio: publicRecord._id.toString(),
      titular: publicRecord.fullName,
      servicio: publicRecord.legalArea,
      estado: publicRecord.status,
    });

    // 3. Simulación de acceso por abogado autorizado (/admin)
    console.log("\n3. Simulando descifrado judicial por letrado autorizado...");
    const secretRecord = await collection.findOne({ _id: new ObjectId(folioId) });
    const idDescifrado = decrypt(secretRecord.encryptedNationalId);
    const telDescifrado = decrypt(secretRecord.encryptedPhone);
    const hechosDescifrados = decrypt(secretRecord.encryptedDescription);

    console.log("✓ Antecedentes descifrados con clave de la firma:");
    console.log({
      cedula: idDescifrado,
      telefono: telDescifrado,
      hechos: hechosDescifrados,
    });

    // 4. Limpieza del registro de prueba
    await collection.deleteOne({ _id: new ObjectId(folioId) });
    console.log("\n✓ Registro de prueba eliminado para mantener limpia la base de datos.");

    console.log("\n=======================================================");
    console.log("¡TODO EL CIRCUITO ATLAS FUNCIONA AL 100% DE EFICACIA!");
    console.log("=======================================================");

  } catch (err) {
    console.error("Error en test de Atlas:", err);
  } finally {
    await client.close();
  }
}

runEndToEndAtlasTest();
