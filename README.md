# Empower Jhang - Community Portal Production Deployment Manual

Welcome to the **Empower Jhang** digital ecosystem. This repository contains the complete production-optimized architecture, featuring an Express.js backend, a React + Vite frontend, and a Prisma-managed MySQL database.

Tagline: **Learn • Connect • Grow**

---

## 1. Directory Structure

The repository is structured to separate concerns, optimize client bundle delivery, and provide absolute compatibility with standard cloud hosting services like **Hostinger Business Hosting**:

```text
Empower Jhang/
├── frontend/                  # React Frontend Client (TypeScript + Vite)
│   ├── public/                # Static assets (PWA manifests, images)
│   ├── src/                   # Component and state architecture
│   └── vite.config.ts         # Outputs production bundle to root "/public"
├── backend/                   # Node.js + Express Backend Server
│   ├── prisma/                # Database migrations & schemas
│   ├── src/                   # Core controllers, middleware, and services
│   ├── dist/                  # Output directory for production esbuild
│   │   └── server.js          # Compiled & minified backend bundle (Startup File)
│   └── package.json           # Backend dependency descriptors & builds
├── public/                    # Built production React assets (generated on build)
├── uploads/                   # Local storage for all dynamic files (generated on startup)
│   ├── profile/               # Member avatar photos
│   ├── member-cards/          # Generated PVC PDF member cards
│   ├── mentor-cards/          # Generated PVC PDF mentor cards
│   ├── volunteer-cards/       # Generated PVC PDF volunteer cards
│   ├── qr/                    # Generated profile verification QR codes
│   ├── resources/             # Course sheets & downloadable documents
│   └── announcements/         # Attachment files for bulletins
├── logs/                      # Error & access rotate logs (generated on startup)
├── backups/                   # Dynamic JSON database snapshots
├── .env.example               # Template environment configuration file
├── package.json               # Root workspace script orchestrator
└── README.md                  # This Master Manual
```

---

## 2. Technology Stack & Production Optimizations

- **Frontend Core**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend Core**: Node.js, Express, Prisma ORM, MySQL.
- **Vite Bundler Options**: Enables code splitting, lazy loading, and asset minification. Builds directly to the root `/public` directory.
- **Esbuild Backend Compiler**: Compiles and minifies the Express backend code from `src/index.js` into a single, optimized ES module (`backend/dist/server.js`), stripping dev dependencies and minimizing loading overhead.
- **Security Headers**: Uses `helmet` to manage secure headers and explicitly disables `X-Powered-By: Express` to mask server technology.
- **HTTPS Enforcement**: Middleware automatically inspects the reverse-proxy `x-forwarded-proto` header and redirects all HTTP traffic to secure HTTPS.
- **Brevo Email Gateway**: Dispatches verified 6-digit transaction codes via secure SMTP.

---

## 3. Environment Variables Configuration

Create a `.env` file in the root directory (local development) or in the `backend/` directory (Hostinger deployment). Use the following template:

```env
# Server Mode & Port
NODE_ENV=production
PORT=5000

# Base Canonical Domain URL
APP_URL=https://empowerjhang.org

# Database Credentials
# Hostinger database URLs follow this syntax: mysql://user:password@host:port/database
DATABASE_URL="mysql://u123456789_user:SecurePass123!@127.0.0.1:3306/u123456789_db"

# Security Configurations
JWT_SECRET="generate-a-secure-64-character-hex-string-for-production"

# Brevo Mailer Gateway Credentials
BREVO_API_KEY="xkeysib-your-brevo-api-key"
BREVO_FROM_EMAIL="info@empowerjhang.org"

# Production Filesystems Mappings (relative to backend/)
UPLOAD_PATH="../uploads"
LOG_PATH="../logs"
```

---

## 4. Local Workspace Commands

Manage both components concurrently from the root directory:

### Install all dependencies
```bash
npm run install:all
```

### Run local dev servers concurrently
```bash
npm run dev
```

### Generate local database client
```bash
npm run db:generate
```

### Apply database migrations locally
```bash
npm run db:migrate
```

### Seed initial administrator accounts
```bash
npm run db:seed
```

---

## 5. Hostinger Business Hosting Deployment Guide

Follow these steps to deploy the entire ecosystem to a Hostinger Business Hosting plan without requiring VPS access.

