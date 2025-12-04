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

if (!supabaseUrl || !anonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// 1. Client with ANON key (simulating frontend)
const supabaseAnon = createClient(supabaseUrl, anonKey);

// 2. Client with SERVICE key (for setup/cleanup)
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testUpload() {
    console.log('--- Testing Upload with ANON Key ---');

    // We need a user to test RLS "authenticated" policy
    // Let's sign in or sign up a test user
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Creating test user: ${email}`);
    // Use admin.createUser to auto-confirm
    const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (createError) {
        console.error('Error creating test user:', createError.message);
        return;
    }

    console.log('User created:', user.id);

    // Sign in with ANON client to get session
    const { data: { session }, error: signInError } = await supabaseAnon.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.error('Sign in failed:', signInError.message);
        return;
    }

    console.log('Signed in as:', session.user.id);

    // Try to upload
    const fileName = `test-upload-${Date.now()}.txt`;
    const fileBody = 'Hello World';

    console.log(`Attempting upload to 'portfolios/${fileName}'...`);
    const { data, error } = await supabaseAnon.storage
        .from('portfolios')
        .upload(fileName, fileBody);

    if (error) {
        console.error('UPLOAD FAILED:', error);
        console.error('Error message:', error.message);
    } else {
        console.log('UPLOAD SUCCESS:', data);
    }

    // Cleanup user
    await supabaseAdmin.auth.admin.deleteUser(session.user.id);
}

testUpload();
