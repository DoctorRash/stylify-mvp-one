# Phase 2 Setup Instructions

## Database Setup

Before you can use the application, you need to set up the database schema in Supabase.

### Step 1: Run the SQL Migration

1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Click on your project (`stylify-mvp`)
3. In the left sidebar, click **SQL Editor**
4. Click **New query**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
8. You should see "Success. No rows returned" message

### Step 2: Create Storage Buckets

The SQL migration creates the tables, but storage buckets must be created manually:

1. In your Supabase dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Create the following buckets:

#### Bucket 1: avatars
- Name: `avatars`
- Public: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket 2: portfolios
- Name: `portfolios`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket 3: order-images
- Name: `order-images`
- Public: ❌ No (Private)
- File size limit: 10MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket 4: tryon-results
- Name: `tryon-results`
- Public: ❌ No (Private)
- File size limit: 10MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### Step 3: Verify Tables

1. In your Supabase dashboard, click **Table Editor** in the left sidebar
2. You should see the following tables:
   - `profiles`
   - `tailor_profiles`
   - `customer_profiles`
   - `orders`
   - `order_items`

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing the Application

### Test 1: Customer Signup
1. Go to `http://localhost:3000`
2. You'll be redirected to `/auth`
3. Click the "Sign Up" tab
4. Fill in:
   - Full Name: "Test Customer"
   - Email: "customer@test.com"
   - Password: "TestPass123!"
   - Role: Select "Customer"
5. Click "Create Account"
6. You should be redirected to `/customer/explore`
7. You should see a welcome message with your name

### Test 2: Tailor Signup
1. Open a new incognito/private window
2. Go to `http://localhost:3000/auth`
3. Click the "Sign Up" tab
4. Fill in:
   - Full Name: "Test Tailor"
   - Email: "tailor@test.com"
   - Password: "TestPass123!"
   - Role: Select "Tailor"
5. Click "Create Account"
6. You should be redirected to `/tailor/dashboard`
7. You should see a welcome message with your name

### Test 3: Login
1. Sign out from either account
2. Go to `/auth`
3. Click the "Login" tab
4. Enter the credentials you used for signup
5. Click "Login"
6. You should be redirected to the appropriate dashboard based on your role

### Test 4: Route Protection
1. While logged out, try to access:
   - `http://localhost:3000/tailor/dashboard` → Should redirect to `/auth`
   - `http://localhost:3000/customer/explore` → Should redirect to `/auth`
2. While logged in as a customer, try to access:
   - `http://localhost:3000/tailor/dashboard` → Should redirect to `/customer/explore`
3. While logged in as a tailor, try to access:
   - `http://localhost:3000/customer/explore` → Should redirect to `/tailor/dashboard`

## Verify in Supabase

After creating accounts, verify in your Supabase dashboard:

1. **Authentication → Users**: You should see the created users
2. **Table Editor → profiles**: You should see profile records with correct roles
3. **Table Editor → tailor_profiles**: You should see a record for the tailor account
4. **Table Editor → customer_profiles**: You should see a record for the customer account

## Troubleshooting

### "Supabase client not initialized"
- Check that your `.env.local` file has the correct Supabase credentials
- Restart the dev server after adding environment variables

### "User already exists"
- The email is already registered
- Use a different email or delete the user from Supabase dashboard

### "Invalid credentials"
- Check that you're using the correct email and password
- Password must be at least 6 characters

### Tables not created
- Make sure you ran the entire SQL migration file
- Check the SQL Editor for any error messages
- Verify you're in the correct Supabase project

## Next Steps

Once Phase 2 is working correctly:
- Phase 3: Tailor profile setup
- Phase 4: Customer order flow
- Phase 5: AI virtual try-on integration
- Phase 6: Email notifications
