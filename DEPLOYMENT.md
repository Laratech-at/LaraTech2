# LaraTech Website - Deployment Guide

Complete guide for deploying the LaraTech sh.p.k website to production.

## 📋 Pre-Deployment Checklist

### 1. Update Configuration Files

#### Google Analytics

Update in all HTML files (head section):

```javascript
// Replace G-XXXXXXXXXX with your actual tracking ID
gtag("config", "G-YOUR-ACTUAL-TRACKING-ID");
```

#### Tawk.to Live Chat

Update in `index.html` (bottom of file):

```javascript
s1.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID";
```

Get your IDs from: https://dashboard.tawk.to/

#### Google Maps

Update in `contact.html`:

1. Go to Google Maps
2. Search for: "Rr. Safet Boletini 46, Iliridë, Mitrovica, Kosovo"
3. Click "Share" → "Embed a map"
4. Copy the iframe code and replace the existing one

### 2. Add Brand Assets

Place these files in the `assets/` folder:

- **Logo**: `Logo.png` (transparent background) - **Already included with adaptive theming**
- **Favicon**: Already included (`favicon.png` and `favicon.svg`)
- **Open Graph Image**: `og-image.jpg` (1200x630px for social sharing)
- **Project Images**: Add screenshots/photos for projects section

**Logo Theme System:** The logo automatically adapts to light/dark themes:

- **Light Mode**: Displays in original colors
- **Dark Mode**: Inverts to white for optimal contrast
- **Size**: Optimized for navbar and footer visibility
- **Implementation**: Uses CSS `filter: invert(1)` for dark mode

Update references in HTML:

```html
<!-- In index.html head -->
<meta property="og:image" content="https://laratech.ai/assets/og-image.jpg" />
```

### 3. Update Domain References

Find and replace `laratech.ai` with your actual domain in:

- `sitemap.xml`
- All HTML files (meta tags, structured data)
- `README.md`

### 4. Form Backend Setup

The contact form needs a backend. Options:

#### Option A: Vercel Serverless Function

Create `api/contact.js`:

```javascript
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, service, message } = req.body;

    // Send email using SendGrid, Mailgun, or similar
    // Or save to database

    res.status(200).json({ success: true });
  }
}
```

#### Option B: Formspree

1. Sign up at https://formspree.io/
2. Update form action in `contact.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"></form>
```

#### Option C: Netlify Forms

Add to form in `contact.html`:

```html
<form name="contact" netlify></form>
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Free, fast, automatic deployments, serverless functions support

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Navigate to project:

```bash
cd laratech-website
```

3. Deploy:

```bash
vercel
```

4. Follow prompts:

   - Link to existing project or create new
   - Confirm settings
   - Deploy

5. Set up custom domain:

```bash
vercel domains add laratech.ai
```

6. Configure DNS:
   - Add A record: `76.76.21.21`
   - Add CNAME: `cname.vercel-dns.com`

### Option 2: Netlify

**Pros**: Free, drag-and-drop, form handling included

1. Go to https://app.netlify.com/
2. Drag and drop your project folder
3. Or connect GitHub:

   - Push code to GitHub
   - "New site from Git" → Select repo
   - Deploy settings: (leave blank for static site)
   - Deploy

4. Custom domain:
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

### Option 3: Traditional Hosting (cPanel/FTP)

**Pros**: Full control, works with existing hosting

1. Connect via FTP (FileZilla, Cyberduck):

   - Host: `ftp.yourdomain.com`
   - Username: Your hosting username
   - Password: Your hosting password

2. Upload files:

   - Upload ALL files to `public_html/` or `www/`
   - Ensure `.htaccess` is uploaded (may be hidden)

3. Set permissions:

   - Files: 644
   - Directories: 755

4. Enable SSL:

   - Through cPanel → SSL/TLS → Install Certificate
   - Or use Let's Encrypt (free)

5. Enable HTTPS redirect:
   - Uncomment redirect section in `.htaccess`

## 🔒 SSL/HTTPS Setup

### Vercel/Netlify

- Automatic SSL (Let's Encrypt)
- No configuration needed

### Traditional Hosting

1. Get SSL certificate:

   - Let's Encrypt (free): Through cPanel or Certbot
   - Paid certificate: From SSL provider

2. Install certificate in cPanel

3. Force HTTPS - uncomment in `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

