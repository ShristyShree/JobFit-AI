import { Ic } from './Icons';

// ── Score Ring ────────────────────────────────────────────────────────────────
export const ScoreRing = ({ score, size = 108, color = '#E85528' }) => {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={size} height={size} style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+'18'} strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ textAlign:'center', zIndex:1 }}>
        <div style={{ fontFamily:'var(--ff-d)', fontWeight:800, fontSize:size*0.23, color, lineHeight:1 }}>{score}</div>
        <div className="mono" style={{ fontSize:10, color:'var(--ink3)', marginTop:2 }}>/100</div>
      </div>
    </div>
  );
};

// ── Progress Bar ──────────────────────────────────────────────────────────────
export const PBar = ({ label, value, color, delay = 0 }) => (
  <div>
    {label && (
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:13, color:'var(--ink2)' }}>{label}</span>
        <span className="mono" style={{ fontSize:11.5, color:'var(--ink3)' }}>{value}%</span>
      </div>
    )}
    <div className="pbar-track">
      <div className="pbar-fill" style={{ width:`${value}%`, '--w':`${value}%`, background:color, '--d':`${delay}s` }} />
    </div>
  </div>
);

// ── Toggle Switch ─────────────────────────────────────────────────────────────
export const Toggle = ({ on, onChange, label, sub }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:'var(--bg)', borderRadius:10 }}>
    <div>
      <div style={{ fontSize:13, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:11.5, color:'var(--ink3)', marginTop:2 }}>{sub}</div>}
    </div>
    <button
      style={{ width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', background:on?'var(--b)':'var(--bg3)', position:'relative', transition:'background 0.25s', flexShrink:0 }}
      onClick={() => onChange(!on)}
    >
      <div style={{ position:'absolute', top:3, left:on?21:3, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.20)', transition:'left 0.22s' }} />
    </button>
  </div>
);

// ── Select Wrapper ────────────────────────────────────────────────────────────
export const Sel = ({ value, onChange, options, placeholder }) => (
  <div style={{ position:'relative' }}>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o.id || o} value={o.id || o}>{o.label || o}</option>)}
    </select>
    <div style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
      <Ic n="chevron" s={14} c="var(--ink3)" />
    </div>
  </div>
);
