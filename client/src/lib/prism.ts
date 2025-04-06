import Prism from 'prismjs';

// Load core prismjs
import 'prismjs/components/prism-core';

// Function to dynamically load languages
export async function loadLanguage(language: string): Promise<void> {
  // Normalize language name
  const normalizedLang = normalizeLanguageName(language);
  
  // Check if language is already loaded
  if (Prism.languages[normalizedLang]) {
    return;
  }
  
  // Dynamic import based on language
  try {
    switch (normalizedLang) {
      case 'javascript':
        await import('prismjs/components/prism-javascript');
        break;
      case 'typescript':
        await import('prismjs/components/prism-typescript');
        break;
      case 'python':
        await import('prismjs/components/prism-python');
        break;
      case 'java':
        await import('prismjs/components/prism-java');
        break;
      case 'csharp':
        await import('prismjs/components/prism-csharp');
        break;
      case 'php':
        await import('prismjs/components/prism-php');
        break;
      case 'css':
        await import('prismjs/components/prism-css');
        break;
      case 'html':
        await import('prismjs/components/prism-markup');
        break;
      case 'ruby':
        await import('prismjs/components/prism-ruby');
        break;
      case 'go':
        await import('prismjs/components/prism-go');
        break;
      default:
        // Default to JavaScript if language not supported
        await import('prismjs/components/prism-javascript');
        break;
    }
  } catch (error) {
    console.error(`Failed to load language: ${normalizedLang}`, error);
    // Load JavaScript as fallback
    await import('prismjs/components/prism-javascript');
  }
}

// Helper function to normalize language names
function normalizeLanguageName(language: string): string {
  language = language.toLowerCase();
  
  // Map common aliases to their proper names
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'cs': 'csharp',
    'c#': 'csharp',
    'markup': 'html',
    'xml': 'html',
  };
  
  return languageMap[language] || language;
}

export default Prism;
