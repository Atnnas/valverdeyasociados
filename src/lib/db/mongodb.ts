import dns from "node:dns";
// Set reliable DNS servers for MongoDB Atlas SRV lookups (prevents ECONNREFUSED on local Windows ISPs)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Graceful fallback if custom DNS cannot be configured in restricted environments
}

import { MongoClient, ServerApiVersion, Db } from "mongodb";

/**
 * MongoDB Connection Singleton tailored for Next.js App Router and Serverless environments.
 * Follows the mongodb-connection skill guidelines:
 * - Reuses the connection across hot reloads in development.
 * - Manages pool size and socket timeouts to prevent pool exhaustion in serverless routes.
 */

const rawUri = process.env.MONGODB_URI;

if (!rawUri) {
  throw new Error("SECURITY/CONFIG ERROR: Please define MONGODB_URI inside .env.local");
}

// Resilient connection string resolver:
// On Windows, SRV records (mongodb+srv://) often fail with ECONNREFUSED in local ISPs/firewalls.
// We auto-fallback to the direct replicaSet seedlist to guarantee 100% connectivity.
const uri =
  rawUri.startsWith("mongodb+srv://") && rawUri.includes("kmadb.jodngjz.mongodb.net")
    ? rawUri.replace(
        "mongodb+srv://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@kmadb.jodngjz.mongodb.net",
        "mongodb://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@ac-cxc8kvq-shard-00-00.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-01.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-02.jodngjz.mongodb.net:27017"
      ) + (rawUri.includes("replicaSet=") ? "" : "&ssl=true&replicaSet=atlas-p0tcts-shard-0&authSource=admin")
    : rawUri;

export const DEFAULT_DB_NAME = process.env.MONGODB_DB_NAME || "valverde_asociados";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Recommended serverless connection pool bounds:
  maxPoolSize: 15,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, avoid global variables
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Helper to get the default or configured database instance
 */
export async function getDatabase(dbName: string = DEFAULT_DB_NAME): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
