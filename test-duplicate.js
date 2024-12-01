import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://obxhmlqpceaawxhnukbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieGhtbHFwY2VhYXd4aG51a2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxODI4MSwiZXhwIjoyMDQ4NDk0MjgxfQ.MZbunaus9kTY_Vuq-iS5E-tzzFFj6iXWLNE42jt8Szg'
)

async function testDuplicateEmails() {
  // Try to insert two records with the same email
  const testData1 = {
    email: 'test@example.com',
    industry: 'Test Industry 1',
    location: 'Test Location 1',
    verified: false,
    created_at: new Date().toISOString()
  }

  const testData2 = {
    email: 'test@example.com', // Same email
    industry: 'Test Industry 2',
    location: 'Test Location 2',
    verified: false,
    created_at: new Date().toISOString()
  }

  console.log('Inserting first record...')
  const { data: insert1, error: error1 } = await supabase
    .from('sophiena')
    .insert([testData1])
    .select()

  if (error1) {
    console.error('Error inserting first record:', error1)
  } else {
    console.log('Successfully inserted first record:', insert1)
  }

  console.log('Inserting second record...')
  const { data: insert2, error: error2 } = await supabase
    .from('sophiena')
    .insert([testData2])
    .select()

  if (error2) {
    console.error('Error inserting second record:', error2)
  } else {
    console.log('Successfully inserted second record:', insert2)
  }

  // Check all records with this email
  const { data: allRecords, error: selectError } = await supabase
    .from('sophiena')
    .select('*')
    .eq('email', 'test@example.com')
    .order('created_at', { ascending: false })

  if (selectError) {
    console.error('Error selecting records:', selectError)
  } else {
    console.log('All records with test email:', allRecords)
    console.log('Total records found:', allRecords.length)
  }
}

testDuplicateEmails()
