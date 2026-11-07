/**
 * Test de Verificación Criptográfica de Grado Militar (AES-256-GCM)
 * Valida confidencialidad, autenticidad y resistencia contra alteración de datos (tamper-proofing).
 */
import crypto from "node:crypto";

const SECRET_KEY = "e4d2a1b9c87f6543210fedcba9876543210fedcba9876543210fedcba9876543";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
}

function encrypt(text) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${enc}`;
}

function decrypt(cipherPayload) {
  const [ivHex, authTagHex, cipherHex] = cipherPayload.split(":");
  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let dec = decipher.update(cipherHex, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

console.log("=== INICIANDO AUDITORÍA CRIPTOGRÁFICA DE VALVERDE & ASOCIADOS ===");

const casoConfidencial = {
  cliente: "Dra. Johana Silva Valverde",
  identificacionFiscal: "CUIT 27-34567890-4",
  telefonoPrivado: "+54 9 11 9876-5432",
  hechosSensibles: "Conflicto societario de fusiones y adquisiciones con información privilegiada no pública.",
};

console.log("\n1. Datos originales en claro:");
console.log(casoConfidencial);

// Encriptación
const encryptedId = encrypt(casoConfidencial.identificacionFiscal);
const encryptedPhone = encrypt(casoConfidencial.telefonoPrivado);
const encryptedFacts = encrypt(casoConfidencial.hechosSensibles);

console.log("\n2. Datos como se guardan en la base de datos MongoDB:");
console.log({
  identificacionFiscal_cifrada: encryptedId,
  telefonoPrivado_cifrado: encryptedPhone,
  hechosSensibles_cifrados: encryptedFacts,
});

// Descifrado legítimo
console.log("\n3. Descifrado con clave autorizada de letrado:");
const decId = decrypt(encryptedId);
const decFacts = decrypt(encryptedFacts);
console.log("Identificación recuperada:", decId);
console.log("Hechos recuperados:", decFacts);

if (decId === casoConfidencial.identificacionFiscal && decFacts === casoConfidencial.hechosSensibles) {
  console.log("--> VERIFICACIÓN: Integridad del 100% en descifrado.");
}

// Prueba de alteración maliciosa (Ataque man-in-the-middle / Tampering en DB)
console.log("\n4. Prueba de resistencia contra alteración no autorizada (Tampering):");
const parts = encryptedFacts.split(":");
// Modificamos un carácter del texto cifrado
const tamperedCipher = parts[0] + ":" + parts[1] + ":" + (parts[2].slice(0, -2) + "ff");

try {
  decrypt(tamperedCipher);
  console.error("ERROR CRÍTICO: El algoritmo aceptó datos alterados.");
} catch {
  console.log("--> ÉXITO: El Authentication Tag de GCM rechazó el dato alterado y abortó inmediatamente.");
}

console.log("\n=== AUDITORÍA CRIPTOGRÁFICA COMPLETADA SATISFACTORIAMENTE ===");

