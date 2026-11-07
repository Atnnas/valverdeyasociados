# Valverde & Asociados — Consultorio Jurídico
### Plataforma Web Institucional con Bóveda Criptográfica y Web Services Seguros

Plataforma web de élite desarrollada en **Next.js (App Router)** para **Valverde & Asociados – Consultorio Jurídico**, diseñada para la recepción, custodia y gestión de información jurídica de alta sensibilidad (secretos industriales, datos personales fiduciarios, antecedentes penales y corporativos) respaldada por **MongoDB** y cifrado simétrico autenticado **AES-256-GCM**.

---

## 🏛️ 1. Identidad Visual y Diseño
La dirección de arte de la web se diseñó de manera personalizada en torno al **logotipo oficial de Valverde & Asociados**:
- **Pizarra Petróleo Profundo (`#2B3840` / `#141C22`):** Inspirado en las hojas de laurel y el nombre institucional.
- **Oro Envejecido Institucional (`#CCA046` / `#DFB55D`):** Derivado de la balanza de la justicia y el subtítulo *"CONSULTORIO JURÍDICO"*.
- **Fondo Obsidiana (`#0E151A`):** Superficie de alta elegancia y contraste, que resalta las microinteracciones doradas y el sello fiduciario.
- **Tipografía Didone y Sans-Serif:**
  - *Playfair Display:* Títulos y marcas que proyectan autoridad histórica y respetabilidad procesal.
  - *Geist Sans:* Textos técnicos y descriptores en mayúsculas con espaciado amplio (`letter-spacing: 0.22em`).
- **100% Responsivo (Mobile-First):** Menú móvil animado con **Framer Motion**, botones táctiles accesibles (44px+) y cuadrículas fluidas adaptadas a celulares, tablets y ordenadores de escritorio.

---

## 🔒 2. Arquitectura de Seguridad (Zero-Knowledge)

La plataforma aplica el principio de **seguridad en capas**:

1. **Cifrado de Campo en Reposo (AES-256-GCM):**
   - Utilidad: `src/lib/security/crypto.ts`
   - Los campos sensibles (`nationalId`, `phone`, `description`) se cifran mediante **AES-256** en modo **Galois/Counter Mode (GCM)** antes de almacenarse en MongoDB.
   - Cada registro cuenta con su propio vector de inicialización (`IV`) único y una firma de autenticidad (*Authentication Tag* de 128 bits). Cualquier alteración en base de datos es detectada y rechazada de inmediato (*Tamper-evident*).
2. **Validación Estricta con Zod:**
   - Esquema: `src/lib/validations/case.ts`
   - Sanitización en runtime contra ataques de inyección NoSQL (`$where`, `$regex`) y bloqueo de payloads maliciosos.
3. **Cabeceras de Protección HTTP:**
   - Configuradas en `next.config.ts`:
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
     - `X-Frame-Options: DENY` (anti-Clickjacking)
     - `X-Content-Type-Options: nosniff` (anti-MIME sniffing)
     - `Referrer-Policy: origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
4. **Ofuscación de Respuestas y Control de Acceso Judicial:**
   - Los Web Services públicos nunca exponen datos sensibles legibles.
   - El acceso al descifrado de expedientes está restringido al endpoint `/api/cases/[id]` mediante token de letrado (`Authorization: Bearer <ADMIN_API_KEY>`).

---

## 🗄️ 3. Conexión Resiliente a MongoDB

- Archivo: `src/lib/db/mongodb.ts`
- Implementa el patrón **Singleton** optimizado para entornos serverless:
  - Reutilización de la promesa del cliente entre recargas en desarrollo.
  - `maxPoolSize: 15`, `maxIdleTimeMS: 30000`, `connectTimeoutMS: 10000` para prevenir fuga de sockets (*pool exhaustion*).

---

## ⚡ 4. Skills de [skills.sh](https://www.skills.sh/) Instaladas

En `.agents/skills/` se encuentran integradas las siguientes directrices y reglas oficiales para agentes:
- **`frontend-design`** *(Anthropic)*: Dirección de arte visual con personalidad, evitando plantillas genéricas.
- **`web-design-guidelines`** *(Vercel)*: Normas de accesibilidad (WCAG), contraste y usabilidad.
- **`vercel-react-best-practices`** *(Vercel)*: Reglas de rendimiento para Next.js y React 19.
- **`mongodb-connection`** *(MongoDB)*: Patrones óptimos de conexión para serverless.
- **`mongodb-query-optimizer`** *(MongoDB)*: Consultas e índices seguros.
- **`webapp-testing`** *(Anthropic)*: Integración de pruebas funcionales y de interfaz.

---

## 🗺️ 5. Rutas y Web Services

| Ruta | Método | Descripción |
| :--- | :--- | :--- |
| `/` | `GET` | Portada institucional con el hero, áreas procesales y **Bóveda de Consulta Cifrada**. |
| `/boveda` | `GET` | Portal para que el cliente o letrado verifique el estado fiduciario de su número de folio. |
| `/admin` | `GET` | Panel de control judicial para abogados autorizados (gestión y descifrado de casos). |
| `/api/cases` | `POST` | Web Service de recepción: valida con Zod, cifra con AES-256 y guarda en MongoDB. |
| `/api/cases/status` | `GET` | Web Service público: audita el estado del folio con datos personales ofuscados. |
| `/api/cases/[id]` | `GET` | Web Service judicial: descifrado autorizado mediante Bearer Token. |
| `/api/admin/cases` | `GET / PATCH` | Web Service administrativo: listado y actualización de estados procesales. |

---

## 🚀 6. Puesta en Marcha

### Requisitos previos
- **Node.js:** v20+ (probado en v25.4.0)
- **MongoDB:** Instancia local o MongoDB Atlas

### Variables de Entorno (`.env.local`)
Copia `.env.example` a `.env.local` y ajusta tus variables:
```env
MONGODB_URI=mongodb://localhost:27017/joha_abogados
ENCRYPTION_SECRET_KEY=e4d2a1b9c87f6543210fedcba9876543210fedcba9876543210fedcba9876543
ADMIN_API_KEY=valverde_admin_key_2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Comandos de Ejecución
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm run start

# Ejecutar auditoría criptográfica
node scripts/test-e2e-crypto.mjs
```

---
© 2026 Valverde & Asociados – Consultorio Jurídico. Todos los derechos reservados.
