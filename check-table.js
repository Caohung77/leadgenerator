import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://obxhmlqpceaawxhnukbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieGhtbHFwY2VhYXd4aG51a2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxODI4MSwiZXhwIjoyMDQ4NDk0MjgxfQ.MZbunaus9kTY_Vuq-iS5E-tzzFFj6iXWLNE42jt8Szg'
)

async function checkTable() {
  // Get all rows to check current state
  const { data: currentData, error: selectError } = await supabase
    .from('sophiena')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (selectError) {
    console.error('Select error:', selectError)
    return
  }
  
  console.log('Current data:', currentData)
  console.log('Total rows:', currentData.length)

  // Try to insert a test row
  const testData = {
    email: `test${Date.now()}@example.com`,
    industry: 'Test Industry',
    location: 'Test Location',
    verified: false,
    created_at: new Date().toISOString()
  }

  const { data: insertData, error: insertError } = await supabase
    .from('sophiena')
    .insert([testData])
    .select()

  if (insertError) {
    console.error('Insert error:', insertError)
  } else {
    console.log('Successfully inserted:', insertData)
  }

  // Check data after insert
  const { data: afterData, error: afterError } = await supabase
    .from('sophiena')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (afterError) {
    console.error('After select error:', afterError)
  } else {
    console.log('Data after insert:', afterData)
    console.log('Total rows after insert:', afterData.length)
  }
}

checkTable()
