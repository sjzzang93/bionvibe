const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials not found in environment variables');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  console.log('🔗 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get migration file from command line argument
  const migrationFile = process.argv[2] || 'create_emotion_diary_table.sql';
  const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log(`📝 Running migration: ${migrationFile}`);
  console.log('');

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
      // If exec_sql doesn't exist, try direct execution by splitting statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      console.log(`📊 Executing ${statements.length} SQL statements...`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        console.log(`   [${i + 1}/${statements.length}] Executing...`);

        // Use the Supabase REST API to execute raw SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ query: statement }),
        });

        if (!response.ok) {
          // Supabase doesn't have exec_sql, we need to use a different approach
          console.log('');
          console.log('⚠️  Note: Direct SQL execution not available via API');
          console.log('');
          console.log('📋 Please run the migration manually:');
          console.log('');
          console.log('1. Go to Supabase Dashboard → SQL Editor');
          console.log('2. Copy and paste the SQL from:');
          console.log(`   ${migrationPath}`);
          console.log('3. Click "Run" to execute the migration');
          console.log('');
          console.log('Or use Supabase CLI:');
          console.log('   supabase db push');
          console.log('');
          return;
        }
      }

      console.log('✅ Migration executed successfully!');
      return { data: null, error: null };
    });

    if (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('');

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('');
    console.log('📋 Please run the migration manually in Supabase Dashboard:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
    console.log('2. Copy the SQL from: supabase/migrations/create_secret_visitors_table.sql');
    console.log('3. Paste and run in the SQL Editor');
    console.log('');
    process.exit(1);
  }
}

runMigration();
