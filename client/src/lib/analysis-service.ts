import { apiRequest } from "@/lib/queryClient";
import { type AnalysisResult } from "@shared/schema";

interface AnalysisOptions {
  securityAnalysis: boolean;
  performanceOptimization: boolean;
  codingStandards: boolean;
  documentationQuality: boolean;
  improvementSuggestions: boolean;
  analysisDepth: number;
}

export async function analyzeCode(
  code: string,
  language: string,
  options: AnalysisOptions
): Promise<AnalysisResult> {
  try {
    const response = await apiRequest('POST', '/api/analyze', {
      code,
      language,
      options
    });
    
    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while analyzing code');
  }
}