## 🧪 Post-Deployment Testing

### 1. Functional Testing

- [ ] All pages load correctly
- [ ] Navigation works (desktop & mobile)
- [ ] Dark/light mode toggle
- [ ] Language switcher (EN/SQ)
- [ ] Contact form submission
- [ ] Google Maps loads and shows correct location
- [ ] "Get Directions" button works on mobile
- [ ] Tawk.to chat widget appears
- [ ] All links work (no 404s)

### 2. Performance Testing

Run Lighthouse audit (Chrome DevTools):

```
Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >95
```

Fix issues if scores are low.

### 3. Browser Testing

Test on:

- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & iOS)
- [ ] Edge
- [ ] Samsung Internet (Android)

### 4. Mobile Testing

- [ ] Test on actual devices (iOS & Android)
- [ ] Check touch interactions
- [ ] Verify text is readable without zooming
- [ ] Test forms on mobile keyboard

### 5. SEO Verification

#### Submit Sitemap

- Google Search Console: https://search.google.com/search-console
- Add property → Sitemaps → Submit: `https://laratech.ai/sitemap.xml`

#### Verify Structured Data

- Test at: https://search.google.com/test/rich-results
- Paste URL or code
- Fix any errors

#### Verify Meta Tags

- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

## 📊 Analytics Setup

### Google Analytics

1. Go to: https://analytics.google.com/
2. Create property for laratech.ai
3. Get Measurement ID (G-XXXXXXXXX)
4. Update in all HTML files

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property for laratech.ai
3. Verify ownership (HTML file or DNS)
4. Submit sitemap

### Vercel Analytics (if using Vercel)

- Automatically enabled
- View at: https://vercel.com/dashboard/analytics

## 🔧 Ongoing Maintenance

### Weekly

- [ ] Check contact form submissions
- [ ] Respond to chat messages (Tawk.to dashboard)
- [ ] Monitor uptime (use UptimeRobot or similar)

### Monthly

- [ ] Review Google Analytics
- [ ] Check for broken links
- [ ] Update blog with new content
- [ ] Review and respond to reviews/testimonials

### Quarterly

- [ ] Run Lighthouse audit
- [ ] Update dependencies (if using build tools)
- [ ] Review and optimize images
- [ ] Check mobile compatibility

### Annually

- [ ] Renew domain
- [ ] Review and update content
- [ ] Refresh testimonials and projects
- [ ] Security audit

## 🆘 Troubleshooting

### Issue: Animations not working

- **Solution**: Check GSAP CDN link is loading
- Verify `animations.js` is loaded after GSAP
- Check browser console for errors

### Issue: Dark mode not persisting

- **Solution**: Check localStorage is enabled
- Clear browser cache and test

### Issue: Forms not submitting

- **Solution**: Check backend endpoint is configured
- Verify CORS settings if using external API
- Check browser console for errors

### Issue: Images not loading

- **Solution**: Verify image paths are correct
- Check file names match (case-sensitive)
- Ensure images are uploaded to server

### Issue: Mobile menu not opening

- **Solution**: Check mobile-menu-toggle ID matches
- Verify main.js is loaded
- Check for JavaScript errors in console

## 📞 Support

For deployment issues:

- **Email**: office@laratech.ai
- **Documentation**: See README.md
- **Hosting Support**: Contact your hosting provider

## 📋 Deployment Checklist Summary

Before going live:

- [ ] Updated Google Analytics ID
- [ ] Configured Tawk.to chat
- [ ] Fixed Google Maps embed
- [ ] Added logo and brand assets
- [ ] Set up contact form backend
- [ ] Updated domain in all files
- [ ] Uploaded to hosting/platform
- [ ] Enabled SSL/HTTPS
- [ ] Tested all functionality
- [ ] Ran Lighthouse audit
- [ ] Submitted sitemap to Google
- [ ] Configured Google Search Console
- [ ] Tested on mobile devices
- [ ] Verified social sharing (OG tags)

---

**Last Updated**: October 7, 2025

Good luck with your deployment! 🚀
