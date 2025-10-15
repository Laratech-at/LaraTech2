# Analytics & Tracking Implementation Guide

## Overview

This document outlines the analytics and tracking implementation for the LaraTech website to monitor user behavior, conversions, and business metrics.

## Google Analytics 4 Setup

### 1. Basic GA4 Implementation

```html
<!-- Google Analytics 4 -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID", {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_parameter_1: "service_interest",
      custom_parameter_2: "project_budget",
      custom_parameter_3: "contact_method",
    },
  });
</script>
```

### 2. Enhanced Ecommerce Events

```javascript
// Contact Form Submission
gtag("event", "generate_lead", {
  currency: "EUR",
  value: 0,
  lead_type: "contact_form",
  service_interest: serviceType,
  project_budget: budgetRange,
  contact_method: preferredMethod,
});

// Service Interest Tracking
gtag("event", "view_item", {
  item_id: serviceId,
  item_name: serviceName,
  item_category: "services",
  item_category2: serviceCategory,
});

// Project Filter Usage
gtag("event", "select_content", {
  content_type: "project_filter",
  item_id: filterCategory,
});

// View Toggle Usage
gtag("event", "select_content", {
  content_type: "view_toggle",
  item_id: viewType,
});
```

## Event Tracking Implementation

### 1. Contact Form Events

```javascript
// Enhanced contact form tracking
const trackContactForm = (formData) => {
  gtag("event", "form_submit", {
    form_id: "contact_form",
    form_name: "Contact Form",
    service_interest: formData.service,
    project_budget: formData.budget,
    timeline: formData.timeline,
    contact_method: formData.contactMethod,
    newsletter_signup: formData.newsletter,
  });

  // Lead generation event
  gtag("event", "generate_lead", {
    currency: "EUR",
    value: estimateProjectValue(formData.budget),
    lead_type: "contact_form",
    service_category: formData.service,
    budget_range: formData.budget,
    timeline: formData.timeline,
  });
};
```

### 2. User Engagement Events

```javascript
// Page scroll tracking
const trackScrollDepth = () => {
  let maxScroll = 0;
  window.addEventListener("scroll", () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      gtag("event", "scroll", {
        percent_scrolled: scrollPercent,
        page_location: window.location.href,
      });
    }
  });
};

// Time on page tracking
const trackTimeOnPage = () => {
  const startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    gtag("event", "timing_complete", {
      name: "time_on_page",
      value: timeSpent,
      page_location: window.location.href,
    });
  });
};
```

### 3. Service Interest Tracking

```javascript
// Service page interactions
const trackServiceInterest = () => {
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const serviceName = card.querySelector("h3").textContent;
      gtag("event", "select_content", {
        content_type: "service",
        item_id: serviceName.toLowerCase().replace(/\s+/g, "_"),
        item_name: serviceName,
        item_category: "services",
      });
    });
  });
};
```

## Custom Dimensions & Metrics

### 1. Custom Dimensions Setup

```javascript
// Custom dimensions for enhanced tracking
gtag("config", "GA_MEASUREMENT_ID", {
  custom_map: {
    custom_parameter_1: "service_interest",
    custom_parameter_2: "project_budget",
    custom_parameter_3: "contact_method",
    custom_parameter_4: "user_type",
    custom_parameter_5: "traffic_source",
  },
});
```

### 2. User Segmentation

```javascript
// User type identification
const identifyUserType = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const referrer = document.referrer;

  let userType = "direct";
  if (utmSource) {
    userType = utmSource;
  } else if (referrer.includes("google")) {
    userType = "organic_search";
  } else if (referrer.includes("linkedin")) {
    userType = "social_linkedin";
  } else if (referrer.includes("facebook")) {
    userType = "social_facebook";
  }

  gtag("event", "user_type_identified", {
    user_type: userType,
    traffic_source: utmSource || "direct",
  });
};
```

## Conversion Tracking

### 1. Lead Generation Goals

```javascript
// Primary conversion: Contact form submission
const trackLeadGeneration = (formData) => {
  gtag("event", "conversion", {
    send_to: "GA_MEASUREMENT_ID/conversion_label",
    value: estimateProjectValue(formData.budget),
    currency: "EUR",
    transaction_id: generateTransactionId(),
    service_interest: formData.service,
    budget_range: formData.budget,
  });
};

// Secondary conversion: Newsletter signup
const trackNewsletterSignup = () => {
  gtag("event", "conversion", {
    send_to: "GA_MEASUREMENT_ID/newsletter_signup",
    value: 0,
    currency: "EUR",
  });
};
```

### 2. Engagement Goals

```javascript
// High engagement indicators
const trackHighEngagement = () => {
  // Time on site > 2 minutes
  setTimeout(() => {
    gtag("event", "engagement", {
      engagement_time_msec: 120000,
      engagement_type: "high_time_on_site",
    });
  }, 120000);

  // Multiple page views
  let pageViews = 0;
  window.addEventListener("beforeunload", () => {
    pageViews++;
    if (pageViews >= 3) {
      gtag("event", "engagement", {
        engagement_type: "multiple_page_views",
        page_count: pageViews,
      });
    }
  });
};
```

