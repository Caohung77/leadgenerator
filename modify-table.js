import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://obxhmlqpceaawxhnukbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieGhtbHFwY2VhYXd4aG51a2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxODI4MSwiZXhwIjoyMDQ4NDk0MjgxfQ.MZbunaus9kTY_Vuq-iS5E-tzzFFj6iXWLNE42jt8Szg'
)

async function modifyTable() {
  // Drop the unique constraint on email
  const { data, error } = await supabase
    .rpc('drop_email_unique_constraint')

  if (error) {
    console.error('Error dropping constraint:', error)
  } else {
    console.log('Successfully removed unique constraint')
  }

  // Test inserting duplicate emails
  const testData = {
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

  // Try to insert first record
  const { data: insert1, error: error1 } = await supabase
    .from('sophiena')
    .insert([testData])
    .select()

  if (error1) {
    console.error('Error inserting first record:', error1)
  } else {
    console.log('Successfully inserted first record:', insert1)
  }

  // Try to insert second record with same email
  const { data: insert2, error: error2 } = await supabase
    .from('sophiena')
    .insert([testData2])
    .select()

  if (error2) {
    console.error('Error inserting second record:', error2)
  } else {
    console.log('Successfully inserted second record:', insert2)
  }
}

modifyTable()
