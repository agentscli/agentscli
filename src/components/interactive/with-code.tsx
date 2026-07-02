import React from 'react';

/** Render `backticked` spans in plain strings as inline code. */
export function withCode(text: string): React.ReactNode {
  const parts = text.split('`');
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <code key={i}>{part}</code> : part
  );
}
