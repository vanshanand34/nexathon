import { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

export default function SimpleCodeEditor({ 
  code, 
  onChange, 
  language, 
  height = '400px' 
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState<number>(0);

  // Update line count when code changes
  useEffect(() => {
    if (code) {
      const lines = code.split('\n').length;
      setLineCount(lines);
    } else {
      setLineCount(1);
    }
  }, [code]);

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert tab at cursor
      const newText = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newText);
      
      // Move cursor after tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white relative">
      <div className="flex">
        {/* Line numbers */}
        <div 
          className="bg-gray-50 text-gray-500 text-right select-none py-2 pr-2 border-r border-gray-300"
          style={{ 
            minWidth: '3rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            height,
            overflow: 'hidden'
          }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="px-2">{i + 1}</div>
          ))}
        </div>
        
        {/* Editor */}
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full resize-none outline-none p-2 font-mono text-sm" 
          style={{ 
            height,
            fontFamily: 'monospace', 
            fontSize: '0.875rem',
            lineHeight: '1.5',
            tabSize: 2
          }}
          spellCheck="false"
          placeholder="Enter your code here..."
        />
      </div>
      
      {/* Language indicator */}
      <div className="absolute bottom-0 right-0 bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded-tl-md border-t border-l border-gray-300">
        {language.toUpperCase()}
      </div>
    </div>
  );
}