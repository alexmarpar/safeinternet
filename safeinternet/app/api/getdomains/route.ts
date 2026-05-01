import { dbConnect } from "@/lib/dbconnect";
import domainList from "@/lib/methods/getdomains";

export async function GET() {
  await dbConnect();

  const Domains = await domainList.find();
  return Response.json(Domains);
}