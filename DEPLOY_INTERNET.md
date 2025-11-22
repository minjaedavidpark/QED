# 🌐 Deploy QED to the Internet

This guide will help you deploy your QED application to the internet with **free or low-cost options**.

## 🎯 Recommended Deployment Strategies

### Option A: Railway (Easiest - All-in-One)

✅ Both services on one platform
✅ Automatic HTTPS
✅ Free tier: $5/month credit
✅ GitHub integration

### Option B: Vercel + Railway

✅ Frontend on Vercel (best for Next.js)
✅ Backend on Railway
✅ Free tiers available

### Option C: Render (Alternative)

✅ Both services on one platform
✅ Free tier available
✅ Automatic HTTPS

---

## 🚀 Option A: Deploy Everything to Railway (RECOMMENDED)

Railway is perfect for full-stack apps with Docker support.

### Step 1: Prepare Your Repository

1. **Commit all deployment files**:
   ```bash
   git add .
   git commit -m "feat: add deployment configuration"
   git push origin main
   ```

### Step 2: Deploy Backend (Manim Service)

1. **Go to [Railway](https://railway.app/) and sign up** with GitHub

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `QED` repository

3. **Configure the Manim Service**:
   - Click "Add Service" → "GitHub Repo"
   - Select your repo
   - Railway will detect the Dockerfile

4. **Set Root Directory**:
   - Go to Settings → Service Settings
   - Set **Root Directory**: `manim-service`
   - Set **Dockerfile Path**: `Dockerfile`

5. **Add Environment Variables**:
   - Go to Variables tab
   - Add these variables:
     ```
     ANTHROPIC_API_KEY=your_actual_key_here
     OPENAI_API_KEY=your_actual_key_here
     LLM_PROVIDER=anthropic
     ```

6. **Configure Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://qed-manim-service.up.railway.app`)

### Step 3: Deploy Frontend (Next.js)

1. **Add another service** to the same project:
   - Click "New" → "GitHub Repo"
   - Select the same repository

2. **Configure the Frontend Service**:
   - Railway should auto-detect Next.js
   - Set **Root Directory**: `.` (leave empty or set to root)
   - Set **Dockerfile Path**: `Dockerfile`

3. **Add Environment Variables**:
   - Go to Variables tab
   - Add these variables:
     ```
     ANTHROPIC_API_KEY=your_actual_key_here
     OPENAI_API_KEY=your_actual_key_here
     LLM_PROVIDER=anthropic
     MANIM_SERVICE_URL=https://qed-manim-service.up.railway.app
     ```
   - **Important**: Use the Manim service URL from Step 2.6

4. **Generate Public URL**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Your app will be live at this URL! 🎉

### Step 4: Test Your Deployment

Visit your Railway frontend URL and test:

- ✅ Homepage loads
- ✅ Can interact with the study coach
- ✅ Visualizations generate correctly

---

## 🚀 Option B: Vercel (Frontend) + Railway (Backend)

This separates your frontend and backend for optimal performance.

### Step 1: Deploy Backend to Railway

Follow **Option A - Step 2** above to deploy just the Manim service.

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com/) and sign up** with GitHub

2. **Import your project**:
   - Click "Add New" → "Project"
   - Import your `QED` repository
   - Vercel auto-detects Next.js

3. **Configure Build Settings**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**:
   - Before deploying, click "Environment Variables"
   - Add these variables:
     ```
     ANTHROPIC_API_KEY=your_actual_key_here
     OPENAI_API_KEY=your_actual_key_here
     LLM_PROVIDER=anthropic
     MANIM_SERVICE_URL=https://your-manim-service.up.railway.app
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://qed-xyz.vercel.app` 🎉

### Step 3: Update CORS (Backend)

Update your Manim service to allow requests from Vercel:

1. Edit `manim-service/api.py` and update CORS:

   ```python
   from flask_cors import CORS

   app = Flask(__name__)
   CORS(app, origins=[
       "http://localhost:3000",
       "https://qed-xyz.vercel.app",  # Add your Vercel URL
       "https://*.vercel.app"  # Or allow all Vercel deployments
   ])
   ```

2. Commit and push:
   ```bash
   git add manim-service/api.py
   git commit -m "feat: update CORS for Vercel deployment"
   git push
   ```

Railway will automatically redeploy.

---

## 🚀 Option C: Deploy to Render

Render is another great free option.

### Step 1: Prepare Render Configuration

We've already created `render.yaml` for you!

### Step 2: Deploy to Render

