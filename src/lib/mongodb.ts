import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Module-level cached client promise for connection reuse in serverless
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the database instance.
 * Uses a cached connection to avoid creating multiple connections
 * in serverless / hot-reload environments.
 */
export async function getDb(): Promise<Db> {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI as string);
  await client.connect();

  const db = client.db(); // Uses the database name from the URI

  cachedClient = client;
  cachedDb = db;

  return db;
}

/**
 * Get a typed collection from the database.
 */
export async function getCollection<T extends Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}
