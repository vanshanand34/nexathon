import { ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
];

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const currentLanguage = languages.find(lang => lang.value === value) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        id="language-selector"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => {
          const dropdown = document.getElementById("language-dropdown");
          if (dropdown) {
            dropdown.classList.toggle("hidden");
          }
        }}
      >
        {currentLanguage.label}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      <div
        id="language-dropdown"
        className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-selector"
      >
        <div className="py-1" role="none">
          {languages.map((language) => (
            <button
              key={language.value}
              onClick={() => {
                onChange(language.value);
                const dropdown = document.getElementById("language-dropdown");
                if (dropdown) {
                  dropdown.classList.add("hidden");
                }
              }}
              className={`block px-4 py-2 text-sm w-full text-left ${
                language.value === value
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              role="menuitem"
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}