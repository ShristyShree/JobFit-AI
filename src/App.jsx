import { useState, useCallback } from 'react';
import './index.css';
import { Ic } from './components/Icons';
import { UploadPage } from './components/UploadPage';
import { LoadingView } from './components/LoadingView';
import { Dashboard } from './components/Dashboard';
import { runAnalysis } from './utils/claude';

// ─────────────────────────────────────────────────────────────────────────────
// App.jsx
//
// To run this project:
//   1. Copy .env.example → .env
//   2. Open .env and paste your Anthropic API key
//   3. Run:  npm install  then  npm run dev
//
// Get a free API key at: https://console.anthropic.com
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [view,      setView]      = useState('upload');   // upload | loading | dashboard
  const [loadStage, setLoadStage] = useState(0);
  const [result,    setResult]    = useState(null);
  const [cfg,       setCfg]       = useState({});
  const [error,     setError]     = useState(null);

  // Check API key is configured
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const keyMissing = !apiKey || apiKey.includes('AIzaSyDK8UzCip1d8V8A2vmIsiPmwKkn7xm0bgs');

  const handleAnalyze = useCallback(async (resumeText, jobProfile, config) => {
    setView('loading');
    setLoadStage(0);
    setCfg(config);
    setError(null);

    const timer = setInterval(() => setLoadStage(p => Math.min(p + 1, 5)), 900);

    try {
      const data = await runAnalysis(resumeText, jobProfile, config);
      clearInterval(timer);
      setResult(data);
      setView('dashboard');
    } catch (e) {
      clearInterval(timer);
      setError(e.message || 'Analysis failed. Please try again.');
      setView('upload');
    }
  }, []);

  return (
    <>
      {/* Ambient background orbs */}
      <div className="orb" style={{ width:520, height:520, background:'var(--r)', top:-220, right:-120 }} />
      <div className="orb" style={{ width:440, height:440, background:'var(--b)', bottom:-160, left:-120 }} />

      {/* ── Header ── */}
      <header style={{ position:'sticky', top:0, zIndex:100, height:58, background:'rgba(242,239,233,0.90)', backdropFilter:'blur(18px)', borderBottom:'1px solid var(--border)', padding:'0 26px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:31, height:31, borderRadius:9, background:'linear-gradient(135deg,var(--r),var(--b))', display:'flex', alignItems:'center', justifyContent:'center', animation:'float 3s ease-in-out infinite' }}>
            <Ic n="brain" s={15} c="#fff" />
          </div>
          <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:17, letterSpacing:'-0.02em' }}>
            JobFit<span style={{ color:'var(--r)' }}></span>
          </div>
          <span className="mono" style={{ fontSize:9.5, background:'var(--r)', color:'#fff', padding:'2px 7px', borderRadius:4, letterSpacing:'0.09em' }}></span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color: keyMissing ? 'var(--r)' : 'var(--ink3)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background: keyMissing ? 'var(--r)' : 'var(--g)', animation: keyMissing ? 'none' : 'pulse 2s infinite' }} />
            {keyMissing ? 'API key not set' : 'AI Engine Active'}
          </div>
          {view === 'dashboard' && (
            <button className="btn-ghost" onClick={() => setView('upload')} style={{ fontSize:12.5 }}>
              <Ic n="upload" s={13} /> New Analysis
            </button>
          )}
        </div>
      </header>

      {/* ── API Key Warning Banner ── */}
      {keyMissing && (
        <div style={{ background:'rgba(232,85,40,0.08)', borderBottom:'1px solid rgba(232,85,40,0.18)', padding:'10px 26px', display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
          <Ic n="key" s={15} c="var(--r)" />
          <span style={{ color:'var(--ink2)' }}>
            <strong style={{ color:'var(--r)' }}>API key not configured.</strong>
            {' '}Open <code style={{ background:'var(--bg2)', padding:'1px 6px', borderRadius:4, fontSize:12 }}>.env</code> and set your <code style={{ background:'var(--bg2)', padding:'1px 6px', borderRadius:4, fontSize:12 }}>VITE_GEMINI_API_KEY</code>.
            {' '}Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color:'var(--b)', textDecoration:'underline' }}>aistudio.google.com/apikey</a>
          </span>
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && (
        <div style={{ maxWidth:640, margin:'16px auto 0', padding:'12px 18px', background:'rgba(220,50,50,0.08)', border:'1px solid rgba(220,50,50,0.20)', borderRadius:10, fontSize:13.5, color:'#b83010', textAlign:'center' }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ position:'relative', zIndex:1, minHeight:'calc(100vh - 58px)' }}>
        {view === 'upload'    && <UploadPage onAnalyze={handleAnalyze} />}
        {view === 'loading'   && <LoadingView stage={loadStage} />}
        {view === 'dashboard' && result && <Dashboard data={result} cfg={cfg} onReset={() => setView('upload')} />}
      </main>

      
    </>
  );
}
