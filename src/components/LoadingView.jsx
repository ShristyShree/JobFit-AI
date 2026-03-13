import { Ic } from './Icons';

const STAGES = [
  'Parsing resume structure and sections…',
  'Extracting skills, titles, and experience…',
  'Matching against target role profile…',
  'Running deep intelligence analysis…',
  'Predicting career trajectory…',
  'Generating AI rewrite suggestions…',
];

export const LoadingView = ({ stage }) => (
  <div style={{ maxWidth:500, margin:'80px auto 0', padding:'0 24px', textAlign:'center' }}>
    <div style={{ animation:'float 2.2s ease-in-out infinite', marginBottom:28 }}>
      <div style={{ width:68, height:68, margin:'0 auto', background:'linear-gradient(135deg,var(--r),var(--b))', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', animation:'pulse 2s infinite' }}>
        <Ic n="brain" s={30} c="#fff" />
      </div>
    </div>
    <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:22, marginBottom:8 }}>Analyzing Your Resume</div>
    <div className="mono" style={{ fontSize:13, color:'var(--r)', marginBottom:32 }}>
      {STAGES[Math.min(stage, STAGES.length - 1)]}
    </div>
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {STAGES.map((s, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 14px', background:i <= stage ? 'var(--surface)' : 'transparent', border:`1px solid ${i <= stage ? 'var(--border)' : 'transparent'}`, borderRadius:10, transition:'all 0.4s' }}>
          <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:i < stage ? 'var(--g)' : i === stage ? 'var(--r)' : 'var(--bg2)', transition:'all 0.4s' }}>
            {i < stage  ? <Ic n="check"  s={11} c="#fff" /> : null}
            {i === stage ? <Ic n="loader" s={11} c="#fff" spin /> : null}
          </div>
          <span style={{ fontSize:13, textAlign:'left', color:i < stage ? 'var(--ink2)' : i === stage ? 'var(--ink)' : 'var(--ink3)', fontWeight:i === stage ? 600 : 400 }}>{s}</span>
        </div>
      ))}
    </div>
  </div>
);
