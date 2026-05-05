import mongoose from "mongoose";
import { domainSchema } from "@/lib/schemas/domain";


export const BlockedDomainsModel =
  mongoose.models.blockeddomains || mongoose.model("blockeddomains", domainSchema);
