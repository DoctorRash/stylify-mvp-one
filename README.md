# Stylify MVP

AI-powered fashion marketplace connecting tailors with customers through virtual try-on technology.

## Features

- 🔐 Role-based authentication (Tailor/Customer/Admin)
- 👔 Tailor profiles with portfolio management
- 🛍️ Multi-step order flow with autosave
- 🤖 AI-powered virtual try-on
- 📧 Email notifications
- 📊 Admin dashboard with metrics
- 🌓 Dark/Light theme support
- ♿ Accessibility-first design

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **AI**: Replicate/Stability AI
- **Email**: SendGrid/Brevo
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- API keys (see setup instructions below)

### Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Fill in your API keys (see "API Key Setup" section below)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Key Setup

### 1. Supabase Keys

**What you need**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`

**How to get them**:

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `stylify-mvp`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project to provision (~2 minutes)
5. Once ready, go to **Settings** → **API**
6. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ Keep this secret!)

### 2. AI API Key (Replicate)

**What you need**: `AI_API_KEY`

**How to get it**:

1. Go to [replicate.com](https://replicate.com)
2. Sign up with GitHub or email
3. Click your profile icon → **API tokens**
4. Click **Create token**
5. Name it `stylify-mvp`
6. Copy the token → `AI_API_KEY`

**Alternative: Stability AI**

1. Go to [platform.stability.ai](https://platform.stability.ai)
2. Sign up and verify email
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key → `AI_API_KEY`

**Note**: Both services offer free credits for testing. Replicate is recommended for this project.

### 3. Email API Key (SendGrid)

**What you need**: `EMAIL_API_KEY`

**How to get it**:

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day free tier)
3. Complete email verification
4. Go to **Settings** → **API Keys**
5. Click **Create API Key**
6. Name: `stylify-mvp`
7. Permissions: **Full Access** (or **Mail Send** only)
8. Click **Create & View**
9. Copy the key → `EMAIL_API_KEY` (⚠️ Only shown once!)

**Alternative: Brevo (formerly Sendinblue)**

1. Go to [brevo.com](https://www.brevo.com)
2. Sign up for free (300 emails/day)
3. Go to **SMTP & API** → **API Keys**
4. Click **Generate a new API key**
5. Name it and copy → `EMAIL_API_KEY`

### 4. Vercel URL

**What you need**: `VERCEL_URL`

**How to get it**:

- **Local development**: Use `http://localhost:3000`
- **Production**: This is auto-populated by Vercel when you deploy
- You can also manually set it after deploying (see Deployment section)

## Database Setup

After getting your Supabase keys, you need to create the database tables:

1. Go to your Supabase project dashboard
2. Click **SQL Editor**
3. Run the migration files in order (we'll create these in Phase 2)

## Project Structure

```
stylify-mvp/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── tailor/            # Tailor dashboard & profile
│   ├── customer/          # Customer pages
│   └── admin/             # Admin dashboard
├── components/            # Reusable React components
├── lib/                   # Utilities and helpers
│   ├── animations/        # Framer Motion variants
│   └── supabase/          # Supabase client setup
└── public/                # Static assets
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **New Project**
4. Import your GitHub repository
5. Configure environment variables:
   - Add all variables from `.env.local`
   - Vercel will auto-populate `VERCEL_URL`
6. Click **Deploy**

### Environment Variables in Vercel

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `AI_API_KEY`
   - `EMAIL_API_KEY`
3. Click **Save**
4. Redeploy if needed

## Rollback Instructions

If you need to rollback a deployment:

1. Go to Vercel dashboard → **Deployments**
2. Find the previous working deployment
3. Click the three dots → **Promote to Production**

## Testing

### Create Test Accounts

1. **Tailor Account**:
   - Go to `/auth/signup`
   - Select role: "Tailor"
   - Complete signup
   - Verify you're redirected to `/tailor/dashboard`

2. **Customer Account**:
   - Use a different email
   - Select role: "Customer"
   - Verify redirect to `/customer/explore`

### Test Features

- ✅ Theme toggle works
- ✅ Authentication flow
- ✅ Role-based routing
- ✅ Profile creation
- ✅ Image uploads
- ✅ Order flow
- ✅ Try-on generation

## Troubleshooting

### "Supabase client not initialized"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server after adding env variables

### "AI API failed"
- Verify `AI_API_KEY` is correct
- Check API credits/quota
- Fallback composite should still work

### "Email not sending"
- Verify `EMAIL_API_KEY` is valid
- Check SendGrid/Brevo dashboard for errors
- Ensure sender email is verified

## Performance

- Target Lighthouse score: ≥80 on mobile
- Image optimization via Next.js Image component
- Lazy loading for images
- Code splitting via App Router

## Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Reduced motion support
- Screen reader friendly

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
