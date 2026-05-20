# Деплой сайта АО «Москоллектор» в корпоративной сети

Сайт — статический (HTML/CSS/JS + ассеты), бэкенда нет.
Достаточно положить содержимое `dist/` на любой веб-сервер.

## Системные требования

**Для запуска (сервер):**
- Любой HTTP-сервер с поддержкой SPA-маршрутизации
- ~250 МБ дискового пространства
- Поддержка GZIP-сжатия (опционально, ускоряет загрузку)

**Для пересборки (опционально):**
- Node.js 18+ (рекомендуется 20)
- npm 9+
- ~1 ГБ дискового пространства (node_modules)

## Вариант A: Готовая сборка

В архиве `dist/` лежат уже скомпилированные файлы. Достаточно положить их в DocumentRoot веб-сервера.

```
dist/
├── index.html              ← главная страница (SPA)
├── 404.html                ← SPA-fallback (копия index.html)
├── assets/                 ← JS/CSS бандлы
├── docs/                   ← PDF/DOC/XLSX (~78 МБ)
├── images/                 ← логотипы, фото
├── videos/                 ← MP4 (~78 МБ)
├── admin/                  ← CMS — рекомендуется удалить для intranet
├── robots.txt
└── sitemap.xml
```

⚠️ **Перед деплоем в intranet:** удалите папку `dist/admin/` — это CMS под GitHub Pages, во внутренней сети она не нужна и не будет работать (использует GitHub OAuth).

## Вариант B: Пересборка из исходников

```bash
# 1. Клонировать репозиторий
git clone https://github.com/krylosophy-hue/-mk.git moscollector-site
cd moscollector-site

# 2. Установить зависимости (один раз)
npm install

# 3. Собрать production-версию
npm run build

# Результат в папке dist/ — её и кладём на сервер
```

Локальная разработка:
```bash
npm run dev
# Откроется на http://localhost:5173
```

## Настройка веб-сервера

### Nginx

Положите `dist/` в `/var/www/moscollector/` и используйте такой конфиг:

```nginx
server {
    listen 80;
    server_name moscollector.local;
    root /var/www/moscollector;
    index index.html;

    # Кеш для статики (1 год)
    location ~* \.(js|css|jpg|jpeg|png|webp|svg|ico|mp4|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA: все маршруты ведут в index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # GZIP для текстовых ресурсов
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
    gzip_comp_level 6;
}
```

После редактирования: `sudo nginx -t && sudo nginx -s reload`

### Apache (httpd)

Положите `dist/` в DocumentRoot, добавьте `.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# SPA: маршруты в index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Кеш статики
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType video/mp4 "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
</IfModule>

# GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

Должны быть включены модули: `mod_rewrite`, `mod_expires`, `mod_deflate`.

### IIS (Windows Server)

В корень `dist/` положите `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url="^(?!.*\.(js|css|jpg|jpeg|png|webp|svg|ico|mp4|pdf|doc|docx|xlsx)$).*$" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <mimeMap fileExtension=".docx" mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
      <mimeMap fileExtension=".xlsx" mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    </staticContent>
    <httpCompression>
      <dynamicTypes>
        <add mimeType="text/*" enabled="true" />
        <add mimeType="application/javascript" enabled="true" />
        <add mimeType="application/json" enabled="true" />
      </dynamicTypes>
    </httpCompression>
  </system.webServer>
</configuration>
```

### Docker

`Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Запуск:
```bash
docker build -t moscollector-site .
docker run -d -p 80:80 --name moscollector moscollector-site
```

## Обновление контента в intranet-версии

Так как CMS (Sveltia) использует GitHub, в intranet она работать не будет.

Варианты обновления контента:
1. **Через GitHub** (если есть доступ): редактировать через CMS на krylosophy-hue.github.io/-mk/admin/ → потом `git pull` → `npm run build` → выложить новый `dist/`
2. **Локально**: разраб редактирует файлы в `content/` (markdown/YAML) → `npm run build` → выложить
3. **Поднять Sveltia CMS на корпоративном Git** (GitLab / Gitea / self-hosted Gitea): конфиг в `public/admin/config.yml` — поменять backend с `github` на `gitlab`/`gitea`

## Что нужно проверить после деплоя

- [ ] Открывается главная: `http://moscollector.local/`
- [ ] Видео на главной воспроизводится
- [ ] Открывается `/consumers`, `/press`, `/contacts`, `/calculator`
- [ ] Прямой переход по `/calculator` (F5 на этой странице) не даёт 404 — это проверяет SPA-fallback
- [ ] Скачиваются PDF из `/docs/...`
- [ ] Работает поиск в шапке

## Структура проекта (для разраба)

```
moscollector-site/
├── content/              ← контент в Markdown/YAML (редактируется через CMS)
├── public/               ← статика (логотипы, видео, PDF, формы)
├── src/                  ← исходный код React + TypeScript
│   ├── App.tsx           ← роутинг
│   ├── Layout.tsx        ← хедер + футер + поиск
│   ├── pages/            ← страницы сайта
│   ├── components/       ← UI-компоненты (shadcn/ui)
│   └── lib/
│       ├── content.ts    ← загрузчик контента из content/
│       └── utils.ts      ← хелперы (cn, asset)
├── vite.config.ts        ← конфиг сборки
├── tailwind.config.js    ← дизайн-токены
└── package.json
```

Стек:
- React 19 + TypeScript
- Vite 7 (сборка)
- Tailwind CSS 3 + shadcn/ui
- React Router 7 (SPA-маршрутизация)
- Framer Motion (анимации)

## Контакты по техническим вопросам

Репозиторий: https://github.com/krylosophy-hue/-mk
Live demo (GitHub Pages): https://krylosophy-hue.github.io/-mk/
