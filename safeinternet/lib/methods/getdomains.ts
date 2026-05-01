import mongoose from "mongoose";
import { domainSchema } from "@/lib/schemas/domain";


const Domain_search = mongoose.models.DomainModel || mongoose.model("DomainModels", domainSchema)
export default Domain_search