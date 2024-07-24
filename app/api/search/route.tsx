// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key environment variable')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: { method: string; query: { term: any } }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; results?: any[] }): void; new(): any } } }) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { term } = req.query;

  if (!term) {
    res.status(400).json({ error: 'Search term is required' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('Doctor')
      .select('*')
      .ilike('doctorname', `%${term}%`);

    if (error) {
      throw error;
    }

    res.status(200).json({ results: data });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}