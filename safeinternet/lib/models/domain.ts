import mongoose from "mongoose";
import { domainSchema } from "@/lib/schemas/domain";


export const DomainModel =
  mongoose.models.DomainModels || mongoose.model("DomainModels", domainSchema);
