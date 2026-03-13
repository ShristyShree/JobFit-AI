import { useState } from 'react';
import { TECH_GROUPS } from '../utils/constants';

export const TechChips = ({ selected, onChange }) => {
  const [grp, setGrp] = useState('Languages');
  const toggle = t => onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);

  return (
    <div>
      {/* Group tabs */}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:9 }}>
        {Object.keys(TECH_GROUPS).map(g => (
          <button key={g} className={`tab-pill${grp === g ? ' on' : ''}`} onClick={() => setGrp(g)}>{g}</button>
        ))}
      </div>

      {/* Chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:7, minHeight:38 }}>
        {TECH_GROUPS[grp].map(t => (
          <button key={t} className={`chip${selected.includes(t) ? ' on' : ''}`} onClick={() => toggle(t)}>
            {selected.includes(t) ? '✓ ' : ''}{t}
          </button>
        ))}
      </div>

      {/* Selection summary */}
      {selected.length > 0 && (
        <div style={{ marginTop:9, padding:'8px 13px', background:'rgba(42,120,232,0.06)', border:'1px solid rgba(42,120,232,0.14)', borderRadius:9, display:'flex', gap:8, alignItems:'flex-start' }}>
          <span className="lbl" style={{ color:'var(--b)', paddingTop:1, flexShrink:0 }}>SELECTED:</span>
          <span style={{ fontSize:12, color:'var(--ink2)', lineHeight:1.6, flex:1 }}>{selected.join(' · ')}</span>
          <button onClick={() => onChange([])} style={{ background:'none', border:'none', color:'var(--ink3)', fontSize:11, cursor:'pointer', textDecoration:'underline', flexShrink:0 }}>clear</button>
        </div>
      )}
    </div>
  );
};
