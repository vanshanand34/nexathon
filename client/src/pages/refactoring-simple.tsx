import { useState } from "react";
import { Box, RefreshCw, Layers, GitMerge, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type AnalysisResult } from "@shared/schema";
import { useToast } from "@/hooks/simple-toast";

const REFACTORING_SAMPLE_CODE = `// Poorly structured function with multiple responsibilities
function processUserData(userData) {
  // Validate user data
  if (!userData.name || !userData.email) {
    console.log('Invalid user data: Missing required fields');
    return false;
  }
  
  if (!userData.email.includes('@')) {
    console.log('Invalid email format');
    return false;
  }
  
  // Format user data
  const formattedUser = {
    fullName: userData.name.toUpperCase(),
    emailAddress: userData.email.toLowerCase(),
    isActive: userData.status === 'active' ? true : false,
    lastLoginDate: userData.lastLogin ? new Date(userData.lastLogin) : null
  };
  
  // Save user to database
  try {
    const db = connectToDatabase();
    const query = "INSERT INTO users (name, email, active, last_login) VALUES ('" + 
                  formattedUser.fullName + "', '" + 
                  formattedUser.emailAddress + "', " + 
                  formattedUser.isActive + ", '" + 
                  formattedUser.lastLoginDate + "')";
    db.execute(query);
    
    // Send welcome email
    if (formattedUser.isActive) {
      const emailService = getEmailService();
      const emailContent = 'Welcome ' + formattedUser.fullName + '! Your account has been created.';
      emailService.send(formattedUser.emailAddress, 'Welcome to Our Platform', emailContent);
    }
    
    console.log('User processed successfully');
    return true;
  } catch (error) {
    console.log('Error processing user: ' + error.message);
    return false;
  }
}

// Duplicate code in multiple functions
function calculateTotalPrice(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const priceWithTax = items[i].price * 1.1; // Add 10% tax
    total += priceWithTax;
  }
  return total;
}

function calculateDiscountedPrice(items, discountPercent) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const priceWithTax = items[i].price * 1.1; // Add 10% tax
    total += priceWithTax;
  }
  return total * (1 - discountPercent / 100);
}`;

export default function Refactoring() {
  const [code, setCode] = useState(REFACTORING_SAMPLE_CODE);
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const { toast } = useToast();

  const handleRefactoring = async () => {
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
      const response = await apiRequest('POST', '/api/refactoring', {
        code,
        language,
        analysisDepth: 3
      });
      
      const result = await response.json();
      setAnalysisResult(result);
      
      toast({
        title: "Refactoring Analysis Complete",
        description: `Found ${result.issuesCount} improvement opportunities`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Refactoring Analysis Failed",
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
          <Box className="mr-2 h-8 w-8 text-blue-500" />
          Code Refactoring
        </h1>
        <p className="text-gray-500 mt-2">
          Improve your code's structure and readability without changing its functionality.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-indigo-500">
              <RefreshCw className="mr-2 h-5 w-5" />
              Code Simplification
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Simplify complex code patterns and reduce unnecessary complexity in your codebase.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-cyan-500">
              <Layers className="mr-2 h-5 w-5" />
              Design Patterns
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Implement proven design patterns to improve code quality and maintainability.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center text-amber-500">
              <GitMerge className="mr-2 h-5 w-5" />
              Code Modernization
            </h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Update legacy code to modern standards and best practices for your language.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border rounded-lg shadow-sm p-4">
          <div className="pb-2">
            <h3 className="text-lg font-medium flex items-center">
              <Box className="mr-2 h-5 w-5 text-blue-500" />
              Code Refactoring Analysis
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
                    onClick={handleRefactoring} 
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Code...
                      </>
                    ) : (
                      <>
                        Analyze Refactoring Opportunities
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
                  <span>Analyzing code structure...</span>
                  <span>Please wait</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-gray-500">
                  Our AI is analyzing your code for refactoring opportunities
                </p>
              </div>
            </div>
          </div>
        )}
        
        {analysisResult && !isAnalyzing && (
          <div className="border rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Refactoring Analysis Results</h3>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">Code Quality Score:</span>
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
                  <span className="block text-xs text-gray-500">Refactoring Opportunities</span>
                  <span className="text-2xl font-bold">{analysisResult.issuesCount}</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Structure Quality</span>
                  <span className="text-2xl font-bold">{analysisResult.codeEfficiency}%</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Best Practices</span>
                  <span className="text-2xl font-bold">{analysisResult.bestPractices}%</span>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="block text-xs text-gray-500">Overall Rating</span>
                  <span className="text-2xl font-bold">{analysisResult.overallQuality}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">Refactoring Suggestions</h4>
              
              {analysisResult.issues.length === 0 ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <div className="flex">
                    <GitMerge className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-sm text-green-700">Your code is well-structured! No significant refactoring opportunities found.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisResult.issues.map((issue) => (
                    <div key={issue.id} className={`border-l-4 p-4 rounded ${
                      issue.type === 'error' ? 'border-red-400 bg-red-50' : 
                      issue.type === 'warning' ? 'border-yellow-400 bg-yellow-50' : 
                      'border-blue-400 bg-blue-50'
                    }`}>
                      <div className="flex justify-between">
                        <h5 className={`text-sm font-medium ${
                          issue.type === 'error' ? 'text-red-800' : 
                          issue.type === 'warning' ? 'text-yellow-800' : 
                          'text-blue-800'
                        }`}>
                          {issue.title}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          issue.type === 'error' ? 'bg-red-200 text-red-800' : 
                          issue.type === 'warning' ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {issue.type}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
                      
                      <div className="mt-2">
                        <div className="bg-gray-800 rounded p-2 text-xs text-white font-mono overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{issue.code}</pre>
                        </div>
                      </div>
                      
                      {issue.suggestionCode && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Recommended refactoring:</p>
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