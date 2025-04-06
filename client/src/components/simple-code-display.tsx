interface CodeDisplayProps {
  code: string;
  language: string;
  lineNumbers?: boolean;
  maxHeight?: string;
}

export default function SimpleCodeDisplay({ 
  code, 
  language, 
  lineNumbers = true, 
  maxHeight = '400px' 
}: CodeDisplayProps) {
  // Process lines for display with line numbers
  const lines = code.split('\n');
  const maxLineNumberWidth = String(lines.length).length;
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 text-sm">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 capitalize">{language}</span>
        <button 
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          Copy
        </button>
      </div>
      <div 
        className="overflow-auto p-4 bg-white"
        style={{ maxHeight }}
      >
        <pre className="text-sm" style={{ margin: 0, fontFamily: 'monospace' }}>
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {lineNumbers && (
                <span className="inline-block text-gray-400 select-none" style={{ width: `${maxLineNumberWidth + 1}ch`, marginRight: '1ch' }}>
                  {String(i + 1).padStart(maxLineNumberWidth, ' ')}
                </span>
              )}
              <span className="text-gray-800">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}