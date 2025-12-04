const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let env = {};
try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkDatabase() {
    console.log('🔍 Checking database status...\n');

    // 1. Check profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, role, full_name');

    if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError.message);
    } else {
        console.log(`✅ Found ${profiles.length} profiles:`);
        profiles.forEach(p => {
            console.log(`   - ${p.email} (${p.role}) - ${p.full_name || 'No name'}`);
        });
    }

    console.log('\n');

    // 2. Check tailor profiles
    const { data: tailors, error: tailorsError } = await supabase
        .from('tailor_profiles')
        .select('*, profiles:user_id(email, full_name)');

    if (tailorsError) {
        console.error('❌ Error fetching tailor profiles:', tailorsError.message);
    } else {
        console.log(`✅ Found ${tailors.length} tailor profiles:`);
        tailors.forEach(t => {
            const status = t.business_name && t.slug ? '✓ Complete' : '⚠️  Incomplete';
            console.log(`   ${status} - ${t.business_name || 'No business name'}`);
            console.log(`      Email: ${t.profiles?.email || 'N/A'}`);
            console.log(`      Slug: ${t.slug || 'MISSING - will not show on explore page'}`);
            console.log(`      Location: ${t.location || 'Not set'}`);
            console.log(`      Specialties: ${t.specialties?.length || 0} items`);
            console.log('');
        });
    }

    console.log('\n');

    // 3. Summary
    const completeTailors = tailors?.filter(t => t.business_name && t.slug).length || 0;
    console.log('📊 SUMMARY:');
    console.log(`   Total profiles: ${profiles?.length || 0}`);
    console.log(`   Total tailors: ${tailors?.length || 0}`);
    console.log(`   Complete tailors (will show on explore): ${completeTailors}`);

    if (completeTailors === 0) {
        console.log('\n⚠️  NO TAILORS WILL SHOW ON EXPLORE PAGE');
        console.log('   Reason: No tailors have both business_name and slug set');
        console.log('\n💡 To fix:');
        console.log('   1. Sign in as a tailor account');
        console.log('   2. Go to /tailor/profile');
        console.log('   3. Fill in business name, location, and specialties');
        console.log('   4. Save the profile');
        console.log('   5. The slug will be auto-generated from business_name');
    }
}

checkDatabase();
