import { dbConnect } from "@/lib/dbconnect";
import whitelist from "@/lib/methods/getdomains";
import { normalizeDomain } from "@/lib/methods/normalizedomain";
import { NextResponse } from "next/server";
import { WhiteDomainModel } from "@/lib/models/whitelistdomain";
import { BlockedDomainsModel } from "@/lib/models/domain";
import { bumpVersion } from "@/lib/methods/domainversion/sendversion";
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";
import { ConfigModel } from "@/lib/models/version";
import { checkApiKey } from "@/lib/methods/security/checkapikey";
import { ratelimit } from "@/lib/methods/security/ratelimit";

export async function GET() {
  await dbConnect();

  const Domains = await whitelist.find().select("-_id -__v");
  return Response.json(Domains);
}
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  if (!checkApiKey(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  await dbConnect();

  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: "Missing domains" }, { status: 400 });
    }
    const normalizedDomain = normalizeDomain(domain);

    const exists = await BlockedDomainsModel.findOne({
      domain: normalizedDomain,
    });

    if (exists) {
      return NextResponse.json(
        { error: "Domain exists in blocked domains" },
        { status: 403 },
      );
    }

    const newDomain = await WhiteDomainModel.create({
      domain: normalizedDomain,
    });
    const config = await getOrCreateVersion();
    const newVersion = bumpVersion(config.value, "minor");

    await ConfigModel.updateOne(
      { key: "db_version" },
      {
        value: newVersion,
        updatedAt: new Date(),
      },
      { upsert: true },
    );

    return NextResponse.json(newDomain, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando domain" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  if (!checkApiKey(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!checkApiKey(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = await WhiteDomainModel.findByIdAndDelete(id);

  if (!deleted) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const config = await getOrCreateVersion();
  const newVersion = bumpVersion(config.value, "minor");

  await ConfigModel.updateOne(
    { key: "db_version" },
    {
      value: newVersion,
      updatedAt: new Date(),
    },
  );

  return Response.json({ ok: true });
}
export async function PATCH(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  if (!checkApiKey(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!checkApiKey(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  await dbConnect();

  const body = await req.json();
  const { id, domain } = body;

  if (!id || !domain) {
    return Response.json({ error: "Missing id or domain" }, { status: 400 });
  }

  const updated = await WhiteDomainModel.findByIdAndUpdate(
    id,
    {
      domain: domain.toLowerCase().trim(),
      updatedAt: new Date(),
    },
    { new: true },
  );

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const config = await getOrCreateVersion();
  const newVersion = bumpVersion(config.value, "minor");

  await ConfigModel.updateOne(
    { key: "db_version" },
    {
      value: newVersion,
      updatedAt: new Date(),
    },
  );

  return Response.json({ ok: true, domain: updated });
}
