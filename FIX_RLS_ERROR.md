# Fix for RLS Policy Error

## The Problem

You're getting "new row violates row-level security policy for table 'profiles'" because the RLS policy requires the user to be authenticated before inserting their profile, but during signup, the session isn't fully established yet.

## The Solution

Use a **database trigger** that automatically creates profiles when users sign up. This runs with elevated privileges and bypasses the RLS issue.

---

## Steps to Fix

### 1. Run the New Migration

1. Go to your Supabase dashboard → **SQL Editor**
2. Open the file `supabase/migrations/002_auto_create_profiles.sql` from your project
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**

This creates a database trigger that automatically creates profiles when users sign up.

### 2. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 3. Try Signing Up Again

The signup should now work! The database will automatically:
- Create the profile in the `profiles` table
- Create the appropriate role-specific profile (`tailor_profiles` or `customer_profiles`)

---

## What Changed

**Before:**
- App tried to manually insert profile after signup
- RLS policy blocked it because session wasn't fully established

**After:**
- User metadata (name, role) is passed during signup
- Database trigger automatically creates profiles with elevated privileges
- No RLS issues!

---

## Verify It Worked

After signing up:
1. Go to Supabase dashboard → **Table Editor**
2. Check the `profiles` table - you should see your profile
3. Check `tailor_profiles` or `customer_profiles` - you should see your role-specific profile
4. You should be redirected to the appropriate dashboard
