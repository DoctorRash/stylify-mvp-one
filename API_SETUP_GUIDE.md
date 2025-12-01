# Complete API Key Setup Guide for Stylify MVP

This guide provides detailed, step-by-step instructions for obtaining all API keys needed for the Stylify project.

---

## 📋 Overview

You'll need API keys from 4 services:
1. **Supabase** - Database, Authentication, Storage
2. **Replicate** OR **Stability AI** - AI virtual try-on
3. **SendGrid** OR **Brevo** - Email notifications

**Estimated setup time**: 30-45 minutes total

---

## 1️⃣ Supabase Setup (15-20 minutes)

### What You'll Get
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

### Step-by-Step Instructions

#### Step 1: Create Account
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** or **"Sign up"**
3. Sign up using:
   - GitHub (recommended - fastest)
   - Google
   - Email

#### Step 2: Create New Project
1. After login, you'll see the dashboard
2. Click **"New Project"** (green button)
3. Fill in the form:
   - **Organization**: Create new or select existing
   - **Name**: `stylify-mvp` (or any name you prefer)
   - **Database Password**: 
     - Click "Generate a password" OR
     - Create a strong password (save this!)
   - **Region**: Choose closest to your location
     - US East (Ohio) - `us-east-1`
     - Europe (Frankfurt) - `eu-central-1`
     - Asia Pacific (Singapore) - `ap-southeast-1`
   - **Pricing Plan**: Free (perfect for development)

