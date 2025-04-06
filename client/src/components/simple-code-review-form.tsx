import { useState } from "react";
import SimpleLanguageSelector from "./simple-language-selector";
import SimpleCodeEditor from "./simple-code-editor";
import SimpleAnalysisOptions from "./simple-analysis-options";
import { apiRequest } from "@/lib/queryClient";
import { Settings } from "lucide-react";

interface CodeReviewFormProps {
  onSubmit: (result: any) => void;
  isLoading: boolean;
}

const DEFAULT_CODE = `// Fetch data from API
function fetchUserData(userId) {
  return fetch(\`https://api.example.com/users/\${userId}\`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log('Error fetching user data:', error);
    });
}

// Process user data
function processUserData(data) {
  var result = [];
  
  for (var i = 0; i < data.length; i++) {
    var user = data[i];
    if (user.active == true) {
      result.push({
        name: user.name,
        email: user.email,
        lastLogin: new Date(user.lastLogin)
      });
    }
  }
  
  return result;
}

// Main function
function main() {
  var userId = 123;
  var userData = fetchUserData(userId);
  var processedData = processUserData(userData);
  
  console.log(processedData);
  return processedData;
}

// Event listeners
document.getElementById('user-btn').addEventListener('click', function() {
  main();
});`;

export default function CodeReviewForm({ onSubmit, isLoading }: CodeReviewFormProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [tabValue, setTabValue] = useState("manual");
  const [options, setOptions] = useState({
    securityAnalysis: true,
    performanceOptimization: true,
    codingStandards: true,
    documentationQuality: false,
    improvementSuggestions: true,
    analysisDepth: 3
  });

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please enter some code to analyze");
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/analyze', {
        code,
        language,
        options
      });
      
      const result = await response.json();
      onSubmit(result);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleClear = () => {
    setCode("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
      <div className="sm:col-span-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Code Input</h2>
              <div className="flex gap-2">
                <SimpleLanguageSelector value={language} onChange={setLanguage} />
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Settings className="mr-1 h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setTabValue("manual")}
                  className={`px-4 py-2 text-sm font-medium ${
                    tabValue === "manual"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={() => setTabValue("upload")}
                  className={`px-4 py-2 text-sm font-medium ${
                    tabValue === "upload"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setTabValue("github")}
                  className={`px-4 py-2 text-sm font-medium ${
                    tabValue === "github"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  GitHub Integration
                </button>
              </div>
              
              <div className="pt-4">
                {tabValue === "manual" && (
                  <SimpleCodeEditor 
                    code={code} 
                    onChange={setCode} 
                    language={language} 
                  />
                )}
                
                {tabValue === "upload" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 mt-2 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: .js, .ts, .py, .java, .cs, .php, .rb, .go
                    </p>
                  </div>
                )}
                
                {tabValue === "github" && (
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Connect to GitHub</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Analyze code directly from your GitHub repositories
                    </p>
                    <div className="mt-4">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Connect GitHub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleClear} 
                className="mr-3 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Code"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sm:col-span-4">
        <SimpleAnalysisOptions options={options} onChange={setOptions} />
      </div>
    </div>
  );
}