1. **Go to [Render](https://render.com/) and sign up** with GitHub

2. **Create a new Blueprint**:
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml`

3. **Configure Services**:
   - Render will create both services automatically
   - Click "Apply" to deploy

4. **Add Environment Variables**:
   For each service, go to Environment tab and add:

   ```
   ANTHROPIC_API_KEY=your_actual_key_here
   OPENAI_API_KEY=your_actual_key_here
   LLM_PROVIDER=anthropic
   ```

5. **Your app is live!**
   - Frontend: `https://qed-frontend.onrender.com`
   - Backend: `https://qed-manim-service.onrender.com`

**Note**: Render's free tier spins down after inactivity (may take 30-60s to wake up).

---

## 💰 Cost Comparison

| Platform             | Frontend | Backend | Total/Month | Free Tier              |
| -------------------- | -------- | ------- | ----------- | ---------------------- |
| **Railway**          | $5       | $5      | ~$10        | $5 credit              |
| **Vercel + Railway** | Free     | $5      | ~$5         | Both have free tiers   |
| **Render**           | Free     | Free    | $0          | Yes (with limitations) |

### Free Tier Limitations

**Railway**:

- $5/month credit (enough for hobby projects)
- 500 hours execution time

**Vercel**:

- 100GB bandwidth/month
- Unlimited deployments
- Hobby use only

**Render**:

- Free tier sleeps after 15 min inactivity
- 750 hours/month
- Limited build minutes

---

## 🔧 Environment Variables Reference

Add these to your deployment platform:

### Required for Both Services

```env
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
LLM_PROVIDER=anthropic
```

### Frontend Only

```env
MANIM_SERVICE_URL=https://your-backend-url.com
```

### Backend Only

(Same as required variables above)

---

## 🌐 Custom Domain Setup

### Railway

1. Go to Settings → Networking
2. Click "Custom Domain"
3. Add your domain (e.g., `qed.yourdomain.com`)
4. Update DNS with provided CNAME

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS with provided records

### Render

1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS with provided CNAME

---

## 📊 Monitoring Your Deployment

### Railway

- View logs: Click service → Logs tab
- Monitor resources: Metrics tab
- View deployments: Deployments tab

### Vercel

- View logs: Project → Deployments → Click deployment
- Analytics: Analytics tab (if enabled)
- Monitor errors: Integrations → Add monitoring

### Render

- View logs: Service → Logs
- Monitor metrics: Metrics tab
- Set up alerts: Settings → Notifications

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Check**:

1. ✅ `MANIM_SERVICE_URL` is set correctly
2. ✅ Backend URL is accessible: `curl https://your-backend-url/health`
3. ✅ CORS is configured properly in backend

**Fix**:

```bash
# Test backend directly
curl https://your-manim-service-url.com/health

# Should return:
# {"status":"healthy","service":"manim-visualizer"}
```

### Build fails on deployment

**Common issues**:

1. Missing `output: 'standalone'` in `next.config.js` ✅ (already added)
2. Missing environment variables
3. Node version mismatch

**Fix**:

- Check build logs on your platform
- Ensure all dependencies in `package.json`
- Verify environment variables are set

### Backend renders slowly or times out

**Manim rendering** can be CPU-intensive:

**Railway/Render**:

- Upgrade to paid tier for better resources
- Increase timeout in `Dockerfile`:
  ```dockerfile
  CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "300", "api:app"]
  ```

### Free tier sleeping (Render)

**Render free tier** sleeps after 15 minutes:

**Solutions**:

1. Upgrade to paid tier ($7/month)
2. Use a ping service (e.g., UptimeRobot) to keep it awake
3. Accept cold starts (first request takes longer)

---

## 🔐 Security Best Practices

### 1. Protect Your API Keys

- ✅ Use environment variables
- ✅ Never commit `.env.local` to Git
- ✅ Rotate keys regularly

### 2. Enable HTTPS

- ✅ All platforms provide free SSL certificates
- ✅ Force HTTPS redirects

### 3. Set Up CORS Properly

```python
# manim-service/api.py
CORS(app, origins=[
    "https://your-frontend-domain.com",
    "http://localhost:3000"  # For local development
])
```

### 4. Rate Limiting

Consider adding rate limiting to your API:

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    default_limits=["100 per hour"]
)
```

---

## 📈 Next Steps After Deployment

1. **Set up monitoring**: Add error tracking (Sentry, LogRocket)
2. **Add analytics**: Track usage (Vercel Analytics, Google Analytics)
3. **Enable caching**: Configure caching headers for better performance
4. **Set up CI/CD**: Automatic deployments on push (already enabled with Railway/Vercel!)
5. **Custom domain**: Add your own domain name
6. **Backup**: Set up database backups if you add persistence

---

## 🎉 Quick Start Recommendation

**For the fastest deployment (5 minutes)**:

1. **Choose Railway** (all-in-one solution)
2. **Push your code** to GitHub
3. **Follow Option A** above
4. **Set environment variables**
5. **You're live!**

**Your app will be accessible at**:

- `https://your-app-name.up.railway.app`

---

## 💡 Tips

- **Start with Railway** for simplicity
- **Monitor costs** in Railway dashboard
- **Use Vercel** if you want the absolute best Next.js performance
- **Test locally first** with `docker-compose up`
- **Check logs** if something doesn't work

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs on your platform
3. Test locally with Docker Compose first
4. Verify environment variables are set correctly

Good luck with your deployment! 🚀
