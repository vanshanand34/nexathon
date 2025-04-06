import { type AnalysisResult, type Issue } from "@shared/schema";

/**
 * Helper function to make requests to the Hugging Face Inference API
 */
async function queryHuggingFaceAPI(
  model: string,
  inputs: string,
  parameters: any = {}
): Promise<any> {
  const API_URL = `https://api-inference.huggingface.co/models/${model}`;
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs,
        parameters,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw error;
  }
}

/**
 * Process text from Hugging Face response to extract JSON result
 */
function extractJsonFromText(text: string): any {
  try {
    // First try direct JSON parsing
    return JSON.parse(text);
  } catch (error) {
    // Try to find and extract JSON blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/```\n([\s\S]*?)\n```/) ||
                     text.match(/{[\s\S]*?}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
      } catch (e) {
        console.error("Error parsing extracted JSON:", e);
      }
    }
    
    // If no JSON found, create a minimal object
    return {
      overallQuality: "Average",
      overallScore: 3,
      issues: []
    };
  }
}

/**
 * Analyze code using Hugging Face model
 */
export async function analyzeCodeWithHuggingFace(
  code: string,
  language: string,
  options: any
): Promise<AnalysisResult> {
  try {
    // CodeLlama is good for code analysis
    const model = "codellama/CodeLlama-34b-Instruct-hf";
    
    // Build a prompt that instructs the model to analyze the code
    const prompt = `
    You are a code analysis assistant. Analyze the following ${language} code:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Analyze this code for ${options.securityAnalysis ? 'security issues, ' : ''}${options.performanceOptimization ? 'performance optimizations, ' : ''}${options.codingStandards ? 'coding standards, ' : ''}${options.documentationQuality ? 'documentation quality, ' : ''}${options.improvementSuggestions ? 'improvement suggestions' : ''}.
    
    Respond with a JSON object having the following structure:
    {
      "overallQuality": string, // One of: Excellent, Good, Average, Poor
      "overallScore": number, // 1-5 rating
      "codeEfficiency": number, // percentage 0-100
      "bestPractices": number, // percentage 0-100
      "issues": [
        {
          "id": string, // unique identifier for the issue
          "type": string, // one of: error, warning, suggestion
          "title": string, // short title for the issue
          "description": string, // detailed description
          "lineStart": number, // starting line number
          "lineEnd": number, // ending line number
          "code": string, // the problematic code snippet
          "suggestionCode": string, // suggested fix
          "explanation": string // explanation of the fix
        }
      ]
    }
    `;
    
    // Call Hugging Face API
    const result = await queryHuggingFaceAPI(model, prompt, {
      max_new_tokens: 1024,
      temperature: 0.2,
      top_p: 0.95,
      return_full_text: false
    });
    
    // Process the result
    let analysisResult: any;
    
    if (Array.isArray(result) && result.length > 0) {
      // Some models return an array of generated texts
      analysisResult = extractJsonFromText(result[0].generated_text);
    } else if (typeof result === 'object' && result.generated_text) {
      // Some models return an object with generated_text
      analysisResult = extractJsonFromText(result.generated_text);
    } else {
      // Direct response
      analysisResult = extractJsonFromText(JSON.stringify(result));
    }
    
    // Format the result to match our expected structure
    return {
      overallQuality: analysisResult.overallQuality || 'Average',
      overallScore: analysisResult.overallScore || 3,
      issuesCount: analysisResult.issues?.length || 0,
      codeEfficiency: analysisResult.codeEfficiency || 70,
      bestPractices: analysisResult.bestPractices || 70,
      issues: (analysisResult.issues || []).map((issue: any, index: number) => ({
        id: issue.id || `issue-${index + 1}`,
        type: issue.type || 'suggestion',
        title: issue.title || 'Code Issue',
        description: issue.description || 'Issue description not provided',
        lineStart: issue.lineStart || 1,
        lineEnd: issue.lineEnd || 1,
        code: issue.code || '',
        suggestionCode: issue.suggestionCode || '',
        explanation: issue.explanation || 'No explanation provided'
      }))
    };
  } catch (error) {
    console.error("Error in Hugging Face analysis:", error);
    
    // Provide a basic response if the API call fails
    return {
      overallQuality: 'Average',
      overallScore: 3,
      issuesCount: 1,
      codeEfficiency: 70,
      bestPractices: 70,
      issues: [{
        id: 'error-1',
        type: 'error',
        title: 'API Error',
        description: 'Failed to analyze code due to an API error.',
        lineStart: 1,
        lineEnd: 1,
        code: '',
        suggestionCode: '',
        explanation: `Error details: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]
    };
  }
}

/**
 * Specialized analysis for security issues
 */
export async function securityAuditWithHuggingFace(
  code: string,
  language: string,
  options: any
): Promise<AnalysisResult> {
  // Use a security-focused prompt
  const securityOptions = {
    ...options,
    securityAnalysis: true,
    performanceOptimization: false,
    codingStandards: false,
    documentationQuality: false,
    improvementSuggestions: true
  };
  
  return analyzeCodeWithHuggingFace(code, language, securityOptions);
}

/**
 * Specialized analysis for performance issues
 */
export async function performanceAnalysisWithHuggingFace(
  code: string,
  language: string,
  options: any
): Promise<AnalysisResult> {
  // Use a performance-focused prompt
  const perfOptions = {
    ...options,
    securityAnalysis: false,
    performanceOptimization: true,
    codingStandards: false,
    documentationQuality: false,
    improvementSuggestions: true
  };
  
  return analyzeCodeWithHuggingFace(code, language, perfOptions);
}

/**
 * Specialized analysis for refactoring suggestions
 */
export async function refactoringAnalysisWithHuggingFace(
  code: string,
  language: string,
  options: any
): Promise<AnalysisResult> {
  // Use a refactoring-focused prompt
  const refactorOptions = {
    ...options,
    securityAnalysis: false,
    performanceOptimization: false,
    codingStandards: true,
    documentationQuality: false,
    improvementSuggestions: true
  };
  
  return analyzeCodeWithHuggingFace(code, language, refactorOptions);
}

/**
 * Specialized analysis for documentation quality
 */
export async function documentationAnalysisWithHuggingFace(
  code: string,
  language: string,
  options: any
): Promise<AnalysisResult> {
  // Use a documentation-focused prompt
  const docOptions = {
    ...options,
    securityAnalysis: false,
    performanceOptimization: false,
    codingStandards: false,
    documentationQuality: true,
    improvementSuggestions: true
  };
  
  return analyzeCodeWithHuggingFace(code, language, docOptions);
}