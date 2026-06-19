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

  // כניסה לדף — מציג גל שלום
  useEffect(() => {
    const t = setTimeout(() => {
      setShown(true);
      setBobState('wave');
      // אחרי 3 שניות חוזר ל-idle
      setTimeout(() => setBobState('idle'), 3000);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // מחליף סרטון לפי מצב
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [bobState]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function getVideoSrc(): string {
    if (bobState === 'wave') return '/bob-wave.mp4';
    if (bobState === 'talk') return '/bob-talk.mp4';
    return '/bob-wave.mp4';
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
    // אחרי תשובה ממשיך talk כל עוד הצ'אט פתוח
  }

  return (
    <>
      <style>{`
        @keyframes bobRise {
          0%   { transform: translateY(160px); opacity: 0; }
          60%  { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bubblePop {
          0%   { transform: scale(0) translateY(10px); opacity: 0; }
          70%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatSlide {
          from { transform: translateY(16px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%         { transform: scale(1); opacity: 1; }
        }
        .bob-rise   { animation: bobRise 0.8s cubic-bezier(0.34,1.3,0.64,1) forwards; }
        .bubble-pop { animation: bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .chat-slide { animation: chatSlide 0.3s ease forwards; }
        .dot1 { animation: dotPulse 1.2s ease-in-out infinite 0s; }
        .dot2 { animation: dotPulse 1.2s ease-in-out infinite 0.2s; }
        .dot3 { animation: dotPulse 1.2s ease-in-out infinite 0.4s; }
      `}</style>

      {shown && (
        <div style={{
          position: 'fixed', bottom: 0, left: 24, zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>

          {/* חלון צ'אט */}
          {open && (
            <div className="chat-slide" style={{
              width: 320, background: '#fff', borderRadius: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              direction: 'rtl', maxHeight: 420, marginBottom: 8,
              border: '1.5px solid #FCD34D',
            }}>
              {/* Header */}
              <div style={{ background: '#FCD34D', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#fff' }}>
                    <video src="/bob-talk.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>בוב — חומרי בניין</div>
                    <div style={{ fontSize: 11, color: '#444' }}>🟢 מחובר · עונה תוך שניות</div>
                  </div>
                </div>
                <button onClick={handleCloseChat} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="#111" />
                </button>
              </div>

              {/* הודעות */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
          )}

          {/* בועת פתיחה — מופיעה מעל הדמות */}
          {!open && (
            <div className="bubble-pop" onClick={handleOpenChat} style={{
              background: '#fff', borderRadius: '16px 16px 16px 4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              padding: '10px 14px', marginBottom: 4, maxWidth: 200,
              fontSize: 13, lineHeight: 1.6, color: '#111',
              border: '1.5px solid #FCD34D', cursor: 'pointer',
              position: 'relative',
            }}>
              <strong style={{ display: 'block', marginBottom: 2 }}>היי! אני בוב 👷</strong>
              יש שאלה? אני כאן לעזור!
            </div>
          )}

          {/* דמות בוב — וידאו */}
          <div className="bob-rise">
            <video
              ref={videoRef}
              key={bobState}
              autoPlay
              loop={bobState === 'idle'}
              muted
              playsInline
              onClick={open ? handleCloseChat : handleOpenChat}
              style={{
                width: 150,
                height: 'auto',
                cursor: 'pointer',
                display: 'block',
                mixBlendMode: 'multiply',
              }}
            >
              <source src={getVideoSrc()} type="video/mp4" />
            </video>
          </div>

        </div>
      )}
    </>
  );
}
