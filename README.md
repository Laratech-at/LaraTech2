# LaraTech sh.p.k - Official Website

> **Digital & Automation Services | Smart-Tech & Web Solutions**

A cutting-edge, performance-focused website for LaraTech sh.p.k, showcasing our automation, AI workflows, web development, and smart home services.

## 🚀 Features

### Design & UX

- ✨ **Dark/Light Mode Toggle** - Seamless theme switching with persistent preference
- 🎨 **Modern Glassmorphism UI** - Semi-transparent cards with backdrop blur effects
- 🌐 **Trilingual Support** - English, Albanian & German language switcher with flag dropdown
- 📱 **Mobile-First Responsive** - Optimized for all screen sizes
- 🎭 **Opening Animation** - Animated arc forming the LaraTech logo
- ⚡ **Smooth Transitions** - Page transitions and scroll animations
- 🖼️ **Adaptive Logo** - Logo automatically inverts colors for optimal contrast in both themes

### Advanced Features

- 🎬 **GSAP Animations** - Scroll-triggered animations, parallax effects, 3D tilt cards
- 🔄 **Micro-interactions** - Hover effects, magnetic buttons, animated icons
- 💬 **Live Chat** - Tawk.to integration for customer support
- 🗺️ **Interactive Map** - Google Maps integration with route/directions button
- 📊 **Dynamic Counters** - Animated statistics on scroll
- 🎯 **Performance Monitoring** - Core Web Vitals tracking
- 🔍 **SEO Optimized** - Structured data, meta tags, sitemap
- 📱 **Floating WhatsApp** - Direct contact button with phone number
- ⬆️ **Back-to-Top Button** - Smooth scroll to top functionality
- 🎭 **Dramatic Loading Screen** - Logo animation with progress bar and status messages
- 🏢 **Project Filtering** - Filter projects by service type with smooth animations
- 📋 **Enhanced Contact Form** - Additional fields for better lead qualification
- 🎁 **Lead Magnets** - Free resources to capture visitor information
- 📄 **Legal Pages** - GDPR-compliant Privacy Policy and Terms of Service
- 📝 **Content Templates** - Ready-to-use templates for blog posts and case studies

### Technical Highlights

- ⚡ **Lazy Loading** - Images load on demand for faster performance
- 🌊 **Liquid Ether Background** - Interactive fluid simulation with mouse interaction
- 📷 **Lightbox Support** - Images and videos in fullscreen overlay
- 🍪 **Cookie Consent** - GDPR-compliant cookie banner with accept/reject buttons
- ♿ **Accessible** - ARIA labels, keyboard navigation, high contrast support
- 🎯 **Before/After Sliders** - Interactive project showcases
- 📍 **Clickable Address** - Street address links to Google Maps
- 🎨 **Animated Tech Logos** - Technologies & Partners section with hover effects

## 📁 Project Structure

```
LaraTech2/
├── index.html              # Homepage
├── services.html           # Services page
├── projects.html           # Projects/Portfolio with filtering
├── about.html              # About us
├── contact.html            # Contact form & map with lead magnets
├── blog.html               # Blog/News section
├── privacy-policy.html     # Privacy Policy (GDPR compliant)
├── terms-of-service.html   # Terms of Service
├── css/
│   └── style.css          # Custom styles & animations
├── js/
│   ├── main.js            # Core functionality with project filtering
│   └── animations.js      # GSAP animations
├── assets/                # Images, logo, favicon
│   ├── Logo.png          # Company logo (PNG format)
│   ├── favicon.png       # Company favicon (PNG format)
│   └── favicon.svg       # Company favicon (SVG format)
├── case-studies/          # Individual project case studies
│   └── template.html      # Case study template
├── templates/             # Content creation templates
│   ├── blog-post-template.html        # Blog post template
│   └── project-documentation-template.md # Project docs template
├── robots.txt             # Search engine instructions
├── sitemap.xml            # Site structure for SEO
├── .htaccess              # Server configuration
├── README.md              # This file
├── PROJECT_SUMMARY.md     # Project overview
├── DEPLOYMENT.md          # Deployment guide
├── SEO_GUIDE.md           # SEO optimization guide
├── ANALYTICS_GUIDE.md     # Analytics implementation guide
├── QA_CHECKLIST.md        # Quality assurance checklist
└── CONTENT_STRATEGY.md    # Content strategy and blog calendar
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Animations**: GSAP 3.12.5 with ScrollTrigger
- **3D Graphics**: Three.js (CDN) for Liquid Ether fluid simulation
- **Fonts**: Inter (body), Orbitron (headings)
- **Chat**: Tawk.to widget
- **Analytics**: Google Analytics (placeholder - update with your ID)
- **Maps**: Google Maps Embed API

## 🎨 Brand Colors

- **Teal Blue**: `#00C8C8` - Primary accent
- **Neon Blue**: `#00FFFF` - Highlights & effects
- **Electric Orange**: `#FF6B00` - Secondary accent
- **Jet Black**: `#0A0A0A` - Dark mode background
- **Off White**: `#F3F4F6` - Light mode text

