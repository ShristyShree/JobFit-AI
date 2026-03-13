import { Ic } from './Icons';

export const ProfilePreview = ({ profile, loading, onRegen, canRegen }) => (
  <div style={{ border:'1px solid var(--border2)', borderRadius:10, overflow:'hidden' }}>
    <div style={{ padding:'9px 14px', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <Ic n="cpu" s={13} c="var(--ink3)" />
        <span className="lbl">AI-GENERATED JOB PROFILE</span>
        {profile && !loading && <span className="tag tag-g" style={{ fontSize:10 }}>Ready</span>}
      </div>
      {(profile || canRegen) && (
        <button className="btn-ghost" onClick={onRegen} disabled={loading || !canRegen} style={{ fontSize:11, padding:'4px 10px', gap:5 }}>
          <Ic n="refresh" s={11} /> Regenerate
        </button>
      )}
    </div>
    <div style={{ padding:'14px', minHeight:78 }}>
      {loading
        ? <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--ink3)', fontSize:13 }}>
            <Ic n="loader" s={16} c="var(--b)" spin /> Generating job description…
          </div>
        : profile
        ? <div style={{ fontSize:12.5, color:'var(--ink2)', lineHeight:1.75, maxHeight:200, overflowY:'auto', whiteSpace:'pre-wrap' }}>{profile}</div>
        : <div style={{ color:'var(--ink3)', fontSize:13, textAlign:'center', padding:'14px 0' }}>
            Fill in the fields above to auto-generate a job profile
          </div>
      }
    </div>
  </div>
);
