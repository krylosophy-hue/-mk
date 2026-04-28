# Moscollector — Corporate Website

Corporate website for AO "Moscollector" (АО «Москоллектор»).

**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS 3 + shadcn/ui + Framer Motion

---

## Quick Start (development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Dev server starts at `http://localhost:5173`.

---

## Production Build

```bash
npm run build
```

Static files will be generated in the `dist/` directory.

---

## Deployment on Your Own Server

### Option 1: Nginx (recommended)

1. **Build the project** on your local machine or CI:

```bash
npm install
npm run build
```

2. **Copy `dist/` to the server**, e.g.:

```bash
scp -r dist/ user@your-server:/var/www/moscollector
```

3. **Nginx config** (`/etc/nginx/sites-available/moscollector`):

```nginx
server {
    listen 80;
    server_name your-domain.ru;

    root /var/www/moscollector;
    index index.html;

    # SPA — all routes fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|mp4|webm|mov)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;
}
```

4. **Enable the site and restart Nginx:**

```bash
sudo ln -s /etc/nginx/sites-available/moscollector /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **(Optional) HTTPS with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.ru
```

---

### Option 2: Docker

1. **Create `Dockerfile`** in the project root:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create `nginx.conf`** in the project root:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|mp4|webm|mov)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
}
```

3. **Build and run:**

```bash
docker build -t moscollector .
docker run -d -p 80:80 --name moscollector moscollector
```

---

### Option 3: Node.js + PM2 (Vite Preview)

For quick deployment without Nginx:

```bash
# On the server
npm install
npm run build
npm install -g pm2

# Start with PM2
pm2 start "npx vite preview --host 0.0.0.0 --port 80" --name moscollector
pm2 save
pm2 startup
```

---

## Project Structure

```
src/
  components/   — UI components (shadcn/ui)
  pages/        — Page components (Home, Info, Consumers, Calculator, etc.)
  lib/          — Utilities
public/
  videos/       — Hero video and other media
  images/       — Logos and images
```

## Environment

- **Node.js** >= 18
- **npm** >= 9
