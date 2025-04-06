import { useState } from "react";
import { FileText, FileCode, BookOpen, FileCog, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type AnalysisResult } from "@shared/schema";
import { useToast } from "@/hooks/simple-toast";

const DOCUMENTATION_SAMPLE_CODE = `/**
 * User service module
 */

// Database connection
const db = require('./database');

// User operations
function getUserById(id) {
  return db.query('SELECT * FROM users WHERE id = ?', [id])
    .then(results => results[0]);
}

function createUser(userData) {
  const { name, email, password } = userData;
  
  // Hash password
  const hashedPassword = hashPassword(password);
  
  return db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
}

function updateUserProfile(id, profileData) {
  const { name, email, bio } = profileData;
  
  return db.query(
    'UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?',
    [name, email, bio, id]
  );
}

function deleteUser(id) {
  return db.query('DELETE FROM users WHERE id = ?', [id]);
}

// Helper function to hash passwords
function hashPassword(password) {
  // Implementation of password hashing
  return 'hashed_' + password;
}

// Export public API
module.exports = {
  getUserById,
  createUser,
  updateUserProfile,
  deleteUser
};`;

export default function Documentation() {
  const [code, setCode] = useState(DOCUMENTATION_SAMPLE_CODE);
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const { toast } = useToast();

  const handleDocumentation = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "error"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest('POST', '/api/documentation', {
        code,
        language,
        analysisDepth: 3
      });
      
      const result = await response.json();
      setAnalysisResult(result);
      
      toast({
        title: "Documentation Generated",
        description: `Documentation created with ${result.issuesCount} suggestions`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Documentation Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleClear = () => {
    setCode("");
    setAnalysisResult(null);
  };

  return (
    <div className="container max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-2 h-8 w-8 text-blue-500" />
          Documentation Generator
        </h1>
        <p className="text-gray-500 mt-2">
          Generate comprehensive documentation for your code automatically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-purple-500">
              <FileCode className="mr-2 h-5 w-5" />
              Code Documentation
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Generate function and class documentation with parameter descriptions and return values.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-teal-500">
              <BookOpen className="mr-2 h-5 w-5" />
              API Reference
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Create API documentation with endpoints, parameters, and example requests/responses.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-orange-500">
              <FileCog className="mr-2 h-5 w-5" />
              Project Structure
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Document your project's architecture, dependencies, and setup process.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Code Documentation Generator
            </h3>
          </div>
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
                    Programming Language
                  </label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex space-x-4 border-b">
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('manual')}
                  >
                    Manual Input
                  </button>
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('upload')}
                  >
                    Upload File
                  </button>
                </div>
                
                {activeTab === 'manual' ? (
                  <div className="space-y-4 pt-2">
                    <textarea 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)} 
                      className="w-full h-64 p-4 text-sm font-mono border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your code here..."
                    />
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-500 mt-2 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: .js, .ts, .py, .java, .cs, .php, .rb, .go
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleClear}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleDocumentation} 
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Documentation...
                      </>
                    ) : (
                      <>
                        Generate Documentation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isAnalyzing && (
          <div className="border rounded-lg shadow-sm p-4">
            <div className="pt-6">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Analyzing code and generating documentation...</span>
                  <span>Please wait</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-gray-500">
                  Our AI is generating comprehensive documentation for your code
                </p>
              </div>
            </div>
          </div>
        )}
        
        {analysisResult && !isAnalyzing && (
          <div className="border rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Generated Documentation</h3>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">Documentation Quality:</span>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysisResult.overallScore >= 4 ? 'bg-green-500' : 
                      analysisResult.overallScore >= 3 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${(analysisResult.overallScore / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">{Math.round((analysisResult.overallScore / 5) * 100)}%</span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Documentation Suggestions</span>
                  <span className="text-2xl font-bold">{analysisResult.issuesCount}</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Coverage</span>
                  <span className="text-2xl font-bold">{analysisResult.codeEfficiency}%</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Completeness</span>
                  <span className="text-2xl font-bold">{analysisResult.bestPractices}%</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Overall Rating</span>
                  <span className="text-2xl font-bold">{analysisResult.overallQuality}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">Documentation Output</h4>
              
              {analysisResult.issues.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="flex">
                    <FileText className="h-5 w-5 text-blue-400 mr-2" />
                    <p className="text-sm text-blue-700">No documentation improvements needed. Your code is well-documented!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisResult.issues.map((issue) => (
                    <div key={issue.id} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                      <div className="flex justify-between">
                        <h5 className="text-sm font-medium text-blue-800">
                          {issue.title}
                        </h5>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800">
                          {issue.type === 'error' ? 'Missing Documentation' : 
                           issue.type === 'warning' ? 'Incomplete Documentation' : 
                           'Enhancement'}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
                      
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Original Code:</p>
                        <div className="bg-gray-800 rounded p-2 text-xs text-white font-mono overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{issue.code}</pre>
                        </div>
                      </div>
                      
                      {issue.suggestionCode && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Suggested Documentation:</p>
                          <div className="bg-green-900 rounded p-2 text-xs text-green-100 font-mono overflow-x-auto">
                            <pre className="whitespace-pre-wrap">{issue.suggestionCode}</pre>
                          </div>
                        </div>
                      )}
                      
                      <p className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Explanation:</span> {issue.explanation}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Location:</span> Lines {issue.lineStart}-{issue.lineEnd}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}