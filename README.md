<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Ibyla3n6dcU07BBR0O8Ro0fEfzCfkzbR

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Verify installation:
   ```bash
   npm run verify
   ```
   This will check that all components are properly configured.

3. Set the `GEMINI_API_KEY` in [.env.local](.env.local):
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key from https://ai.google.dev/

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to: http://localhost:3000

## Building for Production

To build the app for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Features

- 🎤 Voice-based astrology predictions using Gemini AI
- 🌟 12 zodiac signs with Thai language support  
- 🔮 Multiple astrology functions:
  - Daily horoscope
  - Lucky numbers and colors
  - Love compatibility
  - Career predictions
  - And more!

## Testing

This project includes comprehensive tests to verify functionality:

```bash
# Run all tests
npm test

# Run only integration tests (app structure)
npm run test:integration

# Run only tool function tests (astrology logic)
npm run test:tools

# Run verification script
npm run verify
```

All tests check:
- ✅ Dependencies are installed correctly
- ✅ All 12 zodiac signs with Thai translations
- ✅ 6 astrology tool functions
- ✅ React components and app structure
- ✅ State management configuration
- ✅ Vite and TypeScript configuration

## Troubleshooting

If you encounter issues:
1. Make sure you have Node.js installed
2. Run `npm run verify` to check your setup
3. Ensure your `GEMINI_API_KEY` is set correctly in `.env.local`
4. Check that all dependencies are installed with `npm install`

