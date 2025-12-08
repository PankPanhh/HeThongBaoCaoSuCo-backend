import React from 'react';

type Message = {
  id: string;
  from: 'user' | 'agent' | 'system';
  text?: string;
  time?: number;
  status?: string;
  type?: 'text' | 'image' | 'card' | 'location';
  meta?: any;
};

export default function MessageItem({ message }: { message: Message }) {
  const isMe = message.from === 'user';
  const classes = `message-item ${isMe ? 'me' : message.from === 'agent' ? 'agent' : 'system'}`;

  function renderContent() {
    switch (message.type) {
      case 'image':
        const url = message.meta?.previewUrl || message.meta?.url || '';
        return <img src={url} alt="ảnh" className="message-image" />;
      case 'card':
        return (
          <div className="message-card">
            <div className="card-title">{message.meta?.title}</div>
            <div className="card-body">{message.meta?.body}</div>
            {message.meta?.cta && (
              <button className="card-cta" onClick={() => { if (message.meta?.onClick) message.meta.onClick(); }}>
                {message.meta.cta}
              </button>
            )}
          </div>
        );
      case 'location':
        return (
          <div className="message-card">
            <div className="card-title">Vị trí</div>
            <div className="card-body">Lat: {message.meta?.lat}, Lon: {message.meta?.lon}</div>
          </div>
        );
      default:
        return <div className="bubble">{message.text}</div>;
    }
  }

  return (
    <div className={classes}>
      {!isMe && message.from === 'agent' && <div className="avatar">👨‍💼</div>}
      <div className="content">
        {renderContent()}
        <div className="meta">{message.status ? message.status : (message.time ? new Date(message.time).toLocaleTimeString() : '')}</div>
      </div>
    </div>
  );
}
