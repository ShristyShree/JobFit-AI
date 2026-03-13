# ResumeIQ — AI Career Intelligence

An AI-powered resume analyzer built with React + Vite. No job description pasting required — just configure your target role and let AI do the rest.

## Features

- **ATS Score** — keyword density, structure, impact scoring
- **Skill Gap Analysis** — matched vs missing skills with suggestions
- **Recruiter Eye Simulation** — 6-second attention heatmap
- **Interview Risk Flags** — claims that may be challenged
- **Career Path Prediction** — probability-weighted trajectory
- **AI Bullet Rewrites** — before/after with impact scores

## Quick Start

### 1. Get your API key
Go to [console.anthropic.com](https://console.anthropic.com), sign up (free), and create an API key.

### 2. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/resume-iq.git
cd resume-iq
npm install
```

### 3. Set your API key
```bash
cp .env.example .env
```
Open `.env` and replace the placeholder:
```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
```

### 4. Run
```bash
npm run dev
```
Visit `http://localhost:5173`

---

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

When prompted, add your environment variable:
- Key: `VITE_ANTHROPIC_API_KEY`
- Value: your `sk-ant-...` key

Or set it in the Vercel dashboard under **Settings → Environment Variables**.

---

## Project Structure

```
resume-iq/
├── .env                  ← YOUR API KEY GOES HERE (never commit this)
├── .env.example          ← template (safe to commit)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx           ← root component + routing
    ├── index.css         ← all global styles + CSS variables
    ├── main.jsx          ← React entry point
    ├── components/
    │   ├── Atoms.jsx         ← ScoreRing, PBar, Toggle, Sel
    │   ├── Dashboard.jsx     ← all 6 analysis tabs
    │   ├── Icons.jsx         ← SVG icon system
    │   ├── LoadingView.jsx   ← analysis progress screen
    │   ├── ProfilePreview.jsx← AI job description preview
    │   ├── TechChips.jsx     ← multi-select tech stack chips
    │   └── UploadPage.jsx    ← resume upload + role config
    └── utils/
        ├── claude.js         ← all Anthropic API calls
        ├── constants.js      ← roles, exp levels, tech groups
        └── pdfExtract.js     ← PDF.js text extraction
```

## ⚠️ Important Notes

- **Never commit your `.env` file** — it's in `.gitignore` by default
- The app calls the Anthropic API directly from the browser (fine for personal use)
- For a public production app, move API calls to a backend (Vercel serverless functions work great)

## Tech Stack

- React 18 + Vite
- Mammoth.js (DOCX parsing)
- PDF.js via CDN (PDF parsing)
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- Pure CSS (no Tailwind, no UI library)
