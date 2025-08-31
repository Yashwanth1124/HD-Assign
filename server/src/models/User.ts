import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  dob?: Date;
  googleId?: string;
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  googleId: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

export default mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', userSchema);