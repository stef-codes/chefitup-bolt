# Google OAuth Setup for ChefItUp

This guide will help you configure Google OAuth authentication in your Supabase project for the ChefItUp app.

## Prerequisites

1. A Supabase project
2. A Google Cloud Console project
3. The ChefItUp app configured with the scheme `chefitup`

## Step 1: Configure Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add the following authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Note down your Client ID and Client Secret

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Edit"
4. Enable Google authentication
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Save the configuration

## Step 3: Configure Redirect URLs

In your Supabase project dashboard:

1. Go to "Authentication" > "URL Configuration"
2. Add the following redirect URLs:
   ```
   chefitup://auth/callback
   exp://localhost:8081/--/auth/callback
   ```

## Step 4: Test the Integration

1. Start your ChefItUp app
2. Go to the onboarding screen
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to the app

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check that the scheme in app.json is set to "chefitup"

2. **"Provider not enabled" error**:
   - Ensure Google provider is enabled in Supabase
   - Verify your Client ID and Secret are correct

3. **Callback not working**:
   - Check that the auth/callback route is properly configured
   - Verify the redirect URLs in Supabase settings

### Testing in Development:

For development, you can also add:
```
exp://localhost:8081/--/auth/callback
```

## Security Notes

- Keep your Google OAuth credentials secure
- Never commit Client Secrets to version control
- Use environment variables for production deployments
- Regularly rotate your OAuth credentials

## Next Steps

After setting up Google OAuth:

1. Test the sign-in flow thoroughly
2. Handle user profile data from Google
3. Implement proper error handling
4. Add additional OAuth providers if needed (Apple, GitHub, etc.) 