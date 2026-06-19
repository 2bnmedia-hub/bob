'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };
type BobState = 'wave' | 'talk' | 'idle';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [bobState, setBobState] = useState<BobState>('wave');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'שלום! אני בוב 👷 העוזר האישי שלכם - איך אפשר לעזור היום?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 }); // מרחק מתחתית-שמאל
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMiniRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setShown(true);
      setBobState('wave');
      setTimeout(() => setBobState('idle'), 4000);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    [videoRef, videoMiniRef].forEach(ref => {
      if (ref.current) { ref.current.load(); ref.current.play().catch(() => {}); }
    });
  }, [bobState]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Drag logic
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    didDrag.current = false;
    const rect = widgetRef.current!.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !widgetRef.current) return;
      didDrag.current = true;
      const w = widgetRef.current.offsetWidth;
      const h = widgetRef.current.offsetHeight;
      const newLeft = e.clientX - dragOffset.current.x;
      const newTop  = e.clientY - dragOffset.current.y;
      const clampedLeft = Math.max(0, Math.min(window.innerWidth  - w, newLeft));
      const clampedTop  = Math.max(0, Math.min(window.innerHeight - h, newTop));
      // שמור כ-bottom/left
      setPos({
        x: clampedLeft,
        y: window.innerHeight - clampedTop - h,
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Touch drag
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current || !widgetRef.current) return;
      didDrag.current = true;
      const t = e.touches[0];
      const w = widgetRef.current.offsetWidth;
      const h = widgetRef.current.offsetHeight;
      const newLeft = t.clientX - dragOffset.current.x;
      const newTop  = t.clientY - dragOffset.current.y;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - w, newLeft)),
        y: Math.max(0, Math.min(window.innerHeight - h, window.innerHeight - newTop - h)),
      });
    };
    const onTouchEnd = () => { dragging.current = false; };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    didDrag.current = false;
    const t = e.touches[0];
    const rect = widgetRef.current!.getBoundingClientRect();
    dragOffset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  function getVideoSrc() { return bobState === 'talk' ? '/bob-talk-crop.mp4' : '/bob-wave-crop.mp4'; }
  function handleOpenChat()  { setOpen(true);  setBobState('talk'); }
  function handleCloseChat() { setOpen(false); setBobState('wave'); setTimeout(() => setBobState('idle'), 2000); }

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setBobState('talk');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'שגיאה, נסה שוב' }]);
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @keyframes widgetRise { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes bubblePop  { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.05);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes dotPulse   { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes dragHint { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        .widget-rise { animation: widgetRise 0.5s ease forwards; }
        .bubble-pop  { animation: bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .dot1 { animation: dotPulse 1.2s ease-in-out infinite 0s; }
        .dot2 { animation: dotPulse 1.2s ease-in-out infinite 0.2s; }
        .dot3 { animation: dotPulse 1.2s ease-in-out infinite 0.4s; }
        .send-btn:hover { transform: scale(1.08); }
        .send-btn { transition: transform 0.15s; }
        .chat-input:focus { border-color: #F59E0B !important; box-shadow: 0 0 0 3px rgba(252,211,77,0.25); }
        .drag-handle { cursor: grab; user-select: none; }
        .drag-handle:active { cursor: grabbing; }
        .drag-hint { animation: dragHint 1.5s ease-in-out infinite; }
      `}</style>

      {shown && dismissed && (
        <button
          ref={widgetRef as any}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onClick={() => { if (!didDrag.current) setDismissed(false); }}
          aria-label="פתח את בוב"
          style={{
            position: 'fixed', bottom: pos.y, left: pos.x, zIndex: 9999,
            width: 56, height: 56, borderRadius: '50%', border: '2px solid #FCD34D',
            background: '#fff', cursor: 'grab', padding: 0, overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)', touchAction: 'none',
          }}
        >
          <video autoPlay loop muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}>
            <source src="/bob-wave.mp4" type="video/mp4" />
          </video>
        </button>
      )}

      {shown && !dismissed && (
        <div
          ref={widgetRef}
          className="widget-rise"
          style={{
            position: 'fixed',
            bottom: pos.y,
            left: pos.x,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 320,
          }}
        >
          {open ? (
            <div style={{
              width: 320, background: '#FAFAFA', borderRadius: 24, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(252,211,77,0.3)',
              direction: 'rtl',
            }}>
              {/* Header — ניתן לגרור */}
              <div
                className="drag-handle"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #FDE68A 100%)',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite',
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, backdropFilter: 'blur(4px)',
                  }}>👷</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#111', letterSpacing: '-0.3px' }}>בוב</div>
                    <div style={{ fontSize: 11, color: '#7C5B00', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}/>
                      מחובר ומוכן לעזור
                    </div>
                  </div>
                </div>
                {/* אייקון גרירה */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{fontSize:10,color:"rgba(0,0,0,0.4)",marginLeft:2}}>גרור</span>
                  <svg className="drag-hint" width="16" height="16" viewBox="0 0 16 16" fill="rgba(0,0,0,0.4)">
                    <circle cx="5" cy="4"  r="1.5"/><circle cx="11" cy="4"  r="1.5"/>
                    <circle cx="5" cy="8"  r="1.5"/><circle cx="11" cy="8"  r="1.5"/>
                    <circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
                  </svg>
                  <button onClick={handleCloseChat} style={{
                    background: 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer',
                    borderRadius: '50%', width: 30, height: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <X size={15} color="#111" />
                  </button>
                </div>
              </div>

              {/* וידאו */}
              <div style={{
                background: 'linear-gradient(180deg,#FFF8E1 0%,#FFFBF0 100%)',
                display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                height: 200, overflow: 'hidden', borderBottom: '1px solid #FEF3C7',
              }}>
                <video ref={videoRef} key={bobState} autoPlay loop muted playsInline
                  style={{ height: '100%', width: 'auto', objectFit: 'contain' }}>
                  <source src={getVideoSrc()} type="video/mp4" />
                </video>
              </div>

              {/* הודעות */}
              <div style={{
                overflowY: 'auto', padding: '14px 14px 8px',
                display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200,
                background: '#FAFAFA',
              }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                    background: m.role === 'user' ? '#FFFFFF' : 'linear-gradient(135deg,#FEF9C3,#FEF3C7)',
                    boxShadow: m.role === 'user' ? '0 1px 4px rgba(0,0,0,0.08)' : '0 1px 4px rgba(245,158,11,0.2)',
                    borderRadius: m.role === 'user' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    padding: '9px 14px', fontSize: 13, lineHeight: 1.6, maxWidth: '85%', color: '#111',
                  }}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{
                    alignSelf: 'flex-end', background: 'linear-gradient(135deg,#FEF9C3,#FEF3C7)',
                    boxShadow: '0 1px 4px rgba(245,158,11,0.2)',
                    borderRadius: '18px 18px 4px 18px', padding: '10px 16px',
                    display: 'flex', gap: 5, alignItems: 'center',
                  }}>
                    <span className="dot1" style={{ width:7,height:7,borderRadius:'50%',background:'#F59E0B',display:'inline-block' }}/>
                    <span className="dot2" style={{ width:7,height:7,borderRadius:'50%',background:'#F59E0B',display:'inline-block' }}/>
                    <span className="dot3" style={{ width:7,height:7,borderRadius:'50%',background:'#F59E0B',display:'inline-block' }}/>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '10px 12px 14px', background: '#FAFAFA',
                borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <input className="chat-input" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="שאל את בוב..."
                  style={{
                    flex:1, border:'1.5px solid #E5E7EB', borderRadius:14,
                    padding:'9px 14px', fontSize:13, outline:'none',
                    fontFamily:'inherit', direction:'rtl', background:'#fff',
                    transition:'border-color 0.2s,box-shadow 0.2s',
                  }}
                />
                <button className="send-btn" onClick={send} disabled={loading} style={{
                  background:'linear-gradient(135deg,#F59E0B,#FCD34D)', border:'none',
                  borderRadius:14, width:38, height:38, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, boxShadow:'0 2px 8px rgba(245,158,11,0.4)',
                }}>
                  <Send size={15} color="#111" />
                </button>
              </div>
            </div>

          ) : (
            /* סגור */
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:6 }}>
              <div className="bubble-pop" onClick={handleOpenChat} style={{ cursor:'pointer', position:'relative', marginRight:10 }}>
                <svg width="210" height="72" viewBox="0 0 210 72" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFBEB"/>
                      <stop offset="100%" stopColor="#FEF3C7"/>
                    </linearGradient>
                    <filter id="bubbleShadow" x="-10%" y="-10%" width="130%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(245,158,11,0.2)"/>
                    </filter>
                  </defs>
                  <path d="M16,4 Q4,4 4,16 L4,46 Q4,58 16,58 L72,58 Q80,70 92,72 Q100,70 100,58 L194,58 Q206,58 206,46 L206,16 Q206,4 194,4 Z"
                    fill="url(#bubbleGrad)" stroke="#FCD34D" strokeWidth="1.5" filter="url(#bubbleShadow)"/>
                </svg>
                <div style={{
                  position:'absolute', top:0, left:0, right:0, bottom:14,
                  display:'flex', flexDirection:'column', justifyContent:'center',
                  padding:'0 18px', direction:'rtl',
                }}>
                  <strong style={{ fontSize:13, color:'#111', marginBottom:2 }}>היי! אני בוב 👷</strong>
                  <span style={{ fontSize:11.5, color:'#666', lineHeight:1.5 }}>יש שאלה? לחץ ואני עוזר!</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setDismissed(true); }}
                  aria-label="סגור"
                  style={{
                    position:'absolute', top:-6, left:-6, width:22, height:22,
                    borderRadius:'50%', border:'1.5px solid #FCD34D', background:'#fff',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.15)', padding:0,
                  }}
                >
                  <X size={12} color="#666" />
                </button>
              </div>
              {/* בוב מיני — ניתן לגרור */}
              <div
                className="drag-handle"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onClick={handleOpenChat}
                style={{
                  borderRadius:'16px', overflow:'hidden', cursor:'grab',
                  boxShadow:'0 -6px 20px rgba(245,158,11,0.25),0 -2px 8px rgba(0,0,0,0.08)',
                  background:'linear-gradient(180deg,#FFF8E1 0%,#FFFBF0 100%)',
                  display:'inline-block',
                  position:'relative',
                }}
              >
                <video ref={videoMiniRef} key={`mini-${bobState}`} autoPlay loop muted playsInline
                  style={{ width:270, height:'auto', display:'block' }}>
                  <source src={getVideoSrc()} type="video/mp4" />
                </video>
                <div className="drag-hint" style={{
                  position:'absolute', top:8, right:8,
                  background:'rgba(255,255,255,0.85)', borderRadius:8,
                  padding:'4px 7px', fontSize:11, color:'#7C5B00',
                  display:'flex', alignItems:'center', gap:4,
                  backdropFilter:'blur(4px)', pointerEvents:'none',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.12)',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="#F59E0B"><circle cx="2.5" cy="2.5" r="1.2"/><circle cx="7.5" cy="2.5" r="1.2"/><circle cx="2.5" cy="7.5" r="1.2"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>
                  גרור
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}