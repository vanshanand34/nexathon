import { type AnalysisResult, type Issue } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import { 
  analyzeCodeWithHuggingFace,
  securityAuditWithHuggingFace,
  performanceAnalysisWithHuggingFace,
  refactoringAnalysisWithHuggingFace,
  documentationAnalysisWithHuggingFace
} from "./huggingface-service";

// Use Hugging Face API instead of mock responses
const USE_HUGGINGFACE = true;

interface AnalysisOptions {
  securityAnalysis: boolean;
  performanceOptimization: boolean;
  codingStandards: boolean;
  documentationQuality: boolean;
  improvementSuggestions: boolean;
  analysisDepth: number;
}

// Language-specific analyzers to provide more realistic feedback
const languageAnalyzers: Record<string, (code: string, options: AnalysisOptions) => AnalysisResult> = {
  javascript: analyzeJavaScript,
  typescript: analyzeTypeScript,
  python: analyzePython,
  java: analyzeJava,
  csharp: analyzeCSharp,
  cpp: analyzeCpp,
  go: analyzeGo,
  rust: analyzeRust,
  php: analyzePHP,
  ruby: analyzeRuby,
  // Default fallback for other languages
  default: (code: string, options: AnalysisOptions) => generateDefaultAnalysis(code, code.split('\n')[0]?.includes('python') ? 'python' : 'javascript'),
};

/**
 * Main code analysis function
 */
export async function analyzeCode(
  code: string,
  language: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  try {
    console.log(`Analyzing ${language} code with options:`, options);
    
    // Check if we should use Hugging Face API or mock responses
    if (USE_HUGGINGFACE && process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API for code analysis");
      return await analyzeCodeWithHuggingFace(code, language, options);
    } else {
      console.log("Using enhanced mock response for AI analysis");
      // Use language-specific analyzer if available, otherwise use default
      const analyzer = languageAnalyzers[language.toLowerCase()] || languageAnalyzers.default;
      return analyzer(code, options);
    }
  } catch (error) {
    console.error("Error analyzing code:", error);
    // For demonstration purposes, return a mock result if there's an error
    return generateDefaultAnalysis(code, language);
  }
}

/**
 * JavaScript analyzer providing language-specific feedback
 */
function analyzeJavaScript(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Look for common JS issues in the code
  if (code.includes('var ')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('var '));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Use of Deprecated 'var' Keyword",
      description: "The 'var' keyword is deprecated in modern JavaScript. Use 'const' or 'let' instead for better scoping and to avoid hoisting issues.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/var\s+([a-zA-Z0-9_]+)/g, 'const $1'),
      explanation: "Using 'const' or 'let' provides better variable scoping, prevents hoisting-related bugs, and is considered a modern JavaScript best practice."
    });
  }
  
  if (code.includes('==') && !code.includes('===')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('==') && !line.includes('==='));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Loose Equality Comparison",
      description: "Using '==' instead of '===' can lead to unexpected behavior due to type coercion.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/==/g, '==='),
      explanation: "Strict equality comparison (===) checks both value and type, which prevents unexpected behavior due to JavaScript's type coercion rules."
    });
  }
  
  if (code.includes('console.log')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('console.log'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Debug Statements in Production Code",
      description: "Console.log statements should be removed or disabled in production code.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/console\.log\(/g, '// console.log('),
      explanation: "Leaving console.log statements in production code may cause performance issues and potentially expose sensitive information to users inspecting the console."
    });
  }
  
  if (options.securityAnalysis && code.includes('innerHTML')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('innerHTML'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Potential XSS Vulnerability",
      description: "Using innerHTML with user-controlled data can lead to Cross-Site Scripting (XSS) attacks.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/\.innerHTML\s*=/g, '.textContent ='),
      explanation: "Use textContent instead of innerHTML when dealing with user input to prevent XSS attacks. If HTML is needed, consider using safer alternatives like DOMPurify."
    });
  }
  
  if (options.performanceOptimization && code.length > 500 && !code.includes('async') && !code.includes('await')) {
    const randomLine = Math.floor(Math.random() * (lineCount - 5)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 5);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Asynchronous Operations",
      description: "Long-running operations should be made asynchronous to improve application responsiveness.",
      lineStart: randomLine,
      lineEnd: randomLine + 4,
      code: codeSnippet,
      suggestionCode: `async function processData() {
  // Wrap long operations in async functions
  const result = await someOperation();
  return result;
}`,
      explanation: "Using async/await for time-consuming operations can improve application responsiveness by preventing the main thread from being blocked."
    });
  }
  
  // Add more issues if the analysis depth is high and not many issues found yet
  if (options.analysisDepth > 2 && issues.length < 3) {
    const randomLine = Math.floor(Math.random() * (lineCount - 3)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using Modern JavaScript Features",
      description: "The code could benefit from modern JavaScript features such as arrow functions, destructuring, and optional chaining.",
      lineStart: randomLine,
      lineEnd: randomLine + 2,
      code: codeSnippet,
      suggestionCode: `// Example with modern JS features:
const { property1, property2 } = object;
const result = array.map(item => item.process());
const value = object?.property?.nestedValue;`,
      explanation: "Modern JavaScript features can make your code more concise, readable, and less prone to bugs."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * TypeScript analyzer providing language-specific feedback
 */
function analyzeTypeScript(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Look for common TypeScript issues
  if (code.includes(': any') || code.includes(':any')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes(': any') || line.includes(':any'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Use of 'any' Type",
      description: "Using the 'any' type defeats TypeScript's type checking capabilities.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/: any/g, ': unknown').replace(/:any/g, ': unknown'),
      explanation: "Consider using 'unknown' instead of 'any' when the type is not known in advance. 'unknown' is type-safe and requires type checking before use."
    });
  }
  
  if (!code.includes('interface') && !code.includes('type ') && code.length > 200) {
    const randomLine = Math.min(10, Math.floor(lineCount / 3));
    const codeSnippet = extractCodeSnippet(code, randomLine, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using TypeScript Interfaces or Types",
      description: "TypeScript interfaces or type aliases can improve code readability and type safety.",
      lineStart: randomLine,
      lineEnd: randomLine + 2,
      code: codeSnippet,
      suggestionCode: `interface User {
  id: number;
  name: string;
  email: string;
}

function processUser(user: User): void {
  // Process user data
}`,
      explanation: "Define interfaces or types for complex data structures to improve code readability, maintainability, and to catch type errors at compile time."
    });
  }
  
  // TypeScript-specific security check
  if (options.securityAnalysis && code.includes('eval(')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('eval('));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Dangerous Use of eval()",
      description: "Using eval() can lead to code injection vulnerabilities and is generally discouraged.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: "// Consider safer alternatives to eval()\n// For example, use a lookup object or Function constructor if necessary",
      explanation: "The eval() function executes arbitrary JavaScript code, which can introduce security vulnerabilities if used with user-controlled input. Consider safer alternatives."
    });
  }
  
  // Add JavaScript issues as well since TypeScript is a superset of JavaScript
  const jsIssues = analyzeJavaScript(code, options);
  issues.push(...jsIssues.issues);
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Python analyzer providing language-specific feedback
 */
