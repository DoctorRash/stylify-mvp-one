# ⚠️ CRITICAL: How to Fix Your .env.local File

## The Problem

Your `.env.local` file has **line breaks in the middle of the API keys**, which is causing the 401 error. Each environment variable must be on a **single line** with no breaks.

## ❌ WRONG (What you have now):
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn
R5cCI6IkpXVCJ9.eyJpc3MiOiJ
zdXBhYmFzZSIsInJlZiI6InJxd
...
```

## ✅ CORRECT (What it should be):
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd...
```

---

## How to Fix It

### Option 1: Manual Fix (Recommended)

1. **Open `.env.local`** in your code editor
2. **Delete everything** in the file
3. **Copy this template** and paste it:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
AI_API_KEY=
EMAIL_API_KEY=
VERCEL_URL=http://localhost:3000
```

4. **Go to your Supabase dashboard** → Settings → API
5. **Copy each value** and paste it **immediately after the `=`** sign
   - Make sure each key is on **ONE SINGLE LINE**
   - No spaces before or after the value
   - No line breaks in the middle

6. **Your final file should look like this:**

```
NEXT_PUBLIC_SUPABASE_URL=https://rqttsmxrxxklzepliebo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdHRzbXhyeHhrbHplcGxpYm8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2NDUzMTkyMiwiZXhwIjoyMDgwMTA3OTIyfQ.Cta8iThH6lKD3fkeo05-4sLs4TqTbK0pNuumYuDywqE
SUPABASE_SERVICE_KEY=your_service_role_key_here
AI_API_KEY=your_ai_api_key_here
EMAIL_API_KEY=your_email_api_key_here
VERCEL_URL=http://localhost:3000
```

7. **Save the file**
8. **Restart the dev server**:
   - Stop it (Ctrl+C)
   - Run `npm run dev`

---

## Important Notes

- **Each line must be continuous** - no line breaks in the middle of a value
- **No spaces** around the `=` sign
- **No quotes** around the values
- The anon key is very long (200+ characters) - that's normal!
- Make sure you copy the **entire key** from Supabase

---

## After Fixing

1. Restart the dev server
2. Try signing up again
3. The 401 error should be gone!
