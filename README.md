# ChefItUp - Diabetes-Friendly Meal Planning App

A beautiful, production-ready React Native app built with Expo Router for diabetes-friendly meal planning, recipe management, and shopping list organization.

![ChefItUp App](https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

## 🌟 Features

- **Personalized Onboarding**: Tailored setup for diabetes type, dietary restrictions, and cooking preferences
- **Smart Meal Planning**: Weekly meal plans with carb tracking and glycemic index indicators
- **Recipe Library**: Curated diabetes-friendly recipes with detailed nutritional information
- **Shopping Lists**: Auto-generated shopping lists with price tracking and category organization
- **Progress Tracking**: Monitor carb intake, meal prep goals, and weekly achievements
- **Beautiful UI**: Modern, accessible design with smooth animations and micro-interactions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chefitup-bolt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - **Web**: The app will automatically open in your browser at `http://localhost:8081`
   - **Mobile**: Use the Expo Go app to scan the QR code displayed in the terminal
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## 📱 Platform Support

This app is optimized for **web-first** development with full mobile compatibility:

- ✅ **Web** (Primary platform)
- ✅ **iOS** (via Expo Go or development build)
- ✅ **Android** (via Expo Go or development build)

## 🏗️ Project Structure

```
chefitup-bolt/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with navigation
│   ├── onboarding.tsx           # User onboarding flow
│   ├── +not-found.tsx           # 404 page
│   └── (tabs)/                  # Tab-based navigation
│       ├── _layout.tsx          # Tab bar configuration
│       ├── index.tsx            # Home dashboard
│       ├── recipes.tsx          # Recipe library
│       ├── meal-plan.tsx        # Weekly meal planning
│       ├── shopping.tsx         # Shopping lists
│       └── profile.tsx          # User profile & settings
├── components/                   # Reusable components (future)
├── hooks/                       # Custom React hooks
│   └── useFrameworkReady.ts     # Framework initialization
├── assets/                      # Static assets
│   └── images/                  # App icons and images
├── types/                       # TypeScript type definitions
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#16A34A` (Green - health/wellness theme)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Neutral**: `#6B7280` (Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)

### Components
- Modern card-based layouts
- Consistent 16px padding system
- Smooth animations with React Native Reanimated
- Accessible touch targets (44px minimum)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for web production
npm run build:web

# Run linting
npm run lint
```

### Key Technologies

- **Framework**: Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17
- **Styling**: StyleSheet (React Native)
- **Icons**: Lucide React Native
- **Fonts**: @expo-google-fonts/inter
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

### Development Guidelines

1. **File Organization**
   - All routes go in `/app` directory
   - Reusable components in `/components`
   - Use TypeScript for all files

2. **Styling**
   - Use `StyleSheet.create()` for all styles
   - Follow consistent spacing (8px, 16px, 24px, 32px)
   - Maintain color system consistency

3. **Navigation**
   - Primary navigation uses tabs
   - Secondary navigation uses stacks within tabs
   - All routes must export default React components

4. **Platform Compatibility**
   - Web-first development approach
   - Use `Platform.select()` for platform-specific code
   - Test on all target platforms

## 📊 App Features Deep Dive

### 🏠 Home Dashboard
- Daily carb progress tracking
- Weekly goal visualization
- Quick action buttons
- Recent recipe carousel
- Next meal reminders

### 📖 Recipe Library
- Diabetes-friendly recipe collection
- Advanced filtering (category, glycemic index, prep time)
- Detailed nutritional information
- Favorite recipes system
- Search functionality

### 📅 Meal Planning
- Weekly meal plan grid
- Drag-and-drop meal assignment
- Prep schedule optimization
- Nutritional overview
- Shopping list generation

### 🛒 Shopping Lists
- Auto-generated from meal plans
- Category-based organization
- Price tracking and budgeting
- Progress indicators
- Shareable lists

### 👤 User Profile
- Diabetes type and preferences
- Progress tracking and achievements
- Goal setting and monitoring
- App settings and customization

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_API_KEY=your-api-key
```

### App Configuration

Key settings in `app.json`:

```json
{
  "expo": {
    "name": "ChefItUp",
    "slug": "chefitup-diabetes-app",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "web": {
      "bundler": "metro",
      "output": "single"
    }
  }
}
```

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the `dist` folder to your hosting provider
```

### Mobile App Store
1. Create a development build:
   ```bash
   expo build:ios
   expo build:android
   ```

2. Submit to app stores:
   ```bash
   expo submit:ios
   expo submit:android
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Add proper type definitions
- Include JSDoc comments for complex functions
- Maintain consistent formatting with Prettier

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Font loading problems:**
```bash
npx expo install --fix
```

**iOS simulator not opening:**
```bash
npx expo run:ios
```

**Android emulator issues:**
```bash
npx expo run:android
```

### Getting Help

- 📖 [Expo Documentation](https://docs.expo.dev/)
- 💬 [Expo Discord](https://discord.gg/expo)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

## 🎯 Roadmap

- [ ] User authentication and data sync
- [ ] Offline recipe storage
- [ ] Barcode scanning for nutrition info
- [ ] Integration with fitness trackers
- [ ] Social features and recipe sharing
- [ ] AI-powered meal recommendations
- [ ] Healthcare provider integration

---

**Built with ❤️ for the diabetes community**

*ChefItUp helps people with diabetes maintain healthy eating habits through smart meal planning and beautiful, intuitive design.*