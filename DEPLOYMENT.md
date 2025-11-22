# QED Deployment Guide

This guide covers deploying the QED multi-agent study coach application, which consists of two main services:

- **Frontend**: Next.js application (port 3000)
- **Backend**: Flask Manim visualization service (port 5001)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Docker Compose (Recommended)](#docker-compose-recommended)
  - [Manual Deployment](#manual-deployment)
  - [Cloud Deployment](#cloud-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Prerequisites

### For Docker Deployment

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- 4GB+ RAM recommended
- 10GB+ disk space

### For Manual Deployment

- Node.js 20+
- Python 3.11+
- LaTeX distribution (for Manim)
- FFmpeg (for video generation)

---

## Environment Setup

1. **Create environment file**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your API keys** in `.env.local`:

   ```env
   # LLM Provider Selection
   LLM_PROVIDER=anthropic  # or "openai"

   # API Keys
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here

   # Manim Service URL (adjust for your deployment)
   MANIM_SERVICE_URL=http://localhost:5001
   ```

---

## Deployment Options

### Docker Compose (Recommended)

This is the easiest way to deploy both services together.

#### 1. Build and start services

```bash
docker-compose up -d
```

This will:

- Build the frontend Next.js container
- Build the backend Manim service container
- Create a shared network for communication
- Start both services in detached mode

#### 2. View logs

```bash
# All services
docker-compose logs -f

# Just frontend
docker-compose logs -f frontend

# Just backend
docker-compose logs -f manim-service
```

#### 3. Stop services

```bash
docker-compose down
```

#### 4. Rebuild after code changes

```bash
docker-compose up -d --build
```

#### 5. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health check: http://localhost:5001/health

---

### Manual Deployment

#### Frontend (Next.js)

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Build the application**:

   ```bash
   npm run build
   ```

3. **Start the production server**:
   ```bash
   npm start
   ```

The frontend will be available at http://localhost:3000

#### Backend (Manim Service)

1. **Navigate to the service directory**:

   ```bash
   cd manim-service
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the service**:

   ```bash
   # Development
   python api.py

   # Production (with gunicorn)
   gunicorn --bind 0.0.0.0:5001 --workers 2 --timeout 120 api:app
   ```

The backend will be available at http://localhost:5001

---

### Cloud Deployment

#### Option 1: Deploy to a VPS (DigitalOcean, AWS EC2, etc.)

1. **Provision a server** with at least 2GB RAM
2. **Install Docker and Docker Compose**:

   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io docker-compose-v2 -y
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

3. **Clone your repository**:

   ```bash
   git clone <your-repo-url>
   cd QED
   ```

4. **Set up environment**:

   ```bash
   cp .env.example .env.local
   nano .env.local  # Add your API keys
   ```

5. **Deploy with Docker Compose**:

   ```bash
   sudo docker-compose up -d
   ```

6. **Set up reverse proxy (Nginx)**:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api/manim/ {
           proxy_pass http://localhost:5001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Enable HTTPS with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

#### Option 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `MANIM_SERVICE_URL` (point to your deployed backend)

**Note**: Deploy the Manim service separately on a VPS or container platform.

#### Option 3: Deploy Backend to Cloud Run (GCP)

1. **Build and push the Docker image**:

   ```bash
   cd manim-service
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/manim-service
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy manim-service \
     --image gcr.io/YOUR_PROJECT_ID/manim-service \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars ANTHROPIC_API_KEY=xxx,OPENAI_API_KEY=xxx
   ```

#### Option 4: Deploy to Railway/Render

Both services can be deployed separately:

**Railway**:

1. Create a new project
2. Add both services from GitHub
3. Set environment variables
4. Deploy automatically on push

**Render**:

1. Create web services for both frontend and backend
2. Configure Docker builds
3. Set environment variables
4. Deploy

---

## Monitoring and Maintenance

### Health Checks

- **Frontend**: Check http://localhost:3000 loads correctly
- **Backend**: Check http://localhost:5001/health returns:
  ```json
  { "status": "healthy", "service": "manim-visualizer" }
  ```

### Docker Container Health

```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats

# Check logs for errors
docker-compose logs --tail=100 -f
```

### Updating the Application

1. **Pull latest code**:

   ```bash
   git pull origin main
   ```

2. **Rebuild and restart**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Backup Volumes

```bash
# Backup generated media files
docker run --rm -v qed_manim-media:/data -v $(pwd):/backup alpine \
  tar czf /backup/manim-media-backup.tar.gz -C /data .
```

### Scaling

To handle more traffic, increase the number of gunicorn workers in [manim-service/Dockerfile](manim-service/Dockerfile):

```dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "4", "--timeout", "120", "api:app"]
```

---

## Troubleshooting

### Frontend Issues

**Problem**: Build fails with "Module not found"

```bash
# Clear Next.js cache
rm -rf .next
npm install
npm run build
```

**Problem**: API requests fail

- Check `MANIM_SERVICE_URL` in environment
- Verify backend is running: `curl http://localhost:5001/health`

### Backend Issues

**Problem**: Manim rendering fails

- Check LaTeX is installed in container
- Verify FFmpeg is available
- Check disk space: `df -h`

**Problem**: Port 5001 already in use

```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9
```

### Docker Issues

**Problem**: Out of disk space

```bash
# Clean up unused images and containers
docker system prune -a --volumes
```

**Problem**: Container fails to start

```bash
# Check logs
docker-compose logs manim-service
docker-compose logs frontend
```

---

## Security Considerations

1. **Never commit API keys** - use `.env.local` and keep it out of version control
2. **Use HTTPS in production** - set up SSL/TLS certificates
3. **Limit CORS origins** - configure allowed origins in the backend
4. **Rate limiting** - implement rate limiting for API endpoints
5. **Keep dependencies updated** - regularly update packages for security patches

---

## Support

For issues or questions:

- Check the [README.md](README.md) for project overview
- Review [SETUP.md](SETUP.md) for local development setup
- Check logs: `docker-compose logs -f`
