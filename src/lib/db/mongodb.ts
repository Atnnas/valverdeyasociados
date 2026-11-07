import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * MongoDB Connection Singleton tailored for Next.js App Router and Serverless environments.
 * Follows the mongodb-connection skill guidelines:
 * - Reuses the connection across hot reloads in development.
 * - Manages pool size and socket timeouts to prevent pool exhaustion in serverless routes.
 */

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("SECURITY/CONFIG ERROR: Please define MONGODB_URI inside .env.local");
}

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

export default clientPromise;

