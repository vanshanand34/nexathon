import { useState } from "react";
import SimpleCodeReviewForm from "@/components/simple-code-review-form";
import SimpleAnalysisResults from "@/components/simple-analysis-results";
import { type AnalysisResult } from "@shared/schema";
import { Code } from "lucide-react";

export default function CodeReview() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmitCodeReview = async (result: AnalysisResult) => {
    setIsAnalyzing(false);
    setAnalysisResult(result);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="container max-w-6xl px-4 py-6 mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Code className="mr-2 h-8 w-8 text-blue-500" />
          Code Review
        </h1>
        <p className="text-gray-500 mt-2">
          Analyze your code for quality, security, and performance improvements.
        </p>
      </div>
      
      <div className="space-y-6">
        <SimpleCodeReviewForm 
          onSubmit={handleSubmitCodeReview} 
          isLoading={isAnalyzing} 
        />
        
        {analysisResult && (
          <SimpleAnalysisResults result={analysisResult} />
        )}
      </div>
    </div>
  );
}