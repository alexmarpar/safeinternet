import { ConfigModel } from "@/lib/models/version";
import { bumpVersion } from "@/lib/methods/domainversion/sendversion";
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";
import { dbConnect } from "@/lib/dbconnect";
import { checkApiKey } from "@/lib/methods/security/checkapikey";
import { ratelimit } from "@/lib/methods/security/ratelimit";

export async function GET() {
  const config = await ConfigModel.findOne({ key: "db_version" });

  return Response.json({
    version: config?.value || "0.0.0",
  });
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
  const { type } = await req.json(); // "major" | "minor" | "patch"

  const config = await getOrCreateVersion();

  const newVersion = bumpVersion(config.value, type);

  await ConfigModel.updateOne(
    { key: "db_version" },
    {
      value: newVersion,
      updatedAt: new Date(),
    },
  );

  return Response.json({ version: newVersion });
}
