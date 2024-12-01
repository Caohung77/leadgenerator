import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://obxhmlqpceaawxhnukbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieGhtbHFwY2VhYXd4aG51a2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxODI4MSwiZXhwIjoyMDQ4NDk0MjgxfQ.MZbunaus9kTY_Vuq-iS5E-tzzFFj6iXWLNE42jt8Szg'
)

async function checkData() {
  // Get all rows
  const { data, error } = await supabase
    .from('sophiena')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Total rows:', data.length)
  console.log('Data:', data)
}

checkData()
