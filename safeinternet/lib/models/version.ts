import mongoose from "mongoose"
import { configSchema } from "@/lib/schemas/version"

export const ConfigModel =
  mongoose.models.Config || mongoose.model("Config", configSchema);