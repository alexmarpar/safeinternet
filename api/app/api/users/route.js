import { connectDB } from "../../../lib/mongodb";

export async function GET() {
  const db = await connectDB();
  const users = await db.collection("local").find().toArray();

  return Response.json(users);
}

export async function POST(req) {
  const body = await req.json();
  const db = await connectDB();

  await db.collection("startup_log").insertOne(body);

  return Response.json({ ok: true });
}
