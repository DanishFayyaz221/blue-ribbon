import { MongoClient, type Db } from "mongodb";

// Connection is created lazily so that `next build` can import modules that
// reference the DB without requiring MONGODB_URI to be present at build time.
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // Next dev reloads modules on every edit. Without a global cache we would
  // open a new pool per reload and exhaust connections.
  // eslint-disable-next-line no-var
  var __brMongoClient: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  return new MongoClient(uri, {
    maxPoolSize: 10,
    // Fail fast rather than hanging a page render when mongod is down.
    serverSelectionTimeoutMS: 5000,
  }).connect();
}

export function getClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV !== "production") {
    global.__brMongoClient ??= connect();
    return global.__brMongoClient;
  }

  clientPromise ??= connect();
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB ?? "blueribbon");
}
