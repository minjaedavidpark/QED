# 🚀 Quick Deployment Guide

The fastest way to deploy QED to the internet in **under 10 minutes**.

## ⚡ Deploy to Railway (Recommended)

### Prerequisites

- GitHub account
- Your code pushed to GitHub
- API keys ready (Anthropic and/or OpenAI)

---

## Step-by-Step

### 1️⃣ Push Your Code to GitHub

```bash
git add .
git commit -m "chore: ready for deployment"
git push origin main
```

### 2️⃣ Deploy Backend (Manim Service)

1. Go to **[railway.app](https://railway.app)** → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `QED` repository
4. **Configure the service**:
   - Name: `qed-manim-service`
   - Settings → Root Directory: `manim-service`
   - Settings → Dockerfile Path: `Dockerfile`

5. **Add environment variables** (Variables tab):

   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   OPENAI_API_KEY=sk-your-key-here
   LLM_PROVIDER=anthropic
   ```

6. **Generate domain** (Settings → Networking):
   - Click "Generate Domain"
   - Copy URL (e.g., `https://qed-manim-xxx.up.railway.app`)

### 3️⃣ Deploy Frontend (Next.js)

1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select the same `QED` repository
3. **Configure the service**:
   - Name: `qed-frontend`
   - Settings → Root Directory: `.` (or leave empty)
   - Settings → Dockerfile Path: `Dockerfile`

4. **Add environment variables** (Variables tab):

   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   OPENAI_API_KEY=sk-your-key-here
   LLM_PROVIDER=anthropic
   MANIM_SERVICE_URL=https://qed-manim-xxx.up.railway.app
   ```

   ⚠️ **Important**: Use the backend URL from Step 2.6

5. **Generate domain** (Settings → Networking):
   - Click "Generate Domain"
   - Get your live URL!

### 4️⃣ Test Your Deployment

Visit your frontend URL and verify:

- ✅ Homepage loads
- ✅ Can ask questions
- ✅ Visualizations work

---

## ✅ Done!

Your app is now live on the internet! 🎉

**URLs**:

- Frontend: `https://qed-frontend-xxx.up.railway.app`
- Backend: `https://qed-manim-xxx.up.railway.app`

---

## 🔧 Troubleshooting

### "Service won't start"

- Check **Logs** in Railway
- Verify environment variables are set
- Ensure Dockerfile paths are correct

### "Frontend can't reach backend"

- Verify `MANIM_SERVICE_URL` matches your backend URL
- Check backend health: `curl https://your-backend-url/health`

### "Out of Railway credits"

- Railway gives $5/month free credit
- Upgrade to pay-as-you-go if needed
- Or try Render (has free tier)

---

## 💡 What's Next?

1. **Custom domain**: Add your own domain in Railway settings
2. **Monitoring**: Check logs and metrics in Railway
3. **Auto-deploy**: Railway auto-deploys when you push to GitHub
4. **Scaling**: Upgrade resources if needed

---

## 📚 More Options

For other deployment platforms (Vercel, Render, VPS), see **[DEPLOY_INTERNET.md](DEPLOY_INTERNET.md)**.

---

**Need help?** Check the full deployment guide in [DEPLOY_INTERNET.md](DEPLOY_INTERNET.md).
