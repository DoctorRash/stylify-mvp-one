const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually since we're not in Next.js context
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
    console.error('Could not read .env.local file');
    process.exit(1);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase credentials in .env.local');
    console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
    console.log('Service Key:', serviceKey ? 'Found' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function createBucket(name) {
    console.log(`Checking bucket: ${name}...`);
    const { data, error } = await supabase.storage.getBucket(name);

    if (error && error.message.includes('not found')) {
        console.log(`Bucket '${name}' not found. Creating...`);
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(name, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

        if (createError) {
            console.error(`Error creating bucket '${name}':`, createError.message);
        } else {
            console.log(`Bucket '${name}' created successfully.`);
        }
    } else if (error) {
        console.error(`Error checking bucket '${name}':`, error.message);
    } else {
        console.log(`Bucket '${name}' already exists.`);

        // Update to public just in case
        const { error: updateError } = await supabase.storage.updateBucket(name, {
            public: true
        });
        if (updateError) console.error(`Error updating bucket '${name}':`, updateError.message);
        else console.log(`Bucket '${name}' updated to public.`);
    }
}

async function main() {
    await createBucket('portfolios');
    await createBucket('try-on-images');
    console.log('Done!');
}

main();
