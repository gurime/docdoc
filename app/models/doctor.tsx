import mongoose, { Document, Model, Schema } from 'mongoose';

interface IDoctor extends Document {
  doctorname: string;
  role:string;
}

const DoctorSchema: Schema = new Schema({
  doctorname: { type: String, required: true },
  role: { type: String, required: true },
});

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
