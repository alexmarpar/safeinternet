import mongoose, { Schema, Document } from 'mongoose';

interface Domain extends Document {
  domain: string;
}

const DomainSchema = new Schema<Domain>({
  domain: { type: String, required: true, unique: true }
});

export const domain = mongoose.model<Domain>('Domain', DomainSchema);   