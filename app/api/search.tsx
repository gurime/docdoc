import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../lib/mongodb';
import Doctor from '../models/doctor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    await connectToDatabase();

    const results = await Doctor.find({
      title: { $regex: term, $options: 'i' }
    }).exec();

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error searching database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}