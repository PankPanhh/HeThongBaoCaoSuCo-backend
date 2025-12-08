import React, { useRef, useState } from 'react';

type SendPayload = { type: 'text' | 'image' | 'location'; text?: string; file?: File; coords?: { lat: number; lon: number } };

export default function Composer({ onSend, onPickFiles }: { onSend: (payload: SendPayload) => void; onPickFiles?: (files: FileList | null) => void }) {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  function submit() {
    if (!text.trim()) return;
    onSend({ type: 'text', text: text.trim() });
    setText('');
  }

  function pickImage() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (onPickFiles) onPickFiles(files);
      else {
        // fallback: send first file
        const f = files[0];
        onSend({ type: 'image', file: f });
      }
    }
    // reset
    e.currentTarget.value = '';
  }

  async function sendLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSend({ type: 'location', coords: { lat: pos.coords.latitude, lon: pos.coords.longitude } });
      },
      () => {
        // ignore error for now
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 5 }
    );
  }

  return (
    <div className="composer">
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onFileChange} />
      <button className="icon-btn" onClick={pickImage} aria-label="Gửi ảnh">📷</button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn… (Shift+Enter xuống dòng)"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button className="icon-btn" onClick={sendLocation} aria-label="Gửi vị trí">📍</button>
      <button className="send" onClick={submit} aria-label="Gửi">📩</button>
    </div>
  );
}
