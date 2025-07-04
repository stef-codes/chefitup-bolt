# Database Setup Guide - Fix Missing Profiles Table

This guide will help you create the missing `profiles` table in your Supabase database.

## The Problem

You're seeing this error:
```
ERROR Error loading user profile: {"code": "42P01", "details": null, "hint": null, "message": "relation \"public.profiles\" does not exist"}
```

This means the `profiles` table doesn't exist in your Supabase database.

## Solution: Create the Profiles Table

### Step 1: Access Your Supabase Dashboard

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your ChefItUp project
3. Go to the **SQL Editor** (in the left sidebar)

### Step 2: Run the SQL Script

Copy and paste this SQL script into the SQL Editor and click "Run":

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

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on user signup
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

### Step 3: Verify the Table Was Created

1. Go to **Table Editor** in your Supabase dashboard
2. You should see a `profiles` table in the list
3. Click on it to see the table structure

### Step 4: Test the Setup

1. Restart your app
2. Try completing the onboarding flow again
3. Check the console logs - you should no longer see the "relation does not exist" error

## What This Script Does

1. **Creates the `profiles` table** with all necessary columns for user data
2. **Enables Row Level Security** to protect user data
3. **Creates security policies** so users can only access their own profile
4. **Sets up automatic profile creation** when a user signs up
5. **Adds proper data types** for all user preferences and stats

## Troubleshooting

### If you get permission errors:
- Make sure you're logged into Supabase as the project owner
- Try running the SQL commands one by one

### If the table still doesn't appear:
- Refresh the Table Editor page
- Check the SQL Editor for any error messages
- Make sure you're in the correct project

### If you still get errors after creating the table:
- Check that your environment variables are correct
- Verify your Supabase URL and key in the `.env` file
- Restart your development server

## Next Steps

After creating the table:
1. Test the onboarding flow
2. Check that user profiles are being saved
3. Verify that the app can load user data
4. Test the authentication flow

The onboarding should now work properly without the database errors! 