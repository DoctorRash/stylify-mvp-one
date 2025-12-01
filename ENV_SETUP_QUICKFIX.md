# Quick Fix Guide - Environment Variables

## Issue
The application is failing because the Supabase environment variables are not set up.

## Solution

I've created a `.env.local` file in your project root with placeholders. You need to replace the placeholder values with your actual Supabase credentials.

### Steps:

1. **Open `.env.local`** in your project root

2. **Get your Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Open your `stylify-mvp` project
   - Click **Settings** → **API**
   
3. **Copy the following values:**
   - **Project URL** → Replace `your_supabase_project_url_here`
   - **anon/public key** → Replace `your_supabase_anon_key_here`
   - **service_role key** → Replace `your_supabase_service_role_key_here`

4. **Your `.env.local` should look like this:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Save the file**

6. **Restart the dev server:**
   - Stop the current server (Ctrl+C in terminal)
   - Run `npm run dev` again

## Note
You mentioned you added credentials to a `.env` file, but Next.js requires them in `.env.local` for local development. The `.env.local` file is gitignored by default to keep your secrets safe.

## What I Fixed
- **Separated Supabase client files**: Created `lib/supabase/client.ts` (browser only) and `lib/supabase/server.ts` (server only) to fix the build error
- **Created `.env.local` template**: Ready for you to add your credentials
