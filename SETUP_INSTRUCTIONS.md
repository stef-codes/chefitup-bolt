# ChefItUp Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `chefitup` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to you
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Create Environment File

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar TEXT,
  diabetes_type TEXT,
  age TEXT,
  carb_budget TEXT,
  restrictions TEXT[],
  goals TEXT[],
  cooking_level TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

4. Click **Run** to execute the SQL

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://yourdomain.com/**` (for production)

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Try the onboarding flow:
   - The app should now connect to Supabase
   - User accounts will be created in Supabase Auth
   - Profile data will be saved to the profiles table

## Troubleshooting

### "relation 'profiles' does not exist"
- Make sure you ran the SQL script in Step 4
- Check that you're in the correct Supabase project

### "Invalid API key"
- Verify your `.env` file has the correct credentials
- Make sure the environment variables start with `EXPO_PUBLIC_`

### "Network error"
- Check your internet connection
- Verify the Supabase URL is correct
- Make sure your Supabase project is active

## Next Steps

Once setup is complete:
1. Test user registration through the onboarding flow
2. Check the Supabase dashboard to see created users and profiles
3. Customize the profile fields as needed
4. Set up email templates in Authentication → Email Templates

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Verify all environment variables are set correctly
3. Ensure the database schema was created successfully
4. Check the browser console for detailed error messages 