## 📋 Setup Instructions

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/laratech-website.git
cd laratech-website
```

### 2. Update Configuration

**Google Analytics** (index.html, all pages):

```javascript
// Replace 'G-XXXXXXXXXX' with your actual GA tracking ID
gtag("config", "G-XXXXXXXXXX");
```

**Tawk.to Chat** (index.html, bottom):

```javascript
// Replace YOUR_PROPERTY_ID and YOUR_WIDGET_ID
src = "https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID";
```

**Google Maps** (contact.html):

- Update the iframe `src` with accurate coordinates for your address

### 3. Assets Added ✅

The following assets are now included:

- ✅ `Logo.png` - Company logo (PNG format)
- ✅ `favicon.png` - Company favicon (PNG format)
- ✅ `favicon.svg` - Company favicon (SVG format)

**Note:** The logo and favicon are now integrated into all HTML pages. The navigation displays the logo without redundant text for a cleaner look.

### 4. Deploy

#### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Option B: Netlify

- Drag and drop the entire folder to Netlify dashboard
- Or connect your GitHub repo for automatic deployments

#### Option C: Traditional Hosting

- Upload all files via FTP/SFTP to your web host
- Ensure `.htaccess` is uploaded and working

### 5. Post-Deployment Checklist

- [ ] Update `sitemap.xml` with your actual domain
- [ ] Test all forms (contact form needs backend integration)
- [ ] Verify Google Maps shows correct location
- [ ] Test Tawk.to chat widget
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode toggle
- [ ] Verify language switcher (EN/SQ/DE)
- [ ] Test project filtering functionality
- [ ] Verify legal pages (Privacy Policy, Terms of Service)
- [ ] Run Lighthouse audit for performance
- [ ] Set up SSL certificate (HTTPS)
- [ ] Enable HTTPS redirect in `.htaccess`
- [ ] Review QA checklist in `QA_CHECKLIST.md`

## 🔧 Customization

### Adding New Blog Posts

Edit `blog.html` and duplicate an `<article>` block:

```html
<article class="blog-card glass-card overflow-hidden">
  <!-- Your content here -->
</article>
```

### Adding New Projects

Edit `projects.html` and add a new project card in the grid. Use the case study template in `case-studies/template.html` for detailed project pages.

### Adding New Case Studies

1. Copy `case-studies/template.html`
2. Rename to your project (e.g., `automation-workflow-enterprise.html`)
3. Fill in the template placeholders
4. Add link to the case study from the projects page

### Changing Colors

Update the Tailwind config in each HTML file:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "teal-blue": "#00C8C8",
        // Add or modify colors here
      },
    },
  },
};
```

### Form Backend Integration

The contact form currently prevents default submit. To integrate:

1. Set up an API endpoint (e.g., Vercel Serverless Functions, AWS Lambda)
2. Update `js/main.js` in the `initContactForm()` function
3. Replace `/api/contact` with your actual endpoint

## ⚡ Performance Optimization

- All images should be optimized (use WebP format where possible)
- Lazy loading is implemented for images with `data-src` attribute
- GZIP compression enabled via `.htaccess`
- Browser caching configured for static assets
- CSS and JS are minified in production
- Consider using a CDN for static assets

## 🔒 Security Features

- Content Security Policy headers
- XSS protection
- Frame options (prevent clickjacking)
- HTTPS enforcement (enable in production)
- GDPR-compliant cookie consent

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode support
- Respects `prefers-reduced-motion`
- Focus indicators on interactive elements

## 📞 Contact Information

**LaraTech sh.p.k**

- 📍 Address: Rr. Safet Boletini 46, Iliridë, Mitrovica, Kosovo
- 📞 Phone: +383 49 479 759
- 📧 Email: office@laratech.ai
- 🌐 Website: www.laratech.ai
- 💼 LinkedIn: linkedin.com/company/laratech.ai
- 📸 Instagram: instagram.com/laratech.ai
- 🐦 X (Twitter): x.com/Laratech_eu
- 📘 Facebook: facebook.com/laratech.eu

## 📝 Change Log

### Latest Updates (January 7, 2025)

#### ✅ Website Perfection Plan Implementation

