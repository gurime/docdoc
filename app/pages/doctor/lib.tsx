import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key environment variable')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const getDoctor = async (id: string) => {
  const { data, error } = await supabase
    .from('Doctor')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching doctor:', error)
    return null
  }

  return data
}
