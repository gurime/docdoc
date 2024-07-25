import supabase from '@/app/Config/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Valid search term is required' }, { status: 400 });
  }

  try {
    // Log the search term for debugging
    console.log('Search term:', term);

    // Additional debugging: Retrieve all records to see what data exists
    const allData = await supabase
      .from('doctors')  // Ensure this matches the actual table name
      .select('*')
      .limit(10); // Limiting to 10 for brevity

    console.log('All Doctor records:', allData);

    // Perform the search query
    const { data, error, count } = await supabase
      .from('doctors')  // Ensure this matches the actual table name
      .select('id, doctorname, role', { count: 'exact' })
      .ilike('doctorname', `%${term}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    // Log the response from Supabase
    console.log('Supabase search response data:', data);
    console.log('Supabase search response error:', error);
    console.log('Total search results count:', count);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      return NextResponse.json({
        results: data,
        total: count
      });
    } else {
      return NextResponse.json({ results: [], total: 0 });
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}