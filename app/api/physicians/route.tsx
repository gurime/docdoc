import { NextRequest, NextResponse } from 'next/server';
import supabase from "@/app/Config/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("doctors").select("*");

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}