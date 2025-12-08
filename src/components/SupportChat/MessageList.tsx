import React, { MutableRefObject, useEffect } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, listRef }: { messages: any[]; listRef?: MutableRefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    // auto-scroll to bottom on messages change
    const el = listRef?.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, listRef]);

  return (
    <div className="message-list" ref={listRef} role="log" aria-live="polite">
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </div>
  );
}
