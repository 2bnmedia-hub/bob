'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };
type BobState = 'wave' | 'talk' | 'idle';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [bobState, setBobState] = useState<BobState>('wave');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'שלום! אני בוב 👷 איך אפשר לעזור היום?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
      if (ref.current) {
        ref.current.load();
        ref.current.play().catch(() => {});
      }
    });
  }, [bobState]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function getVideoSrc(): string {
    if (bobState === 'talk') return '/bob-talk-crop.mp4';
    return '/bob-wave-crop.mp4';
  }

  function handleOpenChat() {
    setOpen(true);
    setBobState('talk');
  }

  function handleCloseChat() {
    setOpen(false);
    setBobState('wave');
    setTimeout(() => setBobState('idle'), 2000);
  }

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
        @keyframes widgetRise {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes bubblePop {
          0%   { transform: scale(0.8); opacity: 0; }
          70%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%         { transform: scale(1); opacity: 1; }
        }
        .widget-rise { animation: widgetRise 0.5s ease forwards; }
        .bubble-pop  { animation: bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .dot1 { animation: dotPulse 1.2s ease-in-out infinite 0s; }
        .dot2 { animation: dotPulse 1.2s ease-in-out infinite 0.2s; }
        .dot3 { animation: dotPulse 1.2s ease-in-out infinite 0.4s; }
      `}</style>

      {shown && (
        <div className="widget-rise" style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          width: 320,
        }}>

          {/* חלון שיחה מלא עם בוב בפנים */}
          {open ? (
            <div style={{
              width: 320, background: '#fff', borderRadius: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              direction: 'rtl', border: '1.5px solid #FCD34D',
            }}>
              {/* Header עם כפתור סגירה */}
              <div style={{ background: '#FCD34D', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>בוב — חומרי בניין</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#444' }}>🟢 מחובר</span>
                  <button onClick={handleCloseChat} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <X size={18} color="#111" />
                  </button>
                </div>
              </div>

              {/* וידאו בוב — בתוך החלון */}
              <div style={{ background: '#fff', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #F0F0F0', height: 220, overflow: 'hidden' }}>
                <video
                  ref={videoRef}
                  key={bobState}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                >
                  <source src={getVideoSrc()} type="video/mp4" />
                </video>
              </div>

              {/* הודעות */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                    background: m.role === 'user' ? '#F5F5F5' : 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
                    border: m.role === 'assistant' ? '1px solid #FCD34D' : 'none',
                    borderRadius: m.role === 'user' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                    padding: '9px 13px', fontSize: 13, lineHeight: 1.6,
                    maxWidth: '85%', color: '#111',
                  }}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: 'flex-end', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '14px 14px 4px 14px', padding: '10px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    <span className="dot1" style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}/>
                    <span className="dot2" style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}/>
                    <span className="dot3" style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}/>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="שאל את בוב..."
                  style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit', direction: 'rtl' }}
                />
                <button onClick={send} disabled={loading} style={{
                  background: '#FCD34D', border: 'none', borderRadius: 10,
                  width: 36, height: 36, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Send size={15} color="#111" />
                </button>
              </div>
            </div>
          ) : (
            /* כשסגור — בוב קטן עם בועת טקסט */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div className="bubble-pop" onClick={handleOpenChat} style={{ cursor: 'pointer', position: 'relative', marginBottom: 4 }}>
                <svg width="220" height="80" viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg">
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.12)"/>
                  </filter>
                  <path d="M20,4 Q10,4 10,14 L10,52 Q10,62 20,62 L80,62 Q88,74 100,76 Q108,74 108,62 L200,62 Q210,62 210,52 L210,14 Q210,4 200,4 Z"
                    fill="white" stroke="#FCD34D" strokeWidth="1.5" filter="url(#shadow)"/>
                </svg>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 16,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  padding: '0 18px', direction: 'rtl',
                }}>
                  <strong style={{ fontSize: 13, color: '#111', marginBottom: 2 }}>היי! אני בוב 👷</strong>
                  <span style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>יש שאלה? אני כאן לעזור!</span>
                </div>
              </div>
              <div onClick={handleOpenChat} style={{
                background: '#fff',
                borderRadius: '12px 12px 0 0', overflow: 'hidden',
                cursor: 'pointer', boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
                display: 'inline-block',
              }}>
                <video
                  ref={videoMiniRef}
                  key={`mini-${bobState}`}
                  autoPlay loop muted playsInline
                  style={{ width: 200, height: 'auto', display: 'block' }}
                >
                  <source src={getVideoSrc()} type="video/mp4" />
                </video>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
