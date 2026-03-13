# JobFit — AI Career Intelligence

An AI-powered resume analyzer built with React + Vite. No job description pasting required — just configure your target role and let AI do the rest.

## Features

- **ATS Score** — keyword density, structure, impact scoring
- **Skill Gap Analysis** — matched vs missing skills with suggestions
- **Recruiter Eye Simulation** — 6-second attention heatmap
- **Interview Risk Flags** — claims that may be challenged
- **Career Path Prediction** — probability-weighted trajectory
- **AI Bullet Rewrites** — before/after with impact scores

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


## Tech Stack

- React 18 + Vite
- Mammoth.js (DOCX parsing)
- PDF.js via CDN (PDF parsing)
- Google Gemini Api
- Pure CSS (no Tailwind, no UI library)
