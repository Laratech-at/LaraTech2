# LaraTech sh.p.k - Official Website

> **Digital & Automation Services | Smart-Tech & Web Solutions**

A cutting-edge, performance-focused website for LaraTech sh.p.k, showcasing our automation, AI workflows, web development, and smart home services.

## 🚀 Features

### Design & UX

- ✨ **Dark/Light Mode Toggle** - Seamless theme switching with persistent preference
- 🎨 **Modern Glassmorphism UI** - Semi-transparent cards with backdrop blur effects
- 🌐 **Bilingual Support** - English & Albanian language switcher
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

### Technical Highlights

- ⚡ **Lazy Loading** - Images load on demand for faster performance
- 🎨 **Animated Particles** - Background particle effects
- 📷 **Lightbox Support** - Images and videos in fullscreen overlay
- 🍪 **Cookie Consent** - GDPR-compliant cookie banner
- ♿ **Accessible** - ARIA labels, keyboard navigation, high contrast support
- 🎯 **Before/After Sliders** - Interactive project showcases

## 📁 Project Structure

```
LaraTech2/
├── index.html              # Homepage
├── services.html           # Services page
├── projects.html           # Projects/Portfolio
├── about.html              # About us
├── contact.html            # Contact form & map
├── blog.html               # Blog/News section
├── css/
│   └── style.css          # Custom styles & animations
├── js/
│   ├── main.js            # Core functionality
│   └── animations.js      # GSAP animations
├── assets/                # Images, logo, favicon
│   ├── Logo.png          # Company logo (PNG format)
│   ├── favicon.png       # Company favicon (PNG format)
│   └── favicon.svg       # Company favicon (SVG format)
├── robots.txt             # Search engine instructions
├── sitemap.xml            # Site structure for SEO
├── .htaccess              # Server configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Animations**: GSAP 3.12.5 with ScrollTrigger
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
- [ ] Verify language switcher (EN/SQ)
- [ ] Run Lighthouse audit for performance
- [ ] Set up SSL certificate (HTTPS)
- [ ] Enable HTTPS redirect in `.htaccess`

## 🔧 Customization

### Adding New Blog Posts

Edit `blog.html` and duplicate an `<article>` block:

```html
<article class="blog-card glass-card overflow-hidden">
  <!-- Your content here -->
</article>
```

### Adding New Projects

Edit `projects.html` and add a new project card in the grid.

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

### Latest Updates (January 2025)

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
