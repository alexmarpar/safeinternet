import mongoose from "mongoose";
import { domainSchema } from "@/lib/schemas/domain";


const Domain_search = mongoose.models.blockeddomains || mongoose.model("blockeddomains", domainSchema)
export default Domain_search