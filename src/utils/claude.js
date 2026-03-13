// ─────────────────────────────────────────────────────────────────────────────
// claude.js  —  All AI calls (using Google Gemini API)
// API key is read from .env:  VITE_GEMINI_API_KEY=AIzaSy-...
// Get a free key at: https://aistudio.google.com/apikey
// ─────────────────────────────────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const callGemini = async (prompt) => {
  if (!API_KEY || API_KEY.includes('YOUR_KEY')) {
    throw new Error('Please set your VITE_GEMINI_API_KEY in the .env file.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 400) throw new Error('Invalid API key. Check your .env file.');
    if (res.status === 429) throw new Error('Rate limited. Wait a moment and try again.');
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// ── Generate a realistic job description from role config ──────────────────
export const generateJobProfile = async ({ role, expId, techStack, companyId }) => {
  const EXP_LABELS  = { intern:'Internship', entry:'Entry Level', mid:'Mid Level', senior:'Senior', staff:'Staff / Lead' };
  const COMP_LABELS = { faang:'FAANG / Big Tech', startup:'Startup', product:'Product Company', service:'Service / IT', unicorn:'Unicorn / Scale-up' };
  const expLabel  = EXP_LABELS[expId]      || expId;
  const compLabel = COMP_LABELS[companyId] || companyId;

  return callGemini(`You are a senior technical recruiter. Write a concise realistic job description for:

Role: ${expLabel} ${role}
Company Type: ${compLabel}
Required Stack: ${techStack.join(', ')}

Format:
## About the Role
2-3 sentences.

## Requirements
6-8 bullet points (weave in all listed technologies naturally).

## Responsibilities
5 bullet points.

## Nice to Have
3 items.

Be specific. Use industry-standard language. Return only the job description, no preamble.`);
};

// ── Main resume analysis ───────────────────────────────────────────────────
export const runAnalysis = async (resumeText, jobProfile, cfg) => {
  const EXP_LABELS  = { intern:'Internship', entry:'Entry Level', mid:'Mid Level', senior:'Senior', staff:'Staff / Lead' };
  const COMP_LABELS = { faang:'FAANG / Big Tech', startup:'Startup', product:'Product Company', service:'Service / IT', unicorn:'Unicorn / Scale-up' };
  const expLabel  = EXP_LABELS[cfg.expId]      || '';
  const compLabel = COMP_LABELS[cfg.companyId] || '';

  const raw = await callGemini(`You are an expert AI career intelligence system. Analyze this resume and return ONLY valid JSON. No markdown, no backticks, no explanation — just the raw JSON object.

RESUME:
${resumeText}

TARGET ROLE PROFILE:
${jobProfile}

CONTEXT:
Role: ${cfg.role} | Level: ${expLabel} | Stack: ${cfg.techStack.join(', ')} | Company: ${compLabel}

Analyze the ACTUAL resume content. Use real data from the resume — do not invent anything.

Return exactly this JSON (raw, no markdown):
{
  "parsed": {
    "name": "candidate name",
    "current_title": "most recent job title",
    "years_exp": "X years",
    "sections": [
      {"name":"Contact Info","found":true,"quality":"strong"},
      {"name":"Summary/Objective","found":false,"quality":null},
      {"name":"Experience","found":true,"quality":"moderate"},
      {"name":"Education","found":true,"quality":"strong"},
      {"name":"Skills","found":true,"quality":"weak"},
      {"name":"Projects","found":false,"quality":null},
      {"name":"Certifications","found":false,"quality":null}
    ]
  },
  "ats": {
    "score": 58,
    "summary": "One sentence assessment.",
    "keyword_coverage": 52,
    "sub_scores": [
      {"label":"Keyword Density","value":55,"color":"#E85528"},
      {"label":"Format & Structure","value":75,"color":"#2A78E8"},
      {"label":"Quantified Impact","value":25,"color":"#22BF82"},
      {"label":"Tech Stack Match","value":60,"color":"#E8A820"}
    ]
  },
  "signals": [
    {"label":"Years Experience","value":"4 yrs","color":"#2A78E8"},
    {"label":"Skills Matched","value":"6 / 12","color":"#22BF82"},
    {"label":"Risk Flags","value":"3","color":"#E85528"},
    {"label":"Impact Score","value":"3 / 10","color":"#E8A820"}
  ],
  "skills": {
    "matched": [
      {"name":"Python","level":"intermediate"},
      {"name":"Django","level":"intermediate"}
    ],
    "missing": [
      {"name":"Kubernetes","priority":"high","suggestion":"Take the CKA course and build a K8s project."},
      {"name":"Redis","priority":"medium","suggestion":"Add Redis caching to an existing project."}
    ],
    "domains": [
      {"name":"Backend / APIs","coverage":68,"color":"#E85528"},
      {"name":"Frontend","coverage":42,"color":"#2A78E8"},
      {"name":"Cloud & DevOps","coverage":35,"color":"#22BF82"},
      {"name":"Databases","coverage":55,"color":"#E8A820"},
      {"name":"System Design","coverage":25,"color":"#8B5CF6"}
    ]
  },
  "heatmap": {
    "sections": [
      {"name":"Name & Contact","attention":"high","seconds":1.8,"feedback":"Clean and easy to find."},
      {"name":"Work Experience","attention":"high","seconds":2.2,"feedback":"Bullets lack metrics and outcomes."},
      {"name":"Skills Section","attention":"medium","seconds":0.8,"feedback":"No proficiency levels shown."},
      {"name":"Education","attention":"medium","seconds":0.5,"feedback":"Present but lacks coursework detail."},
      {"name":"Projects","attention":"low","seconds":0.3,"feedback":"Too brief, no impact shown."},
      {"name":"Summary","attention":"none","seconds":0,"feedback":"Missing — add one at the top."}
    ],
    "tips": [
      "Add a 2-line Professional Summary at the very top.",
      "Add at least one metric per bullet (%, $, users, time saved).",
      "Name specific technologies inline in each experience bullet.",
      "Bold key terms so they stand out in a quick scan."
    ]
  },
  "risks": {
    "claims": [
      {"claim":"actual quote from resume","level":"high","score":85,"reason":"Why this is a risk.","advice":"How to fix it."},
      {"claim":"another claim","level":"medium","score":55,"reason":"Why this may be challenged.","advice":"How to strengthen it."}
    ]
  },
  "career": {
    "current_role": "Detected Current Role",
    "paths": [
      {"title":"Senior Backend Engineer","emoji":"⚡","probability":62,"timeline":"12-18 months","description":"Natural next step with system design depth.","skills_needed":["Kubernetes","Redis","System Design"]},
      {"title":"Full Stack Engineer","emoji":"🌐","probability":22,"timeline":"6-12 months","description":"Leverage frontend experience and add TypeScript.","skills_needed":["TypeScript","Next.js","GraphQL"]},
      {"title":"DevOps Engineer","emoji":"🚀","probability":16,"timeline":"18-24 months","description":"Build on cloud experience with Kubernetes and Terraform.","skills_needed":["Kubernetes","Terraform","CI/CD"]}
    ],
    "next_steps": [
      "Rewrite every bullet to include a quantified metric.",
      "Get AWS Solutions Architect Associate certified.",
      "Build and publish a Kubernetes project on GitHub.",
      "Add a Professional Summary section targeting this role.",
      "Practice 2 system design questions per week."
    ]
  },
  "improvements": [
    {
      "section":"Experience",
      "before":"actual weak bullet copied from resume",
      "before_score":2,
      "after":"Rewritten strong version with metrics, scale, and tech specifics",
      "after_score":9,
      "explanation":"Why the rewrite is stronger."
    },
    {
      "section":"Experience",
      "before":"another weak bullet from resume",
      "before_score":2,
      "after":"Rewritten with concrete impact and numbers",
      "after_score":8,
      "explanation":"Added measurable outcome and specific tools."
    }
  ]
}`);

  // Strip markdown code fences if Gemini adds them
  const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(cleaned);
};
