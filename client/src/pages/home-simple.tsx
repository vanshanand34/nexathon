import { Link } from "wouter";
import { Code, ArrowRight, Shield, Zap, Box, FileText, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="block text-gray-800">AI-Powered</span>
                  <span className="block text-blue-500 mt-1">Code Review</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0">
                  Transform your development workflow with AI-powered code analysis. Identify bugs, security vulnerabilities, and performance issues before they reach production.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link href="/code-review">
                    <button className="px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2">
                      Try Code Review
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/security-audit">
                    <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Security Audit
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg blur-2xl"></div>
                  <div className="relative border-2 border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-center mb-4">
                      <Code className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Code Analysis</span>
                    </div>
                    <pre className="text-sm bg-gray-100 text-gray-700 p-3 rounded-md overflow-x-auto">
                      <code>{`function calculate(a, b) {
  return a + b;
}

// AI Analysis Result:
// ✓ Function correctly adds two numbers
// ✓ Simple and readable implementation
// → Consider adding parameter type validation`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Comprehensive Code Analysis</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                Our AI-powered platform offers multiple tools to improve your code quality
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/code-review" className="block">
                <div className="h-full border border-gray-200 rounded-lg p-6 bg-white transition-all hover:shadow-md hover:border-blue-200">
                  <div className="flex flex-col h-full">
                    <Code className="h-10 w-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Code Review</h3>
                    <p className="text-gray-500 text-sm flex-grow">
                      Get comprehensive analysis and suggestions to improve your code quality.
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link href="/security-audit" className="block">
                <div className="h-full border border-gray-200 rounded-lg p-6 bg-white transition-all hover:shadow-md hover:border-blue-200">
                  <div className="flex flex-col h-full">
                    <Shield className="h-10 w-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Security Audit</h3>
                    <p className="text-gray-500 text-sm flex-grow">
                      Identify vulnerabilities and security issues in your codebase.
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link href="/performance" className="block">
                <div className="h-full border border-gray-200 rounded-lg p-6 bg-white transition-all hover:shadow-md hover:border-blue-200">
                  <div className="flex flex-col h-full">
                    <Zap className="h-10 w-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Performance</h3>
                    <p className="text-gray-500 text-sm flex-grow">
                      Optimize your code for better performance and efficiency.
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link href="/refactoring" className="block">
                <div className="h-full border border-gray-200 rounded-lg p-6 bg-white transition-all hover:shadow-md hover:border-blue-200">
                  <div className="flex flex-col h-full">
                    <Box className="h-10 w-10 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Refactoring</h3>
                    <p className="text-gray-500 text-sm flex-grow">
                      Restructure existing code without changing its external behavior.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                Our AI-powered process is simple, fast, and effective
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Input Your Code</h3>
                <p className="text-gray-500">
                  Paste your code or upload files for analysis.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">AI Analysis</h3>
                <p className="text-gray-500">
                  Our AI engine analyzes your code thoroughly.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Get Results</h3>
                <p className="text-gray-500">
                  Receive detailed feedback and improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-500 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to improve your code?</h2>
                <p className="text-blue-50 mb-6">
                  Start using our AI code reviewer today and take your code quality to the next level.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-white" />
                    <span>Find bugs and security issues before they reach production</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-white" />
                    <span>Improve code performance and maintainability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-white" />
                    <span>Save time with automated code analysis</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md w-full">
                  <h3 className="text-xl font-medium mb-4">Start Analyzing Your Code</h3>
                  <div className="space-y-4">
                    <Link href="/code-review" className="block w-full">
                      <button className="w-full px-4 py-2 text-sm font-medium text-blue-500 bg-white rounded-md hover:bg-gray-100">
                        Try Code Review
                      </button>
                    </Link>
                    <Link href="/security-audit" className="block w-full">
                      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-transparent border border-white/30 rounded-md hover:bg-white/10">
                        Security Audit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-xl font-bold">CodeAI Review</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  Making code better, one review at a time.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-3">Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/code-review" className="text-gray-500 hover:text-gray-800 transition-colors">Code Review</Link></li>
                    <li><Link href="/security-audit" className="text-gray-500 hover:text-gray-800 transition-colors">Security Audit</Link></li>
                    <li><Link href="/performance" className="text-gray-500 hover:text-gray-800 transition-colors">Performance</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/documentation" className="text-gray-500 hover:text-gray-800 transition-colors">Documentation</Link></li>
                    <li><a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Blog</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Support</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-12 pt-6 text-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CodeAI Review. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}