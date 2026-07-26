import React from 'react';
import { renderCheckScript } from './render-check-data';
import TerminalReplay from './terminal-replay';

export default function RenderCheck() {
  return <TerminalReplay script={renderCheckScript} />;
}
