import React, { type ReactNode } from 'react';

interface CodeSnippetProps {
  title?: string;
  code?: string;
  children?: ReactNode; // To fully support Astro rendering standard blocks if needed
}

export default function ReactCodeSnippet({ title = 'style.css', code, children }: CodeSnippetProps) {
  return (
    <div className="card">
      <div className="header">
        <div className="top">
          <div className="circle">
            <span className="red circle2"></span>
          </div>
          <div className="circle">
            <span className="yellow circle2"></span>
          </div>
          <div className="circle">
            <span className="green circle2"></span>
          </div>
          <div className="title">
            <p id="title2">{title}</p>
          </div>
        </div>
      </div>
      <div className="code-container">
        {/* If raw code string is provided use the requested textarea, else use standard children rendering */}
        {code ? (
          <textarea className="area" id="code" name="code" readOnly value={code} />
        ) : (
          <div className="area" id="code-override">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
