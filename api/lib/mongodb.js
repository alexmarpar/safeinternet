import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/config";

const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  return client.db();
}
