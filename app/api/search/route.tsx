import connectToDatabase from '@/app/lib/mongodb';
import Doctor from '@/app/models/doctor';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const results = await Doctor.find({
      title: { $regex: term, $options: 'i' }
    }).exec();

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Error searching database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
