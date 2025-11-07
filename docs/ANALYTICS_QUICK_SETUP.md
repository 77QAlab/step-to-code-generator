# Analytics Quick Setup

Get analytics tracking up and running in 3 steps.

## Step 1: Create .env File

Create a `.env` file in the project root:

```bash
# Windows (PowerShell)
New-Item .env

# Mac/Linux
touch .env
```

Or copy from `env.example.txt`:
```bash
cp env.example.txt .env
```

## Step 2: Add Your Analytics ID

Open `.env` and add your analytics configuration:

### Option A: Google Analytics 4
```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Get your ID from: https://analytics.google.com/ → Admin → Data Streams

### Option B: Plausible Analytics
```env
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

Get domain from: https://plausible.io/ → Your Sites

### Option C: Both (Optional)
```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

### Option D: Disable
Leave empty:
```env
VITE_GA4_MEASUREMENT_ID=
VITE_PLAUSIBLE_DOMAIN=
```

## Step 3: Restart Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ Verify It Works

1. **Check Console**: Look for: `Analytics initialized: { ga4: true }` or similar
2. **Perform Actions**: Click Download, Import CSV, change framework
3. **Check Dashboard**: View events in your analytics dashboard

## What Gets Tracked?

- ✅ Page views
- ✅ Code downloads (with framework info)
- ✅ CSV imports/exports
- ✅ Framework selection changes
- ✅ Code copies to clipboard
- ✅ Custom template creation

## Need Help?

See full documentation: [ANALYTICS.md](./ANALYTICS.md)

---

**That's it!** Analytics will start tracking automatically. 🎉

