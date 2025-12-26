import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import Composer from './Composer';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';
import './SupportChat.scss';

type Props = { incidentId?: string; className?: string; onClose?: () => void };

export default function SupportChat({ incidentId, className, onClose }: Props) {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [typing, setTyping] = useState(false);
  const [attachments, setAttachments] = useState<Array<any>>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // start empty to show friendly intro; you can prefill if needed
    setMessages([]);
  }, [incidentId]);

  function handleSend(text: string) {
    if (!text || !text.trim()) return;
    const m = { id: String(Date.now()), from: 'user', text, time: Date.now(), status: 'sending', type: 'text' };
    setMessages((p) => [...p, m]);
    // mock send and agent reply
    setTimeout(() => {
      setMessages((p) => p.map((msg) => (msg.id === m.id ? { ...msg, status: 'sent' } : msg)));
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((p) => [...p, { id: String(Date.now() + 1), from: 'agent', text: 'Cảm ơn, chúng tôi đã nhận được thông tin và đang xử lý.', time: Date.now(), type: 'text' }]);
      }, 900);
    }, 600);
  }

  function handleSendPayload(payload: any) {
    if (!payload) return;
    if (payload.type === 'text') return handleSend(payload.text);
    if (payload.type === 'image') {
      const id = String(Date.now());
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const m = { id, from: 'user', type: 'image', meta: { previewUrl: preview }, time: Date.now(), status: 'sending' };
        setMessages((p) => [...p, m]);
        setTimeout(() => setMessages((p) => p.map((msg) => (msg.id === id ? { ...msg, status: 'sent' } : msg))), 800);
      };
      reader.readAsDataURL(payload.file);
      return;
    }
    if (payload.type === 'location') {
      const id = String(Date.now());
      const m = { id, from: 'user', type: 'location', meta: { lat: payload.coords.lat, lon: payload.coords.lon }, time: Date.now(), status: 'sent' };
      setMessages((p) => [...p, m]);
      return;
    }
  }

  // handle files selected from Composer: add to attachments and simulate upload progress
  function handlePickFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    files.forEach((file) => {
      const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7);
      const item = { id, file, previewUrl: null as string | null, progress: 0, status: 'uploading' };
      setAttachments((p) => [...p, item]);

      // read file as data URL for preview (avoids blob: CSP issues)
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, previewUrl: preview } : a)));
      };
      reader.onerror = () => {
        // keep previewUrl null on error
      };
      reader.readAsDataURL(file);

      // simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 8; // random step
        if (progress >= 100) progress = 100;
        setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, progress } : a)));
        if (progress >= 100) {
          clearInterval(interval as any);
          // mark done and append message using the latest attachments state
          setAttachments((prev) => {
            const updated = prev.map((a) => (a.id === id ? { ...a, status: 'done', progress: 100 } : a));
            const item = updated.find((x) => x.id === id);
            const preview = item?.previewUrl || null;
            const m = { id: 'img-' + id, from: 'user', type: 'image', meta: { previewUrl: preview }, time: Date.now(), status: 'sent' };
            setMessages((p) => [...p, m]);
            return updated;
          });
        }
      }, 250 + Math.random() * 300);
    });
  }

  function removeAttachment(id: string) {
    // revoke object url
    setAttachments((p) => p.filter((x) => x.id !== id));
  }

  const quicks = ['Cách báo sự cố', 'Liên hệ khẩn cấp', 'Cập nhật tiến độ'];

  return (
    <div className={`support-chat ${className ?? ''}`} role="region" aria-label="Chat hỗ trợ">

      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🤝</div>
          <div className="empty-title">Chào bạn!</div>
          <div className="empty-sub">Bạn cần hỗ trợ gì hôm nay?</div>
          <QuickReplies items={quicks} onPick={(t) => handleSend(t)} />
        </div>
      ) : (
        <>
          <MessageList messages={messages} listRef={listRef} />
          {typing && (
            <div className="typing-row"><div className="avatar">👨‍💼</div><TypingIndicator /></div>
          )}
        </>
      )}

      {messages.length > 0 && (
        <div className="quick-replies-holder"><QuickReplies items={quicks} onPick={(t) => handleSend(t)} /></div>
      )}

      <div className="attachment-gallery">
        {attachments.map((a) => (
          <div key={a.id} className="attachment-item">
            <img src={a.previewUrl} alt="preview" className="attachment-thumb" />
            <div className="attachment-progress">
              <div className="bar" style={{ width: `${a.progress}%` }} />
            </div>
            <button className="attachment-remove" onClick={() => removeAttachment(a.id)} aria-label="Remove">✕</button>
          </div>
        ))}
      </div>

      <Composer onSend={handleSendPayload} onPickFiles={handlePickFiles} />
    </div>
  );
}
