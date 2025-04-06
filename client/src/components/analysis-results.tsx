import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CodeDisplay from "@/components/ui/code-display";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisResult, type Issue } from "@shared/schema";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const getIssueIcon = (type: string) => {
    switch(type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 mr-2" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />;
      case 'suggestion':
        return <Info className="h-5 w-5 text-blue-500 mr-2" />;
      default:
        return <Info className="h-5 w-5 text-blue-500 mr-2" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch(type) {
      case 'error':
        return "border-red-200 bg-red-50";
      case 'warning':
        return "border-yellow-200 bg-yellow-50";
      case 'suggestion':
        return "border-blue-200 bg-blue-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getIssueHeaderColor = (type: string) => {
    switch(type) {
      case 'error':
        return "bg-red-50";
      case 'warning':
        return "bg-yellow-50";
      case 'suggestion':
        return "bg-blue-50";
      default:
        return "bg-blue-50";
    }
  };

  const getIssueHeaderTextColor = (type: string) => {
    switch(type) {
      case 'error':
        return "text-red-800";
      case 'warning':
        return "text-yellow-800";
      case 'suggestion':
        return "text-blue-800";
      default:
        return "text-blue-800";
    }
  };

  const toggleExpandIssue = (id: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIssues(newExpanded);
  };

  const getFilteredIssues = () => {
    if (activeTab === "all") return result.issues;
    return result.issues.filter(issue => issue.type === activeTab);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const getStarRating = (score: number) => {
    const filled = Math.round(score);
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`h-4 w-4 ${i < filled ? 'text-yellow-500' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    );
  };

  const handleApplyFix = (issue: Issue) => {
    toast({
      title: "Fix Applied",
      description: "The suggested fix has been applied to the code",
    });
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Analysis Results
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Check className="mr-1.5 h-4 w-4" />
              Apply Suggestions
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-5 sm:p-6">
          {/* Summary Card */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-2">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500">Overall Quality</div>
                <div className="mt-1 flex items-center">
                  <span className="text-lg font-semibold text-yellow-500">{result.overallQuality}</span>
                  <div className="ml-2 flex">
                    {getStarRating(result.overallScore)}
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500">Issues Found</div>
                <div className="mt-1 flex items-center">
                  <span className="text-lg font-semibold text-gray-900">{result.issuesCount}</span>
                  <span className="ml-1 text-xs text-gray-500">issues</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500">Code Efficiency</div>
                <div className="mt-1 flex items-center">
                  <span className="text-lg font-semibold text-orange-500">
                    {result.codeEfficiency >= 75 ? "High" : 
                     result.codeEfficiency >= 50 ? "Medium" : "Low"}
                  </span>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${result.codeEfficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500">Best Practices</div>
                <div className="mt-1 flex items-center">
                  <span className="text-lg font-semibold text-green-500">{result.bestPractices}%</span>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${result.bestPractices}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Issues Tab List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b border-gray-200 mb-4">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 border-b-2 font-medium text-sm data-[state=active]:border-primary-500"
              >
                All Issues ({result.issues.length})
              </TabsTrigger>
              <TabsTrigger 
                value="error" 
                className="px-4 py-2 border-b-2 font-medium text-sm data-[state=active]:border-primary-500"
              >
                Errors ({result.issues.filter(i => i.type === 'error').length})
              </TabsTrigger>
              <TabsTrigger 
                value="warning" 
                className="px-4 py-2 border-b-2 font-medium text-sm data-[state=active]:border-primary-500"
              >
                Warnings ({result.issues.filter(i => i.type === 'warning').length})
              </TabsTrigger>
              <TabsTrigger 
                value="suggestion" 
                className="px-4 py-2 border-b-2 font-medium text-sm data-[state=active]:border-primary-500"
              >
                Suggestions ({result.issues.filter(i => i.type === 'suggestion').length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4 space-y-4">
              {getFilteredIssues().map((issue) => (
                <div 
                  key={issue.id} 
                  className={`bg-white border rounded-md overflow-hidden ${getIssueColor(issue.type)}`}
                >
                  <div 
                    className={`px-4 py-2 flex items-center justify-between ${getIssueHeaderColor(issue.type)}`}
                    onClick={() => toggleExpandIssue(issue.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="flex items-center">
                      {getIssueIcon(issue.type)}
                      <span className={`font-medium ${getIssueHeaderTextColor(issue.type)}`}>
                        {issue.title}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">Line {issue.lineStart}-{issue.lineEnd}</div>
                  </div>
                  
                  {expandedIssues.has(issue.id) && (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                        
                        <div className="mb-3">
                          <CodeDisplay code={issue.code} language="javascript" />
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestion</h4>
                          <div className="bg-green-50 p-3 rounded-md border border-green-200 overflow-x-auto">
                            <CodeDisplay code={issue.suggestionCode} language="javascript" />
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{issue.explanation}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                        <Button variant="outline" className="mr-2" size="sm">
                          Ignore
                        </Button>
                        <Button size="sm" onClick={() => handleApplyFix(issue)}>
                          Apply Fix
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {getFilteredIssues().length > 5 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    Load More Issues
                    <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