4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning (you'll see a progress indicator)

#### Step 3: Get Your API Keys
Once your project is ready:

1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see the API settings page with:

**Copy these values:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
```
→ This is your `NEXT_PUBLIC_SUPABASE_URL`

**API Keys section:**

```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```
service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ This is your `SUPABASE_SERVICE_KEY` ⚠️ **KEEP THIS SECRET!**

#### Step 4: Save Your Keys
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Supabase setup complete!**

---

## 2️⃣ AI API Setup (10 minutes)

Choose **ONE** of these options:

### Option A: Replicate (Recommended)

#### Why Replicate?
- Easy to use
- Pay-as-you-go pricing
- $5 free credit for new accounts
- Great for virtual try-on models

#### Step-by-Step Instructions

1. Go to **[replicate.com](https://replicate.com)**
2. Click **"Sign in"** or **"Sign up"**
3. Sign up with:
   - GitHub (fastest)
   - Google
   - Email

4. After login, click your **profile icon** (top right)
5. Select **"API tokens"** from dropdown
6. Click **"Create token"** button
7. Give it a name: `stylify-mvp`
8. Click **"Create"**
9. **Copy the token immediately** (shown only once!)

```
r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
→ This is your `AI_API_KEY`

#### Add to .env.local:
```bash
AI_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Pricing
- $5 free credit for new accounts
- ~$0.01-0.05 per try-on generation
- No monthly fees

✅ **Replicate setup complete!**

---

### Option B: Stability AI

#### Why Stability AI?
- High-quality image generation
- Good for fashion/clothing
- Free tier available

#### Step-by-Step Instructions

1. Go to **[platform.stability.ai](https://platform.stability.ai)**
2. Click **"Sign up"** or **"Get started"**
3. Create account with email
4. Verify your email (check inbox)
5. After login, go to **"API Keys"** in the menu
6. Click **"Create API Key"**
7. Name it: `stylify-mvp`
8. Copy the key:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
→ This is your `AI_API_KEY`

#### Add to .env.local:
```bash
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Pricing
- 25 free credits on signup
- ~1-2 credits per generation
- $10/month for 1000 credits

✅ **Stability AI setup complete!**

---

## 3️⃣ Email API Setup (10 minutes)

Choose **ONE** of these options:

### Option A: SendGrid (Recommended)

#### Why SendGrid?
- 100 emails/day free forever
- Easy setup
- Reliable delivery
- Good documentation

#### Step-by-Step Instructions

1. Go to **[sendgrid.com](https://sendgrid.com)**
2. Click **"Start for free"** or **"Sign up"**
3. Fill in the signup form:
   - Email
   - Password
   - Accept terms
4. Verify your email (check inbox)
5. Complete the onboarding questions:
   - "What's your role?" → Developer
   - "What will you use SendGrid for?" → Transactional emails
   - "How many emails?" → Less than 40k/month

6. After onboarding, go to **Settings** → **API Keys** (left sidebar)
7. Click **"Create API Key"** (blue button)
8. Configure:
   - **API Key Name**: `stylify-mvp`
   - **API Key Permissions**: 
     - Select **"Full Access"** OR
     - Select **"Restricted Access"** → Enable only **"Mail Send"**
9. Click **"Create & View"**
10. **Copy the API key immediately** (shown only once!)

```
SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
→ This is your `EMAIL_API_KEY`

#### Add to .env.local:
```bash
EMAIL_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Important: Verify Sender Email
Before sending emails, you need to verify a sender email:

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - From Name: `Stylify`
   - From Email: your email
   - Reply To: same email
   - Company details
4. Check your email and click verification link
5. ✅ Now you can send emails!

#### Pricing
- **Free tier**: 100 emails/day forever
- No credit card required

✅ **SendGrid setup complete!**

---

### Option B: Brevo (formerly Sendinblue)

#### Why Brevo?
- 300 emails/day free
- No credit card required
- Good for EU users

#### Step-by-Step Instructions

1. Go to **[brevo.com](https://www.brevo.com)**
2. Click **"Sign up free"**
3. Fill in signup form and verify email
4. Complete onboarding wizard
5. Go to **SMTP & API** → **API Keys** (top menu)
6. Click **"Generate a new API key"**
7. Name it: `stylify-mvp`
8. Copy the key:

```
xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
→ This is your `EMAIL_API_KEY`

#### Add to .env.local:
```bash
EMAIL_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Pricing
- **Free tier**: 300 emails/day
- No credit card required

✅ **Brevo setup complete!**

---

## 4️⃣ Final .env.local File

Your complete `.env.local` should look like this:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI API (Replicate OR Stability AI)
AI_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email API (SendGrid OR Brevo)
EMAIL_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vercel (leave empty for local development)
VERCEL_URL=http://localhost:3000
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already done)
- Never commit API keys to Git
- Use environment variables in Vercel for production
- Rotate keys if exposed

### ❌ DON'T:
- Share `SUPABASE_SERVICE_KEY` publicly
- Commit `.env.local` to version control
- Use production keys in development
- Hardcode keys in your code

---

## 🧪 Testing Your Setup

After adding all keys, test them:

```bash
# Restart your dev server
npm run dev
```

### Test Checklist:
- [ ] Supabase connection works (Phase 2)
- [ ] Can sign up/login (Phase 2)
- [ ] AI API responds (Phase 6)
- [ ] Emails send successfully (Phase 7)

---

## 💰 Cost Summary

### Free Tier Limits:
- **Supabase**: 500MB database, 1GB storage, 2GB bandwidth
- **Replicate**: $5 free credit (~100-500 generations)
- **Stability AI**: 25 free credits (~12-25 generations)
- **SendGrid**: 100 emails/day forever
- **Brevo**: 300 emails/day forever

### Estimated Monthly Cost (after free tier):
- **Development**: $0 (stay within free tiers)
- **Production (low traffic)**: $5-15/month
- **Production (medium traffic)**: $25-50/month

---

## 🆘 Troubleshooting

### Supabase Issues
**Problem**: "Invalid API key"
- Solution: Check you copied the full key (very long string)
- Verify no extra spaces

**Problem**: "Project not found"
- Solution: Ensure URL includes `https://` and `.supabase.co`

### Replicate Issues
**Problem**: "Authentication failed"
- Solution: Regenerate token, ensure it starts with `r8_`

### SendGrid Issues
**Problem**: "Sender not verified"
- Solution: Check email for verification link
- Go to Sender Authentication settings

**Problem**: "API key invalid"
- Solution: Regenerate key with correct permissions

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Replicate Documentation](https://replicate.com/docs)
- [Stability AI Documentation](https://platform.stability.ai/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Brevo Documentation](https://developers.brevo.com)

---

## ✅ Next Steps

Once you have all API keys:
1. Create `.env.local` file with all keys
2. Restart your development server
3. Let me know you're ready for **Phase 2: Authentication**!

---

**Questions?** Let me know which service you need help with!
