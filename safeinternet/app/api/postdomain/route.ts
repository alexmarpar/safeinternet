import { dbConnect } from "@/lib/dbconnect";
import { DomainModel } from "@/lib/models/domain";
import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/methods/normalizedomain"

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: "Missing domains" }, { status: 400 });
    }
    console.log(domain)
    const normalizedDomain = normalizeDomain(domain);
    console.log(normalizedDomain)

    const newDomain = await DomainModel.create({
      domain: normalizedDomain,
    });
    return NextResponse.json(newDomain, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando domain" },
      { status: 500 },
    );
  }
}
