import supabase from '@/app/Config/supabase'

export const getDoctor = async (id: string) => {


  const { data} = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()



  return data
}
