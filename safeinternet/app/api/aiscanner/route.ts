import { dbConnect } from "@/lib/dbconnect";
import { BlockedDomainsModel } from "@/lib/models/domain";
import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/methods/normalizedomain";
import { bumpVersion } from "@/lib/methods/domainversion/sendversion";
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";
import OpenAI from "openai";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { domain } = body;
    const { textContent } = body;

    if (!domain) {
      return NextResponse.json({ error: "Missing domains" }, { status: 400 });
    }
    const normalizedDomain = normalizeDomain(domain);
    const existing = await BlockedDomainsModel.findOne({ domain: normalizedDomain });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
    console.log(normalizedDomain);
    console.log(textContent);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("MODERATION CALL", Date.now());
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: textContent,
    });

    const config = await getOrCreateVersion();
    await bumpVersion(config.value, "minor");

    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    console.error("🔥 ERROR REAL:", error);
    return NextResponse.json(
      { error: "Error creando domain" },
      { status: 500 },
    );
  }
}
