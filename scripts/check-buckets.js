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

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function checkBuckets() {
    console.log('🪣 Checking Storage Buckets...\n');

    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing buckets:', error.message);
            return;
        }

        console.log(`Found ${buckets.length} buckets:\n`);

        const requiredBuckets = ['portfolios', 'try-on-images'];
        const foundBuckets = buckets.map(b => b.name);

        requiredBuckets.forEach(bucketName => {
            const exists = foundBuckets.includes(bucketName);
            const bucket = buckets.find(b => b.name === bucketName);

            if (exists) {
                console.log(`✅ ${bucketName}`);
                console.log(`   ID: ${bucket.id}`);
                console.log(`   Public: ${bucket.public}`);
                console.log(`   Created: ${bucket.created_at}`);
            } else {
                console.log(`❌ ${bucketName} - MISSING!`);
            }
            console.log('');
        });

        // Test upload to portfolios bucket
        console.log('\n🧪 Testing portfolio bucket upload...');
        const testFile = Buffer.from('test');
        const testPath = `test-${Date.now()}.txt`;

        const { error: uploadError } = await supabase.storage
            .from('portfolios')
            .upload(testPath, testFile);

        if (uploadError) {
            console.error('❌ Upload test FAILED:', uploadError.message);
        } else {
            console.log('✅ Upload test PASSED');
            // Clean up
            await supabase.storage.from('portfolios').remove([testPath]);
            console.log('✅ Cleanup successful');
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkBuckets();
