import React from 'react';

export default function QuickReplies({ items, onPick }: { items: string[]; onPick: (text: string) => void }) {
  return (
    <div className="quick-replies" role="list">
      {items.map((it, idx) => (
        <button key={idx} className="quick-reply" onClick={() => onPick(it)}>{it}</button>
      ))}
    </div>
  );
}