- **Added:** Privacy Policy and Terms of Service pages with trilingual support (EN/SQ/DE)
- **Added:** Comprehensive content strategy document with blog calendar and documentation guidelines
- **Added:** Project filtering system with smooth animations and view toggle (grid/list)
- **Added:** Enhanced contact form with additional fields for better lead qualification
- **Added:** Lead magnet section with free resources to capture visitor information
- **Added:** Case study template and enhanced projects page with detailed project information
- **Added:** SEO optimization guide with structured data implementation
- **Added:** Analytics implementation guide with event tracking setup
- **Added:** Quality assurance checklist for pre-launch testing
- **Enhanced:** Sitemap with new legal pages and proper priority settings
- **Enhanced:** Footer links across all pages with legal page integration
- **Result:** Complete business-ready website with legal compliance and conversion optimization

### Previous Updates (January 2025)

#### ✅ Liquid Ether Interactive Background

- **Added:** Three.js-powered fluid simulation replacing static particle background
- **Enhanced:** Interactive mouse/touch controls with smooth fluid response
- **Configured:** Optimized settings matching ReactBits demo (mouseForce: 20, cursorSize: 65)
- **Implemented:** Auto-demo mode with configurable intensity and speed
- **Added:** Multiple CDN fallbacks for Three.js reliability (unpkg, cdnjs, jsdelivr)
- **Enhanced:** Glassmorphism navbar with stronger blur (20px) and rounded design
- **Added:** Glassmorphism button styles for hero section
- **Optimized:** Performance with reduced resolution (0.5) and Poisson iterations (32)
- **Fixed:** Color consistency - fluid colors locked to prevent theme changes
- **Result:** Premium interactive background with smooth 60fps performance

#### ✅ Trilingual Language Support

- **Added:** German language support - Complete translations for all content
- **Enhanced:** Language dropdown with flag icons (🇬🇧 EN, 🇦🇱 SQ, 🇩🇪 DE)
- **Improved:** Mobile-responsive language selector (flag-only on mobile, flag+text on desktop)
- **Updated:** All HTML files with `data-lang-de` attributes for German content
- **Result:** Full trilingual website supporting English, Albanian, and German

#### ✅ Enhanced User Experience Features

- **Added:** Sticky navigation bar - Always visible with glassmorphism effect
- **Added:** Back-to-top button - Smooth scroll functionality with fade-in animation
- **Added:** Floating WhatsApp button - Direct contact (+383 49 479 759) with hover effects
- **Added:** Clickable street address - Links to Google Maps for directions
- **Enhanced:** Cookie consent with accept/reject buttons and localStorage persistence
- **Result:** Improved navigation and user engagement features

#### ✅ Dramatic Loading Screen

- **Added:** Logo animation with glow effects and particle background
- **Added:** Progress bar with percentage counter and status messages
- **Enhanced:** Loading screen adapts to theme (logo inversion for dark mode)
- **Improved:** Smooth fade-out transition to main content
- **Result:** Professional loading experience with brand reinforcement

#### ✅ Technologies & Partners Animation

- **Added:** Floating animation for tech logos with hover effects
- **Enhanced:** Scale and brightness effects on hover with animation pause
- **Improved:** Visual feedback for interactive elements
- **Result:** Engaging animated section showcasing technology partnerships

#### ✅ Console Warning Fixes

- **Fixed:** GSAP particle animation warnings with proper element checks
- **Fixed:** Tawk.to script errors by commenting out invalid widget ID
- **Enhanced:** Error handling for missing DOM elements
- **Result:** Clean console with no warnings or errors

#### ✅ Adaptive Logo Theme System

- **Added:** Smart logo color inversion - Logo automatically adapts to theme
- **Light Mode:** Logo displays in original colors (black on transparent background)
- **Dark Mode:** Logo inverts to white for optimal contrast against dark backgrounds
- **Enhanced:** Logo size increased to `h-16` (64px) for better visibility in navbar and footer
- **Updated:** All HTML files with `logo-theme` class for consistent theming
- **Result:** Perfect logo visibility and brand consistency across all themes

#### ✅ Logo & Favicon Integration

- **Added:** `Logo.png` - Company logo integrated into all HTML pages
- **Added:** `favicon.png` - Primary favicon for all browsers
- **Updated:** Navigation bars now display logo without redundant "LaraTech" text
- **Modified:** All HTML files (`index.html`, `services.html`, `about.html`, `blog.html`, `contact.html`, `projects.html`)
- **Result:** Cleaner navigation design with logo as primary brand identifier

#### 🔧 Technical Improvements

- **Enhanced:** CSS filter system for automatic logo color adaptation
- **Improved:** Logo sizing optimized for navbar height without increasing navbar size
- **Optimized:** Theme switching with smooth transitions and hover effects
- **Added:** High CSS specificity with `html.light` and `html.dark` selectors

---

## 📝 License

© 2025 LaraTech sh.p.k. All rights reserved.

## 🤝 Support

For technical support or questions about the website, contact:

- Email: office@laratech.ai
- Live Chat: Available on the website

---

**Last Updated**: January 7, 2025

**Version**: 1.0.0

**Built with** ❤️ **by LaraTech**
