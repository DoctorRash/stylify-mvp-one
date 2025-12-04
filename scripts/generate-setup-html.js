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
const serviceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Setup Buckets</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .log { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; margin-top: 10px; white-space: pre-wrap; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Setup Storage Buckets</h1>
    <p>Initializing...</p>
    <div id="log" class="log"></div>

    <script>
        const supabaseUrl = '${supabaseUrl}';
        const serviceKey = '${serviceKey}';
        const supabase = window.supabase.createClient(supabaseUrl, serviceKey);
        const logDiv = document.getElementById('log');

        function log(msg, type = 'info') {
            const div = document.createElement('div');
            div.textContent = msg;
            if (type) div.className = type;
            logDiv.appendChild(div);
        }

        async function createBucket(name) {
            log(\`Checking bucket: \${name}...\`);
            
            // Try to get bucket
            const { data: bucket, error: getError } = await supabase.storage.getBucket(name);
            
            if (getError && getError.message.includes('not found')) {
                log(\`Bucket '\${name}' not found. Creating...\`);
                const { data, error } = await supabase.storage.createBucket(name, {
                    public: true,
                    fileSizeLimit: 5242880,
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
                });
                
                if (error) {
                    log(\`Error creating '\${name}': \${error.message}\`, 'error');
                } else {
                    log(\`Success: Bucket '\${name}' created.\`, 'success');
                }
            } else if (getError) {
                log(\`Error checking '\${name}': \${getError.message}\`, 'error');
            } else {
                log(\`Bucket '\${name}' already exists.\`, 'success');
                // Update to public
                const { error: updateError } = await supabase.storage.updateBucket(name, {
                    public: true
                });
                if (updateError) log(\`Warning: Could not update public status: \${updateError.message}\`, 'error');
                else log(\`Updated '\${name}' to public.\`, 'success');
            }
        }

        async function run() {
            try {
                await createBucket('portfolios');
                await createBucket('try-on-images');
                log('Done! You can close this page.', 'success');
            } catch (err) {
                log(\`Unexpected error: \${err.message}\`, 'error');
            }
        }

        run();
    </script>
</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, '../setup-buckets.html'), htmlContent);
console.log('Generated setup-buckets.html');
