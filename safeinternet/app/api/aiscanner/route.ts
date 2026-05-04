import { dbConnect } from "@/lib/dbconnect";
import { DomainModel } from "@/lib/models/domain";
import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/methods/normalizedomain"
import { bumpVersion } from "@/lib/methods/domainversion/sendversion"
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion"
import OpenAI from "openai";


export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: "Missing domains" }, { status: 400 });
    }
    const normalizedDomain = normalizeDomain(domain);
    const openai = new OpenAI();

    const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: "...text to classify goes here...", 
    });
    
    console.log(moderation);
    //--- Pending of input text, whilelistdomaindb

    const newDomain = await DomainModel.create({
      domain: normalizedDomain,
    });
    const config = await getOrCreateVersion();
    await bumpVersion(config.value,"minor"); 

    return NextResponse.json(newDomain, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando domain" },
      { status: 500 },
    );
  }
}
