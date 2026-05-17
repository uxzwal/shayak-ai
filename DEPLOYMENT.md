# Deployment Guide for Sahayak AI

Complete instructions for setting up and deploying the Sahayak AI emergency response app.

## Prerequisites

- Node.js 14+ and npm 6+
- A code editor (VS Code recommended)
- Git (for version control)

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sahayak-ai.git
cd sahayak-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

Opens at: http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

Creates optimized `build/` folder (4-5 MB including all assets)

## Deployment Options

### Option A: Vercel (Recommended for Speed)

**Best for**: Global CDN, instant deployment, no configuration needed

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to connect GitHub account
```

**Post-deployment:**
- App URL: `https://yourdomain.vercel.app`
- Auto-deploys on git push
- Environment: `preview` (staging) and `production`

### Option B: Netlify (Recommended for Ease)

**Best for**: Easy setup, built-in CI/CD, form handling

#### Method 1: Git Integration (Recommended)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub account
5. Select repository
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy"

#### Method 2: CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build locally
npm run build

# Deploy
netlify deploy --prod --dir=build
```

**Netlify config** (optional, create `netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "build"

[dev]
  command = "npm start"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: GitHub Pages (Free Hosting)

**Best for**: Free, GitHub integration

#### Setup:

1. Ensure repo is public

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/sahayak-ai",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

4. Deploy:
```bash
npm run deploy
```

5. Go to repository Settings → Pages
6. Select "Deploy from a branch"
7. Choose: `gh-pages` branch

App URL: `https://yourusername.github.io/sahayak-ai`

### Option D: Self-Hosted (AWS, DigitalOcean, etc.)

**Best for**: Custom domain, full control

#### AWS S3 + CloudFront:

```bash
# 1. Create S3 bucket
aws s3api create-bucket --bucket sahayak-ai --region us-east-1

# 2. Build project
npm run build

# 3. Upload to S3
aws s3 sync build/ s3://sahayak-ai

# 4. Set bucket as static website
aws s3 website s3://sahayak-ai --index-document index.html --error-document index.html

# 5. Create CloudFront distribution (via AWS console)
```

#### DigitalOcean App Platform:

1. Create new App
2. Connect GitHub repo
3. Configure:
   - Build command: `npm run build`
   - Output directory: `build`
4. Deploy

#### Traditional Server (VPS/Shared Hosting):

```bash
# 1. Build locally
npm run build

# 2. Connect to server
ssh user@your-server.com

# 3. Copy files
scp -r build/* user@your-server.com:/var/www/sahayak-ai/

# 4. Configure Nginx
sudo vi /etc/nginx/sites-available/sahayak-ai
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name sahayak-ai.example.com;
    root /var/www/sahayak-ai;
    index index.html;
    
    # Serve all files, fallback to index.html for routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker should not be cached
    location = /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/sahayak-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option E: Docker (Advanced)

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t sahayak-ai .
docker run -p 80:80 sahayak-ai
```

## Configuration & Optimization

### Environment Variables

Create `.env.production`:

```env
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production
```

### Performance Optimization

1. **Enable Gzip compression**:
   ```bash
   # Vercel: Automatic
   # Netlify: Automatic
   # Nginx:
   gzip on;
   gzip_types text/plain text/css text/javascript application/json;
   ```

2. **Cache headers**:
   ```bash
   # Immutable resources (hashed filenames)
   Cache-Control: max-age=31536000, immutable
   
   # HTML (service worker will handle)
   Cache-Control: max-age=3600, must-revalidate
   
   # Service worker (never cache)
   Cache-Control: no-cache, no-store, must-revalidate
   ```

3. **CDN caching**:
   - Vercel: Automatic edge caching
   - Netlify: Automatic CDN
   - CloudFront: Configure cache behaviors
   - Cloudflare: Enable caching

### Security

Add headers:

```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### HTTPS/SSL

All major platforms provide free HTTPS:

- **Vercel**: Automatic Let's Encrypt
- **Netlify**: Automatic Let's Encrypt
- **GitHub Pages**: Automatic with custom domain
- **AWS**: Use ACM (AWS Certificate Manager)
- **Let's Encrypt**: Free certificates for self-hosted

## Testing Deployment

### Before going live:

1. **Test on production build locally**:
```bash
npm run build
serve -s build
```

2. **Test on multiple devices**:
   - iPhone (Safari)
   - Android (Chrome)
   - Desktop (Chrome, Firefox, Safari)

3. **Test offline functionality**:
   - Disconnect WiFi
   - Verify all features work
   - Check LocalStorage persists

4. **Test PWA installation**:
   - Android: Click install prompt
   - iOS: Add to home screen
   - Desktop: Install button

5. **Lighthouse audit**:
```bash
# Built-in to Chrome DevTools
# Run: DevTools → Lighthouse → Analyze page load
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

## Monitoring & Analytics

### Error Tracking (Optional)

Sentry integration:

```bash
npm install @sentry/react @sentry/tracing
```

In `App.js`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV,
});

export default Sentry.withProfiler(App);
```

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Custom Domain

### Vercel

1. Go to project Settings → Domains
2. Add custom domain
3. Update DNS records (shown in Vercel)
4. Wait 1-2 hours for DNS propagation

### Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS at your registrar

### Self-hosted

1. Point domain A record to server IP
2. Update your DNS provider
3. Wait for propagation

## Rollback & Versioning

### Git tags for releases:

```bash
# Tag release
git tag -a v1.0.0 -m "First production release"
git push origin v1.0.0

# Rollback to previous version
git reset --hard v0.9.0
git push --force
```

### Netlify rollback:

In Netlify dashboard: Deploys → Select previous deploy → Publish

### Vercel rollback:

In Vercel dashboard: Deployments → Select previous → Promote to Production

## Troubleshooting

### Build fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### App shows blank page

1. Check browser console for errors
2. Verify `index.html` is served correctly
3. Check Service Worker registration
4. Clear browser cache and reload

### Offline not working

1. Check Service Worker is registered (DevTools → Application → Service Workers)
2. Verify `service-worker.js` exists
3. Check HTTPS is enabled (Service Workers require HTTPS)
4. Clear old Service Worker caches

### Performance issues

1. Run Lighthouse audit
2. Check Network tab for large assets
3. Enable Gzip compression
4. Optimize images
5. Enable CDN caching

## Support & Help

- Documentation: See README.md
- Issues: GitHub Issues
- Questions: Discussions forum

---

**Need help?** Open an issue or check the main README for more information.
