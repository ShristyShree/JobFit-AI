import { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import { Ic } from './Icons';
import { Sel, Toggle } from './Atoms';
import { TechChips } from './TechChips';
import { ProfilePreview } from './ProfilePreview';
import { extractPdfText } from '../utils/pdfExtract';
import { generateJobProfile } from '../utils/claude';
import { ROLES, EXP_LEVELS, COMPANY_TYPES, SAMPLE_RESUME } from '../utils/constants';

export const UploadPage = ({ onAnalyze }) => {
  // Resume state
  const [resumeText, setResumeText] = useState('');
  const [fileName,   setFileName]   = useState(null);
  const [fileStatus, setFileStatus] = useState(null); // null | loading | success | error
  const [fileError,  setFileError]  = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const fileRef = useRef();

  // Role config state
  const [role,       setRole]       = useState('');
  const [expId,      setExpId]      = useState('');
  const [techStack,  setTechStack]  = useState([]);
  const [companyId,  setCompanyId]  = useState('');
  const [autoGen,    setAutoGen]    = useState(true);
  const [profile,    setProfile]    = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [analyzing,  setAnalyzing]  = useState(false);
  const timerRef = useRef(null);

  const allFilled   = role && expId && techStack.length > 0 && companyId;
  const resumeReady = resumeText.trim().length > 80;
  const canRun      = resumeReady && allFilled && !analyzing && fileStatus !== 'loading';

  // Auto-generate debounce
  useEffect(() => {
    if (!autoGen || !allFilled) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doGenerate, 700);
    return () => clearTimeout(timerRef.current);
  }, [role, expId, techStack, companyId, autoGen]);

  const doGenerate = async () => {
    if (!allFilled) return;
    setGenLoading(true);
    try { setProfile(await generateJobProfile({ role, expId, techStack, companyId })); }
    catch { /* silent — analysis still works without it */ }
    finally { setGenLoading(false); }
  };

  // File handling
  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileStatus('loading');
    setFileError(null);
    setResumeText('');
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        const buf = await file.arrayBuffer();
        const txt = await extractPdfText(buf);
        if (!txt || txt.length < 50) throw new Error('PDF has no selectable text — it may be scanned. Please paste the text manually.');
        setResumeText(txt);
        setFileStatus('success');
      } else if (ext === 'docx') {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        const txt = result.value?.trim();
        if (!txt || txt.length < 50) throw new Error('Could not extract text from DOCX. Try pasting manually.');
        setResumeText(txt);
        setFileStatus('success');
      } else if (['txt', 'md'].includes(ext)) {
        const txt = await file.text();
        if (!txt.trim()) throw new Error('File appears to be empty.');
        setResumeText(txt);
        setFileStatus('success');
      } else {
        throw new Error(`".${ext}" not supported. Use PDF, DOCX, or TXT.`);
      }
    } catch (e) {
      setFileStatus('error');
      setFileError(e.message || 'Failed to read file.');
    }
  };

  const handleDrop = e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const jd = profile || `Target: ${EXP_LEVELS.find(e => e.id === expId)?.label} ${role} at ${COMPANY_TYPES.find(c => c.id === companyId)?.label}. Stack: ${techStack.join(', ')}.`;
    await onAnalyze(resumeText, jd, { role, expId, techStack, companyId });
    setAnalyzing(false);
  };

  const StatusDot = ({ done }) => (
    <span className={`tag ${done ? 'tag-g' : 'tag-n'}`}>
      {done ? <><Ic n="check" s={10} c="#137a52" /> Ready</> : 'Needed'}
    </span>
  );

  return (
    <div style={{ maxWidth:980, margin:'0 auto', padding:'36px 24px 52px' }}>

      {/* Hero */}
      <div className="fu" style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(232,85,40,0.09)', border:'1px solid rgba(232,85,40,0.20)', borderRadius:99, padding:'5px 14px', marginBottom:20 }}>
          <Ic n="sparkle" s={13} c="var(--r)" />
          <span className="mono" style={{ fontSize:10.5, color:'var(--r)', letterSpacing:'0.09em' }}>AI CAREER INTELLIGENCE</span>
        </div>
        <h1 style={{ fontFamily:'var(--ff-d)', fontSize:'clamp(28px,4.5vw,50px)', fontWeight:800, lineHeight:1.08, marginBottom:16 }}>
          From resume to insight<br />
          <span style={{ background:'linear-gradient(120deg,var(--r),var(--b))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>in under 60 seconds</span>
        </h1>
        <p style={{ fontSize:16, color:'var(--ink2)', maxWidth:460, margin:'0 auto', lineHeight:1.65 }}>
          Upload your resume, configure your target role — no job description pasting required.
          AI generates the profile and scores your fit instantly.
        </p>
      </div>

      {/* Step tracker */}
      <div className="fu" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:36, flexWrap:'wrap' }}>
        {[
          { n:1, label:'Upload Resume',  done:resumeReady },
          { n:2, label:'Configure Role', done:allFilled   },
          { n:3, label:'Run Analysis',   done:false       },
        ].map((s, i) => (
          <div key={s.n} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-d)', fontWeight:700, fontSize:12, background:s.done ? 'var(--g)' : i===2&&canRun ? 'var(--r)' : 'var(--bg3)', color:(s.done||(i===2&&canRun)) ? '#fff' : 'var(--ink3)', border:`2px solid ${s.done?'var(--g)':i===2&&canRun?'var(--r)':'var(--bg3)'}`, transition:'all 0.3s' }}>
                {s.done ? <Ic n="check" s={12} c="#fff" /> : s.n}
              </div>
              <span style={{ fontSize:13, fontWeight:s.done?600:400, color:s.done?'var(--g)':'var(--ink2)' }}>{s.label}</span>
            </div>
            {i < 2 && <div style={{ width:32, height:1, background:'var(--border2)', margin:'0 4px' }} />}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:26, alignItems:'start' }}>

        {/* LEFT: Resume */}
        <div className="card fu" style={{ animationDelay:'0.1s', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:resumeReady?'var(--g)':'var(--r)', transition:'background 0.3s' }}>
                {resumeReady ? <Ic n="check" s={14} c="#fff" /> : <Ic n="file" s={14} c="#fff" />}
              </div>
              <div>
                <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:15 }}>Your Resume</div>
                <div className="lbl">Step 1 — Upload or paste</div>
              </div>
            </div>
            <StatusDot done={resumeReady} />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            style={{ margin:'14px 16px 0', padding:'16px', cursor:'pointer', border:`2px dashed ${dragging?'var(--r)':fileStatus==='error'?'rgba(220,50,50,0.35)':fileStatus==='success'?'rgba(34,191,130,0.4)':'var(--border2)'}`, borderRadius:10, textAlign:'center', background:dragging?'rgba(232,85,40,0.03)':fileStatus==='success'?'rgba(34,191,130,0.03)':'transparent', transition:'all 0.2s' }}
          >
            {fileStatus === 'loading' && <><Ic n="loader" s={20} c="var(--r)" spin /><div style={{ fontSize:12, color:'var(--r)', marginTop:7 }}>Extracting text from {fileName}…</div></>}
            {fileStatus === 'success' && <><Ic n="check" s={20} c="var(--g)" /><div style={{ fontSize:12.5, color:'var(--g)', marginTop:6, fontWeight:600 }}>{fileName}</div><div style={{ fontSize:11, color:'var(--ink3)', marginTop:2 }}>{resumeText.trim().split(/\s+/).length} words extracted</div></>}
            {fileStatus === 'error'   && <><Ic n="alert" s={20} c="#b83010" /><div style={{ fontSize:12, color:'#b83010', marginTop:6 }}>{fileError}</div></>}
            {!fileStatus && <><Ic n="upload" s={22} c={dragging?'var(--r)':'var(--ink3)'} /><div style={{ fontSize:13, color:'var(--ink2)', marginTop:8, fontWeight:500 }}>Drop PDF, DOCX, or TXT here</div><div style={{ fontSize:11.5, color:'var(--ink3)', marginTop:3 }}>or click to browse</div></>}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
          </div>

          <div style={{ padding:'10px 16px 0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'4px 0 10px' }}>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
              <span style={{ fontSize:11.5, color:'var(--ink3)' }}>or paste text</span>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
            </div>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here…" rows={10} />
          </div>

          <div style={{ padding:'10px 16px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <button className="btn-ghost" style={{ fontSize:11.5 }}
              onClick={() => { setResumeText(SAMPLE_RESUME); setFileStatus('success'); setFileName('sample-resume.txt'); }}>
              <Ic n="file" s={12} /> Use sample resume
            </button>
            {resumeReady && <span className="mono" style={{ fontSize:11, color:'var(--ink3)' }}>{resumeText.trim().split(/\s+/).length}w</span>}
          </div>
        </div>

        {/* RIGHT: Target Role */}
        <div className="card fu" style={{ animationDelay:'0.14s', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:allFilled?'var(--g)':'var(--b)', transition:'background 0.3s' }}>
                {allFilled ? <Ic n="check" s={14} c="#fff" /> : <Ic n="target" s={14} c="#fff" />}
              </div>
              <div>
                <div style={{ fontFamily:'var(--ff-d)', fontWeight:700, fontSize:15 }}>Target Role</div>
                <div className="lbl">Step 2 — Configure your goal</div>
              </div>
            </div>
            <StatusDot done={allFilled} />
          </div>

          <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:16 }}>
            {/* Role + Level */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--ink2)', marginBottom:7 }}>💼 Job Role</div>
                <Sel value={role} onChange={setRole} placeholder="Select a role…" options={ROLES.map(r => ({ id:r, label:r }))} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--ink2)', marginBottom:7 }}>📊 Experience Level</div>
                <Sel value={expId} onChange={setExpId} placeholder="Select level…" options={EXP_LEVELS.map(e => ({ id:e.id, label:`${e.label} · ${e.years}` }))} />
              </div>
            </div>

            {/* Company Type */}
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--ink2)', marginBottom:8 }}>🏢 Company Type</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {COMPANY_TYPES.map(ct => (
                  <button key={ct.id} onClick={() => setCompanyId(ct.id)}
                    style={{ padding:'7px 12px', borderRadius:10, cursor:'pointer', fontSize:12.5, fontFamily:'var(--ff-b)', fontWeight:companyId===ct.id?600:400, border:`1.5px solid ${companyId===ct.id?'var(--b)':'var(--border2)'}`, background:companyId===ct.id?'rgba(42,120,232,0.10)':'var(--surface2)', color:companyId===ct.id?'var(--b)':'var(--ink2)', transition:'all 0.15s' }}>
                    {ct.emoji} {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--ink2)', marginBottom:8 }}>
                ⚙️ Tech Stack <span style={{ fontSize:11.5, fontWeight:400, color:'var(--ink3)', marginLeft:6 }}>— pick all that apply</span>
              </div>
              <TechChips selected={techStack} onChange={setTechStack} />
            </div>

            {/* Auto-generate toggle */}
            <Toggle on={autoGen} onChange={setAutoGen} label="Auto-generate Job Description" sub="AI writes a full JD the moment all fields are filled" />

            {!autoGen && (
              <button className="btn-ghost" onClick={doGenerate} disabled={!allFilled || genLoading} style={{ justifyContent:'center' }}>
                {genLoading ? <><Ic n="loader" s={13} spin /> Generating…</> : <><Ic n="sparkle" s={13} /> Generate Job Profile</>}
              </button>
            )}
          </div>

          <div style={{ padding:'14px 16px 16px' }}>
            <ProfilePreview profile={profile} loading={genLoading} onRegen={doGenerate} canRegen={allFilled} />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fu" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          <span className={`tag ${resumeReady?'tag-g':'tag-n'}`}>{resumeReady?'✓':'○'} Resume</span>
          <span className={`tag ${role?'tag-g':'tag-n'}`}>{role?`✓ ${role}`:'○ Role'}</span>
          <span className={`tag ${expId?'tag-g':'tag-n'}`}>{expId?`✓ ${EXP_LEVELS.find(e=>e.id===expId)?.label}`:'○ Experience'}</span>
          <span className={`tag ${techStack.length>0?'tag-g':'tag-n'}`}>{techStack.length>0?`✓ ${techStack.length} skills`:'○ Tech Stack'}</span>
          <span className={`tag ${companyId?'tag-g':'tag-n'}`}>{companyId?`✓ ${COMPANY_TYPES.find(c=>c.id===companyId)?.emoji} ${COMPANY_TYPES.find(c=>c.id===companyId)?.label}`:'○ Company'}</span>
          {profile && <span className="tag tag-p">✓ JD generated</span>}
        </div>

        <button className="btn-cta" onClick={handleAnalyze} disabled={!canRun} style={{ fontSize:16, padding:'15px 44px' }}>
          {analyzing
            ? <><Ic n="loader" s={18} c="#fff" spin /> Analyzing…</>
            : <><Ic n="brain" s={18} c={canRun?'#fff':'var(--ink3)'} /> Run Intelligence Analysis</>}
        </button>

        {!canRun && !analyzing && (
          <div style={{ fontSize:12.5, color:'var(--ink3)' }}>
            {!resumeReady ? '📋 Add your resume to continue' : !allFilled ? '🎯 Complete your target role setup to continue' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
