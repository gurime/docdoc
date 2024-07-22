import mongoose, { Document, Model, Schema } from 'mongoose';

interface IDoctor extends Document {
  title: string;
}

const DoctorSchema: Schema = new Schema({
  title: { type: String, required: true },
});

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
