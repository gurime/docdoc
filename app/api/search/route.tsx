import connectToDatabase from '@/app/lib/mongodb';
import Doctor from '@/app/models/doctor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');

  if (!term || term.trim().length === 0) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    await connectToDatabase();
   

    const allDoctors = await Doctor.find({}).lean().exec();

    const results = await Doctor.find({
      title: { $regex: term, $options: 'i' }
    }).lean().exec();


    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
