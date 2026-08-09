# ProspectPilot — Netlify Deployment Guide & Secrets Configuration

This guide provides step-by-step instructions for deploying **ProspectPilot** to Netlify, including the exact environment variables/secrets you need to configure in the Netlify dashboard.

---

## 1. Secrets & Environment Variables Checklist

Before initiating the build on Netlify, gather these API keys and environment variables:

| Variable Name | Required / Optional | Description & Value |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Recommended** | Your Google Gemini API Key from Google AI Studio ([aistudio.google.com](https://aistudio.google.com/app/apikey)). |
| `GEOAPIFY_API_KEY` | **Optional** | Your Geoapify Places API key ([geoapify.com](https://www.geoapify.com/)). If left empty, ProspectPilot automatically uses realistic US business search fallbacks. |
| `APP_URL` | **Optional** | Your Netlify site domain (e.g., `https://prospectpilot.netlify.app`). |
| `NODE_VERSION` | **Recommended** | `20` (Ensures Node.js 20+ runtime environment on Netlify Functions). |

---

## 2. Step-by-Step Instructions: How to Set Up Secrets in Netlify

### Step A: Deploy Your Repository
1. Log into your **Netlify Dashboard** ([app.netlify.com](https://app.netlify.com/)).
2. Click **Add new site** -> **Import an existing project**.
3. Select your Git provider (GitHub / GitLab / Bitbucket) and authorize repository access.
4. Select the **ProspectPilot** repository.

### Step B: Configure Build Settings
Netlify will automatically detect the settings from `netlify.toml`, but verify these fields:
* **Build command**: `npm run build`
* **Publish directory**: `dist`
* **Functions directory**: `netlify/functions`

### Step C: Paste Environment Variables / Secrets
1. In Netlify, navigate to **Site configuration** -> **Environment variables** (or click **Environment variables** during site creation).
2. Click **Add a variable** (or **Import from .env**).
3. Add the following keys and values:

```env
# 1. Gemini API Key (For AI CRO Audits & Zero-Flattery Cold Emails)
GEMINI_API_KEY=AIzaSy...

# 2. Geoapify API Key (For live US business place scraping)
GEOAPIFY_API_KEY=your_geoapify_key_here

# 3. Node.js Version
NODE_VERSION=20
```

4. Click **Save** (or **Deploy site**).

---

## 3. How Netlify Serves the App

* **Frontend SPA**: React 19 + Vite compiled static assets served from the `/dist` directory.
* **Serverless Backend API**: Express endpoints (`/api/leads/search`, `/api/leads/extract-emails`, `/api/leads/audit-and-draft`) are automatically bundled via esbuild and routed through `netlify/functions/server.ts` using `serverless-http`.
* **Microlink Screenshots**: Web screenshots are generated dynamically with 10-second wait delays so site scripts load completely before capture.

---

## 4. Verification & Testing

Once deployed:
1. Open your Netlify site URL (e.g. `https://your-app.netlify.app`).
2. Verify the API status pill in the top header (shows **Gemini Active** and **Geoapify Status**).
3. Run a test search (e.g., *Dentists in Austin, TX*) to test full scraping, contact extraction, and Gemini email copywriting.

---

## 5. Troubleshooting & FAQ

* **What if `GEMINI_API_KEY` hits a rate limit?**
  ProspectPilot includes built-in model failover (`gemini-2.5-flash` -> `gemini-3.6-flash` -> `gemini-2.0-flash`) and an instant local CRO audit engine fallback so campaigns never crash or stall.
* **Function Timeouts**:
  Netlify Functions have a default 10-second execution limit on free tiers. ProspectPilot handles audit calls sequentially to ensure individual function executions complete quickly within limit.
