const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanDB() {
  console.log('Fetching all verses from database...');
  const { data: verses, error } = await supabase.from('verses').select('id, verse_text, reference');
  if (error) {
    console.error('Error fetching verses:', error);
    return;
  }
  
  console.log(`Found ${verses.length} verses.`);
  
  let updatedCount = 0;
  for (const v of verses) {
    let original = v.verse_text;
    let clean = original.trim();
    
    // 1. Remove any leading double quotes or « or “
    clean = clean.replace(/^[«"”“]+/g, '').trim();
    
    // 2. Remove any reference at the end like "(مت 1: 1)" or " (مت 1: 1)."
    // We can use a regex to strip from the last '(' to the end if it looks like a reference.
    clean = clean.replace(/\s*\([^\)]+\)[\."”“]*$/g, '').trim();
    
    // 3. Remove any trailing double quotes, dots, or » or ”
    clean = clean.replace(/[»"”“]+$/g, '').trim();
    
    if (clean !== original) {
      console.log(`\nOriginal: ${original}`);
      console.log(`Cleaned:  ${clean}`);
      
      const { error: updateError } = await supabase
        .from('verses')
        .update({ verse_text: clean })
        .eq('id', v.id);
        
      if (updateError) {
        console.error('Update error for id', v.id, updateError);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`\nSuccessfully updated ${updatedCount} verses in the database!`);
}

cleanDB();
