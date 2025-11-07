# Analytics Setup Guide

This guide explains how to set up analytics tracking for the Step-to-Code Generator using Google Analytics 4 or Plausible Analytics.

## Overview

The application supports two analytics providers:
- **Google Analytics 4 (GA4)** - Full-featured analytics with detailed insights
- **Plausible Analytics** - Privacy-friendly, GDPR-compliant alternative

You can enable one or both, or disable analytics entirely.

## Quick Setup

### 1. Create Environment File

Create a `.env` file in the root directory of the project:

```bash
# Copy the example file (if available)
cp .env.example .env

# Or create manually
touch .env
```

### 2. Configure Analytics

Edit the `.env` file and add your analytics configuration:

#### For Google Analytics 4

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**How to get your Measurement ID:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Go to Admin → Data Streams
4. Select your web stream
5. Copy the Measurement ID (starts with `G-`)

#### For Plausible Analytics

```env
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

**How to set up Plausible:**
1. Sign up at [Plausible Analytics](https://plausible.io/)
2. Add your domain
3. Use your domain name as the value (e.g., `step-to-code-generator.com`)

#### Enable Both (Optional)

You can enable both providers simultaneously:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

#### Disable Analytics

Leave both variables empty or unset:

```env
VITE_GA4_MEASUREMENT_ID=
VITE_PLAUSIBLE_DOMAIN=
```

### 3. Restart Development Server

After updating `.env`, restart your development server:

```bash
npm run dev
```

The analytics scripts will automatically load if configured.

## Tracked Events

The following events are automatically tracked:

### Page Views
- **Event**: Automatic page view tracking
- **When**: On initial page load and navigation
- **Properties**: Page path

### Code Downloads
- **Event**: `download_code`
- **When**: User clicks "Download" button
- **Properties**:
  - `framework`: Selected framework (playwright, cypress, testcafe)
  - `test_name`: Name of the test
  - `file_type`: File extension (spec.js, cy.js, test.js)

### CSV Imports
- **Event**: `csv_import`
- **When**: User imports a CSV file
- **Properties**:
  - `step_count`: Number of steps imported

### CSV Exports
- **Event**: `csv_export`
- **When**: User exports steps as CSV
- **Properties**:
  - `step_count`: Number of steps exported

### Framework Selection
- **Event**: `framework_change`
- **When**: User changes the framework selector
- **Properties**:
  - `framework`: Selected framework (playwright, cypress, testcafe)

### Code Copy
- **Event**: `code_copy`
- **When**: User copies code to clipboard
- **Properties**:
  - `framework`: Selected framework

### Custom Template Added
- **Event**: `custom_template_added`
- **When**: User adds a custom step template
- **Properties**: None

## Viewing Analytics Data

### Google Analytics 4

1. Go to your [Google Analytics dashboard](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Engagement** → **Events**
4. View custom events in real-time or historical data

**Useful Reports:**
- **Realtime**: See events as they happen
- **Events**: View all custom events
- **User Engagement**: Track user interactions

### Plausible Analytics

1. Log in to your [Plausible dashboard](https://plausible.io/)
2. Select your site
3. View **Top Pages**, **Referrers**, and **Devices**
4. Custom events appear in the **Events** section

**Note**: Plausible shows custom events with their names and properties. You'll see events like `download_code`, `csv_import`, etc.

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` | No |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible Analytics domain name | `example.com` | No |

## Production Setup

For production deployment:

### Vercel
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add your analytics variables
4. Redeploy

### Netlify
1. Go to **Site settings** → **Environment variables**
2. Add your analytics variables
3. Redeploy

### GitHub Pages
Since GitHub Pages doesn't support server-side environment variables, you can:
1. Use build-time environment variables
2. Or set variables in your CI/CD pipeline

### Manual Build
```bash
# Set variables before build
export VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
export VITE_PLAUSIBLE_DOMAIN=your-domain.com

# Build
npm run build
```

## Privacy Considerations

### Google Analytics 4
- Uses cookies
- Requires GDPR consent in EU
- Provides detailed user tracking
- Consider adding a privacy policy and cookie consent banner

### Plausible Analytics
- **No cookies** by default
- **GDPR compliant** out of the box
- Privacy-friendly alternative
- Doesn't track individual users across sites
- Better for privacy-conscious users

## Testing Analytics

### Development Testing

1. **Check Console**: Analytics initialization logs will appear:
   ```
   Analytics initialized: { ga4: true, plausible: false }
   ```

2. **Google Analytics DebugView**:
   - Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Open your app and perform actions
   - Check DebugView in GA4 dashboard

3. **Plausible Test Mode**:
   - Events appear immediately in dashboard
   - Use "Test Mode" if available in your Plausible settings

### Verify Events

1. Open browser DevTools → Network tab
2. Filter by `google-analytics` or `plausible`
3. Perform actions (download, import, etc.)
4. Verify requests are being sent

## Troubleshooting

### Analytics Not Working?

1. **Check Environment Variables**:
   ```bash
   # Verify variables are set
   echo $VITE_GA4_MEASUREMENT_ID
   echo $VITE_PLAUSIBLE_DOMAIN
   ```

2. **Restart Dev Server**: Environment variables are loaded at build/start time

3. **Check Browser Console**: Look for initialization messages

4. **Verify Scripts Load**: Check Network tab for analytics scripts

5. **Ad Blockers**: Some ad blockers prevent analytics. Test in incognito mode or disable blockers

### Events Not Showing?

1. **Wait**: Some analytics have a delay (especially GA4)
2. **Check Filters**: Ensure no filters are excluding your events
3. **Verify Event Names**: Check they match in your analytics dashboard
4. **Test in Production**: Some analytics don't work well in localhost

### Google Analytics Issues

- **Measurement ID Format**: Must start with `G-`
- **Permissions**: Ensure your account has access to the property
- **Data Delay**: GA4 can take 24-48 hours for some reports

### Plausible Issues

- **Domain Name**: Must match exactly as registered in Plausible
- **HTTPS**: Plausible requires HTTPS in production
- **CORS**: Ensure your domain is whitelisted in Plausible settings

## Code Reference

### Analytics Utility

Located in `src/utils/analytics.js`, this file contains:

- `initAnalytics()` - Initialize all enabled providers
- `trackPageView()` - Track page views
- `trackEvent()` - Generic event tracking
- `trackDownload()` - Track code downloads
- `trackCSVImport()` - Track CSV imports
- `trackCSVExport()` - Track CSV exports
- `trackFrameworkChange()` - Track framework selection
- `trackCodeCopy()` - Track clipboard copy
- `trackCustomTemplate()` - Track custom template creation

### Adding New Events

To add a new tracked event:

```javascript
import { trackEvent } from './utils/analytics';

// In your function
trackEvent('my_custom_event', {
  property1: 'value1',
  property2: 'value2',
});
```

## Best Practices

1. **Respect Privacy**: Always inform users about analytics (privacy policy)
2. **Minimal Data**: Only track necessary events
3. **No PII**: Don't track personally identifiable information
4. **Test First**: Verify events before deploying to production
5. **Monitor Usage**: Check analytics regularly to ensure they're working

## Disabling Analytics

To completely disable analytics:

1. Remove or empty variables in `.env`:
   ```env
   VITE_GA4_MEASUREMENT_ID=
   VITE_PLAUSIBLE_DOMAIN=
   ```

2. Restart your dev server or rebuild

3. No analytics scripts will be loaded

## Support

For issues or questions:
- Check the [troubleshooting section](#troubleshooting) above
- Review analytics provider documentation
- Open an issue on GitHub

---

**Last Updated**: Analytics setup for Step-to-Code Generator

