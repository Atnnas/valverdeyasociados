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
 * - Lazy initialization to prevent build-time crashes when environment variables are loaded at runtime.
 * - Reuses the connection across invocations in serverless/development.
 * - Manages pool size and socket timeouts to prevent pool exhaustion.
 */

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

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    // If during build analysis or unconfigured, throw descriptive runtime error
    throw new Error("SECURITY/CONFIG ERROR: Please define MONGODB_URI in environment variables.");
  }

  // Resilient connection string resolver:
  // Fallback to direct replicaSet seedlist if needed
  const uri =
    rawUri.startsWith("mongodb+srv://") && rawUri.includes("kmadb.jodngjz.mongodb.net")
      ? rawUri.replace(
          "mongodb+srv://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@kmadb.jodngjz.mongodb.net",
          "mongodb://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@ac-cxc8kvq-shard-00-00.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-01.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-02.jodngjz.mongodb.net:27017"
        ) + (rawUri.includes("replicaSet=") ? "" : "&ssl=true&replicaSet=atlas-p0tcts-shard-0&authSource=admin")
      : rawUri;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

/**
 * Helper to get the default or configured database instance
 */
export async function getDatabase(dbName: string = DEFAULT_DB_NAME): Promise<Db> {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(dbName);
}

// Lazy thenable to satisfy default export without throwing during Next.js static build phase
const clientPromise: Promise<MongoClient> = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return getMongoClientPromise().then(onfulfilled, onrejected);
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<MongoClient | TResult> {
    return getMongoClientPromise().catch(onrejected);
  },
  finally(onfinally?: (() => void) | null): Promise<MongoClient> {
    return getMongoClientPromise().finally(onfinally);
  },
  [Symbol.toStringTag]: "Promise",
} as Promise<MongoClient>;

export default clientPromise;
