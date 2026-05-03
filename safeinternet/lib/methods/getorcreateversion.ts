import { ConfigModel } from "@/lib/models/version"

export async function getOrCreateVersion() {
  let config = await ConfigModel.findOne({ key: "db_version" });

  if (!config) {
    config = await ConfigModel.create({
      key: "db_version",
      value: "0.0.0",
      updatedAt: new Date()
    });
  }


  return config;
}