import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INote extends Document {
  user: Types.ObjectId;
  title: string;
  body?: string;
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String }
}, { timestamps: true });

export default mongoose.models.Note as mongoose.Model<INote> || mongoose.model<INote>('Note', noteSchema);