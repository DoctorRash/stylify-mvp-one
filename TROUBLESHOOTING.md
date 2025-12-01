# Troubleshooting "Invalid API key" Error

## Common Causes & Solutions

### 1. Database Migration Not Run ✅ **MOST LIKELY**

The error "Invalid API key" during signup often means the database tables don't exist yet.

**Solution:**
1. Go to your Supabase dashboard: https://supabase.com
2. Open your project (`stylify-mvp`)
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Open the file `supabase/migrations/001_initial_schema.sql` from your project
6. Copy the ENTIRE contents
7. Paste into the SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. You should see "Success. No rows returned"

**Verify tables were created:**
- Click **Table Editor** in the left sidebar
- You should see: `profiles`, `tailor_profiles`, `customer_profiles`, `orders`, `order_items`

---

### 2. Wrong API Key

**Check your `.env.local` file:**
- Make sure you copied the **anon/public** key, NOT the service_role key
- The anon key should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**To verify:**
1. Go to Supabase dashboard → Settings → API
2. Compare the **anon public** key with what's in your `.env.local`
3. Make sure they match exactly (no extra spaces or line breaks)

---

### 3. Supabase Project Not Ready

If you just created the Supabase project:
- Wait 2-3 minutes for it to fully provision
- Refresh the Supabase dashboard
- Make sure the project status shows as "Active"

---

### 4. Environment Variables Not Loaded

After changing `.env.local`:
1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart it**: `npm run dev`
3. Try signing up again

---

## How to Check the Actual Error

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try signing up again
4. Look for red error messages
5. Share the error message with me for more specific help

---

## Quick Test

Try this in your browser console while on the signup page:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

This will show if the environment variables are loaded correctly.

---

## Most Likely Fix

**Run the database migration!** This is the #1 cause of this error. The signup process tries to insert into the `profiles` table, but if that table doesn't exist, Supabase returns an error that looks like "Invalid API key".
