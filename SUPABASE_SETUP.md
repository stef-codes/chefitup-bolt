# Supabase Authentication Setup

This guide will help you set up Supabase authentication for the ChefItUp app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env` file in your project root with the following content:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database Schema

Run the following SQL in your Supabase SQL Editor:

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

-- Enable RLS
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

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (for development, use `http://localhost:3000`)
3. Add redirect URLs for your app:
   - For development: `http://localhost:3000/**`
   - For production: `https://yourdomain.com/**`

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with a new account
3. Check that the user profile is created in the `profiles` table
4. Test signing in and out

## 6. Troubleshooting

### Common Issues:

1. **Environment variables not loading**: Make sure your `.env` file is in the project root and starts with `EXPO_PUBLIC_`
2. **Database connection errors**: Verify your Supabase URL and key are correct
3. **RLS policy errors**: Make sure you've run the SQL setup script
4. **Authentication redirect issues**: Check your redirect URLs in Supabase settings

### Getting Help:

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [React Native setup guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- Check the console for error messages

## 7. Production Deployment

When deploying to production:

1. Update your environment variables with production Supabase credentials
2. Configure proper redirect URLs in Supabase
3. Set up proper email templates in Supabase Authentication settings
4. Consider enabling additional security features like MFA 