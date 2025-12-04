const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function verify() {
    console.log('--- 1. Checking Bucket Existence (Admin) ---');
    const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
    if (bucketError) {
        console.error('Failed to list buckets:', bucketError.message);
        return;
    }

    const portfolioBucket = buckets.find(b => b.name === 'portfolios');
    if (!portfolioBucket) {
        console.error('❌ Bucket "portfolios" DOES NOT EXIST.');
        console.log('Available buckets:', buckets.map(b => b.name));
        return;
    }
    console.log('✅ Bucket "portfolios" exists.');
    console.log('   Public:', portfolioBucket.public);

    console.log('\n--- 2. Testing Admin Upload (Service Key) ---');
    const adminFileName = `admin-test-${Date.now()}.txt`;
    const { error: adminUploadError } = await supabaseAdmin.storage
        .from('portfolios')
        .upload(adminFileName, 'Admin upload test');

    if (adminUploadError) {
        console.error('❌ Admin upload failed:', adminUploadError.message);
    } else {
        console.log('✅ Admin upload successful.');
        // Cleanup
        await supabaseAdmin.storage.from('portfolios').remove([adminFileName]);
    }

    console.log('\n--- 3. Testing User Upload (Anon Key + RLS) ---');
    // Create temp user
    const email = `test-storage-${Date.now()}@example.com`;
    const password = 'password123';

    const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (createUserError) {
        console.error('Skipping user test: Could not create user:', createUserError.message);
        return;
    }

    // Sign in
    const { data: { session }, error: signInError } = await supabaseAnon.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.error('Skipping user test: Could not sign in:', signInError.message);
    } else {
        // Try upload
        const userFileName = `${user.id}/user-test-${Date.now()}.txt`;
        const { error: userUploadError } = await supabaseAnon.storage
            .from('portfolios')
            .upload(userFileName, 'User upload test');

        if (userUploadError) {
            console.error('❌ User upload failed:', userUploadError);
            console.error('   Message:', userUploadError.message);
            console.error('   This indicates an RLS policy issue.');
        } else {
            console.log('✅ User upload successful.');
            // Cleanup
            await supabaseAdmin.storage.from('portfolios').remove([userFileName]);
        }
    }

    // Cleanup user
    await supabaseAdmin.auth.admin.deleteUser(user.id);
}

verify();
