# Deployment Guide 🚀

Deploy your Content Creator Tip Jar to the web!

## Free Hosting Options

### 1. GitHub Pages (Recommended for Students)

**Pros:** Free, easy, custom domain support
**Best for:** Static sites, student projects

**Steps:**

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/tip-jar.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "main" branch
   - Click Save

3. **Access your site**
   - URL: `https://yourusername.github.io/tip-jar/`
   - Wait 2-3 minutes for deployment

### 2. Netlify

**Pros:** Automatic deployments, custom domains, HTTPS
**Best for:** Quick deployments, continuous integration

**Steps:**

1. **Sign up** at https://netlify.com
2. **Drag and drop** your project folder
3. **Done!** Your site is live

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Vercel

**Pros:** Fast, optimized, great for React
**Best for:** Modern web apps

**Steps:**

1. **Sign up** at https://vercel.com
2. **Import** your GitHub repository
3. **Deploy** automatically

**Or use Vercel CLI:**
```bash
npm install -g vercel
vercel --prod
```

### 4. Cloudflare Pages

**Pros:** Global CDN, fast, free SSL
**Best for:** High-performance sites

**Steps:**

1. **Sign up** at https://pages.cloudflare.com
2. **Connect** your GitHub repository
3. **Configure** build settings (none needed for static)
4. **Deploy**

## Deployment Checklist

Before deploying, ensure:

- [ ] All files are committed
- [ ] No sensitive data in code
- [ ] Links are relative (not absolute)
- [ ] Images are optimized
- [ ] Code is tested locally
- [ ] README is updated
- [ ] Config files are set correctly

## Environment Configuration

### For Production

Update `config.js`:

```javascript
const CONFIG = {
    network: 'mainnet', // Change to mainnet for production
    // ... rest of config
};
```

### Environment Variables

Create `.env` file (don't commit this!):

```
ALGORAND_API_KEY=your_api_key_here
ALGORAND_NETWORK=mainnet
```

## Custom Domain Setup

### GitHub Pages

1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME record:
   - Type: CNAME
   - Name: www
   - Value: yourusername.github.io
3. In GitHub repo settings, add custom domain
4. Enable "Enforce HTTPS"

### Netlify

1. Go to Domain Settings
2. Add custom domain
3. Follow DNS configuration instructions
4. SSL automatically configured

## SSL/HTTPS

All recommended platforms provide free SSL:
- GitHub Pages: Automatic with custom domain
- Netlify: Automatic
- Vercel: Automatic
- Cloudflare: Automatic

## Performance Optimization

### 1. Minify Files

```bash
# Install minifier
npm install -g minify

# Minify CSS
minify styles.css > styles.min.css

# Minify JS
minify app.js > app.min.js
```

### 2. Optimize Images

- Use WebP format
- Compress images (TinyPNG, ImageOptim)
- Use appropriate sizes
- Lazy load images

### 3. Enable Caching

Add `_headers` file (Netlify):
```
/*
  Cache-Control: public, max-age=31536000
```

### 4. Use CDN

For Algorand SDK, use CDN:
```html
<script src="https://unpkg.com/algosdk@latest/dist/browser/algosdk.min.js"></script>
```

## Backend Integration (Optional)

For production, consider adding a backend:

### Option 1: Firebase

```bash
npm install firebase
```

**Features:**
- Real-time database
- Authentication
- Hosting
- Free tier available

### Option 2: Supabase

```bash
npm install @supabase/supabase-js
```

**Features:**
- PostgreSQL database
- Authentication
- Real-time subscriptions
- Free tier available

### Option 3: AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
```

**Features:**
- Full AWS integration
- Scalable
- Pay-as-you-go

## Database Migration

Move from localStorage to database:

### Firebase Example

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    projectId: "tip-jar"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save creator
async function saveCreator(creator) {
    await addDoc(collection(db, 'creators'), creator);
}
```

## Monitoring & Analytics

### Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Security Best Practices

1. **Never commit private keys**
   - Use environment variables
   - Add to .gitignore

2. **Validate all inputs**
   - Sanitize user data
   - Check transaction amounts

3. **Use HTTPS only**
   - Enforce SSL
   - No mixed content

4. **Rate limiting**
   - Prevent spam
   - Use Cloudflare or similar

5. **Content Security Policy**
   Add to HTML:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com;">
   ```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Testing Before Deployment

1. **Test all features**
   - Wallet connection
   - Profile creation
   - Tipping
   - Dashboard
   - Widget embedding

2. **Cross-browser testing**
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Mobile testing**
   - Responsive design
   - Touch interactions
   - Mobile wallets

4. **Performance testing**
   - Load time
   - Transaction speed
   - API response time

## Post-Deployment

1. **Test live site**
   - All features working
   - Links are correct
   - Images loading

2. **Monitor errors**
   - Check browser console
   - Set up error tracking (Sentry)

3. **Gather feedback**
   - Share with test users
   - Iterate and improve

4. **Update documentation**
   - Add live URL to README
   - Update screenshots

## Scaling Considerations

As your platform grows:

1. **Database**: Move to PostgreSQL/MongoDB
2. **Caching**: Implement Redis
3. **CDN**: Use Cloudflare/AWS CloudFront
4. **Load Balancing**: Multiple servers
5. **Monitoring**: Datadog, New Relic
6. **Backup**: Regular database backups

## Cost Estimates

### Free Tier (Good for starting)
- Hosting: $0 (GitHub Pages, Netlify)
- Domain: $10-15/year
- SSL: $0 (included)
- **Total: ~$15/year**

### Production (Scaling)
- Hosting: $5-20/month (Vercel, Netlify Pro)
- Database: $5-25/month (Firebase, Supabase)
- Domain: $15/year
- CDN: $0-50/month
- **Total: ~$10-100/month**

## Support & Maintenance

1. **Regular updates**
   - Security patches
   - Dependency updates
   - Feature improvements

2. **Backup strategy**
   - Database backups
   - Code repository
   - User data

3. **User support**
   - FAQ page
   - Contact form
   - Community Discord

## Launch Checklist

- [ ] Code tested thoroughly
- [ ] All features working
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Analytics installed
- [ ] Error tracking setup
- [ ] Backup system in place
- [ ] Documentation complete
- [ ] Social media ready
- [ ] Launch announcement prepared

## Resources

- [GitHub Pages Docs](https://pages.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

**Ready to launch? Let's go! 🚀**
