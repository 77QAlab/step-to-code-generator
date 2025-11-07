/**
 * Analytics utility supporting Google Analytics 4 and Plausible Analytics
 * Configure via environment variables:
 * - VITE_GA4_MEASUREMENT_ID for Google Analytics 4
 * - VITE_PLAUSIBLE_DOMAIN for Plausible Analytics
 */

// Configuration from environment variables
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

// Check if analytics should be enabled
const isGA4Enabled = GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== '';
const isPlausibleEnabled = PLAUSIBLE_DOMAIN && PLAUSIBLE_DOMAIN !== '';

/**
 * Initialize Google Analytics 4
 */
const initGA4 = () => {
  if (!isGA4Enabled) return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  return true;
};

/**
 * Initialize Plausible Analytics
 */
const initPlausible = () => {
  if (!isPlausibleEnabled) return;

  const script = document.createElement('script');
  script.defer = true;
  script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);

  return true;
};

/**
 * Initialize all analytics
 */
export const initAnalytics = () => {
  const results = {
    ga4: false,
    plausible: false,
  };

  if (isGA4Enabled) {
    results.ga4 = initGA4();
  }

  if (isPlausibleEnabled) {
    results.plausible = initPlausible();
  }

  if (results.ga4 || results.plausible) {
    console.log('Analytics initialized:', results);
  }

  return results;
};

/**
 * Track page view
 */
export const trackPageView = (path = window.location.pathname) => {
  // Google Analytics 4
  if (isGA4Enabled && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: path,
    });
  }

  // Plausible - automatic, but can trigger manually if needed
  if (isPlausibleEnabled && window.plausible) {
    window.plausible('pageview');
  }
};

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Additional parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  // Google Analytics 4
  if (isGA4Enabled && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  // Plausible Analytics
  if (isPlausibleEnabled && window.plausible) {
    // Plausible uses different syntax - event name as string, props as object
    window.plausible(eventName, { props: eventParams });
  }
};

/**
 * Track code download
 */
export const trackDownload = (framework, testName) => {
  trackEvent('download_code', {
    framework: framework || 'unknown',
    test_name: testName || 'unnamed',
    file_type: getFileExtension(framework),
  });
};

/**
 * Track CSV import
 */
export const trackCSVImport = (stepCount) => {
  trackEvent('csv_import', {
    step_count: stepCount || 0,
  });
};

/**
 * Track CSV export
 */
export const trackCSVExport = (stepCount) => {
  trackEvent('csv_export', {
    step_count: stepCount || 0,
  });
};

/**
 * Track framework selection change
 */
export const trackFrameworkChange = (framework) => {
  trackEvent('framework_change', {
    framework: framework || 'unknown',
  });
};

/**
 * Track code copy to clipboard
 */
export const trackCodeCopy = (framework) => {
  trackEvent('code_copy', {
    framework: framework || 'unknown',
  });
};

/**
 * Track custom template added
 */
export const trackCustomTemplate = () => {
  trackEvent('custom_template_added');
};

/**
 * Get file extension for framework
 */
const getFileExtension = (framework) => {
  const extensions = {
    playwright: 'spec.js',
    cypress: 'cy.js',
    testcafe: 'test.js',
  };
  return extensions[framework] || 'js';
};

/**
 * Check if analytics is enabled
 */
export const isAnalyticsEnabled = () => {
  return isGA4Enabled || isPlausibleEnabled;
};

