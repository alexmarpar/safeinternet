import { dbConnect } from "@/lib/dbconnect";
import { BlockedDomainsModel } from "@/lib/models/domain";
import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/methods/normalizedomain";
import { bumpVersion } from "@/lib/methods/domainversion/sendversion";
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";
import { runSerial } from "@/lib/methods/aiscanner/serializerequest";
import OpenAI from "openai";
import { checkApiKey } from "@/lib/methods/security/checkapikey";
import { ratelimit } from "@/lib/methods/security/ratelimit";


export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  if (!checkApiKey(req)) {
    return new Response("Unauthorized, Sorry this entrypoint is disabled", { status: 401 });
  }
  await dbConnect();

  try {
    const body = await req.json();
    const { domain } = body;
    const { textContent } = body;

    if (!domain) {
      return NextResponse.json({ error: "Missing domain" }, { status: 400 });
    }

    if (
      !textContent ||
      typeof textContent !== "string" ||
      textContent.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid textContent" },
        { status: 400 },
      );
    }

    const normalizedDomain = normalizeDomain(domain);
    const existing = await BlockedDomainsModel.findOne({
      domain: normalizedDomain,
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
    console.log(normalizedDomain);
    console.log(textContent);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const moderation = await runSerial(() =>
      openai.moderations.create({
        model: "omni-moderation-2024-09-26",
        input: textContent,
      }),
    );

    console.log(moderation);
    /*
    ERROR REAL: Error: 429 Too Many Requests
    at ignore-listed frames {
  status: 429,
  headers: Headers {
    date: 'Tue, 05 May 2026 18:17:49 GMT',
    'content-type': 'application/json',
    'content-length': '129',
    connection: 'keep-alive',
    server: 'cloudflare',
    'openai-version': '2020-10-01',
    'openai-organization': 'xxxx',
    'openai-project': 'xxxxxx',
    'x-request-id': 'xxxxxxx',
    'openai-processing-ms': '25',
    'x-openai-proxy-wasm': 'v0.1',
    'cf-cache-status': 'DYNAMIC',
    'set-cookie': 'xxxxxx',
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    'x-content-type-options': 'nosniff',
    'cf-ray': 'xxxxxx-MAD',
    'alt-svc': 'h3=":443"; ma=86400'
  },
  requestID: 'xxxx',
  error: {
    message: 'Too Many Requests',
    type: 'invalid_request_error',
    param: null,
    code: null
  },
  code: null,
  param: null,
  type: 'invalid_request_error'

    */

    const config = await getOrCreateVersion();
    await bumpVersion(config.value, "minor");

    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    console.error("ERROR REAL:", error);
    return NextResponse.json(
      { error: "Error creando domain" },
      { status: 500 },
    );
  }
}
