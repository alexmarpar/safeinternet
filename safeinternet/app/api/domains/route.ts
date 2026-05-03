import { dbConnect } from "@/lib/dbconnect";
import { DomainModel } from "@/lib/models/domain";
import { getOrCreateVersion } from "@/lib/methods/getorcreateversion";
import { bumpVersion } from "@/lib/methods/domainversion/sendversion";
import { ConfigModel } from "@/lib/models/version"


export async function DELETE(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = await DomainModel.findByIdAndDelete(id);

  if (!deleted) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const config = await getOrCreateVersion();
  const newVersion = bumpVersion(config.value, "patch")

  await ConfigModel.updateOne(
      { key: "db_version" },
      {
        value: newVersion,
        updatedAt: new Date()
      }
    );

  return Response.json({ ok: true });
}
export async function PATCH(req: Request) {
  await dbConnect();

  const body = await req.json();
  const { id, domain } = body;

  if (!id || !domain) {
    return Response.json(
      { error: "Missing id or domain" },
      { status: 400 }
    );
  }
  

  const updated = await DomainModel.findByIdAndUpdate(
    id,
    {
      domain: domain.toLowerCase().trim(),
      updatedAt: new Date()
    },
    { new: true }
  );

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const config = await getOrCreateVersion();
  const newVersion = bumpVersion(config.value, "patch")

  await ConfigModel.updateOne(
      { key: "db_version" },
      {
        value: newVersion,
        updatedAt: new Date()
      }
    )

  return Response.json({ ok: true, domain: updated });
}