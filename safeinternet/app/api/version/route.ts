import { ConfigModel } from "@/lib/models/version"
import { bumpVersion } from "@/lib/methods/domainversion/sendversion"
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";

export async function GET() {
  const config = await ConfigModel.findOne({ key: "version" });

  return Response.json({
    version: config?.value || "0.0.0"
  });
}


export async function POST(req: Request) {
  const { type } = await req.json(); // "major" | "minor" | "patch"

  const config = await getOrCreateVersion();

  const newVersion = bumpVersion(config.value, type);

  await ConfigModel.updateOne(
    { key: "db_version" },
    {
      value: newVersion,
      updatedAt: new Date()
    }
  );

  return Response.json({ version: newVersion });
}