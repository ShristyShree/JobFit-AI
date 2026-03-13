import { useState } from 'react';
import { Ic } from './Icons';
import { ScoreRing, PBar } from './Atoms';
import { EXP_LEVELS, COMPANY_TYPES } from '../utils/constants';

// ── Tab nav ───────────────────────────────────────────────────────────────────
const TABS = [
  { id:'overview', label:'Overview',      icon:'cpu'      },
  { id:'skills',   label:'Skill Gap',     icon:'target'   },
  { id:'heatmap',  label:'Recruiter Eye', icon:'eye'      },
  { id:'risk',     label:'Risk Flags',    icon:'alert'    },
  { id:'career',   label:'Career Path',   icon:'trending' },
  { id:'improve',  label:'AI Rewrites',   icon:'edit'     },
];

export const Dashboard = ({ data, cfg, onReset }) => {
  const [tab, setTab] = useState('overview');
  const expLabel  = EXP_LEVELS.find(e => e.id === cfg.expId)?.label  || '';
  const compLabel = COMPANY_TYPES.find(c => c.id === cfg.companyId)?.label || '';

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 52px' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, gap:16, flexWrap:'wrap' }}>
        <div>
          <div className="lbl" style={{ marginBottom:4 }}>Intelligence Report</div>
          <h2 style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:22, marginBottom:8 }}>{data.parsed?.name || 'Your Resume'}</h2>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
            {cfg.role    && <span className="tag tag-b">💼 {expLabel} {cfg.role}</span>}
            {compLabel   && <span className="tag tag-n">🏢 {compLabel}</span>}
            {cfg.techStack?.length > 0 && <span className="tag tag-p">⚙️ {cfg.techStack.length} skills targeted</span>}
          </div>
        </div>
        <button className="btn-ghost" onClick={onReset}><Ic n="upload" s={13} /> New Analysis</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:5, overflowX:'auto', marginBottom:24, paddingBottom:2 }}>
        {TABS.map(t => (
          <div key={t.id} className={`nav-pill${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
            <Ic n={t.icon} s={14} /> {t.label}
          </div>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab data={data} />}
      {tab === 'skills'   && <SkillsTab   data={data} />}
      {tab === 'heatmap'  && <HeatmapTab  data={data} />}
      {tab === 'risk'     && <RiskTab     data={data} />}
      {tab === 'career'   && <CareerTab   data={data} cfg={cfg} />}
      {tab === 'improve'  && <ImproveTab  data={data} />}
    </div>
  );
};

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
const OverviewTab = ({ data }) => {
  const sc  = data.ats?.score || 0;
  const col = sc >= 70 ? 'var(--g)' : sc >= 45 ? 'var(--y)' : 'var(--r)';
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18 }}>
      <div className="card fu" style={{ padding:26 }}>
        <div className="lbl" style={{ marginBottom:16 }}>ATS Compatibility Score</div>
        <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:24 }}>
          <ScoreRing score={sc} size={108} color={col} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:19, color:col, marginBottom:6 }}>{sc >= 70 ? 'Strong Match' : sc >= 45 ? 'Moderate Match' : 'Needs Work'}</div>
            <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6, marginBottom:10 }}>{data.ats?.summary}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <span className="tag tag-g">{data.ats?.keyword_coverage}% keywords</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {(data.ats?.sub_scores || []).map((s, i) => <PBar key={i} label={s.label} value={s.value} color={s.color} delay={i * 0.1} />)}
        </div>
      </div>

      <div className="card fu" style={{ padding:26, animationDelay:'0.07s' }}>
        <div className="lbl" style={{ marginBottom:16 }}>Resume Sections</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {(data.parsed?.sections || []).map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 13px', background:'var(--bg)', borderRadius:9 }}>
              <div style={{ width:7, height:7, borderRadius:2, flexShrink:0, background:s.found?'var(--g)':'var(--bg3)' }} />
              <span style={{ flex:1, fontSize:13.5, fontWeight:500 }}>{s.name}</span>
              <span className={`tag ${s.found?'tag-g':'tag-r'}`}>{s.found ? 'Found' : 'Missing'}</span>
              {s.quality && <span className={`tag ${s.quality==='strong'?'tag-g':s.quality==='weak'?'tag-r':'tag-y'}`}>{s.quality}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card fu" style={{ padding:26, animationDelay:'0.12s' }}>
        <div className="lbl" style={{ marginBottom:16 }}>Key Signals</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {(data.signals || []).map((sig, i) => (
            <div key={i} style={{ padding:'14px 16px', background:'var(--bg)', borderRadius:11 }}>
              <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:24, color:sig.color || 'var(--ink)' }}>{sig.value}</div>
              <div className="lbl" style={{ marginTop:4 }}>{sig.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── SKILLS ────────────────────────────────────────────────────────────────────
const SkillsTab = ({ data }) => {
  const { skills } = data;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
      <div className="card fu" style={{ padding:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
          <div style={{ width:26, height:26, background:'rgba(34,191,130,0.14)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="check" s={13} c="var(--g)" /></div>
          <div><div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:15 }}>Matched Skills</div><div className="lbl">{skills?.matched?.length || 0} found in your resume</div></div>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {(skills?.matched || []).map((sk, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'rgba(34,191,130,0.08)', border:'1px solid rgba(34,191,130,0.22)', borderRadius:99 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--g)' }} />
              <span className="mono" style={{ fontSize:12, color:'#137a52' }}>{sk.name}</span>
              {sk.level && <span style={{ fontSize:10, color:'var(--ink3)' }}>· {sk.level}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card fu" style={{ padding:22, animationDelay:'0.07s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
          <div style={{ width:26, height:26, background:'rgba(232,85,40,0.10)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="x" s={13} c="var(--r)" /></div>
          <div><div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:15 }}>Skill Gaps</div><div className="lbl">{skills?.missing?.length || 0} missing from your profile</div></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {(skills?.missing || []).map((sk, i) => (
            <div key={i} style={{ padding:'11px 14px', background:'rgba(232,85,40,0.04)', border:'1px solid rgba(232,85,40,0.12)', borderRadius:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span className="mono" style={{ fontSize:12.5, fontWeight:500 }}>{sk.name}</span>
                <span className={`tag ${sk.priority==='high'?'tag-r':sk.priority==='medium'?'tag-y':'tag-n'}`}>{sk.priority}</span>
              </div>
              {sk.suggestion && <div style={{ fontSize:12, color:'var(--ink2)', lineHeight:1.55 }}>💡 {sk.suggestion}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card fu" style={{ padding:22, gridColumn:'span 2', animationDelay:'0.12s' }}>
        <div className="lbl" style={{ marginBottom:18 }}>Domain Coverage</div>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {(skills?.domains || []).map((d, i) => <PBar key={i} label={d.name} value={d.coverage} color={d.color} delay={i * 0.08} />)}
        </div>
      </div>
    </div>
  );
};

// ── HEATMAP ───────────────────────────────────────────────────────────────────
const HeatmapTab = ({ data }) => {
  const { heatmap } = data;
  const BG  = { high:'rgba(232,85,40,0.45)',  medium:'rgba(232,168,32,0.26)', low:'rgba(0,0,0,0.04)', none:'transparent' };
  const BDR = { high:'rgba(232,85,40,0.26)',  medium:'rgba(232,168,32,0.20)', low:'rgba(0,0,0,0.06)', none:'var(--border)' };
  const BAD = { high:'🔥 Hot spot', medium:'👀 Noticed', low:'💤 Skimmed', none:'— Ignored' };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="card fu" style={{ padding:24 }}>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18, marginBottom:4 }}>6-Second Recruiter Scan Simulation</div>
          <div style={{ fontSize:13, color:'var(--ink2)' }}>Where a recruiter's attention lands during the first pass</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {(heatmap?.sections || []).map((s, i) => (
            <div key={i} style={{ padding:'13px 16px', borderRadius:10, background:BG[s.attention]||'transparent', border:`1px solid ${BDR[s.attention]||'var(--border)'}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:'var(--ink2)' }}>{s.feedback}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:16 }}>
                  <div style={{ fontSize:12.5, fontWeight:600 }}>{BAD[s.attention]}</div>
                  <div className="mono" style={{ fontSize:10.5, color:'var(--ink3)', marginTop:2 }}>{s.seconds}s avg</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card fu" style={{ padding:22, animationDelay:'0.1s' }}>
        <div className="lbl" style={{ marginBottom:14 }}>Positioning Tips</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:10 }}>
          {(heatmap?.tips || []).map((tip, i) => (
            <div key={i} style={{ padding:'13px 15px', background:'var(--bg)', borderRadius:10, display:'flex', gap:11 }}>
              <div style={{ width:26, height:26, background:'var(--b)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13 }}>{['💡','📍','✨','🎯'][i % 4]}</div>
              <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.55 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── RISK ──────────────────────────────────────────────────────────────────────
const RiskTab = ({ data }) => {
  const { risks } = data;
  const RC = { high:'var(--r)', medium:'var(--y)', low:'var(--g)' };
  const RT = { high:'tag-r',   medium:'tag-y',    low:'tag-g'    };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {['high','medium','low'].map(lv => (
          <div key={lv} className="card fu" style={{ padding:'18px 20px', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:36, color:RC[lv] }}>{(risks?.claims || []).filter(c => c.level === lv).length}</div>
            <div style={{ fontSize:12.5, color:'var(--ink2)', marginTop:4, textTransform:'capitalize' }}>{lv} Risk</div>
          </div>
        ))}
      </div>
      <div className="card fu" style={{ padding:22, animationDelay:'0.08s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{ width:32, height:32, background:'rgba(232,85,40,0.10)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="alert" s={16} c="var(--r)" /></div>
          <div>
            <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:17 }}>Interview Risk Flags</div>
            <div style={{ fontSize:13, color:'var(--ink2)' }}>Claims that may be challenged in interviews</div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {(risks?.claims || []).map((risk, i) => (
            <div key={i} className="fu" style={{ animationDelay:`${i * 0.06}s`, background:'var(--bg)', borderRadius:12, padding:'13px 16px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:7, height:7, borderRadius:2, background:RC[risk.level]||'var(--ink3)', marginTop:5, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                    <span className="mono" style={{ fontSize:13, fontWeight:500 }}>"{risk.claim}"</span>
                    <span className={`tag ${RT[risk.level]||'tag-n'}`}>{risk.level} risk</span>
                  </div>
                  <div style={{ fontSize:13, color:'var(--ink2)', marginBottom:8 }}>{risk.reason}</div>
                  <div style={{ fontSize:12.5, color:'var(--b)', background:'rgba(42,120,232,0.07)', padding:'8px 12px', borderRadius:8 }}>💡 {risk.advice}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:24, color:RC[risk.level] }}>{risk.score}</div>
                  <div className="lbl">RISK</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── CAREER ────────────────────────────────────────────────────────────────────
const CareerTab = ({ data }) => {
  const { career } = data;
  const COLS = ['var(--r)', 'var(--b)', 'var(--g)', 'var(--y)'];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="card fu" style={{ padding:26 }}>
        <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18, marginBottom:4 }}>Career Trajectory Prediction</div>
        <div style={{ fontSize:13, color:'var(--ink2)', marginBottom:24 }}>Based on your current skills and target role requirements</div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <div style={{ width:38, height:38, background:'var(--ink)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic n="star" s={16} c="#fff" /></div>
          <div><div className="lbl" style={{ marginBottom:2 }}>CURRENT ROLE DETECTED</div><div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:16 }}>{career?.current_role}</div></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {(career?.paths || []).map((p, i) => (
            <div key={i} className="fu" style={{ animationDelay:`${i * 0.09}s`, position:'relative', display:'flex', alignItems:'center', gap:14, padding:'15px 18px', background:'var(--bg)', borderRadius:12, overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:`${COLS[i]}0C`, width:`${p.probability}%`, transition:'width 1.2s ease' }} />
              <div style={{ position:'relative', width:34, height:34, background:COLS[i], borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:17 }}>{p.emoji}</div>
              <div style={{ flex:1, position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:14 }}>{p.title}</span>
                  <span className="tag tag-n">{p.timeline}</span>
                </div>
                <div style={{ fontSize:12.5, color:'var(--ink2)', marginBottom:7 }}>{p.description}</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {(p.skills_needed || []).map((sk, j) => <span key={j} className="tag tag-b">{sk}</span>)}
                </div>
              </div>
              <div style={{ position:'relative', textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:28, color:COLS[i], lineHeight:1 }}>{p.probability}%</div>
                <div className="lbl" style={{ marginTop:2 }}>MATCH</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card fu" style={{ padding:22, animationDelay:'0.18s' }}>
        <div className="lbl" style={{ marginBottom:14 }}>Recommended Next Steps</div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {(career?.next_steps || []).map((step, i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'11px 15px', background:'var(--bg)', borderRadius:10 }}>
              <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:16, color:'var(--ink3)', width:24 }}>0{i + 1}</div>
              <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── AI REWRITES ────────────────────────────────────────────────────────────────
const ImproveTab = ({ data }) => {
  const { improvements } = data;
  return (
    <div className="card fu" style={{ padding:26 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:34, height:34, background:'rgba(42,120,232,0.10)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="sparkle" s={17} c="var(--b)" /></div>
        <div>
          <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:18 }}>AI Bullet Point Rewrites</div>
          <div style={{ fontSize:13, color:'var(--ink2)' }}>Weak statements transformed into impactful achievements</div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
        {(improvements || []).map((imp, i) => (
          <div key={i} className="fu" style={{ animationDelay:`${i * 0.07}s` }}>
            {imp.section && <div className="lbl" style={{ marginBottom:10, color:'var(--b)' }}>{imp.section}</div>}
            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                <span className="tag tag-r">Before</span>
                <span className="mono" style={{ fontSize:10.5, color:'var(--ink3)' }}>impact: {imp.before_score}/10</span>
              </div>
              <div style={{ padding:'11px 15px', background:'rgba(232,85,40,0.04)', border:'1px solid rgba(232,85,40,0.13)', borderRadius:9, fontSize:13.5, color:'var(--ink2)', lineHeight:1.65 }}>{imp.before}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'var(--b)' }}><Ic n="arrow" s={14} c="var(--b)" /> AI REWRITE</div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                <span className="tag tag-g">After</span>
                <span className="mono" style={{ fontSize:10.5, color:'var(--ink3)' }}>impact: {imp.after_score}/10</span>
              </div>
              <div style={{ padding:'11px 15px', background:'rgba(34,191,130,0.06)', border:'1px solid rgba(34,191,130,0.22)', borderRadius:9, fontSize:13.5, color:'var(--ink)', lineHeight:1.65, fontWeight:500 }}>{imp.after}</div>
            </div>
            {imp.explanation && (
              <div style={{ marginTop:9, fontSize:12.5, color:'var(--ink2)', padding:'8px 12px', background:'var(--bg)', borderRadius:8 }}>
                <span style={{ fontWeight:600 }}>Why it works: </span>{imp.explanation}
              </div>
            )}
            {i < improvements.length - 1 && <div style={{ height:1, background:'var(--border)', marginTop:28 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};
