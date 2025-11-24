# Authentication Setup Guide

Daily Grind now has full authentication powered by Supabase! Users can sign up, sign in, and manage their accounts.

## Features

- ✅ Email/password authentication
- ✅ User sign up with email confirmation
- ✅ Secure sign in
- ✅ User profile dropdown
- ✅ Sign out functionality
- ✅ Beautiful auth modal
- ✅ Protected user state
- ✅ Persistent sessions

## Setup Instructions

### 1. Create a Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up (it's free!)

### 2. Create a New Project

1. Click "New Project"
2. Give it a name: "daily-grind" (or whatever you like)
3. Set a strong database password (save this!)
4. Choose a region close to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 3. Get Your API Credentials

1. Go to your project dashboard
2. Click "Settings" (gear icon) in the sidebar
3. Click "API" under Project Settings
4. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 4. Add to Your Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run the App

```bash
npm run dev
```

That's it! Click "Sign In" in the header to test it out.

## Email Confirmation

By default, Supabase requires email confirmation for new users. To disable this (for testing):

1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Scroll to "Email Auth"
4. Toggle OFF "Enable email confirmations"

## User Flow

### Sign Up
1. User clicks "Sign In" button
2. Switches to "Sign Up" tab
3. Enters email and password (min 6 characters)
4. Receives confirmation email (if enabled)
5. Clicks link in email to confirm

### Sign In
1. User clicks "Sign In" button
2. Enters email and password
3. Instantly signed in
4. User icon appears in header

### Sign Out
1. Click user icon in header
2. Click "Sign Out"
3. Signed out and redirected

## Deployment (Vercel)

Add these environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Architecture

### Frontend Components

- **`AuthContext`** (`src/contexts/AuthContext.tsx`) - React context for auth state
- **`AuthModal`** (`src/components/AuthModal.tsx`) - Sign in/sign up UI
- **`Header`** (`src/components/Header.tsx`) - User menu and auth button
- **`supabase`** (`src/lib/supabase.ts`) - Supabase client configuration

### How It Works

1. **AuthProvider** wraps the entire app in `main.tsx`
2. Supabase client is initialized with your credentials
3. Auth state is managed globally via React Context
4. User sessions persist across page reloads
5. Supabase handles all auth logic securely

## Security Features

✅ **Secure by default**: All passwords hashed by Supabase
✅ **Email verification**: Optional email confirmation
✅ **Session management**: Automatic token refresh
✅ **XSS protection**: Anon key is safe to expose (frontend-only access)
✅ **Row Level Security**: Supabase RLS ready for future features

## Customization

### Change Password Requirements

Edit `AuthModal.tsx` (line ~110):

```tsx
<input
  type="password"
  minLength={8}  // Change from 6 to 8
  // ...
/>
```

### Add Social Auth (Google, GitHub, etc.)

1. Enable in Supabase dashboard: Authentication > Providers
2. Add social login buttons in `AuthModal.tsx`
3. Use `supabase.auth.signInWithOAuth()`

### Customize Email Templates

1. Go to Supabase dashboard
2. Navigate to Authentication > Email Templates
3. Customize the confirmation email, reset password, etc.

## Future Enhancements

Now that you have auth, you can add:

- [ ] Order history (per user)
- [ ] Saved addresses
- [ ] Favorite products
- [ ] User preferences
- [ ] Loyalty points
- [ ] Admin dashboard

## Troubleshooting

### "Auth features will be disabled" warning
- Check that your `.env` file has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after adding env variables

### "Invalid API key" error
- Double-check you copied the **anon key**, not the **service_role key**
- The anon key starts with `eyJ...`

### Email confirmation not working
- Check your spam folder
- Verify email settings in Supabase dashboard
- Disable email confirmation for testing

### User stays logged in after closing browser
- This is expected behavior (persistent sessions)
- To change: modify session persistence in `AuthContext.tsx`

## Cost

Supabase free tier includes:
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 500 MB database storage
- ✅ 1 GB file storage

Perfect for a solo dev project!

## Support

Questions? Check:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Community Discord](https://discord.supabase.com)

---

**Built with ❤️ by makers, for makers**
