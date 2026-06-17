# Deployment — Hostinger Cloud (SSH)

Two apps, two subdomains on the same Hostinger Cloud plan:

| App | Domain | Stack | Document / App root |
| --- | --- | --- | --- |
| API | `api3.a7mdgmal.online` | Laravel (PHP 8.2+) | `backend/public` |
| Frontend | `a7mdgmal.online` | Next.js (Node 20) | repo root (`logistec16`) |

> They share the registrable domain `a7mdgmal.online`. Auth uses **Bearer tokens** (no cookies), so
> the only cross-origin requirement is CORS — handled by `FRONTEND_URL` in the API `.env`.

---

## 0. Prerequisites (hPanel)
1. **Subdomains:** create `api3.a7mdgmal.online`. Keep `a7mdgmal.online` as the main domain.
2. **MySQL:** hPanel → Databases → create DB + user (note name/user/password).
3. **SSL:** enable free SSL for both `a7mdgmal.online` and `api3.a7mdgmal.online`.
4. **PHP version:** set the `api` subdomain to PHP **8.2+** with `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`.
5. **Node version:** ensure Node **20.x** is available (hPanel → Advanced → Node.js).
6. Upload the project (git clone or the file manager) to e.g. `~/repos/logistec16`.

---

## 1. Backend — `api3.a7mdgmal.online`

Point the subdomain's **document root** to `~/repos/logistec16/backend/public`.

```bash
cd ~/repos/logistec16/backend
composer install --no-dev --optimize-autoloader

cp .env.example .env
php artisan key:generate

# Edit .env and set:
#   APP_ENV=production   APP_DEBUG=false
#   APP_URL=https://api3.a7mdgmal.online
#   FRONTEND_URL=https://a7mdgmal.online
#   DB_CONNECTION=mysql  DB_DATABASE=...  DB_USERNAME=...  DB_PASSWORD=...
#   AUTHENTICA_ENABLED=true  AUTHENTICA_API_KEY=...  AUTHENTICA_TEMPLATE_ID=...

php artisan migrate --force --seed     # --seed creates demo data + admin (change it!)
php artisan storage:link               # public/storage -> storage/app/public
php artisan config:cache route:cache

# Writable dirs
chmod -R 775 storage bootstrap/cache
```

- **Authentica:** put the live API key/sender/template in `.env`. With `AUTHENTICA_ENABLED=false` the
  API falls back to a logged OTP (dev only). Endpoint/template are configurable in `config/authentica.php`.
- **Admin login (from the seeder):** phone `0500000000` / `admin123` — **change the password immediately**
  (or remove `--seed` and create the admin manually with `php artisan tinker`).
- If the subdomain root can't be `backend/public`, add `backend/public/.htaccess` (Laravel ships one) and a
  redirect, or symlink the docroot to `backend/public`.

**Verify:** `curl https://api3.a7mdgmal.online/api/banners` → JSON `{"data":[...]}`.

---

## 2. Frontend — `a7mdgmal.online` (Node app)

Configure a **Node.js application** in hPanel (or PM2) with:
- **Application root:** `~/repos/logistec16`
- **Startup file / command:** `npm run start` (Next.js `next start`; it honors the `PORT` Hostinger assigns)
- **Environment variable:** `NEXT_PUBLIC_API_URL=https://api3.a7mdgmal.online/api`
  (already in `.env.production`, but set it in the panel too so it's present at build time)

```bash
cd ~/repos/logistec16
npm ci
npm run build
# then start/restart the Node app from hPanel, or with PM2:
#   pm2 start "npm run start" --name a7mdgmal-web
#   pm2 save
```

Hostinger proxies `https://a7mdgmal.online` to the Node app's port. Ensure SSL is on.

**Verify:** open `https://a7mdgmal.online` → home loads, latest ads appear (fetched from the API),
register → OTP (real SMS) → login works, WhatsApp/Call buttons work.

---

## 3. CORS / domains checklist
- API `.env` `FRONTEND_URL=https://a7mdgmal.online` (add `,https://www.a7mdgmal.online` if you use www).
- Frontend `NEXT_PUBLIC_API_URL=https://api3.a7mdgmal.online/api`.
- Both subdomains on HTTPS.

## 4. Updating after changes
```bash
cd ~/repos/logistec16 && git pull
# backend
cd backend && composer install --no-dev -o && php artisan migrate --force \
  && php artisan config:cache route:cache
# frontend
cd .. && npm ci && npm run build   # then restart the Node app
```

## 5. Notes
- The seeder uses Unsplash image URLs for demo content; uploaded images are stored under
  `backend/storage/app/public` and served via `storage:link`.
- Run `php artisan optimize:clear` if you change `.env` after caching config.
