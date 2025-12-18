# Nginx Configuration for MyPacer

This directory contains Nginx configuration files for production and staging environments.

## 📁 Files

- `mypacer.fr.conf` - Production configuration
- `stage.mypacer.fr.conf` - Staging configuration

## 🚀 Deployment Instructions

### Prerequisites

1. Docker containers running (via mypacer_infra docker-compose)
2. Nginx installed on the server
3. DNS configured:
   - `mypacer.fr` → server IP
   - `www.mypacer.fr` → server IP
   - `stage.mypacer.fr` → server IP

### Production Setup

1. **Copy the config file:**

   ```bash
   sudo cp mypacer.fr.conf /etc/nginx/sites-available/mypacer.fr
   sudo ln -s /etc/nginx/sites-available/mypacer.fr /etc/nginx/sites-enabled/
   ```

2. **Test and reload Nginx:**

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **SSL certificates are already configured** (managed by Certbot)

### Staging Setup

1. **Copy the config file:**

   ```bash
   sudo cp stage.mypacer.fr.conf /etc/nginx/sites-available/stage.mypacer.fr
   sudo ln -s /etc/nginx/sites-available/stage.mypacer.fr /etc/nginx/sites-enabled/
   ```

2. **Test Nginx config:**

   ```bash
   sudo nginx -t
   ```

3. **Configure SSL with Certbot:**

   ```bash
   sudo certbot --nginx -d stage.mypacer.fr
   ```

4. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## 🔧 Port Mapping

### Production

- Web: `127.0.0.1:8080` (Docker) → `mypacer.fr`
- API: `127.0.0.1:8000` (Docker) → `mypacer.fr/api/`

### Staging

- Web: `127.0.0.1:8081` (Docker) → `stage.mypacer.fr`
- API: `127.0.0.1:8001` (Docker) → `stage.mypacer.fr/api/`

## ⚠️ Important Notes

- **API is accessed via `/api` path** - No CORS needed (same origin)
- **Old static files** in `/home/cyril/src/running_pace_table/dist` can be removed after deployment
- **Old api.mypacer.fr config** can be kept or removed (no longer needed with `/api` routing)

## 🧪 Testing

After deployment, test the following:

```bash
# Test web
curl https://mypacer.fr
curl https://stage.mypacer.fr

# Test API
curl https://mypacer.fr/api/health
curl https://stage.mypacer.fr/api/health

# Test API docs
curl https://mypacer.fr/api/docs
curl https://stage.mypacer.fr/api/docs
```
