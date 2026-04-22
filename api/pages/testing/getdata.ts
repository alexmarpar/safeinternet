// pages/api/data.ts
import dbConnectPromise from '@/lib/db';

export default async function handler(req, res) {
  const client = await dbConnectPromise;
  const db = client.db('domains');
  const data = await db.collection('your-collection').find({}).toArray();
  res.json({ data });
}   