### Step 1: Create Database on Hostinger
1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** -> **MySQL Databases**.
3. Create a new database and database user (e.g. `u123456789_empower`). Write down the database name, username, and password.

### Step 2: Prepare Project Files
1. Run a build on your local machine to generate the production assets:
   ```bash
   npm run build:frontend
   npm run build:backend
   ```
2. Compress the project folder into a ZIP file. **Crucial:** Exclude all `node_modules` folders to keep the size small. Ensure your zip file contains:
   - `backend/` (including `dist/server.js`, `prisma/`, `package.json`)
   - `frontend/` (excluding node_modules)
   - `public/` (containing the built frontend files)
   - `package.json` (root orchestrator)

### Step 3: Upload and Extract Files
1. In hPanel, go to **Files** -> **File Manager**.
2. Go to your domain root directory (typically `public_html`).
3. Upload your compressed ZIP file.
4. Extract the contents directly into `public_html`.

### Step 4: Install Dependencies & Run Database Migrations via SSH
1. Go to **Advanced** -> **SSH Access** in hPanel and enable SSH. Log in using your credentials.
2. Navigate to your project folder:
   ```bash
   cd public_html
   ```
3. Install production dependencies for the backend:
   ```bash
   cd backend
   npm install --production
   ```
4. Create your production `.env` file inside the `backend/` directory:
   ```bash
   nano .env
   ```
   Paste the configuration template from section 3, replacing the details with your actual Hostinger database credentials and Brevo API key.
5. Generate the Prisma database client:
   ```bash
   npx prisma generate
   ```
6. Deploy the database migrations to your Hostinger MySQL database:
   ```bash
   npx prisma db push
   ```
7. Seed the initial admin account (admin credentials will print in the console):
   ```bash
   node prisma/seed.js
   ```

### Step 5: Configure Hostinger Node.js Application Manager
1. In hPanel, search for **Node.js** under the website dashboard.
2. Click **Create Application** and configure it with the following parameters:
   - **Node.js Version**: Select the latest LTS version (Node 20+).
   - **Application Root**: Set this to `backend` (relative to `public_html/`).
   - **Application URL**: Select your target domain (e.g., `https://empowerjhang.org`).
   - **Startup File**: Set this to `dist/server.js`.
3. Save the configurations and click **Start/Restart**.

### Step 6: Enable SSL (HTTPS)
1. Go to **Security** -> **SSL** in hPanel.
2. Install a free Lifetime SSL certificate on your domain.
3. The Express backend will now automatically enforce secure connections and flag browser session cookies with the `secure: true` flag.

---

## 6. Automated Backup and Cron Job Setup

Keep your database and uploaded assets safe by scheduling automated jobs in the Hostinger hPanel.

### Setting up Cron Jobs in hPanel
1. Navigate to **Advanced** -> **Cron Jobs**.
2. Add the following jobs (adjust paths if your files are located outside `public_html/`):

#### 1. Daily Database Backup & OTP Cleanup (Runs at midnight)
- **Schedule**: `0 0 * * *`
- **Command**:
  ```bash
  cd /home/u123456789/domains/empowerjhang.org/public_html/backend && node -e "import('./src/services/otpService.js').then(s => s.otpService.clearExpiredOtps())"
  ```

#### 2. Weekly Uploads Archivist (Runs every Sunday at 2 AM)
- **Schedule**: `0 2 * * 0`
- **Command**:
  ```bash
  tar -czf /home/u123456789/domains/empowerjhang.org/public_html/backups/uploads-backup-$(date +\%F).tar.gz /home/u123456789/domains/empowerjhang.org/public_html/uploads
  ```

---

## 7. Troubleshooting & Verification Checklist

- **503 Service Unavailable / Passenger Errors**: Ensure the Startup File in the Node.js Manager is pointed to `dist/server.js` and that `npm install` completed successfully in the `backend/` directory. Check Node.js application logs inside the `backend/logs` directory.
- **CORS Violations**: Ensure `APP_URL` in `backend/.env` matches the exact URL loaded in the user's browser (including `https://` and without a trailing slash).
- **Prisma Client Missing**: Run `npx prisma generate` in the `backend/` directory over SSH, then restart the Node.js application.