## Performance Monitoring

### 1. Core Web Vitals Tracking

```javascript
// Core Web Vitals implementation
const trackWebVitals = () => {
  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      gtag("event", "web_vitals", {
        metric_name: "LCP",
        metric_value: Math.round(entry.startTime),
        metric_rating:
          entry.startTime < 2500
            ? "good"
            : entry.startTime < 4000
            ? "needs_improvement"
            : "poor",
      });
    }
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      gtag("event", "web_vitals", {
        metric_name: "FID",
        metric_value: Math.round(entry.processingStart - entry.startTime),
        metric_rating:
          entry.processingStart - entry.startTime < 100
            ? "good"
            : entry.processingStart - entry.startTime < 300
            ? "needs_improvement"
            : "poor",
      });
    }
  }).observe({ entryTypes: ["first-input"] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    gtag("event", "web_vitals", {
      metric_name: "CLS",
      metric_value: Math.round(clsValue * 1000),
      metric_rating:
        clsValue < 0.1
          ? "good"
          : clsValue < 0.25
          ? "needs_improvement"
          : "poor",
    });
  }).observe({ entryTypes: ["layout-shift"] });
};
```

## Error Tracking

### 1. JavaScript Error Tracking

```javascript
// Global error tracking
window.addEventListener("error", (event) => {
  gtag("event", "exception", {
    description: event.error.message,
    fatal: false,
    error_type: "javascript_error",
    error_file: event.filename,
    error_line: event.lineno,
  });
});

// Promise rejection tracking
window.addEventListener("unhandledrejection", (event) => {
  gtag("event", "exception", {
    description: event.reason.message || "Unhandled promise rejection",
    fatal: false,
    error_type: "promise_rejection",
  });
});
```

### 2. Form Error Tracking

```javascript
// Form validation error tracking
const trackFormErrors = (form) => {
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("invalid", () => {
      gtag("event", "form_error", {
        form_id: form.id,
        field_name: input.name,
        error_type: "validation_error",
        error_message: input.validationMessage,
      });
    });
  });
};
```

## Privacy & GDPR Compliance

### 1. Cookie Consent Integration

```javascript
// Cookie consent tracking
const trackCookieConsent = (consent) => {
  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.advertising ? "granted" : "denied",
    functionality_storage: consent.functionality ? "granted" : "denied",
  });

  gtag("event", "cookie_consent", {
    consent_analytics: consent.analytics,
    consent_advertising: consent.advertising,
    consent_functionality: consent.functionality,
  });
};
```

### 2. Data Anonymization

```javascript
// IP anonymization
gtag("config", "GA_MEASUREMENT_ID", {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});
```

## Reporting & Dashboards

### 1. Key Metrics to Track

- **Traffic Metrics**: Sessions, users, page views, bounce rate
- **Engagement Metrics**: Average session duration, pages per session
- **Conversion Metrics**: Contact form submissions, newsletter signups
- **Technical Metrics**: Page load times, error rates, Core Web Vitals
- **Business Metrics**: Lead quality, service interest distribution

### 2. Custom Reports

- **Lead Generation Report**: Contact form submissions by source
- **Service Interest Report**: Most viewed services and categories
- **User Journey Report**: Path analysis from landing to conversion
- **Performance Report**: Page speed and technical metrics
- **Geographic Report**: Traffic and conversions by location

## Implementation Checklist

### Phase 1: Basic Setup

- [ ] Install Google Analytics 4
- [ ] Configure basic pageview tracking
- [ ] Set up conversion goals
- [ ] Implement cookie consent

### Phase 2: Enhanced Tracking

- [ ] Add custom event tracking
- [ ] Implement user segmentation
- [ ] Set up error tracking
- [ ] Configure custom dimensions

### Phase 3: Advanced Analytics

- [ ] Implement Core Web Vitals tracking
- [ ] Set up enhanced ecommerce
- [ ] Configure custom reports
- [ ] Add performance monitoring

### Phase 4: Optimization

- [ ] A/B test tracking implementation
- [ ] Set up automated alerts
- [ ] Create custom dashboards
- [ ] Implement data quality checks

## Maintenance & Updates

### Regular Tasks

- **Weekly**: Review conversion rates and traffic patterns
- **Monthly**: Analyze user behavior and engagement metrics
- **Quarterly**: Update tracking implementation and goals
- **Annually**: Comprehensive analytics audit and strategy review

### Monitoring

- **Real-time**: Monitor for tracking errors and data quality issues
- **Daily**: Check conversion tracking and goal completions
- **Weekly**: Review performance metrics and user engagement
- **Monthly**: Analyze trends and identify optimization opportunities

---

_Last Updated: January 7, 2025_
_Document Version: 1.0_
