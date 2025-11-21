# Deployment Guide - Drone Fuel Calculator

Quick guide for deploying your drone fuel calculator to Cloudflare Pages.

## Cloudflare Pages Deployment (Recommended)

### Why Cloudflare Pages?
- **Free** - Unlimited bandwidth and requests
- **Fast** - Global CDN with 300+ locations
- **Simple** - Zero configuration needed
- **Secure** - Automatic HTTPS

### Method 1: Git Integration (Recommended)

#### Step 1: Initialize Git Repository
```bash
cd fuel_calc_app

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Drone Fuel Calculator v1.0"
```

#### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/drone-fuel-calc.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy on Cloudflare Pages
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Click **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your repository
5. Configure settings:
   - **Production branch:** main
   - **Build command:** (leave empty)
   - **Build output directory:** /
6. Click **Save and Deploy**

Your site will be live at: `https://YOUR-PROJECT.pages.dev`

### Method 2: Direct Upload (No Git Required)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Click **Pages** → **Create a project**
3. Click **Upload assets**
4. Drag and drop the `fuel_calc_app` folder
5. Click **Deploy site**

Done! Site is live immediately.

## Custom Domain Setup (Optional)

1. In your Cloudflare Pages project, click **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `fuel.yourdomain.com`)
4. Cloudflare will configure DNS automatically
5. SSL certificate is provisioned automatically

## Local Testing

Before deploying, test locally:

```bash
# Option 1: Python
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node.js (if installed)
npx http-server
# Visit http://localhost:8080

# Option 3: Just open index.html in browser
open index.html
```

## Post-Deployment Checklist

- [ ] Visit your live site
- [ ] Test all calculations
- [ ] Test on mobile device
- [ ] Test print function
- [ ] Test comparison mode
- [ ] Test export functions
- [ ] Check that tabs work correctly
- [ ] Verify localStorage persistence (refresh page)

## Updating Your Site

### If using Git integration:
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main

# Cloudflare Pages deploys automatically!
```

### If using direct upload:
1. Go to your Cloudflare Pages project
2. Click **Create new deployment**
3. Upload updated files
4. New version is live!

## Configuration Files

Your project includes these Cloudflare-specific files:

- **`_headers`** - Security and caching headers
- **`_redirects`** - URL redirects (optional)
- **`robots.txt`** - Search engine instructions

These are automatically applied by Cloudflare Pages.

## Troubleshooting

### Site not loading?
- Check browser console for errors
- Verify all files were uploaded/committed
- Clear browser cache (Ctrl+Shift+R)

### Calculator not working?
- Check browser console for JavaScript errors
- Ensure all .js files are in the correct location
- Test in incognito mode to rule out extensions

### Updates not showing?
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check deployment status in Cloudflare dashboard
- Purge Cloudflare cache if needed

## Cost

**Cloudflare Pages Free Tier:**
- Unlimited sites
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 100 custom domains per project

**Total cost: $0/month**

## Security

The app includes security headers via `_headers` file:
- XSS protection
- Clickjacking protection
- Content Security Policy
- HTTPS enforcement (automatic)

## Performance

Expected performance:
- **Load time:** < 2 seconds
- **Lighthouse score:** 90+ (all categories)
- **Global CDN:** Fast from anywhere

## Support

- **Cloudflare Docs:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/)
- **Cloudflare Discord:** [discord.gg/cloudflaredev](https://discord.gg/cloudflaredev)
- **Status:** [cloudflarestatus.com](https://www.cloudflarestatus.com/)

---

**That's it!** Your drone fuel calculator is now live and accessible from anywhere in the world.
