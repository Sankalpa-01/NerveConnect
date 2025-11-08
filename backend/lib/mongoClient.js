const { MongoClient } = require("mongodb");

let client;
let db;
let mongod;

async function startInMemory() {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log("Connected to in-memory MongoDB");
  return db;
}

async function connect() {
  if (db) return db;

  const useInMemory = process.env.USE_IN_MEMORY_DB === "true";

  if (useInMemory) {
    return startInMemory();
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "MONGODB_URI not set; falling back to in-memory MongoDB for development"
      );
      return startInMemory();
    }
    throw new Error("MONGODB_URI not set in environment");
  }

  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db(); 
    console.log("Connected to MongoDB successfully ✅");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB at", uri, err?.message || err);
    const allowFallback =
      process.env.FALLBACK_TO_IN_MEMORY_ON_CONN_FAIL === "true" ||
      process.env.NODE_ENV !== "production";
    if (allowFallback) {
      console.warn("Falling back to in-memory MongoDB");
      try {
        return await startInMemory();
      } catch (e) {
        console.error("Failed to start in-memory MongoDB:", e?.message || e);
        throw e;
      }
    }
    throw err;
  }
}

async function getDb() {
  if (!db) await connect();
  return db;
}

async function close() {
  if (client) await client.close();
  if (mongod) await mongod.stop();
}

module.exports = { connect, getDb, close };
