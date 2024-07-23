import mongoose from 'mongoose';
import Doctor from '@/app/models/doctor';
import connectToDatabase from '@/app/lib/mongodb';

interface DoctorDocument extends mongoose.Document {
  _id: string;
  name: string;
  specialty: string;
  title: string;
}

export async function getArticle(id: string): Promise<DoctorDocument | null> {
  try {
    await connectToDatabase();
    const article = await Doctor.findById(id).exec();
    return article as DoctorDocument | null;
  } catch (error) {
    console.error("Error fetching article: ", error);
    return null;
  }
}
