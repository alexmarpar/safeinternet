import mongoose from "mongoose";
import { domainSchema } from "@/lib/schemas/domain";


export const WhiteDomainModel =
  mongoose.models.WhiteListDomains || mongoose.model("WhiteListDomains", domainSchema);
