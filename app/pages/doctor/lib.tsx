import mongoose from 'mongoose';
import Doctor from '@/app/models/doctor';
import connectToDatabase from '@/app/lib/mongodb';

interface DoctorDocument extends mongoose.Document {
  _id: string;
  doctorname: string;
  role: string;
}

export async function getDoctor(id: string | undefined): Promise<DoctorDocument | null> {

  if (!id || id === 'undefined') {
    try {
      await connectToDatabase();
      const doctor = await Doctor.findOne().exec();
      return doctor as DoctorDocument | null;
    } catch (error) {
      return null;
    }
  }

  try {
    await connectToDatabase();
    let doctor = await Doctor.findById(id).exec();
    
    if (!doctor) {
      doctor = await Doctor.findOne().exec();
    }

    return doctor as DoctorDocument | null;
  } catch (error) {
    return null;
  }
}