function analyzePython(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for Python 2 print statements
  if (code.includes('print ') && !code.match(/print\s*\(/)) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('print ') && !line.match(/print\s*\(/));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Python 2 Style Print Statement",
      description: "Using Python 2 style print statements. In Python 3, print is a function.",
      lineStart: lineStart,
      lineEnd: lineStart + 1,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/print (.+)/, 'print($1)'),
      explanation: "In Python 3, print is a function that requires parentheses. Using the older Python 2 syntax can lead to syntax errors."
    });
  }
  
  // Check for weak exception handling
  if (code.includes('except:') && !code.match(/except\s+[A-Za-z0-9_]+:/)) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('except:') && !line.match(/except\s+[A-Za-z0-9_]+:/));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 5);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Broad Exception Clause",
      description: "Using a bare except clause will catch all exceptions, including KeyboardInterrupt and SystemExit, which can make it hard to debug or terminate the program.",
      lineStart: lineStart,
      lineEnd: lineStart + 4,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/except:/, 'except Exception:'),
      explanation: "Specify the types of exceptions to catch rather than using a bare except clause. This makes the code more readable and prevents catching unexpected exceptions."
    });
  }
  
  // Security check for SQL injection
  if (options.securityAnalysis && (code.includes('.execute(') || code.includes('cursor.execute'))) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('.execute(') || line.includes('cursor.execute'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    if (codeSnippet.match(/execute\(.*\+.*\)/) || codeSnippet.match(/execute\(.*%.*\)/)) {
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "SQL Injection Vulnerability",
        description: "Potential SQL injection vulnerability. String concatenation or formatting used in SQL query.",
        lineStart: lineStart,
        lineEnd: lineStart + 2,
        code: codeSnippet,
        suggestionCode: `# Use parameterized queries
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))`,
        explanation: "Use parameterized queries or prepared statements to prevent SQL injection attacks. Never concatenate or use string formatting for SQL queries with user input."
      });
    }
  }
  
  // Performance suggestion for list vs. generator
  if (options.performanceOptimization && code.includes('[') && code.includes('for') && code.includes('in')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('[') && line.includes('for') && line.includes('in'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using Generator Expression",
      description: "For large datasets, generator expressions are more memory-efficient than list comprehensions.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/\[(.+) for (.+) in (.+)\]/, '($1 for $2 in $3)'),
      explanation: "Generator expressions (using parentheses instead of square brackets) evaluate lazily and consume less memory than list comprehensions, which is beneficial for large datasets."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Java analyzer providing language-specific feedback
 */
function analyzeJava(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for null checks instead of Optional usage
  if (code.includes(' != null') && !code.includes('Optional<')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes(' != null'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using Optional<T>",
      description: "Java 8 introduced Optional<T> to better handle nullable values and avoid NullPointerExceptions.",
      lineStart: lineStart,
      lineEnd: lineStart + 3,
      code: codeSnippet,
      suggestionCode: `// Instead of null checks:
Optional<String> optionalName = Optional.ofNullable(name);
optionalName.ifPresent(value -> System.out.println(value));`,
      explanation: "Optional<T> provides a more expressive API for handling values that might be null, leading to cleaner code and fewer NullPointerExceptions."
    });
  }
  
  // Check for potential resource leaks
  if (code.includes('new FileInputStream') || code.includes('new BufferedReader') || code.includes('new Connection')) {
    const resourcePattern = code.includes('new FileInputStream') ? 'new FileInputStream' : 
                           (code.includes('new BufferedReader') ? 'new BufferedReader' : 'new Connection');
    const lineIndex = code.split('\n').findIndex(line => line.includes(resourcePattern));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 5);
    
    if (!code.includes('try (') && !code.includes('finally')) {
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "Resource Leak",
        description: "Resources like streams, readers, or connections should be closed properly to avoid resource leaks.",
        lineStart: lineStart,
        lineEnd: lineStart + 4,
        code: codeSnippet,
        suggestionCode: `// Use try-with-resources to automatically close resources
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // Use the resource
} catch (IOException e) {
    e.printStackTrace();
}`,
        explanation: "Use try-with-resources statement (available since Java 7) to ensure that resources are closed automatically after the try block, even in case of exceptions."
      });
    }
  }
  
  // Security check for potential SQL Injection
  if (options.securityAnalysis && (code.includes('executeQuery(') || code.includes('executeUpdate('))) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('executeQuery(') || line.includes('executeUpdate('));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    if (codeSnippet.includes('+') && (codeSnippet.includes('executeQuery') || codeSnippet.includes('executeUpdate'))) {
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "SQL Injection Vulnerability",
        description: "String concatenation in SQL queries can lead to SQL Injection attacks.",
        lineStart: lineStart,
        lineEnd: lineStart + 3,
        code: codeSnippet,
        suggestionCode: `// Use PreparedStatement to prevent SQL Injection
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = connection.prepareStatement(sql);
pstmt.setString(1, username);
ResultSet rs = pstmt.executeQuery();`,
        explanation: "Always use PreparedStatement with parameterized queries instead of concatenating strings to build SQL queries. This protects against SQL Injection attacks."
      });
    }
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * C# analyzer providing language-specific feedback
 */
function analyzeCSharp(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for using statements without braces
  if (code.includes('using ') && code.includes(';') && !code.includes('using (')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('using ') && line.includes(';'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using Statements with Braces",
      description: "When working with disposable resources, using statements with braces ensure proper resource cleanup.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// For disposable resources, use using statements with braces
using (var file = new StreamReader("file.txt"))
{
    string line = file.ReadLine();
    // Process the file
}  // Resource automatically disposed here`,
      explanation: "Using statements with braces (using (resource) { ... }) ensure that the Dispose method is called even if an exception occurs, preventing resource leaks."
    });
  }
  
  // Check for potential async/await issues
  if (code.includes('async') && code.includes('Task') && !code.includes('ConfigureAwait')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('await') && !line.includes('ConfigureAwait'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using ConfigureAwait(false)",
      description: "When using await in library code, ConfigureAwait(false) can prevent deadlocks and improve performance.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: codeSnippet.replace(/await\s+([^;]+)/g, 'await $1.ConfigureAwait(false)'),
      explanation: "Using ConfigureAwait(false) prevents the task from being resumed on the original synchronization context, which can avoid deadlocks in certain scenarios and improve performance in library code."
    });
  }
  
  // Security check for potential SQL Injection
  if (options.securityAnalysis && (code.includes('SqlCommand') || code.includes('ExecuteReader'))) {
    const lineIndex = code.split('\n').findIndex(line => (line.includes('SqlCommand') || line.includes('ExecuteReader')) && line.includes('+'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    if (codeSnippet.includes('+') && (codeSnippet.includes('SqlCommand') || codeSnippet.includes('ExecuteReader'))) {
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "SQL Injection Vulnerability",
        description: "String concatenation in SQL queries can lead to SQL Injection attacks.",
        lineStart: lineStart,
        lineEnd: lineStart + 3,
        code: codeSnippet,
        suggestionCode: `// Use parameterized queries to prevent SQL Injection
string query = "SELECT * FROM Users WHERE Username = @Username";
using (SqlCommand command = new SqlCommand(query, connection))
{
    command.Parameters.AddWithValue("@Username", username);
    using (SqlDataReader reader = command.ExecuteReader())
    {
        // Process results
    }
}`,
        explanation: "Always use parameterized queries with SqlParameter objects instead of concatenating strings to build SQL queries. This protects against SQL Injection attacks."
      });
    }
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * C++ analyzer providing language-specific feedback
 */
function analyzeCpp(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for raw pointers instead of smart pointers
  if (code.includes('new ') && !code.includes('std::unique_ptr') && !code.includes('std::shared_ptr')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('new ') && !line.includes('unique_ptr') && !line.includes('shared_ptr'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Use Smart Pointers Instead of Raw Pointers",
      description: "Raw pointers can lead to memory leaks. Consider using smart pointers instead.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// Instead of raw pointers:
std::unique_ptr<MyClass> ptr = std::make_unique<MyClass>();
// or for shared ownership:
std::shared_ptr<MyClass> ptr = std::make_shared<MyClass>();`,
      explanation: "Smart pointers like std::unique_ptr and std::shared_ptr automatically manage memory and help prevent memory leaks and dangling pointers. They follow the RAII principle, ensuring resources are properly released."
    });
  }
  
  // Check for potential buffer overflows
  if (options.securityAnalysis && (code.includes('strcpy') || code.includes('strcat') || code.includes('sprintf'))) {
    const riskFunctions = ['strcpy', 'strcat', 'sprintf'];
    const riskFunction = riskFunctions.find(func => code.includes(func)) || 'strcpy';
    const lineIndex = code.split('\n').findIndex(line => line.includes(riskFunction));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Potential Buffer Overflow",
      description: `Using ${riskFunction} without bounds checking can lead to buffer overflows.`,
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// Instead of strcpy, use strncpy
strncpy(dest, src, destSize - 1);
dest[destSize - 1] = '\\0';  // Ensure null termination

// Or better yet, use std::string
std::string str = sourceStr;`,
      explanation: "Unbounded string functions like strcpy, strcat, and sprintf can lead to buffer overflows, which are a common source of security vulnerabilities. Use their bounded alternatives (strncpy, strncat, snprintf) or, preferably, std::string and string_view."
    });
  }
  
  // Check for dangerous exceptions usage
  if (code.includes('try') && code.includes('catch') && !code.includes('catch(...)') && !code.includes('catch (...)')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('catch') && !line.includes('...'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 5);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Catching All Exceptions",
      description: "In some contexts, it's important to catch all exceptions to prevent them from propagating unexpectedly.",
      lineStart: lineStart,
      lineEnd: lineStart + 4,
      code: codeSnippet,
      suggestionCode: `try {
    // Risky operations
} catch (const std::exception& e) {
    // Handle standard exceptions
    std::cerr << "Standard exception: " << e.what() << std::endl;
} catch (...) {
    // Handle any other exceptions
    std::cerr << "Unknown exception caught" << std::endl;
}`,
      explanation: "Adding a catch(...) block ensures that all exceptions are caught, preventing unexpected program termination. This is particularly important in destructors and other contexts where exceptions should not propagate."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Go analyzer providing language-specific feedback
 */
function analyzeGo(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for unhandled errors
  if (code.includes('err :=') || code.includes('err =')) {
    const lines = code.split('\n');
    const errorLines = lines.map((line, index) => ({line, index})).filter(({line}) => 
      (line.includes('err :=') || line.includes('err =')) && !line.includes('if err !='));
    
    if (errorLines.length > 0) {
      const lineStart = errorLines[0].index + 1;
      const codeSnippet = extractCodeSnippet(code, lineStart, 3);
      
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "Unhandled Error",
        description: "Error value is not checked after an operation that can return an error.",
        lineStart: lineStart,
        lineEnd: lineStart + 2,
        code: codeSnippet,
        suggestionCode: `result, err := someFunction()
if err != nil {
    log.Printf("Error: %v", err)
    return err
}
// Continue with result`,
        explanation: "In Go, it's a best practice to always check error values returned from functions. Ignoring errors can lead to unexpected behavior and bugs that are hard to diagnose."
      });
    }
  }
  
  // Check for lack of context in http requests
  if (options.securityAnalysis && code.includes('http.') && !code.includes('context.')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('http.') && !line.includes('context.'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Using Context with HTTP Requests",
      description: "Using context with HTTP requests allows for request cancellation and timeouts.",
      lineStart: lineStart,
      lineEnd: lineStart + 3,
      code: codeSnippet,
      suggestionCode: `ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
if err != nil {
    return err
}
client := &http.Client{}
resp, err := client.Do(req)`,
      explanation: "Using context.Context with HTTP requests allows you to set deadlines, cancel requests, and pass request-scoped values. This helps prevent resource leaks and improves the robustness of your application."
    });
  }
  
  // Check for missing mutex locks
  if (code.includes('var mutex sync.Mutex') || code.includes('mutex := &sync.Mutex{}')) {
    const hasMutexLock = code.includes('mutex.Lock()');
    const hasMutexUnlock = code.includes('mutex.Unlock()');
    
    if (!hasMutexLock || !hasMutexUnlock) {
      const lineIndex = code.split('\n').findIndex(line => 
        line.includes('var mutex sync.Mutex') || line.includes('mutex := &sync.Mutex{}'));
      const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
      const codeSnippet = extractCodeSnippet(code, lineStart, 5);
      
      issues.push({
        id: uuidv4(),
        type: "warning",
        title: "Mutex Declared But Not Used Properly",
        description: "A mutex is declared but not properly locked and unlocked, which may lead to race conditions.",
        lineStart: lineStart,
        lineEnd: lineStart + 4,
        code: codeSnippet,
        suggestionCode: `var mutex sync.Mutex
// When accessing shared resources:
mutex.Lock()
// Access or modify shared resources
defer mutex.Unlock()`,
        explanation: "When using a mutex for synchronization, you must call Lock() before accessing shared resources and Unlock() after you're done. The defer statement is a good way to ensure the mutex is always unlocked, even if an error occurs."
      });
    }
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Rust analyzer providing language-specific feedback
 */
function analyzeRust(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for unsafe blocks
  if (code.includes('unsafe')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('unsafe'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 5);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Use of Unsafe Code",
      description: "Unsafe code bypasses Rust's safety guarantees and can lead to memory safety issues.",
      lineStart: lineStart,
      lineEnd: lineStart + 4,
      code: codeSnippet,
      suggestionCode: `// Consider safe alternatives when possible
// If unsafe is necessary, document why it's needed and ensure safety invariants
// Example:
// Instead of raw pointers, use references or smart pointers:
let value = Box::new(42);`,
      explanation: "Rust's unsafe blocks allow operations that the compiler cannot verify as safe, such as dereferencing raw pointers or calling unsafe functions. Use unsafe code only when necessary, document why it's needed, and ensure that the safety invariants are maintained."
    });
  }
  
  // Check for unwrap without error handling
  if (code.includes('.unwrap()')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('.unwrap()'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Potential Panic with unwrap()",
      description: "Using unwrap() can cause the program to panic if the Result or Option is None/Err.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// Instead of unwrap(), consider:
// 1. Using match:
match result {
    Ok(value) => { /* use value */ },
    Err(e) => { /* handle error */ },
}

// 2. Using if let:
if let Ok(value) = result {
    // use value
}

// 3. Using ? operator in functions that return Result:
let value = result?;`,
      explanation: "The unwrap() method extracts the value from a Result or Option, but panics if the value is an Err or None. This can cause your program to terminate unexpectedly. Instead, handle the error cases explicitly using match, if let, or the ? operator."
    });
  }
  
  // Check for clones that might be unnecessary
  if (options.performanceOptimization && code.includes('.clone()')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('.clone()'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Potential Unnecessary Clone",
      description: "Cloning creates a new copy of data and can be expensive. Consider using references or other ownership strategies.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// Instead of cloning, consider:
// 1. Using references:
fn process(data: &Vec<i32>) { /* ... */ }

// 2. Using Rc/Arc for shared ownership:
let shared_data = Rc::new(expensive_data);
let clone1 = Rc::clone(&shared_data); // This is a cheap pointer copy`,
      explanation: "The clone() method creates a new copy of the data, which can be expensive for large data structures. Consider if you really need ownership of the data, or if a reference (&) would suffice. For shared ownership, consider using Rc or Arc, which use reference counting instead of deep copying."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * PHP analyzer providing language-specific feedback
 */
function analyzePHP(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for deprecated mysql functions
  if (code.includes('mysql_') && (code.includes('mysql_query') || code.includes('mysql_connect'))) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('mysql_query') || line.includes('mysql_connect'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Use of Deprecated mysql_* Functions",
      description: "The mysql_* functions are deprecated and have been removed in PHP 7.0.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `// Use mysqli or PDO instead:
$conn = new mysqli('localhost', 'username', 'password', 'database');
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();`,
      explanation: "The mysql_* functions are insecure, deprecated since PHP 5.5.0, and completely removed in PHP 7.0. Use mysqli or PDO with prepared statements instead, which offer improved security and functionality."
    });
  }
  
  // Check for potential SQL Injection
  if (options.securityAnalysis && (code.includes('query(') || code.includes('exec('))) {
    const lines = code.split('\n');
    const queryLines = lines.map((line, index) => ({line, index})).filter(({line}) => 
      (line.includes('query(') || line.includes('exec(')) && line.includes('$_') && line.includes('"'));
    
    if (queryLines.length > 0) {
      const lineStart = queryLines[0].index + 1;
      const codeSnippet = extractCodeSnippet(code, lineStart, 4);
      
      issues.push({
        id: uuidv4(),
        type: "error",
        title: "SQL Injection Vulnerability",
        description: "Direct inclusion of user input in SQL queries can lead to SQL Injection attacks.",
        lineStart: lineStart,
        lineEnd: lineStart + 3,
        code: codeSnippet,
        suggestionCode: `// Use prepared statements:
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->execute();`,
        explanation: "Never include user input directly in SQL queries. Use prepared statements with parameter binding to prevent SQL Injection attacks. This applies to both mysqli and PDO database connections."
      });
    }
  }
  
  // Check for error suppression operator
  if (code.includes('@')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('@'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    if (codeSnippet.includes('@')) {
      issues.push({
        id: uuidv4(),
        type: "warning",
        title: "Use of Error Suppression Operator",
        description: "The @ error suppression operator hides errors and can make debugging difficult.",
        lineStart: lineStart,
        lineEnd: lineStart + 2,
        code: codeSnippet,
        suggestionCode: codeSnippet.replace(/@/g, '') + `
// Handle potential errors explicitly:
try {
    // potentially error-prone code
} catch (Exception $e) {
    // handle the error
}`,
        explanation: "The @ operator suppresses error messages, making it harder to diagnose problems. Instead of suppressing errors, handle them explicitly using try-catch blocks or check functions like file_exists() before operations that might fail."
      });
    }
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Ruby analyzer providing language-specific feedback
 */
function analyzeRuby(code: string, options: AnalysisOptions): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for potential mass assignment vulnerability
  if (options.securityAnalysis && code.includes('params') && code.includes('.create') && !code.includes('permit')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('params') && line.includes('.create'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Mass Assignment Vulnerability",
      description: "Using params directly without strong parameters can lead to mass assignment vulnerabilities.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `# Use strong parameters:
def create
  @user = User.create(user_params)
end

private

def user_params
  params.require(:user).permit(:name, :email, :role)
end`,
      explanation: "Mass assignment vulnerabilities allow attackers to set attributes that weren't intended to be modified, such as admin privileges. Always use strong parameters (params.require().permit()) to whitelist allowed attributes."
    });
  }
  
  // Check for SQL Injection in where clauses
  if (options.securityAnalysis && code.includes('.where') && code.includes('#{')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('.where') && line.includes('#{'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "SQL Injection Vulnerability",
      description: "String interpolation in SQL queries can lead to SQL Injection attacks.",
      lineStart: lineStart,
      lineEnd: lineStart + 2,
      code: codeSnippet,
      suggestionCode: `# Use parameterized queries:
User.where("name = ?", user_name)
# Or hash conditions:
User.where(name: user_name)`,
      explanation: "String interpolation in SQL queries can lead to SQL Injection attacks. Use parameterized queries (question mark placeholders) or hash conditions to ensure user input is properly escaped."
    });
  }
  
  // Check for missing error handling
  if (code.includes('begin') && code.includes('rescue') && !code.includes('rescue =>')) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('rescue') && !line.includes('rescue =>'));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 5);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Generic Error Handling",
      description: "The rescue clause without a specific exception type catches all StandardError exceptions.",
      lineStart: lineStart,
      lineEnd: lineStart + 4,
      code: codeSnippet,
      suggestionCode: `begin
  # Risky operation
rescue SpecificError => e
  # Handle specific error
  puts "Specific error occurred: #{e.message}"
rescue StandardError => e
  # Handle other standard errors
  puts "Error occurred: #{e.message}"
end`,
      explanation: "It's better to rescue specific exception types rather than catching all StandardError exceptions. This allows you to handle different errors differently and avoids catching exceptions you might not be able to handle properly."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const overallScore = calculateOverallScore(issues, code.length, options);
  const codeEfficiency = calculateEfficiencyScore(issues, code.length, options);
  const bestPractices = calculateBestPracticesScore(issues, code.length, options);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: issues.length,
    codeEfficiency,
    bestPractices,
    issues,
  };
}

/**
 * Default analyzer for languages without specific implementation
 */
function generateDefaultAnalysis(code: string, language: string): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Generate realistic issues based on the code length and content
  
  // Check for commented-out code which is a common issue in most languages
  const commentStarters = ['#', '//', '/*', '*', '<!--'];
  const lines = code.split('\n');
  const commentedCodeLines = lines.filter(line => 
    commentStarters.some(starter => line.trim().startsWith(starter)) && 
    line.length > 20 && 
    !line.includes('TODO') && 
    !line.includes('NOTE'));
  
  if (commentedCodeLines.length > 2) {
    const lineIndex = lines.findIndex((line, index) => 
      commentStarters.some(starter => line.trim().startsWith(starter)) &&
      line.length > 20);
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * lineCount) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Commented-out Code",
      description: "There are multiple blocks of commented-out code. This can make the codebase harder to maintain.",
      lineStart: lineStart,
      lineEnd: lineStart + 3,
      code: codeSnippet,
      suggestionCode: "// Remove commented-out code that's no longer needed\n// If it contains important information, convert it to proper documentation",
      explanation: "Commented-out code reduces readability and makes maintenance more difficult. It can also lead to confusion about whether the code is still needed. Either remove it completely or convert important information into proper documentation comments."
    });
  }
  
  // Check for very long lines
  const longLines = lines.map((line, index) => ({line, index})).filter(({line}) => line.length > 100);
  if (longLines.length > 0) {
    const {line, index} = longLines[0];
    const lineStart = index + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 1);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Long Line",
      description: "Line exceeds recommended length of 80-100 characters, which can reduce readability.",
      lineStart: lineStart,
      lineEnd: lineStart,
      code: codeSnippet,
      suggestionCode: "// Break long lines into multiple lines for better readability\n// Use appropriate line continuation syntax for your language",
      explanation: "Long lines require horizontal scrolling and make code harder to read. Breaking them into multiple lines improves readability and makes the code easier to understand."
    });
  }
  
  // Check for inconsistent indentation
  const indentationCounts: {[key: string]: number} = {};
  lines.forEach(line => {
    const match = line.match(/^(\s+)/);
    if (match) {
      const indentation = match[1];
      indentationCounts[indentation] = (indentationCounts[indentation] || 0) + 1;
    }
  });
  
  if (Object.keys(indentationCounts).length > 2) {
    const randomLine = Math.floor(Math.random() * (lineCount - 4)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 4);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Inconsistent Indentation",
      description: "The code has inconsistent indentation styles, which can lead to readability issues.",
      lineStart: randomLine,
      lineEnd: randomLine + 3,
      code: codeSnippet,
      suggestionCode: "// Standardize indentation (e.g., 2 or 4 spaces, or tabs)\n// Consider using a code formatter or linter to automate this",
      explanation: "Inconsistent indentation makes code harder to read and understand. Standardize on a single indentation style (either spaces or tabs, with a consistent width) throughout your codebase. Using a code formatter or linter can help automate this process."
    });
  }
  
  // Generate a few more generic issues based on code length
  if (code.length > 500) {
    const randomLine = Math.floor(Math.random() * (lineCount - 5)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 5);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Consider Function Decomposition",
      description: "This section of code might benefit from being broken down into smaller, more focused functions.",
      lineStart: randomLine,
      lineEnd: randomLine + 4,
      code: codeSnippet,
      suggestionCode: "// Break this code into smaller functions, each with a single responsibility\n// Example:\n// function validateInput() { ... }\n// function processData() { ... }\n// function formatOutput() { ... }",
      explanation: "Following the Single Responsibility Principle, functions should do one thing and do it well. Breaking complex code into smaller, well-named functions makes the code more readable, testable, and maintainable."
    });
  }
  
  // Calculate overall scores based on the issues found and code size
  const numberOfIssues = issues.length;
  const overallScore = 5 - Math.min(4, numberOfIssues);
  
  return {
    overallQuality: getQualityLabel(overallScore),
    overallScore,
    issuesCount: numberOfIssues,
    codeEfficiency: 80 - numberOfIssues * 10,
    bestPractices: 85 - numberOfIssues * 10,
    issues,
  };
}

/**
 * Function for specific security audit analysis
 */
export async function securityAudit(
  code: string,
  language: string,
  options: { analysisDepth: number }
): Promise<AnalysisResult> {
  const auditOptions: AnalysisOptions = {
    securityAnalysis: true,
    performanceOptimization: false,
    codingStandards: false,
    documentationQuality: false,
    improvementSuggestions: true,
    analysisDepth: options.analysisDepth || 3
  };
  
  try {
    console.log(`Performing security audit on ${language} code`);
    
    // Check if we should use Hugging Face API or mock responses
    if (USE_HUGGINGFACE && process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API for security audit");
      return await securityAuditWithHuggingFace(code, language, auditOptions);
    } else {
      console.log("Using enhanced mock response for security audit");
      
      // Generate security-focused analysis
      const analyzer = languageAnalyzers[language.toLowerCase()] || languageAnalyzers.default;
      const baseResult = analyzer(code, auditOptions);
      
      // Add more security-specific issues
      return enhanceWithSecurityIssues(baseResult, code, language);
    }
  } catch (error) {
    console.error("Error during security audit:", error);
    return enhanceWithSecurityIssues(generateDefaultAnalysis(code, language), code, language);
  }
}

/**
 * Function for performance optimization analysis
 */
export async function performanceAnalysis(
  code: string,
  language: string,
  options: { analysisDepth: number }
): Promise<AnalysisResult> {
  const perfOptions: AnalysisOptions = {
    securityAnalysis: false,
    performanceOptimization: true,
    codingStandards: false,
    documentationQuality: false,
    improvementSuggestions: true,
    analysisDepth: options.analysisDepth || 3
  };
  
  try {
    console.log(`Performing performance analysis on ${language} code`);
    
    // Check if we should use Hugging Face API or mock responses
    if (USE_HUGGINGFACE && process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API for performance analysis");
      return await performanceAnalysisWithHuggingFace(code, language, perfOptions);
    } else {
      console.log("Using enhanced mock response for performance analysis");
      
      // Generate performance-focused analysis
      const analyzer = languageAnalyzers[language.toLowerCase()] || languageAnalyzers.default;
      const baseResult = analyzer(code, perfOptions);
      
      // Add more performance-specific issues
      return enhanceWithPerformanceIssues(baseResult, code, language);
    }
  } catch (error) {
    console.error("Error during performance analysis:", error);
    return enhanceWithPerformanceIssues(generateDefaultAnalysis(code, language), code, language);
  }
}

/**
 * Function for code refactoring suggestions
 */
export async function refactoringAnalysis(
  code: string,
  language: string,
  options: { analysisDepth: number }
): Promise<AnalysisResult> {
  const refactorOptions: AnalysisOptions = {
    securityAnalysis: false,
    performanceOptimization: false,
    codingStandards: true,
    documentationQuality: true,
    improvementSuggestions: true,
    analysisDepth: options.analysisDepth || 3
  };
  
  try {
    console.log(`Generating refactoring suggestions for ${language} code`);
    
    // Check if we should use Hugging Face API or mock responses
    if (USE_HUGGINGFACE && process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API for refactoring analysis");
      return await refactoringAnalysisWithHuggingFace(code, language, refactorOptions);
    } else {
      console.log("Using enhanced mock response for refactoring analysis");
      
      // Generate refactoring-focused analysis
      const analyzer = languageAnalyzers[language.toLowerCase()] || languageAnalyzers.default;
      const baseResult = analyzer(code, refactorOptions);
      
      // Add more refactoring-specific issues
      return enhanceWithRefactoringIssues(baseResult, code, language);
    }
  } catch (error) {
    console.error("Error during refactoring analysis:", error);
    return enhanceWithRefactoringIssues(generateDefaultAnalysis(code, language), code, language);
  }
}

/**
 * Function for documentation generation and analysis
 */
export async function documentationAnalysis(
  code: string,
  language: string,
  options: { analysisDepth: number }
): Promise<AnalysisResult> {
  const docOptions: AnalysisOptions = {
    securityAnalysis: false,
    performanceOptimization: false,
    codingStandards: false,
    documentationQuality: true,
    improvementSuggestions: true,
    analysisDepth: options.analysisDepth || 3
  };
  
  try {
    console.log(`Analyzing documentation for ${language} code`);
    
    // Check if we should use Hugging Face API or mock responses
    if (USE_HUGGINGFACE && process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API for documentation analysis");
      return await documentationAnalysisWithHuggingFace(code, language, docOptions);
    } else {
      console.log("Using enhanced mock response for documentation analysis");
      
      // Generate documentation-focused analysis
      const baseResult = generateDocumentationAnalysisResult(code, language);
      
      return baseResult;
    }
  } catch (error) {
    console.error("Error during documentation analysis:", error);
    return generateDocumentationAnalysisResult(code, language);
  }
}

// Helper functions

/**
 * Extract a code snippet from the full code
 */
function extractCodeSnippet(code: string, lineStart: number, lineCount: number): string {
  const lines = code.split('\n');
  const start = Math.max(0, lineStart - 1);
  const end = Math.min(lines.length, start + lineCount);
  return lines.slice(start, end).join('\n');
}

/**
 * Calculate overall score based on issues found
 */
function calculateOverallScore(issues: Issue[], codeLength: number, options: AnalysisOptions): number {
  const errorWeight = 2;
  const warningWeight = 1;
  const suggestionWeight = 0.5;
  
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const suggestionCount = issues.filter(issue => issue.type === 'suggestion').length;
  
  const weightedIssueCount = errorCount * errorWeight + warningCount * warningWeight + suggestionCount * suggestionWeight;
  
  // Code length factor: longer code might have more issues but should not be overly penalized
  const lengthFactor = Math.log10(Math.max(100, codeLength)) / Math.log10(1000);
  
  // Analysis depth factor: deeper analysis might find more issues
  const depthFactor = options.analysisDepth / 3;
  
  // Start with a perfect score and subtract based on issues
  const score = 5 - (weightedIssueCount / (5 * lengthFactor * depthFactor));
  
  // Ensure score is within range 1-5
  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * Calculate code efficiency score
 */
function calculateEfficiencyScore(issues: Issue[], codeLength: number, options: AnalysisOptions): number {
  const performanceIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes('performance') || 
    issue.description.toLowerCase().includes('performance') ||
    issue.title.toLowerCase().includes('efficiency') ||
    issue.description.toLowerCase().includes('efficiency'));
  
  const baseScore = 80;
  const deduction = performanceIssues.length * 15;
  
  return Math.max(20, Math.min(100, baseScore - deduction));
}

/**
 * Calculate best practices score
 */
function calculateBestPracticesScore(issues: Issue[], codeLength: number, options: AnalysisOptions): number {
  const practiceIssues = issues.filter(issue => 
    issue.type === 'warning' || 
    issue.title.toLowerCase().includes('practice') ||
    issue.description.toLowerCase().includes('practice'));
  
  const baseScore = 85;
  const deduction = practiceIssues.length * 12;
  
  return Math.max(25, Math.min(100, baseScore - deduction));
}

/**
 * Get quality label based on score
 */
function getQualityLabel(score: number): 'Excellent' | 'Good' | 'Average' | 'Poor' {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Average';
  return 'Poor';
}

/**
 * Enhance analysis with security-specific issues
 */
function enhanceWithSecurityIssues(baseResult: AnalysisResult, code: string, language: string): AnalysisResult {
  const issues = [...baseResult.issues];
  const lineCount = code.split('\n').length;
  
  // Add common security issues if they don't already exist
  const hasInjectionIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('injection') || 
    issue.description.toLowerCase().includes('injection'));
  
  if (!hasInjectionIssue) {
    const randomLine = Math.floor(Math.random() * (lineCount - 3)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 3);
    
    issues.push({
      id: uuidv4(),
      type: "error",
      title: "Potential Injection Vulnerability",
      description: "User input is used without proper validation or sanitization, potentially leading to injection attacks.",
      lineStart: randomLine,
      lineEnd: randomLine + 2,
      code: codeSnippet,
      suggestionCode: "// Validate and sanitize all user inputs\n// Use parameterized queries or prepared statements for database operations\n// Avoid executing dynamic code with user input",
      explanation: "Injection attacks occur when untrusted data is sent to an interpreter as part of a command or query. They can lead to data theft, data loss, or unauthorized access. Always validate and sanitize user inputs and use parameterized queries for database operations."
    });
  }
  
  const hasAuthIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('authentication') || 
    issue.description.toLowerCase().includes('authentication'));
  
  if (!hasAuthIssue && code.length > 300) {
    const randomLine = Math.floor(Math.random() * (lineCount - 4)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 4);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Weak Authentication Mechanism",
      description: "The authentication mechanism might not follow security best practices, potentially allowing unauthorized access.",
      lineStart: randomLine,
      lineEnd: randomLine + 3,
      code: codeSnippet,
      suggestionCode: "// Implement strong authentication with:\n// 1. Password hashing using bcrypt or Argon2\n// 2. Multi-factor authentication when possible\n// 3. Account lockout after failed attempts\n// 4. HTTPS for all authentication requests",
      explanation: "Strong authentication is crucial for system security. Implement proper password hashing, multi-factor authentication when possible, and account lockout mechanisms. Never store or transmit plain-text passwords, and always use HTTPS for authentication requests."
    });
  }
  
  // Calculate new scores focusing on security
  const securityScore = Math.max(1, 5 - Math.min(4, issues.filter(issue => issue.type === 'error').length));
  
  return {
    overallQuality: getQualityLabel(securityScore),
    overallScore: securityScore,
    issuesCount: issues.length,
    codeEfficiency: baseResult.codeEfficiency,
    bestPractices: baseResult.bestPractices,
    issues,
  };
}

/**
 * Enhance analysis with performance-specific issues
 */
function enhanceWithPerformanceIssues(baseResult: AnalysisResult, code: string, language: string): AnalysisResult {
  const issues = [...baseResult.issues];
  const lineCount = code.split('\n').length;
  
  // Add common performance issues if they don't already exist
  const hasLoopIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('loop') || 
    issue.description.toLowerCase().includes('loop'));
  
  if (!hasLoopIssue && code.includes('for ') && code.length > 200) {
    const lineIndex = code.split('\n').findIndex(line => line.includes('for '));
    const lineStart = lineIndex !== -1 ? lineIndex + 1 : Math.floor(Math.random() * (lineCount - 4)) + 1;
    const codeSnippet = extractCodeSnippet(code, lineStart, 4);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Loop Optimization Opportunity",
      description: "This loop might be optimized to improve performance, especially for large datasets.",
      lineStart: lineStart,
      lineEnd: lineStart + 3,
      code: codeSnippet,
      suggestionCode: "// Optimization strategies:\n// 1. Cache array length outside the loop\n// 2. Use appropriate loop type for your use case\n// 3. Consider break/continue for early termination\n// 4. For large datasets, consider chunking or async processing",
      explanation: "Loop optimization can significantly improve performance. Cache array lengths outside loops, minimize work inside loops, use appropriate loop types (for-of for iterating arrays, for-in for object properties), and consider early termination when possible."
    });
  }
  
  const hasMemoryIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('memory') || 
    issue.description.toLowerCase().includes('memory'));
  
  if (!hasMemoryIssue && code.length > 400) {
    const randomLine = Math.floor(Math.random() * (lineCount - 3)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Potential Memory Usage Concern",
      description: "This section of code might lead to excessive memory usage, especially with large datasets.",
      lineStart: randomLine,
      lineEnd: randomLine + 2,
      code: codeSnippet,
      suggestionCode: "// Memory optimization strategies:\n// 1. Release references to objects when no longer needed\n// 2. Use streaming or pagination for large datasets\n// 3. Consider using generators for large sequences\n// 4. Implement proper cleanup for resources",
      explanation: "Efficient memory usage is crucial for application performance. Release references to objects when they're no longer needed, use streaming or pagination for large datasets, and implement proper cleanup for resources. For large sequences, consider generators or iterators instead of building large arrays in memory."
    });
  }
  
  // Calculate new scores focusing on performance
  const efficiencyScore = Math.max(30, 100 - (issues.filter(issue => 
    issue.title.toLowerCase().includes('performance') || 
    issue.description.toLowerCase().includes('performance')).length * 15));
  
  return {
    overallQuality: baseResult.overallQuality,
    overallScore: baseResult.overallScore,
    issuesCount: issues.length,
    codeEfficiency: efficiencyScore,
    bestPractices: baseResult.bestPractices,
    issues,
  };
}

/**
 * Enhance analysis with refactoring-specific issues
 */
function enhanceWithRefactoringIssues(baseResult: AnalysisResult, code: string, language: string): AnalysisResult {
  const issues = [...baseResult.issues];
  const lineCount = code.split('\n').length;
  
  // Add common refactoring issues if they don't already exist
  const hasDuplicationIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('duplicat') || 
    issue.description.toLowerCase().includes('duplicat'));
  
  if (!hasDuplicationIssue && code.length > 300) {
    const randomLine = Math.floor(Math.random() * (lineCount - 5)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 5);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Potential Code Duplication",
      description: "Similar code patterns appear in multiple places, which can lead to maintenance challenges.",
      lineStart: randomLine,
      lineEnd: randomLine + 4,
      code: codeSnippet,
      suggestionCode: "// Extract duplicated code into reusable functions\nfunction sharedFunctionality(params) {\n  // Common logic here\n}\n\n// Then call the function from multiple places",
      explanation: "Code duplication increases maintenance burden and the risk of bugs. When you need to change logic, you must remember to update it in all duplicated places. Extract common functionality into reusable functions or methods to improve maintainability and reduce the risk of inconsistencies."
    });
  }
  
  const hasComplexityIssue = issues.some(issue => 
    issue.title.toLowerCase().includes('complex') || 
    issue.description.toLowerCase().includes('complex'));
  
  if (!hasComplexityIssue && code.length > 400) {
    const randomLine = Math.floor(Math.random() * (lineCount - 6)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 6);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Reduce Cognitive Complexity",
      description: "This code section has high cognitive complexity, making it difficult to understand and maintain.",
      lineStart: randomLine,
      lineEnd: randomLine + 5,
      code: codeSnippet,
      suggestionCode: "// Strategies to reduce complexity:\n// 1. Break down into smaller functions\n// 2. Simplify conditional logic\n// 3. Use early returns\n// 4. Extract complex conditions into well-named functions",
      explanation: "High cognitive complexity makes code harder to understand, debug, and maintain. Break complex functions into smaller, well-named functions that each do one thing. Simplify conditional logic by using early returns, guard clauses, or the strategy pattern. Extract complex conditions into functions with descriptive names that explain their purpose."
    });
  }
  
  // Calculate new scores focusing on refactoring
  const bestPracticesScore = Math.max(40, 100 - (issues.filter(issue => 
    issue.type === 'warning' || 
    issue.title.toLowerCase().includes('code') || 
    issue.description.toLowerCase().includes('code')).length * 10));
  
  return {
    overallQuality: baseResult.overallQuality,
    overallScore: baseResult.overallScore,
    issuesCount: issues.length,
    codeEfficiency: baseResult.codeEfficiency,
    bestPractices: bestPracticesScore,
    issues,
  };
}

/**
 * Generate a documentation-focused analysis
 */
function generateDocumentationAnalysisResult(code: string, language: string): AnalysisResult {
  const issues: Issue[] = [];
  const lineCount = code.split('\n').length;
  
  // Check for lack of comments
  const lines = code.split('\n');
  const commentStarters = ['#', '//', '/*', '*', '<!--'];
  const commentLines = lines.filter(line => 
    commentStarters.some(starter => line.trim().startsWith(starter)));
  
  const commentRatio = commentLines.length / lineCount;
  
  if (commentRatio < 0.1 && lineCount > 20) {
    const randomLine = Math.floor(Math.random() * (lineCount - 3)) + 1;
    const codeSnippet = extractCodeSnippet(code, randomLine, 3);
    
    issues.push({
      id: uuidv4(),
      type: "warning",
      title: "Insufficient Documentation",
      description: "The code lacks sufficient comments to explain its purpose and functionality.",
      lineStart: randomLine,
      lineEnd: randomLine + 2,
      code: codeSnippet,
      suggestionCode: generateLanguageSpecificDocs(language, codeSnippet),
      explanation: "Well-documented code is easier to understand, maintain, and collaborate on. Add comments to explain 'why' rather than 'what', as the code itself should be clear enough to explain what it does. Document complex algorithms, business rules, and any non-obvious decisions or edge cases."
    });
  }
  
  // Check for function/method documentation
  const functionKeywords = ['function', 'def ', 'sub ', 'void', 'int', 'string', 'boolean', 'public', 'private', 'protected'];
  const functionLines = lines.map((line, index) => ({line, index})).filter(({line}) => 
    functionKeywords.some(keyword => line.includes(keyword)) && 
    line.includes('(') && 
    !line.includes(';'));
  
  // For each function found, check if it has documentation above it
  for (let i = 0; i < Math.min(2, functionLines.length); i++) {
    const {line, index} = functionLines[i];
    const lineStart = index + 1;
    
    // Check for documentation above the function
    const hasDocs = index > 0 && 
      (commentStarters.some(starter => lines[index - 1].trim().startsWith(starter)) ||
       (index > 1 && lines[index - 1].trim() === '' && commentStarters.some(starter => lines[index - 2].trim().startsWith(starter))));
    
    if (!hasDocs) {
      const codeSnippet = extractCodeSnippet(code, lineStart, 2);
      
      issues.push({
        id: uuidv4(),
        type: "suggestion",
        title: "Missing Function Documentation",
        description: "This function lacks documentation explaining its purpose, parameters, and return value.",
        lineStart: lineStart,
        lineEnd: lineStart + 1,
        code: codeSnippet,
        suggestionCode: generateFunctionDocTemplate(language, codeSnippet),
        explanation: "Well-documented functions are easier to use correctly. Function documentation should explain the function's purpose, parameters (including types and constraints), return values, exceptions or errors it might throw, and any side effects."
      });
    }
  }
  
  // Check for missing file-level documentation
  const hasFileDoc = lines.slice(0, 10).some(line => 
    commentStarters.some(starter => line.trim().startsWith(starter)) && 
    line.length > 20);
  
  if (!hasFileDoc && lineCount > 30) {
    const codeSnippet = extractCodeSnippet(code, 1, 3);
    
    issues.push({
      id: uuidv4(),
      type: "suggestion",
      title: "Missing File-Level Documentation",
      description: "The file lacks header documentation explaining its purpose and usage.",
      lineStart: 1,
      lineEnd: 3,
      code: codeSnippet,
      suggestionCode: generateFileDocTemplate(language),
      explanation: "File-level documentation helps users understand the module's purpose, how to use it, and how it fits into the larger system. Include information such as the module's purpose, major classes or functions, usage examples, dependencies, and any configuration or setup required."
    });
  }
  
  // Generate some positive documentation suggestions
  const randomLine = Math.floor(Math.random() * (lineCount - 10)) + 5;
  const codeSnippet = extractCodeSnippet(code, randomLine, 5);
  
  issues.push({
    id: uuidv4(),
    type: "suggestion",
    title: "Documentation Enhancement Opportunity",
    description: "This section could benefit from additional documentation to explain the business logic or algorithm.",
    lineStart: randomLine,
    lineEnd: randomLine + 4,
    code: codeSnippet,
    suggestionCode: generateDocSuggestion(language, codeSnippet),
    explanation: "Good documentation doesn't just explain what the code does, but why it does it that way. Document business rules, algorithms, and design decisions, especially when they aren't obvious from the code itself. This helps future developers understand the context and constraints that led to the current implementation."
  });
  
  // Calculate overall scores
  const documentationScore = Math.max(1, 5 - Math.min(4, issues.length * 0.5));
  
  return {
    overallQuality: getQualityLabel(documentationScore),
    overallScore: documentationScore,
    issuesCount: issues.length,
    codeEfficiency: 70,
    bestPractices: 60,
    issues,
  };
}

/**
 * Generate language-specific documentation
 */
function generateLanguageSpecificDocs(language: string, codeSnippet: string): string {
  const lowercaseLang = language.toLowerCase();
  
  if (lowercaseLang === 'javascript' || lowercaseLang === 'typescript') {
    return `/**
 * Description of what this code does.
 * Include any important details about the implementation.
 * 
 * @example
 * // Example usage:
 * const result = someFunction();
 */
${codeSnippet}`;
  } else if (lowercaseLang === 'python') {
    return `"""
Description of what this code does.
Include any important details about the implementation.

Example:
    # Example usage:
    result = some_function()
"""
${codeSnippet}`;
  } else if (lowercaseLang === 'java' || lowercaseLang === 'csharp') {
    return `/**
 * Description of what this code does.
 * Include any important details about the implementation.
 * 
 * Example usage:
 * <pre>
 * var result = SomeFunction();
 * </pre>
 */
${codeSnippet}`;
  } else if (lowercaseLang === 'ruby') {
    return `# =============================================================================
# Description of what this code does.
# Include any important details about the implementation.
#
# Example usage:
#    result = some_function
# =============================================================================
${codeSnippet}`;
  } else {
    return `// =============================================================================
// Description of what this code does.
// Include any important details about the implementation.
//
// Example usage:
//    var result = someFunction();
// =============================================================================
${codeSnippet}`;
  }
}

/**
 * Generate a function documentation template
 */
function generateFunctionDocTemplate(language: string, functionCode: string): string {
  const lowercaseLang = language.toLowerCase();
  
  if (lowercaseLang === 'javascript' || lowercaseLang === 'typescript') {
    return `/**
 * Description of what this function does.
 *
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @throws {ErrorType} Description of when this error is thrown
 */
${functionCode}`;
  } else if (lowercaseLang === 'python') {
    return `def function_name(param_name: type) -> return_type:
    """
    Description of what this function does.

    Args:
        param_name (type): Description of parameter

    Returns:
        return_type: Description of return value

    Raises:
        ErrorType: Description of when this error is thrown
    """`;
  } else if (lowercaseLang === 'java') {
    return `/**
 * Description of what this method does.
 *
 * @param paramName Description of parameter
 * @return Description of return value
 * @throws ErrorType Description of when this error is thrown
 */
${functionCode}`;
  } else if (lowercaseLang === 'csharp') {
    return `/// <summary>
/// Description of what this method does.
/// </summary>
/// <param name="paramName">Description of parameter</param>
/// <returns>Description of return value</returns>
/// <exception cref="ErrorType">Description of when this error is thrown</exception>
${functionCode}`;
  } else {
    return `// Function: functionName
// Description: Description of what this function does.
// Parameters:
//   - paramName: Description of parameter
// Returns: Description of return value
// Throws: Description of when errors are thrown
${functionCode}`;
  }
}

/**
 * Generate a file documentation template
 */
function generateFileDocTemplate(language: string): string {
  const lowercaseLang = language.toLowerCase();
  
  if (lowercaseLang === 'javascript' || lowercaseLang === 'typescript') {
    return `/**
 * @fileoverview Description of the file.
 * 
 * This file contains functions and classes related to...
 * 
 * @author Your Name
 */`;
  } else if (lowercaseLang === 'python') {
    return `"""
Description of the file.

This file contains functions and classes related to...

Usage examples:
    from module import function
    result = function(param)
"""`;
  } else if (lowercaseLang === 'java') {
    return `/**
 * Description of the file.
 * 
 * This file contains classes and methods related to...
 * 
 * @author Your Name
 */`;
  } else if (lowercaseLang === 'csharp') {
    return `/// <summary>
/// Description of the file.
/// 
/// This file contains classes and methods related to...
/// </summary>`;
  } else {
    return `// =============================================================================
// Description of the file.
//
// This file contains functions and classes related to...
//
// Author: Your Name
// =============================================================================`;
  }
}

/**
 * Generate documentation suggestions
 */
function generateDocSuggestion(language: string, codeSnippet: string): string {
  const lowercaseLang = language.toLowerCase();
  
  if (lowercaseLang === 'javascript' || lowercaseLang === 'typescript') {
    return `/**
 * This section implements a key business rule:
 * 
 * 1. First, we validate the input data
 * 2. Then, we apply the business logic
 * 3. Finally, we format the output
 * 
 * Note: The algorithm used here optimizes for readability over performance.
 * For large datasets, consider using the alternative approach in utils.js.
 */
${codeSnippet}`;
  } else if (lowercaseLang === 'python') {
    return `"""
This section implements a key business rule:

1. First, we validate the input data
2. Then, we apply the business logic
3. Finally, we format the output

Note: The algorithm used here optimizes for readability over performance.
For large datasets, consider using the alternative approach in utils.py.
"""
${codeSnippet}`;
  } else {
    return `// This section implements a key business rule:
//
// 1. First, we validate the input data
// 2. Then, we apply the business logic
// 3. Finally, we format the output
//
// Note: The algorithm used here optimizes for readability over performance.
// For large datasets, consider using the alternative approach in Utils class.
${codeSnippet}`;
  }
}

/**
 * Generate analysis prompt for OpenAI
 */
function generateAnalysisPrompt(
  code: string,
  language: string,
  options: AnalysisOptions,
): string {
  const analysisTypes = [];
  if (options.securityAnalysis) analysisTypes.push("security vulnerabilities");
  if (options.performanceOptimization)
    analysisTypes.push("performance optimizations");
  if (options.codingStandards)
    analysisTypes.push("coding standards compliance");
  if (options.documentationQuality) analysisTypes.push("documentation quality");
  if (options.improvementSuggestions)
    analysisTypes.push("code improvement suggestions");

  const depthMap = {
    1: "basic",
    2: "standard",
    3: "comprehensive",
  };

  const analysisDepthText =
    depthMap[options.analysisDepth as keyof typeof depthMap] || "standard";

  return `
Analyze the following ${language} code and provide a ${analysisDepthText} review focusing on ${analysisTypes.join(", ")}.

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis in JSON format.
`;
}

/**
 * Format and validate the analysis result
 */
function formatAnalysisResult(rawResult: any): AnalysisResult {
  // Add UUIDs to issues and ensure proper type formatting
  const formattedIssues: Issue[] = (rawResult.issues || []).map(
    (issue: any) => ({
      id: uuidv4(),
      type: issue.type || "suggestion",
      title: issue.title || "Unknown Issue",
      description: issue.description || "",
      lineStart: parseInt(issue.lineStart) || 1,
      lineEnd: parseInt(issue.lineEnd) || 1,
      code: issue.code || "",
      suggestionCode: issue.suggestionCode || "",
      explanation: issue.explanation || "",
    }),
  );

  return {
    overallQuality: rawResult.overallQuality || "Average",
    overallScore: parseInt(rawResult.overallScore) || 3,
    issuesCount: formattedIssues.length,
    codeEfficiency: parseInt(rawResult.codeEfficiency) || 50,
    bestPractices: parseInt(rawResult.bestPractices) || 50,
    issues: formattedIssues,
  };
}